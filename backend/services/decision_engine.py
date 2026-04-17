from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from services.store import reminder_store
from integrations.google_calendar import create_google_calendar_event

IMPORTANCE_THRESHOLD = 0.0

def process_event_decision(user_id: str, message_id: str, event_data: Dict[str, Any], message_text: str, source: str):
    """
    Decides whether to create a reminder and calendar event based on importance.
    """
    if not event_data.get("has_event"):
        return None

    importance = event_data.get("importance_score", 0.0)
    event_dt = event_data.get("datetime")
    
    if importance >= IMPORTANCE_THRESHOLD and event_dt:
        # 1. Check for duplicates
        # Simplified: Check if this message already has a reminder
        existing = reminder_store.get(f"rem_{message_id}")
        if existing and existing.get("calendar_event_id"):
            return existing
        
        # If reminder exists but has no calendar_event_id, we use the existing dict
        reminder = existing if existing else None
        # 2. Create Reminder
        # Reminder set for 30 mins before the event
        reminder_time = event_dt - timedelta(minutes=30)
        
        if not reminder:
            reminder = {
                "id": f"rem_{message_id}",
                "message_id": message_id,
                "source": source,
                "event_title": message_text[:100],
                "event_time": event_dt.isoformat(),
                "reminder_time": reminder_time.isoformat(),
                "status": "pending",
                "notification_sent": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "importance": importance,
                "intent": event_data.get("intent")
            }
            reminder_store.upsert(reminder["id"], reminder)

        # 3. Create Google Calendar Event
        try:
            cal_event_id = create_google_calendar_event(
                user_id=user_id,
                summary=f"[{event_data.get('intent').upper()}] {message_text[:50]}...",
                description=f"Auto-generated from {source} message: {message_text}",
                start_time=event_dt
            )
            if cal_event_id:
                reminder["calendar_event_id"] = cal_event_id
                reminder_store.upsert(reminder["id"], reminder)
        except Exception as e:
            print(f"Decision Engine: Failed to create calendar event but reminder is saved: {e}")

        return reminder

    return None
