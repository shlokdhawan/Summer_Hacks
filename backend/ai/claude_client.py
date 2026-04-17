import anthropic
import json
from settings import settings

class ClaudeClient:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.claude_model

    def generate_json(self, system_prompt: str, user_prompt: str):
        """
        Sends a request to Claude and expects a JSON response.
        """
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt + "\n\nIMPORTANT: Return ONLY raw JSON."}
                ]
            )
            text = response.content[0].text
            # Clean up potential markdown formatting
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            return json.loads(text)
        except Exception as e:
            print(f"Claude JSON Error: {e}")
            raise

    def generate_text(self, system_prompt: str, user_prompt: str):
        """
        Sends a request to Claude and returns the raw text.
        """
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4000,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )
            return response.content[0].text
        except Exception as e:
            print(f"Claude Text Error: {e}")
            raise

# Singleton instance
claude_client = ClaudeClient()
