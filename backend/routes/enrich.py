from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ai.enrich import enrich_message
from services.store import message_store
from settings import settings


router = APIRouter(prefix="/enrich", tags=["enrich"])


@router.post("/run")
def run_enrichment(limit: int = 25):
    if not settings.gemini_api_key:
        raise HTTPException(status_code=400, detail="Missing GEMINI_API_KEY in backend/.env")
    msgs = message_store.list(limit=limit)
    out = []
    for m in msgs:
        enrich_message(m)
        out.append(m.model_dump())
    return {"ok": True, "enriched": len(out), "items": out}

