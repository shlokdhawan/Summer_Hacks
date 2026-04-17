from datetime import datetime, timezone
import sys
import os

# Add parent dir to path if needed
sys.path.append(os.getcwd())

from services.event_processor import detect_event

def test_detection():
    test_cases = [
        ("Meeting tomorrow at 3 PM", True, "meeting"),
        ("Submit report by Friday", True, "deadline"),
        ("Client call next Monday at 11", True, "meeting"),
        ("Don’t forget project review on 5th April", True, "reminder"),
        ("Interview scheduled for Tuesday evening", True, "meeting"),
        ("How are you?", False, "casual"),
        ("Let’s talk later", False, "casual")
    ]
    
    now = datetime(2026, 4, 1, 10, 0, 0, tzinfo=timezone.utc)
    
    print(f"{'Text':<45} | {'Detected?':<10} | {'Intent':<12} | {'DateTime'}")
    print("-" * 90)
    
    for text, expected_has_event, expected_intent in test_cases:
        res = detect_event(text, "test_sender", now)
        dt_str = res['datetime'].strftime("%Y-%m-%d %H:%M") if res['datetime'] else "None"
        print(f"{text:<45} | {str(res['has_event']):<10} | {res['intent']:<12} | {dt_str}")

if __name__ == "__main__":
    test_detection()
