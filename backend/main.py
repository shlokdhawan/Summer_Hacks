from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import gmail as gmail_routes
from routes import enrich as enrich_routes
from routes import rag as rag_routes
from routes import telegram as telegram_routes
from routes import whatsapp as whatsapp_routes
from routes import slack as slack_routes
from routes import messages as messages_routes
from settings import settings


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_base_url, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to Inbox Zero AI! Visit /docs for the API schema."}

@app.get("/health")
def health():
    return {"ok": True}
app.include_router(gmail_routes.router)
app.include_router(enrich_routes.router)
app.include_router(rag_routes.router)
app.include_router(telegram_routes.router)
app.include_router(whatsapp_routes.router)
app.include_router(slack_routes.router)
app.include_router(messages_routes.router)
