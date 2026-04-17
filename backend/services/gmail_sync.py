import uuid
from typing import List, Optional
from google.oauth2.credentials import Credentials

from models import NormalizedMessage
from services.gmail_client import (
    build_gmail_service,
    extract_text_payload,
    gmail_internaldate_to_dt,
    parse_headers,
)
from ingest import ingest_message
from ai.enrich import enrich_message
from settings import settings

def sync_gmail_messages(creds: Credentials, limit: int = 15, enrich: bool = True) -> List[NormalizedMessage]:
    """
    Service function to fetch Gmail messages and ingest them.
    """
    svc = build_gmail_service(creds)
    
    try:
        resp = svc.users().messages().list(userId="me", maxResults=limit).execute()
        msg_refs = resp.get("messages") or []
        print(f"Gmail sync: Found {len(msg_refs)} message references.")
    except Exception as e:
        print(f"Gmail sync failed: {e}")
        return []

    ingested = []
    for ref in msg_refs:
        mid = ref.get("id")
        if not mid:
            continue

        try:
            full = svc.users().messages().get(userId="me", id=mid, format="full").execute()
            payload = full.get("payload") or {}
            headers = parse_headers(payload.get("headers"))
            text_plain, text_html = extract_text_payload(payload)

            created_at = gmail_internaldate_to_dt(full.get("internalDate"))
            thread_id = full.get("threadId")

            # Deterministic ID based on source and Gmail's message ID
            deterministic_id = uuid.uuid5(uuid.NAMESPACE_DNS, f"gmail:{mid}")

            m = NormalizedMessage(
                id=deterministic_id,
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
            ingested.append(m)
        except Exception as e:
            print(f"Skipping single Gmail message {mid}: {e}")
            
    return ingested
