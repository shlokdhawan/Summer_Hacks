from fastapi import APIRouter, Header, HTTPException
from typing import Optional, List
from models import ReminderResponse
from services.store import reminder_store, message_store
from services.message_normalizer import normalize_to_event_format
from services.event_processor import detect_event
from services.decision_engine import process_event_decision
from routes.gmail import _require_user

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/reminders", response_model=List[ReminderResponse])
def get_reminders(x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")):
    """
    Returns all detected reminders.
    """
    _require_user(x_user_id)
    return reminder_store.all()

@router.post("/process-message")
def process_manual_message(text: str, source: str = "manual", x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")):
    """
    Manually processes a message text through the event detection pipeline.
    Good for testing.
    """
    user_id = _require_user(x_user_id)
    import uuid
    from datetime import datetime, timezone
    
    # Simulate a normalized message
    from models import NormalizedMessage
    msg = NormalizedMessage(
        source=source,
        source_message_id=str(uuid.uuid4()),
        body_text=text,
        created_at=datetime.now(timezone.utc)
    )
    
    normalized = normalize_to_event_format(msg)
    event_data = detect_event(normalized["text"], normalized["sender"], normalized["timestamp"])
    
    reminder = process_event_decision(
        user_id=user_id,
        message_id=str(msg.id),
        event_data=event_data,
        message_text=text,
        source=source
    )
    
    return {
        "event_detection": {
            "has_event": event_data["has_event"],
            "datetime": event_data["datetime"],
            "intent": event_data["intent"],
            "importance": event_data["importance_score"]
        },
        "reminder_created": reminder is not None,
        "reminder": reminder
    }

@router.get("/reprocess-all")
def reprocess_all_existing_messages(x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")):
    """
    Retroactively scans the entire local email history for events and schedules them.
    Useful for existing emails.
    """
    user_id = _require_user(x_user_id)
    processed = 0
    reminders_created = 0
    
    for msg in message_store.all():
        try:
            normalized = normalize_to_event_format(msg)
            event_data = detect_event(normalized["text"], normalized["sender"], normalized["timestamp"])
            
            if event_data.get("has_event"):
                result = process_event_decision(
                    user_id=user_id,
                    message_id=str(msg.id),
                    event_data=event_data,
                    message_text=normalized["text"],
                    source=msg.source
                )
                if result:
                    reminders_created += 1
            processed += 1
        except Exception as e:
            continue
            
    return {"status": "success", "messages_scanned": processed, "reminders_scheduled": reminders_created}
