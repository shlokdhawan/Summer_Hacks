from __future__ import annotations

import json
from typing import Any, Dict

from google import genai
from google.genai import types

from settings import settings


def _get_client() -> genai.Client:
    api_key = getattr(settings, "gemini_api_key", None)
    if not api_key:
        raise RuntimeError("Missing GEMINI_API_KEY in backend/.env")
    return genai.Client(api_key=api_key)


def gemini_json(system: str, user: str, model: str, max_tokens: int = 600) -> Dict[str, Any]:
    client = _get_client()
    config = types.GenerateContentConfig(
        system_instruction=system,
        temperature=0.0,
        max_output_tokens=max_tokens,
        response_mime_type="application/json",
    )
    
    response = client.models.generate_content(
        model=model,
        contents=user,
        config=config,
    )
    
    text = response.text or "{}"
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Fallback if the response somehow wasn't fully parsed as JSON
        if text.startswith("```"):
            text = text.split("```", 2)[1] if "```" in text else text
            text = text.replace("json", "", 1).strip()
        return json.loads(text)


def gemini_text(system: str, user: str, model: str, max_tokens: int = 2000) -> str:
    client = _get_client()
    config = types.GenerateContentConfig(
        system_instruction=system,
        temperature=0.7,
        max_output_tokens=max_tokens,
    )
    response = client.models.generate_content(
        model=model,
        contents=user,
        config=config,
    )
    return response.text or ""
