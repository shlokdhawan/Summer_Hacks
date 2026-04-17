import json
import os
import sys
sys.path.append(os.getcwd())
import uuid
from datetime import datetime
from models import NormalizedMessage
from ingest import ingest_message
from services.store import message_store

def maintenance():
    print("Starting database maintenance...")
    
    persistence_file = ".inboxzero_messages.json"
    if not os.path.exists(persistence_file):
        print("No database found to clean.")
        return

    with open(persistence_file, "r") as f:
        old_data = json.load(f)

    # 1. Deduplicate existing messages
    unique_messages = {}
    for item in old_data:
        # Force deterministic ID recalculation
        source = item.get("source")
        sid = item.get("source_message_id")
        
        if not source or not sid:
            continue
            
        # Manually calculate the new deterministic ID
        new_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{source}:{sid}"))
        
        # If we have multiple copies, keep the one that might have enrichment data
        if new_id not in unique_messages or (not unique_messages[new_id].get("category") and item.get("category")):
            item["id"] = new_id
            unique_messages[new_id] = item

    print(f"Cleaned up duplicates. Reduced {len(old_data)} entries to {len(unique_messages)} unique messages.")

    # 2. Inject Hardcoded Slack Messages
    slack_seeds = [
        {
            "source": "slack",
            "source_message_id": "hardcoded_slack_1",
            "sender_handle": "U12345",
            "sender_display": "Shlok Dhawan",
            "subject": "#general",
            "body_text": "Hey team, I've pushed the latest changes to the aggregator. Can someone review the Twilio webhook logic?",
            "created_at": datetime.utcnow().isoformat(),
            "category": "action",
            "importance": "important",
            "tone": "formal"
        },
        {
            "source": "slack",
            "source_message_id": "hardcoded_slack_2",
            "sender_handle": "U67890",
            "sender_display": "Alex Reed",
            "subject": "#hacks",
            "body_text": "Did anyone order pizza? I'm starving. Also, the Slack bot just replied to my message!",
            "created_at": datetime.utcnow().isoformat(),
            "category": "social",
            "importance": "not_important",
            "tone": "casual"
        },
        {
            "source": "slack",
            "source_message_id": "hardcoded_slack_3",
            "sender_handle": "U11223",
            "sender_display": "DevOps Bot",
            "subject": "#alerts",
            "body_text": "[CRITICAL] Production server CPU usage is at 98%. Immediate investigation required.",
            "created_at": datetime.utcnow().isoformat(),
            "category": "urgent",
            "importance": "important",
            "tone": "urgent"
        }
    ]

    for s in slack_seeds:
        # Calculate ID for seeds too
        new_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{s['source']}:{s['source_message_id']}"))
        s["id"] = new_id
        unique_messages[new_id] = s

    # 3. Save cleaned store
    with open(persistence_file, "w") as f:
        json.dump(list(unique_messages.values()), f, indent=2)
    
    print(f"Maintenance complete. Final count: {len(unique_messages)} messages.")

if __name__ == "__main__":
    maintenance()
