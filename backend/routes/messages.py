from fastapi import APIRouter, Header, HTTPException, BackgroundTasks
from typing import Optional
from services.store import message_store
from services.gmail_sync import sync_gmail_messages
from services.telegram_sync import sync_telegram_updates
from services.whatsapp_sync import sync_whatsapp_messages
from services.slack_sync import sync_slack_messages
from routes.gmail import _load_credentials, _require_user
from ai.enrich import enrich_message
from ai.brief import generate_daily_brief
from rag import rag_store
from settings import settings

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/brief")
def get_daily_brief(x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")):
    """
    Generates a high-level narrative brief of recent activity.
    """
    _require_user(x_user_id)
    # Pull the latest 30 messages across all platforms for the brief
    msgs = message_store.list(limit=30)
    brief_text = generate_daily_brief(msgs)
    return {"brief": brief_text}

def full_sync_worker(user_id: str):
    """
    Background worker that handles the slow work:
    1. Fetching from Gmail
    2. Fetching from Telegram
    3. AI Enrichment
    4. RAG Indexing
    """
    # 1. Fetch Raw (Gmail)
    try:
        creds = _load_credentials(user_id)
        if creds:
             sync_gmail_messages(creds, limit=15)
    except Exception as e:
        print(f"Background Gmail sync failed: {e}")

    # 2. Fetch Raw (Telegram)
    if settings.telegram_bot_token:
        try:
            sync_telegram_updates()
        except Exception as e:
            print(f"Background Telegram sync failed: {e}")

    # 3. Fetch Raw (WhatsApp/Twilio)
    if settings.twilio_account_sid and settings.twilio_auth_token:
        try:
            sync_whatsapp_messages(limit=15)
        except Exception as e:
            print(f"Background WhatsApp sync failed: {e}")

    # 4. Fetch Raw (Slack)
    if settings.slack_bot_token:
        try:
            sync_slack_messages(limit_per_channel=15)
        except Exception as e:
            print(f"Background Slack sync failed: {e}")

    # 5. Index all currently ingested messages to RAG (Fast)
    try:
        all_msgs = message_store.all()
        rag_store.upsert_messages(all_msgs)
        print(f"Indexed {len(all_msgs)} messages to RAG index.")
    except Exception as e:
        print(f"Background RAG indexing failed: {e}")

    # 6. Enrich (Slow) - POWERED BY GROQ
    if settings.groq_api_key:
        import time
        unenriched = [m for m in all_msgs if m.category is None]
        # Process max 5 per sync to stay within rate limits
        for m in unenriched[:5]:
            try:
                enrich_message(m)
                # Re-upsert to RAG to include the new summary/category in metadata
                rag_store.upsert_messages([m])
                time.sleep(5) 
            except Exception as e:
                err_txt = str(e).upper()
                if "429" in err_txt:
                    print("RATE LIMIT HIT: Skipping enrichment for this cycle.")
                    break
                else:
                    print(f"Background enrich failed for {m.id}: {e}")
    pass

@router.get("/")
def list_messages(limit: int = 50):
    msgs = message_store.list(limit=limit)
    return {"items": [m.model_dump() for m in msgs]}

@router.get("/sync")
def sync_all(
    background_tasks: BackgroundTasks,
    x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")
):
    """
    Kicks off a full aggregator sync in the background.
    """
    try:
        user_id = _require_user(x_user_id)
        
        # Fire and forget the slow sync process
        background_tasks.add_task(full_sync_worker, user_id)
            
        # Return immediately while the worker runs
        msgs = message_store.list(limit=50)
        return {"items": [m.model_dump() for m in msgs]}
    except Exception as e:
        import traceback
        return {"error": str(e), "trace": traceback.format_exc()}

@router.get("/relations")
def get_relations(x_user_id: Optional[str] = Header(default=None, alias="X-User-Id")):
    """
    Computes a relation graph between senders using REAL vector similarity.
    
    Algorithm:
    1. For each sender, embed all their messages and compute a centroid vector.
    2. Compute cosine similarity between every pair of sender centroids.
    3. Only create edges when similarity exceeds a meaningful threshold.
    
    This reveals genuine topical relationships — e.g., two senders who both
    discuss "project deadlines" will be connected, even if one uses Gmail
    and the other uses Telegram.
    """
    from rag import _stable_embed, _cosine, _message_to_text
    import math

    _require_user(x_user_id)
    msgs = message_store.all()

    # Step 1: Group messages by sender and build profiles
    sender_map = {}
    for m in msgs:
        sender = m.sender_display or m.sender_handle or "Unknown"
        if sender not in sender_map:
            sender_map[sender] = {
                "messages": [],
                "sources": set(),
                "categories": set(),
                "importance": "not_important",
                "count": 0,
                "subjects": [],
            }
        sender_map[sender]["messages"].append(m)
        sender_map[sender]["sources"].add(m.source)
        if m.category:
            sender_map[sender]["categories"].add(m.category)
        if m.importance == "important":
            sender_map[sender]["importance"] = "important"
        sender_map[sender]["count"] += 1
        if m.subject:
            sender_map[sender]["subjects"].append(m.subject)

    # Step 2: Compute centroid embedding for each sender
    DIMS = 1024
    sender_centroids = {}
    for sender, info in sender_map.items():
        # Combine all message text into individual embeddings, then average
        embeddings = []
        for m in info["messages"]:
            text = _message_to_text(m)
            if text.strip():
                embeddings.append(_stable_embed(text, DIMS))
        
        if embeddings:
            # Average all embeddings to get the "centroid" of this sender's topics
            centroid = [0.0] * DIMS
            for emb in embeddings:
                for k in range(DIMS):
                    centroid[k] += emb[k]
            n = len(embeddings)
            centroid = [c / n for c in centroid]
            
            # Normalize the centroid to unit length for cosine similarity
            norm = math.sqrt(sum(c * c for c in centroid)) or 1.0
            centroid = [c / norm for c in centroid]
            sender_centroids[sender] = centroid
        else:
            sender_centroids[sender] = [0.0] * DIMS

    # Step 3: Build nodes
    nodes = []
    for sender, info in sender_map.items():
        nodes.append({
            "id": sender,
            "count": info["count"],
            "sources": list(info["sources"]),
            "categories": list(info["categories"]),
            "importance": info["importance"],
            "top_subjects": info["subjects"][:3],
        })

    # Step 4: Compute pairwise cosine similarity and create edges above threshold
    SIMILARITY_THRESHOLD = 0.15  # Only connect senders with meaningful overlap
    edges = []
    senders = list(sender_map.keys())
    
    for i in range(len(senders)):
        for j in range(i + 1, len(senders)):
            s1, s2 = senders[i], senders[j]
            
            # Compute real cosine similarity between sender centroids
            sim = _cosine(sender_centroids[s1], sender_centroids[s2])
            
            if sim >= SIMILARITY_THRESHOLD:
                # Find the shared keywords that explain the connection
                words1 = set()
                words2 = set()
                for m in sender_map[s1]["messages"]:
                    text = (m.subject or "") + " " + (m.summary or "")
                    words1.update(w.lower() for w in text.split() if len(w) > 3)
                for m in sender_map[s2]["messages"]:
                    text = (m.subject or "") + " " + (m.summary or "")
                    words2.update(w.lower() for w in text.split() if len(w) > 3)
                
                shared_keywords = list(words1 & words2)[:5]
                
                edges.append({
                    "source": s1,
                    "target": s2,
                    "strength": round(sim, 3),
                    "similarity": round(sim * 100, 1),
                    "shared_keywords": shared_keywords,
                    "reason": f"{round(sim*100)}% semantic overlap" + (f" ({', '.join(shared_keywords[:3])})" if shared_keywords else ""),
                })

    return {"nodes": nodes, "edges": edges}
