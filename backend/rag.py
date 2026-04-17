from __future__ import annotations

import hashlib
import math
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional
from uuid import UUID

from pinecone import Pinecone

from models import NormalizedMessage, RAGHit, Source
from settings import settings


def _stable_embed(text: str, dims: int = 1024) -> List[float]:
    """
    Deterministic local embedding fallback.
    Not semantically strong, but good enough to make RAG plumbing testable offline.
    """
    if not text:
        return [0.0] * dims

    vec: List[float] = [0.0] * dims
    for token in text.lower().split():
        h = hashlib.blake2b(token.encode("utf-8"), digest_size=16).digest()
        for i in range(0, len(h), 2):
            idx = h[i] % dims
            sign = -1.0 if (h[i + 1] & 1) else 1.0
            vec[idx] += sign * (1.0 + (h[i + 1] / 255.0))

    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


def _cosine(a: List[float], b: List[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


def _message_to_text(m: NormalizedMessage) -> str:
    parts: List[str] = []
    if m.subject:
        parts.append(m.subject)
    if m.sender_display:
        parts.append(f"From: {m.sender_display}")
    if m.body_text:
        parts.append(m.body_text)
    return "\n".join(parts).strip()


@dataclass
class _LocalDoc:
    message_id: UUID
    vector: List[float]
    meta: Dict[str, Any]
    text: str


class RAGStore:
    def __init__(self) -> None:
        self._pc = None
        self._index = None
        self._local: List[_LocalDoc] = []

    @property
    def using_pinecone(self) -> bool:
        self._ensure_pinecone()
        return self._index is not None

    def _ensure_pinecone(self) -> None:
        if self._index is not None:
            return
        if not (settings.pinecone_api_key and settings.pinecone_index):
            return
        self._pc = Pinecone(api_key=settings.pinecone_api_key)
        self._index = self._pc.Index(settings.pinecone_index)

    def upsert_messages(self, messages: Iterable[NormalizedMessage]) -> None:
        self._ensure_pinecone()
        vectors = []
        for m in messages:
            text = _message_to_text(m)
            vec = _stable_embed(text)
            meta = {
                "message_id": str(m.id),
                "source": m.source,
                "source_message_id": m.source_message_id,
                "thread_id": m.thread_id or "",
                "sender_display": m.sender_display or "",
                "subject": m.subject or "",
                "snippet": (m.body_text or "")[:240] if m.body_text else "",
                "created_at": m.created_at.isoformat() if m.created_at else "",
            }

            if self.using_pinecone:
                vectors.append((str(m.id), vec, meta))
            else:
                self._local.append(_LocalDoc(message_id=m.id, vector=vec, meta=meta, text=text))

        if self.using_pinecone and vectors:
            self._index.upsert(vectors=vectors, namespace=settings.pinecone_namespace)

    def query(self, query: str, top_k: int = 8, sources: Optional[List[Source]] = None) -> List[RAGHit]:
        self._ensure_pinecone()
        qvec = _stable_embed(query)

        if self.using_pinecone:
            try:
                filter_obj = None
                if sources:
                    filter_obj = {"source": {"$in": sources}}
                res = self._index.query(
                    namespace=settings.pinecone_namespace,
                    vector=qvec,
                    top_k=top_k,
                    include_metadata=True,
                    filter=filter_obj,
                )
                hits: List[RAGHit] = []
                for match in (res.get("matches") or []):
                    md = match.get("metadata") or {}
                    hits.append(
                        RAGHit(
                            message_id=UUID(md.get("message_id") or match.get("id")),
                            score=float(match.get("score") or 0.0),
                            source=md.get("source") or "gmail",
                            source_message_id=md.get("source_message_id") or "",
                            thread_id=md.get("thread_id"),
                            sender_display=md.get("sender_display"),
                            subject=md.get("subject"),
                            snippet=md.get("snippet"),
                            created_at=md.get("created_at"),
                        )
                    )
                return hits
            except Exception as e:
                print(f"Pinecone query failed, falling back to local: {e}")
                # Fall through to local search logic below
                pass

        scored: List[tuple[float, _LocalDoc]] = []
        for doc in self._local:
            if sources and doc.meta.get("source") not in sources:
                continue
            scored.append((_cosine(qvec, doc.vector), doc))
        scored.sort(key=lambda t: t[0], reverse=True)
        out: List[RAGHit] = []
        for score, doc in scored[:top_k]:
            out.append(
                RAGHit(
                    message_id=doc.message_id,
                    score=float(score),
                    source=doc.meta.get("source") or "gmail",
                    source_message_id=doc.meta.get("source_message_id") or "",
                    thread_id=doc.meta.get("thread_id"),
                    sender_display=doc.meta.get("sender_display"),
                    subject=doc.meta.get("subject"),
                    snippet=doc.meta.get("snippet"),
                    created_at=doc.meta.get("created_at"),
                )
            )
        return out


rag_store = RAGStore()

