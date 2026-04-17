import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from googleapiclient.discovery import build

class CalendarService:
    def __init__(self, user_id: str):
        self.user_id = user_id
        from routes.gmail import _load_credentials
        self.creds = _load_credentials(user_id)
        self.service = None
        if self.creds:
            self.service = build('calendar', 'v3', credentials=self.creds)

    def create_event(self, summary: str, description: str, start_time: datetime, end_time: Optional[datetime] = None) -> Optional[str]:
        """
        Creates a Google Calendar event.
        """
        if not self.service:
            print(f"Calendar service not available for user {self.user_id} (No credentials)")
            return None

        if not end_time:
            end_time = start_time + timedelta(hours=1)

        event = {
            'summary': summary,
            'description': description,
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': end_time.isoformat(),
                'timeZone': 'UTC',
            },
            'reminders': {
                'useDefault': True,
            },
        }

        try:
            # Check for existing events to prevent duplicates (simplified check)
            # In production, we should probably check if an event with same summary/time exists in a small window
            executed_event = self.service.events().insert(calendarId='primary', body=event).execute()
            return executed_event.get('id')
        except Exception as e:
            print(f"Failed to create calendar event: {e}")
            return None

def create_google_calendar_event(user_id: str, summary: str, description: str, start_time: datetime):
    calendar = CalendarService(user_id)
    return calendar.create_event(summary, description, start_time)
