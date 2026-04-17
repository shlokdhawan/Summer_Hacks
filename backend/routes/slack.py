from datetime import datetime
from uuid import uuid4
from fastapi import APIRouter, Request, BackgroundTasks, Response
import hashlib
import hmac
import time

from models import NormalizedMessage
from ingest import ingest_message
from ai.enrich import enrich_message
from settings import settings

router = APIRouter(prefix="/slack", tags=["slack"])


def _verify_slack_signature(body: bytes, timestamp: str, signature: str) -> bool:
    """Verify that the request actually came from Slack."""
    if not settings.slack_signing_secret:
        return True  # Skip verification in dev if no secret
    if abs(time.time() - int(timestamp)) > 60 * 5:
        return False  # Reject requests older than 5 minutes
    sig_basestring = f"v0:{timestamp}:{body.decode('utf-8')}"
    my_sig = "v0=" + hmac.new(
        settings.slack_signing_secret.encode(),
        sig_basestring.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(my_sig, signature)


def _process_slack_event(event: dict):
    """
    Transform a Slack message event into our unified NormalizedMessage.
    """
    text = event.get("text", "")
    if not text:
        return

    user_id = event.get("user", "unknown")
    channel = event.get("channel", "")
    ts = event.get("ts", "")

    # Convert Slack timestamp to datetime
    try:
        created_at = datetime.utcfromtimestamp(float(ts)) if ts else datetime.utcnow()
    except (ValueError, OSError):
        created_at = datetime.utcnow()

    msg = NormalizedMessage(
        source="slack",
        source_message_id=ts or str(uuid4()),
        thread_id=event.get("thread_ts"),
        sender_handle=user_id,
        sender_display=user_id,  # Slack Events API doesn't include display name inline
        subject=f"#{channel}",
        body_text=text,
        created_at=created_at,
        raw=event,
    )

    ingest_message(msg)

    if settings.groq_api_key:
        enrich_message(msg)


@router.post("/events")
async def slack_events(request: Request, background_tasks: BackgroundTasks):
    """
    Slack Events API endpoint.
    
    Handles:
    1. URL verification challenge (initial setup)
    2. message events from subscribed channels
    """
    body = await request.body()
    payload = await request.json()

    # 1. URL Verification — Slack sends this when you first configure the Events URL
    if payload.get("type") == "url_verification":
        return {"challenge": payload.get("challenge", "")}

    # 2. Verify signature (optional but recommended)
    slack_sig = request.headers.get("X-Slack-Signature", "")
    slack_ts = request.headers.get("X-Slack-Request-Timestamp", "")
    if settings.slack_signing_secret and not _verify_slack_signature(body, slack_ts, slack_sig):
        return Response(status_code=401, content="Invalid signature")

    # 3. Process event callbacks
    if payload.get("type") == "event_callback":
        event = payload.get("event", {})

        # Only process actual user messages (not bot messages, not edits)
        if event.get("type") == "message" and not event.get("subtype") and not event.get("bot_id"):
            background_tasks.add_task(_process_slack_event, event)

    return {"ok": True}
