import os
from datetime import datetime
from typing import List
from slack_sdk import WebClient
from settings import settings
from models import NormalizedMessage
from ingest import ingest_message
from ai.enrich import enrich_message

def sync_slack_messages(limit_per_channel: int = 20):
    """
    Proactively fetches recent messages from Slack public channels
    using the provided SLACK_BOT_TOKEN.
    """
    if not settings.slack_bot_token:
        print("Slack bot token missing. Skipping Slack sync.")
        return

    try:
        client = WebClient(token=settings.slack_bot_token)
        
        # 1. Get list of public channels the bot is in
        channels_res = client.conversations_list(types="public_channel")
        if not channels_res["ok"]:
            print(f"Failed to list Slack channels: {channels_res['error']}")
            return

        channels = channels_res["channels"]
        
        total_ingested = 0
        for channel in channels:
            # We only sync channels the bot has been invited to (is_member=True)
            if not channel.get("is_member"):
                continue
            
            channel_id = channel["id"]
            channel_name = channel["name"]
            
            # 2. Fetch history for the channel
            history_res = client.conversations_history(channel=channel_id, limit=limit_per_channel)
            if not history_res["ok"]:
                print(f"Failed to fetch history for #{channel_name}: {history_res['error']}")
                continue
            
            messages = history_res["messages"]
            for msg_data in messages:
                # Skip bot messages or subtype messages (like join/leave) unless simple text
                if msg_data.get("subtype"):
                    continue
                
                text = msg_data.get("text")
                if not text:
                    continue
                
                ts = msg_data.get("ts")
                user_id = msg_data.get("user", "unknown")
                
                # Normalize Slack timestamp (seconds.microseconds)
                dt = datetime.fromtimestamp(float(ts))
                
                msg = NormalizedMessage(
                    source="slack",
                    source_message_id=ts,
                    thread_id=msg_data.get("thread_ts"),
                    sender_handle=user_id,
                    sender_display=user_id, # Display name requires separate lookup, keeping it simple
                    subject=f"#{channel_name}",
                    body_text=text,
                    created_at=dt,
                    raw=msg_data
                )
                
                # Ingest (deduplication handled by deterministic ID in models.py)
                ingest_message(msg)
                
                # Enrich if needed
                if settings.groq_api_key:
                    # enrichment logic
                    enrich_message(msg)
                
                total_ingested += 1
        
        print(f"Slack sync complete. Synced {total_ingested} messages across all channels.")

    except Exception as e:
        print(f"Slack Sync failed: {e}")
