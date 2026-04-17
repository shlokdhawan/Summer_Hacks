from typing import Any, Dict

from ai.groq_client import groq_client
from ai.prompts import SYSTEM_TRIAGE, USER_ENRICH_TEMPLATE
from models import NormalizedMessage


def enrich_message(m: NormalizedMessage) -> NormalizedMessage:
    body = (m.body_text or "")[:6000]  # Groq context is smaller, keep concise
    payload = USER_ENRICH_TEMPLATE.format(
        source=m.source,
        from_=m.sender_display or m.sender_handle or "",
        subject=m.subject or "",
        body=body,
    )

    data: Dict[str, Any] = groq_client.generate_json(
        system_prompt=SYSTEM_TRIAGE,
        user_prompt=payload
    )

    m.category = str(data.get("category") or "") or None
    m.importance = str(data.get("importance") or "") or None
    m.tone = str(data.get("tone") or "") or None
    try:
        m.priority_score = int(data.get("priority_score")) if data.get("priority_score") is not None else None
    except Exception:
        m.priority_score = None
    m.needs_reply = bool(data.get("needs_reply")) if data.get("needs_reply") is not None else None
    m.summary = str(data.get("summary") or "") or None
    sr = data.get("suggested_replies")
    if isinstance(sr, list):
        m.suggested_replies = [str(x) for x in sr][:3]
    else:
        m.suggested_replies = []

    return m

