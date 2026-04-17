from __future__ import annotations

from models import NormalizedMessage
from rag import rag_store
from services.store import message_store


from services.message_normalizer import normalize_to_event_format
from services.event_processor import detect_event
from services.decision_engine import process_event_decision


def ingest_message(m: NormalizedMessage) -> NormalizedMessage:
    """
    Fast ingest. Persistence and in-memory storage only.
    RAG indexing, AI enrichment, and EVENT DETECTION happen here or in background.
    """
    message_store.upsert(m)
    
    # NEW: Event Detection Pipeline
    try:
        normalized = normalize_to_event_format(m)
        event_data = detect_event(normalized["text"], normalized["sender"], normalized["timestamp"])
        
        if event_data.get("has_event"):
            # Fixed 'demo' user for local development, consistent with existing routes
            process_event_decision(
                user_id="demo", 
                message_id=str(m.id), 
                event_data=event_data, 
                message_text=normalized["text"],
                source=m.source
            )
    except Exception as e:
        print(f"Event Detection failure for message {m.id}: {e}")

    return m

