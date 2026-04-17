from fastapi import APIRouter, HTTPException
from typing import Optional

from models import RAGQuery, RAGChatRequest, RAGChatResponse
from rag import rag_store
from services.store import message_store
from settings import settings
from ai.groq_client import groq_client
from ai.gemini_client import gemini_text
from ai.prompts import SYSTEM_RAG_CHAT


router = APIRouter(prefix="/rag", tags=["rag"])


@router.post("/query")
def query_rag(payload: RAGQuery):
    hits = rag_store.query(query=payload.query, top_k=payload.top_k, sources=payload.sources)
    return {"using_pinecone": rag_store.using_pinecone, "hits": [h.model_dump() for h in hits]}


@router.post("/chat", response_model=RAGChatResponse)
def chat_with_inbox(payload: RAGChatRequest):
    """
    1. Query RAG for context.
    2. Format context into a prompt.
    3. Ask Groq (or Gemini) to answer based on context.
    4. Return answer + sources.
    """
    hits = rag_store.query(query=payload.query, top_k=10, sources=payload.sources)
    
    if not hits:
        return RAGChatResponse(
            answer="I couldn't find any relevant messages in your inbox to answer that question.",
            sources=[]
        )

    # Build context string
    context_parts = []
    for h in hits:
        part = f"Source: {h.source}\nFrom: {h.sender_display or 'Unknown'}\nSubject: {h.subject or 'No Subject'}\nContent: {h.snippet or ''}"
        context_parts.append(part)
    
    context_str = "\n\n---\n\n".join(context_parts)
    
    user_prompt = f"User Question: {payload.query}\n\nContext From Inbox:\n{context_str}"
    
    try:
        # Try Groq first (usually faster/cheaper if within limits)
        answer = groq_client.generate_text(system_prompt=SYSTEM_RAG_CHAT, user_prompt=user_prompt)
        return RAGChatResponse(answer=answer, sources=hits)
    except Exception as e:
        # Fallback to Gemini if Groq is rate limited or fails
        print(f"Groq Chat failed, falling back to Gemini: {e}")
        try:
            answer = gemini_text(
                system=SYSTEM_RAG_CHAT, 
                user=user_prompt, 
                model=settings.gemini_model
            )
            return RAGChatResponse(answer=answer, sources=hits)
        except Exception as ge:
            return RAGChatResponse(
                answer=f"Sorry, both Groq and Gemini services are unavailable: {str(ge)}",
                sources=hits
            )


@router.post("/reindex")
def reindex_all():
    """
    Push all currently ingested messages into Pinecone (if configured).
    """
    if not (settings.pinecone_api_key and settings.pinecone_index):
        raise HTTPException(status_code=400, detail="Pinecone not configured (set PINECONE_API_KEY and PINECONE_INDEX)")
    msgs = message_store.all()
    rag_store.upsert_messages(msgs)
    return {"ok": True, "count": len(msgs), "using_pinecone": rag_store.using_pinecone}

