from datetime import datetime
from uuid import uuid4
from fastapi import APIRouter, Request, BackgroundTasks

from models import NormalizedMessage
from ingest import ingest_message
from ai.enrich import enrich_message
from settings import settings

router = APIRouter(prefix="/telegram", tags=["telegram"])

def _process_telegram_message(payload: dict):
    """
    Background worker that transforms telegram payload into unified model and enriches it.
    """
    message_data = payload.get("message", {})
    text = message_data.get("text", "")
    if not text:
        return
        
    chat = message_data.get("chat", {})
    sender_name = chat.get("first_name", "Telegram User")
    if chat.get("last_name"):
        sender_name += f" {chat.get('last_name')}"
        
    unix_time = message_data.get("date")
    created_at = datetime.utcfromtimestamp(unix_time) if unix_time else datetime.utcnow()

    msg = NormalizedMessage(
        source="telegram",
        source_message_id=str(message_data.get("message_id", uuid4())),
        sender_handle=chat.get("username"),
        sender_display=sender_name,
        body_text=text,
        created_at=created_at,
        raw=payload,
    )
    
    # Send through ingestion to Pinecone
    ingest_message(msg)
    
    # Enrich with Groq
    if settings.groq_api_key:
        enrich_message(msg)


@router.post("/webhook")
async def telegram_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Consumer wrapper for Telegram's webhook system.
    """
    try:
        payload = await request.json()
        # Fire to background to return 200 OK instantly to Telegram servers
        background_tasks.add_task(_process_telegram_message, payload)
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}
