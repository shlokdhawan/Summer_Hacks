from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Literal, Optional
from uuid import UUID, uuid4, uuid5, NAMESPACE_DNS

from pydantic import BaseModel, Field


Source = Literal["gmail", "slack", "whatsapp", "telegram", "manual"]


class NormalizedMessage(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    source: Source
    source_message_id: str
    
    thread_id: Optional[str] = None

    sender_handle: Optional[str] = None
    sender_display: Optional[str] = None
    recipient_handle: Optional[str] = None

    subject: Optional[str] = None
    body_text: Optional[str] = None
    body_html: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def model_post_init(self, __context: Any) -> None:
        # 1. Normalize IDs deterministically
        seed = f"{self.source}:{self.source_message_id}"
        self.id = uuid5(NAMESPACE_DNS, seed)

        # 2. Normalize created_at to be UTC-aware
        if self.created_at.tzinfo is None:
            self.created_at = self.created_at.replace(tzinfo=timezone.utc)
        else:
            self.created_at = self.created_at.astimezone(timezone.utc)

    # Enrichment
    category: Optional[str] = None
    importance: Optional[str] = None  # important | not_important
    tone: Optional[str] = None  # formal, urgent, casual, friendly, angry, neutral, promotional
    priority_score: Optional[int] = None
    summary: Optional[str] = None
    needs_reply: Optional[bool] = None
    suggested_replies: Optional[List[str]] = None

    raw: Optional[Dict[str, Any]] = None


class RAGQuery(BaseModel):
    query: str
    top_k: int = 8
    sources: Optional[List[Source]] = None


class RAGHit(BaseModel):
    message_id: UUID
    score: float
    source: Source
    source_message_id: str
    thread_id: Optional[str] = None
    sender_display: Optional[str] = None
    subject: Optional[str] = None
    snippet: Optional[str] = None
    created_at: Optional[datetime] = None


class RAGChatRequest(BaseModel):
    query: str
    sources: Optional[List[Source]] = None


class RAGChatResponse(BaseModel):
    answer: str
    sources: List[RAGHit]


class ReminderResponse(BaseModel):
    id: str
    message_id: str
    source: str
    event_title: str
    event_time: datetime
    reminder_time: datetime
    status: Literal["pending", "sent", "cancelled"]
    notification_sent: bool
    created_at: datetime
    importance: float
    intent: str
    calendar_event_id: Optional[str] = None

