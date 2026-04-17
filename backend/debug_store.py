from services.store import message_store
from services.redis_client import get_redis
import json

print("--- STORE DEBUG ---")
print(f"Total messages in store: {len(message_store.all())}")

r = get_redis()
token = r.get("gmail:token:demo")
if token:
    print("Gmail Token: FOUND")
    try:
        data = json.loads(token)
        print(f"Token Scopes: {data.get('scopes')}")
        print(f"Token Expiry: {data.get('expiry')}")
    except:
        print("Token JSON is MALFORMED")
else:
    print("Gmail Token: MISSING (User needs to connect Gmail again via UI)")

last_tg = r.get("telegram:last_update_id")
print(f"Last Telegram Update ID: {last_tg}")
