from __future__ import annotations

from models import NormalizedMessage
from rag import rag_store
from services.store import message_store


def ingest_message(m: NormalizedMessage) -> NormalizedMessage:
    """
    Fast ingest. Persistence and in-memory storage only.
    RAG indexing and AI enrichment happen in background tasks.
    """
    message_store.upsert(m)
    return m

