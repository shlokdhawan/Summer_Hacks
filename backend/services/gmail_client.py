from __future__ import annotations

import base64
from datetime import datetime, timezone
from typing import Any

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


def _decode_b64url(data: str) -> str:
    padded = data + "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(padded.encode("utf-8")).decode("utf-8", errors="replace")


def build_gmail_service(creds: Credentials):
    return build("gmail", "v1", credentials=creds, cache_discovery=False)


def extract_text_payload(payload: dict[str, Any]) -> tuple[str | None, str | None]:
    """
    Returns (text/plain, text/html) if present.
    """
    if not payload:
        return None, None

    mime = payload.get("mimeType")
    body = payload.get("body") or {}
    data = body.get("data")
    parts = payload.get("parts") or []

    if data and mime in ("text/plain", "text/html"):
        text = _decode_b64url(data)
        return (text, None) if mime == "text/plain" else (None, text)

    text_plain = None
    text_html = None
    for p in parts:
        tp, th = extract_text_payload(p)
        text_plain = text_plain or tp
        text_html = text_html or th
    return text_plain, text_html


def parse_headers(headers: list[dict[str, str]] | None) -> dict[str, str]:
    out: dict[str, str] = {}
    for h in headers or []:
        name = (h.get("name") or "").lower()
        value = h.get("value") or ""
        if name:
            out[name] = value
    return out


def gmail_internaldate_to_dt(internal_date_ms: str | None) -> datetime:
    if not internal_date_ms:
        return datetime.utcnow()
    try:
        ms = int(internal_date_ms)
        # Force naive UTC to prevent crashes with other naive datetimes in the store
        return datetime.fromtimestamp(ms / 1000.0, tz=timezone.utc).replace(tzinfo=None)
    except Exception:
        return datetime.utcnow()

