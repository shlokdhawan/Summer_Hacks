from __future__ import annotations

from typing import List
from datetime import datetime, timedelta

from ai.groq_client import groq_client
from ai.prompts import SYSTEM_BRIEF, USER_BRIEF_TEMPLATE
from models import NormalizedMessage

def generate_daily_brief(messages: List[NormalizedMessage]) -> str:
    """
    Takes a list of normalized messages, filters for the last 24h,
    and generates a Daily Brief markdown string.
    """
    if not messages:
        return "No messages were received in the last 24 hours to summarize."

    # Top 10 most recent — keep token usage low for free tier
    recent_msgs = sorted(messages, key=lambda x: x.created_at, reverse=True)[:10]

    context_lines = []
    for m in recent_msgs:
        # Prefer summary over raw body to save tokens
        content = m.summary or (m.body_text or "")[:150]
        line = f"[{m.source.upper()}] From: {m.sender_display or m.sender_handle} | Subject: {m.subject or 'N/A'} | {content}"
        context_lines.append(line)

    messages_context = "\n---\n".join(context_lines)
    user_prompt = USER_BRIEF_TEMPLATE.format(messages_context=messages_context)

    try:
        return groq_client.generate_text(
            system_prompt=SYSTEM_BRIEF,
            user_prompt=user_prompt
        )
    except Exception as e:
        err_str = str(e)
        print(f"Brief generation failed: {e}")
        return f"### ⚠️ Brief Generation Failed\n\n**Details:** {err_str}"
