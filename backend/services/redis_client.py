from __future__ import annotations

import time
import os
import json
from dataclasses import dataclass
from typing import Any, Dict, Optional

from redis import Redis

from settings import settings


@dataclass
class _MemItem:
    value: str
    expires_at: Optional[float] = None


class InMemoryRedis:
    """
    Tiny subset of Redis that persists to a local JSON file.
    Ensures OAuth tokens survive server reloads when Docker/Redis is not running.
    """

    def __init__(self) -> None:
        self.persistence_file = ".inboxzero_persistence.json"
        self._data: Dict[str, _MemItem] = {}
        self._load()

    def _load(self) -> None:
        if os.path.exists(self.persistence_file):
            try:
                with open(self.persistence_file, "r") as f:
                    raw = json.load(f)
                    now = time.time()
                    for k, v in raw.items():
                        exp = v.get("expires_at")
                        if exp is None or exp > now:
                            self._data[k] = _MemItem(value=v["value"], expires_at=exp)
            except Exception as e:
                print(f"Failed to load persistence: {e}")

    def _save(self) -> None:
        try:
            with open(self.persistence_file, "w") as f:
                serializable = {
                    k: {"value": v.value, "expires_at": v.expires_at}
                    for k, v in self._data.items()
                }
                json.dump(serializable, f)
        except Exception as e:
            print(f"Failed to save persistence: {e}")

    def _gc(self) -> None:
        now = time.time()
        dead = [k for k, v in self._data.items() if v.expires_at is not None and v.expires_at <= now]
        if dead:
            for k in dead:
                self._data.pop(k, None)
            self._save()

    def get(self, key: str) -> Optional[str]:
        self._gc()
        item = self._data.get(key)
        return item.value if item else None

    def set(self, key: str, value: str) -> None:
        self._data[key] = _MemItem(value=value, expires_at=None)
        self._save()

    def setex(self, key: str, ttl_seconds: int, value: str) -> None:
        self._data[key] = _MemItem(value=value, expires_at=time.time() + int(ttl_seconds))
        self._save()

    def delete(self, key: str) -> None:
        self._data.pop(key, None)
        self._save()


_mem_redis = InMemoryRedis()


def get_redis() -> Any:
    r = Redis.from_url(
        settings.redis_url, 
        decode_responses=True, 
        socket_connect_timeout=0.5,
        socket_timeout=0.5
    )
    try:
        r.ping()
        return r
    except Exception:
        return _mem_redis

