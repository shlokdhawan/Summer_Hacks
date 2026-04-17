import dateparser
import re
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

# Keywords for Intent Classification
INTENT_KEYWORDS = {
    "meeting": ["meeting", "call", "zoom", "sync", "meet", "interview", "hangout", "google meet", "teams"],
    "deadline": ["deadline", "submit", "submission", "due", "by", "before", "hand in", "finish", "complete"],
    "reminder": ["reminder", "remind", "don't forget", "remember", "alert", "notice"],
    "appointment": ["appointment", "booking", "reservation", "slot", "schedule", "doctor", "dentist", "visit"],
    "task": ["to do", "task", "project", "work on", "action", "item", "deliverable"]
}

# Importance Keywords
IMPORTANT_KEYWORDS = [
    "urgent", "asap", "emergency", "critical", "important", "priority", 
    "deadline", "final", "client", "investor", "boss", "manager", "founder"
]

VIP_SENDERS = ["founder", "manager", "client", "ceo", "professor"]

def extract_datetime(text: str, base_date: datetime) -> Optional[datetime]:
    """
    Extracts date and time from text using dateparser.
    """
    # Clean up common phrases
    clean_text = re.sub(r'^(meeting|remind me|reminder|don\'t forget|submit|due|call|interview) (at|on|by|for)? ', '', text, flags=re.IGNORECASE)
    
    settings = {
        'PREFER_DATES_FROM': 'future',
        'RELATIVE_BASE': base_date,
        'RETURN_AS_TIMEZONE_AWARE': True
    }
    
    # Try parsing whole cleaned text
    dt = dateparser.parse(clean_text, settings=settings)
    
    # Fallback: Try parsing just the words after "by", "on", "at", "next", "tomorrow"
    if not dt:
        keywords = ["by ", "on ", "at ", "next ", "tomorrow", "tonight", "friday", "monday", "tuesday", "wednesday", "thursday", "saturday", "sunday"]
        for kw in keywords:
            if kw in text.lower():
                idx = text.lower().find(kw)
                dt = dateparser.parse(text[idx:], settings=settings)
                if dt: break
            
    return dt

def classify_intent(text: str) -> str:
    """
    Classifies the intent based on keywords.
    """
    text_lower = text.lower()
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return intent
    return "casual"

def calculate_importance(text: str, sender: str, event_dt: Optional[datetime], now: datetime) -> float:
    """
    Calculates importance score (0-100).
    """
    score = 0.0
    text_lower = text.lower()
    sender_lower = sender.lower()

    # Normalize timezones for comparison
    from datetime import timezone
    if now.tzinfo is None:
        now = now.replace(tzinfo=timezone.utc)
    if event_dt and event_dt.tzinfo is None:
        event_dt = event_dt.replace(tzinfo=timezone.utc)

    # 1. Keyword match (+30)
    if any(kw in text_lower for kw in IMPORTANT_KEYWORDS):
        score += 30

    # 2. Sender priority (+30)
    if any(vip in sender_lower for vip in VIP_SENDERS):
        score += 30

    # 3. Time urgency (+40)
    if event_dt:
        time_diff = event_dt - now
        if time_diff < timedelta(hours=24):
            score += 40
        elif time_diff < timedelta(hours=48):
            score += 20
        elif time_diff > timedelta(days=7):
            score -= 10 # Far away events are less urgent initially

    return min(max(score, 0.0), 100.0)

def detect_event(text: str, sender: str, timestamp: datetime) -> Dict[str, Any]:
    """
    Main entry point for event detection.
    """
    event_dt = extract_datetime(text, timestamp)
    intent = classify_intent(text)
    
    # If we found a date or a strong intent keyword, mark as potential event
    has_event = (event_dt is not None and intent != "casual") or (event_dt is not None)
    
    importance = calculate_importance(text, sender, event_dt, timestamp)
    
    return {
        "has_event": has_event,
        "datetime": event_dt,
        "intent": intent,
        "importance_score": importance
    }
