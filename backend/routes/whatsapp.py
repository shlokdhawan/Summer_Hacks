from datetime import datetime
from uuid import uuid4
from fastapi import APIRouter, Request, Form, BackgroundTasks
from fastapi.responses import Response

from models import NormalizedMessage
from ingest import ingest_message
from ai.enrich import enrich_message
from settings import settings

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])


def _process_twilio_message(from_number: str, body: str, msg_sid: str, profile_name: str):
    """
    Transform a Twilio WhatsApp Sandbox message into our unified NormalizedMessage.
    """
    if not body:
        return

    # Twilio sends numbers as "whatsapp:+1234567890"
    clean_number = from_number.replace("whatsapp:", "")

    msg = NormalizedMessage(
        source="whatsapp",
        source_message_id=msg_sid or str(uuid4()),
        sender_handle=clean_number,
        sender_display=profile_name or clean_number,
        body_text=body,
        created_at=datetime.utcnow(),
        raw={"from": from_number, "body": body, "sid": msg_sid},
    )

    ingest_message(msg)

    if settings.groq_api_key:
        enrich_message(msg)


@router.post("/webhook")
async def twilio_whatsapp_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
):
    """
    Twilio WhatsApp Sandbox webhook.
    
    Twilio sends form-encoded POST data with these key fields:
    - From: whatsapp:+1234567890
    - Body: message text
    - MessageSid: unique message ID
    - ProfileName: sender's WhatsApp display name
    """
    form = await request.form()

    from_number = form.get("From", "")
    body = form.get("Body", "")
    msg_sid = form.get("MessageSid", "")
    profile_name = form.get("ProfileName", "")

    if body:
        background_tasks.add_task(
            _process_twilio_message,
            str(from_number),
            str(body),
            str(msg_sid),
            str(profile_name),
        )

    # Twilio expects a TwiML response (empty is fine for no auto-reply)
    return Response(
        content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        media_type="application/xml",
    )


@router.get("/webhook")
def twilio_health():
    """Health check for Twilio webhook verification."""
    return {"ok": True, "provider": "twilio-sandbox"}
