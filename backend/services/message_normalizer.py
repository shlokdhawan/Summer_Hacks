from datetime import datetime
from typing import Dict, Any, Literal
from models import NormalizedMessage

SourceType = Literal["gmail", "slack", "whatsapp", "telegram"]

def normalize_to_event_format(msg: NormalizedMessage) -> Dict[str, Any]:
    """
    Normalizes a project message model into a unified format for event processing.
    """
    return {
        "id": str(msg.id),
        "source": msg.source,
        "sender": msg.sender_display or msg.sender_handle or "Unknown",
        "text": f"{msg.subject or ''} {msg.body_text or ''}".strip(),
        "timestamp": msg.created_at
    }
