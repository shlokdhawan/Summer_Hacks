import httpx
import uuid
from datetime import datetime, timezone
from typing import List

from models import NormalizedMessage
from ingest import ingest_message
from settings import settings
from services.redis_client import get_redis

def sync_telegram_updates():
    """
    Polls the Telegram getUpdates API and ingests new messages.
    Uses Redis to track the 'offset' so we don't process the same message twice.
    """
    if not settings.telegram_bot_token:
        print("Telegram Bot Token not configured.")
        return []

    r = get_redis()
    # For "Path B" deep sync, we'll try pulling from offset 0 if it's the first time
    last_update_id = r.get("telegram:last_update_id")
    offset = int(last_update_id) + 1 if last_update_id else 0

    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/getUpdates"
    print(f"Syncing Telegram (offset: {offset})...")
    
    try:
        # Pull up to 100 messages (Telegram's limit)
        response = httpx.get(url, params={"offset": offset, "limit": 100, "timeout": 5}, timeout=10)
        data = response.json()
    except Exception as e:
        print(f"Failed to poll Telegram: {e}")
        return []

    if not data.get("ok"):
        return []

    updates = data.get("result", [])
    ingested_messages = []

    for update in updates:
        update_id = update.get("update_id")
        message_data = update.get("message")
        
        if not message_data or "text" not in message_data:
            r.set("telegram:last_update_id", str(update_id))
            continue

        text = message_data.get("text")
        chat = message_data.get("chat", {})
        sender_name = chat.get("first_name", "Telegram User")
        if chat.get("last_name"):
            sender_name += f" {chat.get('last_name')}"
            
        unix_time = message_data.get("date")
        if unix_time:
            # FORCE NAIVE UTC to match in-memory store and avoid comparison crashes
            created_at = datetime.fromtimestamp(unix_time, tz=timezone.utc).replace(tzinfo=None)
        else:
            created_at = datetime.utcnow()

        # Deterministic ID based on source and Telegram's internal ID
        source_id = str(message_data.get("message_id"))
        deterministic_id = uuid.uuid5(uuid.NAMESPACE_DNS, f"telegram:{source_id}")

        msg = NormalizedMessage(
            id=deterministic_id,
            source="telegram",
            source_message_id=source_id,
            sender_handle=chat.get("username"),
            sender_display=sender_name,
            body_text=text,
            created_at=created_at,
            raw=update,
        )

        ingest_message(msg)
        ingested_messages.append(msg)
        r.set("telegram:last_update_id", str(update_id))

    return ingested_messages
