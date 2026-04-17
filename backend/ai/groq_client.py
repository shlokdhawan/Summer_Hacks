import json
import time
from groq import Groq
from settings import settings


class GroqClient:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.groq_model
        # Use a smaller, faster model for text generation (higher rate limits)
        self.fast_model = "llama-3.1-8b-instant"

    def generate_json(self, system_prompt: str, user_prompt: str):
        """Send a request to Groq and parse a JSON response. Retries on rate limit."""
        return self._retry(self._do_json, system_prompt, user_prompt)

    def generate_text(self, system_prompt: str, user_prompt: str):
        """Send a request to Groq using the fast model. Retries on rate limit."""
        return self._retry(self._do_text, system_prompt, user_prompt)

    def _do_json(self, system_prompt: str, user_prompt: str):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt + "\n\nIMPORTANT: Return ONLY raw JSON, no markdown fences."},
            ],
            temperature=0.3,
            max_tokens=800,
            response_format={"type": "json_object"},
        )
        text = response.choices[0].message.content
        return json.loads(text)

    def _do_text(self, system_prompt: str, user_prompt: str):
        response = self.client.chat.completions.create(
            model=self.fast_model,  # Use faster model with separate rate limits
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        return response.choices[0].message.content

    def _retry(self, fn, *args, max_retries=3):
        """Retry with exponential backoff on 429 rate limit errors."""
        for attempt in range(max_retries):
            try:
                return fn(*args)
            except Exception as e:
                err = str(e)
                if "429" in err or "rate_limit" in err.lower():
                    wait = 15 * (attempt + 1)  # 15s, 30s, 45s
                    print(f"Rate limit hit, waiting {wait}s (attempt {attempt+1}/{max_retries})...")
                    time.sleep(wait)
                else:
                    raise
        # Final attempt without catch
        return fn(*args)


# Singleton
groq_client = GroqClient()
