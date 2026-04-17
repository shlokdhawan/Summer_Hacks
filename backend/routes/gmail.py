from __future__ import annotations

import json
import os
import secrets
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Header, HTTPException, Request
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow

from ingest import ingest_message
from models import NormalizedMessage
from services.gmail_client import (
    build_gmail_service,
    extract_text_payload,
    gmail_internaldate_to_dt,
    parse_headers,
)
from services.redis_client import get_redis
from settings import settings
from ai.enrich import enrich_message


router = APIRouter(prefix="/gmail", tags=["gmail"])

TOKEN_KEY_PREFIX = "gmail:token:"
STATE_KEY_PREFIX = "gmail:oauth_state:"


def _require_user(user_id: Optional[str]) -> str:
    if settings.require_user_header and not user_id:
        raise HTTPException(status_code=400, detail="Missing X-User-Id header")
    return user_id or "demo"


def _token_key(user_id: str) -> str:
    return f"{TOKEN_KEY_PREFIX}{user_id}"


def _state_key(state: str) -> str:
    return f"{STATE_KEY_PREFIX}{state}"


def _make_flow(state: str) -> Flow:
    if not (settings.google_client_id and settings.google_client_secret and settings.google_redirect_uri):
        raise HTTPException(
            status_code=500,
            detail="Gmail OAuth not configured. Set GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI in backend/.env",
        )

    # Local dev: oauthlib refuses exchanging codes over plain HTTP by default.
    # For localhost/127.0.0.1 callbacks we explicitly allow insecure transport.
    if settings.google_redirect_uri.startswith("http://localhost") or settings.google_redirect_uri.startswith(
        "http://127.0.0.1"
    ):
        os.environ.setdefault("OAUTHLIB_INSECURE_TRANSPORT", "1")

    client_config = {
        "web": {
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }
    scopes = [s.strip() for s in settings.google_scopes.split() if s.strip()]
    flow = Flow.from_client_config(client_config, scopes=scopes, state=state)
    flow.redirect_uri = settings.google_redirect_uri
    return flow


def _load_credentials(user_id: str) -> Credentials:
    r = get_redis()
    raw = r.get(_token_key(user_id))
    if not raw:
        raise HTTPException(status_code=401, detail="No Gmail token for user. Call /gmail/oauth/start first.")
    data = json.loads(raw)
    creds = Credentials.from_authorized_user_info(data)
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(GoogleRequest())
        r.set(_token_key(user_id), creds.to_json())
    return creds


@router.get("/oauth/start")
def oauth_start(x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")):
    user_id = _require_user(x_user_id)
    state = secrets.token_urlsafe(16)

    r = get_redis()
    r.setex(_state_key(state), 600, user_id)

    flow = _make_flow(state=state)
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    return {"auth_url": auth_url, "state": state}


@router.get("/oauth/callback")
def oauth_callback(request: Request, state: str):
    r = get_redis()
    user_id = r.get(_state_key(state))
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid/expired OAuth state. Restart /gmail/oauth/start.")

    flow = _make_flow(state=state)
    flow.fetch_token(authorization_response=str(request.url))

    creds = flow.credentials
    if not creds:
        raise HTTPException(status_code=500, detail="Failed to obtain Gmail credentials")

    r.set(_token_key(user_id), creds.to_json())
    r.delete(_state_key(state))
    return {"ok": True, "user_id": user_id}


@router.get("/profile")
def profile(x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")):
    user_id = _require_user(x_user_id)
    creds = _load_credentials(user_id)
    svc = build_gmail_service(creds)
    me = svc.users().getProfile(userId="me").execute()
    return {"emailAddress": me.get("emailAddress"), "messagesTotal": me.get("messagesTotal")}


@router.get("/fetch")
def fetch_latest(
    limit: int = 25,
    q: Optional[str] = None,
    x_user_id: Optional[str] = Header(default=None, alias="X-User-Id"),
    enrich: bool = False,
):
    """
    Fetch latest Gmail messages and ingest them into the system + RAG.
    """
    user_id = _require_user(x_user_id)
    creds = _load_credentials(user_id)
    svc = build_gmail_service(creds)

    resp = (
        svc.users()
        .messages()
        .list(userId="me", maxResults=min(max(limit, 1), 100), q=q or None)
        .execute()
    )
    msg_refs = resp.get("messages") or []

    ingested = []
    for ref in msg_refs:
        mid = ref.get("id")
        if not mid:
            continue

        full = (
            svc.users()
            .messages()
            .get(userId="me", id=mid, format="full")
            .execute()
        )
        payload = full.get("payload") or {}
        headers = parse_headers(payload.get("headers"))
        text_plain, text_html = extract_text_payload(payload)

        created_at = gmail_internaldate_to_dt(full.get("internalDate"))
        thread_id = full.get("threadId")

        m = NormalizedMessage(
            source="gmail",
            source_message_id=mid,
            thread_id=thread_id,
            sender_handle=headers.get("from"),
            sender_display=headers.get("from"),
            recipient_handle=headers.get("to"),
            subject=headers.get("subject"),
            body_text=text_plain,
            body_html=text_html,
            created_at=created_at,
            raw=full,
        )
        ingest_message(m)
        if enrich and settings.gemini_api_key:
            enrich_message(m)
        ingested.append(m)

    return {
        "ingested": len(ingested),
        "enriched": len([m for m in ingested if m.summary or m.category or m.priority_score is not None]),
        "items": [m.model_dump() for m in ingested],
    }

