import json
import os
from collections import defaultdict
from typing import List, Optional
from uuid import UUID

from models import NormalizedMessage


class MessageStore:
    """
    Persistent local store. Saves messages to a JSON file to prevent loss on reloads.
    """

    def __init__(self) -> None:
        self.persistence_file = ".inboxzero_messages.json"
        self._by_id = {}
        self._by_thread = defaultdict(list)
        self._load()

    def _load(self) -> None:
        if os.path.exists(self.persistence_file):
            try:
                with open(self.persistence_file, "r") as f:
                    data = json.load(f)
                    for item in data:
                        m = NormalizedMessage.model_validate(item)
                        self._by_id[m.id] = m
                        if m.thread_id:
                            if m.id not in self._by_thread[m.thread_id]:
                                self._by_thread[m.thread_id].append(m.id)
            except Exception as e:
                print(f"Failed to load message store: {e}")

    def _save(self) -> None:
        try:
            with open(self.persistence_file, "w") as f:
                json.dump([m.model_dump(mode='json') for m in self._by_id.values()], f)
        except Exception as e:
            print(f"Failed to save message store: {e}")

    def upsert(self, m: NormalizedMessage) -> None:
        self._by_id[m.id] = m
        if m.thread_id:
            if m.id not in self._by_thread[m.thread_id]:
                self._by_thread[m.thread_id].append(m.id)
        self._save()

    def list(self, limit: int = 50) -> List[NormalizedMessage]:
        msgs = list(self._by_id.values())
        msgs.sort(key=lambda x: x.created_at, reverse=True)
        return msgs[:limit]

    def all(self) -> List[NormalizedMessage]:
        return list(self._by_id.values())

    def get(self, message_id: UUID) -> Optional[NormalizedMessage]:
        return self._by_id.get(message_id)


message_store = MessageStore()

