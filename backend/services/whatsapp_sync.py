from twilio.rest import Client
from datetime import datetime
from uuid import uuid4
from settings import settings
from models import NormalizedMessage
from ingest import ingest_message
from ai.enrich import enrich_message

def sync_whatsapp_messages(limit: int = 15):
    """
    Proactively fetches recent messages from the Twilio API
    to ensure we didn't miss any via webhooks.
    """
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        print("Twilio credentials missing. Skipping WhatsApp sync.")
        return

    try:
        client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        
        # Fetch the last N messages
        messages = client.messages.list(limit=limit)
        
        for record in messages:
            # We only care about WhatsApp messages in the sandbox
            if not record.from_.startswith("whatsapp:"):
                continue
            
            # Normalize the source ID
            msg_sid = record.sid
            clean_number = record.from_.replace("whatsapp:", "")
            
            # Twilio's timestamp is already a datetime object
            timestamp = record.date_sent or record.date_created or datetime.utcnow()
            
            msg = NormalizedMessage(
                source="whatsapp",
                source_message_id=msg_sid,
                sender_handle=clean_number,
                sender_display=clean_number, # Twilio API list doesn't easily give ProfileName
                body_text=record.body,
                created_at=timestamp,
                raw={"from": record.from_, "sid": record.sid, "status": record.status}
            )
            
            # Ingest (deduplication is handled by message_store.upsert)
            ingest_message(msg)
            
            # Enrich if not categorized
            if settings.groq_api_key:
                enrich_message(msg)
                
        print(f"WhatsApp sync complete. Checked {len(messages)} records.")
        
    except Exception as e:
        print(f"Twilio Sync failed: {e}")
