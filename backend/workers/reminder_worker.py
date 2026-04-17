import time
import asyncio
import os
import sys
from datetime import datetime, timezone

# Add the parent directory (backend) to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.store import reminder_store
from settings import settings
import httpx

async def send_telegram_notification(text: str):
    """
    Sends a notification via Telegram bot if configured.
    """
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        return False
        
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    payload = {
        "chat_id": settings.telegram_chat_id,
        "text": f"🔔 *REMINDER*: {text}",
        "parse_mode": "Markdown"
    }
    try:
        async with httpx.AsyncClient() as client:
            await client.post(url, json=payload)
        return True
    except Exception as e:
        print(f"Failed to send Telegram notification: {e}")
        return False

async def reminder_worker_loop():
    """
    Periodically checks for pending reminders and triggers notifications.
    """
    print("Reminder Worker: Started")
    while True:
        try:
            pending = reminder_store.list_pending()
            for r in pending:
                msg = f"{r['event_title']} at {r['event_time']}"
                print(f"Reminder Worker: Triggering notification for '{msg}'")
                
                # Send notification
                success = await send_telegram_notification(msg)
                
                # Update status
                r["status"] = "sent"
                r["notification_sent"] = success
                reminder_store.upsert(r["id"], r)
                
        except Exception as e:
            print(f"Reminder Worker Error: {e}")
            
        await asyncio.sleep(60) # Check every minute

if __name__ == "__main__":
    asyncio.run(reminder_worker_loop())
