from services.redis_client import get_redis

r = get_redis()
# Clearing the offset forces the Telegram API to return the last 100 messages 
# that are still in its 24hr buffer.
r.delete("telegram:last_update_id")
print("Telegram offset RESET. Next sync will pull history.")
