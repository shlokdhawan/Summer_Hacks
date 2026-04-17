from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # App
    app_name: str = "Inbox Zero AI"
    api_base_url: str = "http://localhost:8000"
    frontend_base_url: str = "http://localhost:5173"

    # Redis (cache + token store + celery broker)
    redis_url: str = "redis://localhost:6379/0"

    # Pinecone (optional; local fallback if unset)
    pinecone_api_key: Optional[str] = None
    pinecone_index: Optional[str] = None
    pinecone_namespace: str = "messages"

    # Gmail OAuth
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    google_redirect_uri: Optional[str] = None
    google_scopes: str = "https://www.googleapis.com/auth/gmail.readonly"

    # Gemini
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-2.5-flash"

    # Claude/Anthropic
    anthropic_api_key: Optional[str] = None
    claude_model: str = "claude-3-5-sonnet-latest"

    # Groq (Llama 3)
    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.3-70b-versatile"

    # Telegram
    telegram_bot_token: Optional[str] = None

    # Slack (Events API)
    slack_bot_token: Optional[str] = None
    slack_signing_secret: Optional[str] = None

    # Twilio WhatsApp Sandbox
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None

    # Auth (demo)
    require_user_header: bool = True


settings = Settings()

