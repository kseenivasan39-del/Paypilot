import logging
from typing import Optional
from backend.config import settings

logger = logging.getLogger(__name__)

_genai_configured = False

def get_ai_model():
    """Returns a configured Google Gemini model if AI_API_KEY is available, or None."""
    global _genai_configured
    if not settings.AI_API_KEY or settings.AI_API_KEY.startswith("your_"):
        return None
    
    try:
        import google.generativeai as genai
        if not _genai_configured:
            genai.configure(api_key=settings.AI_API_KEY)
            _genai_configured = True
        return genai.GenerativeModel(settings.AI_MODEL_NAME)
    except Exception as e:
        logger.warning(f"Could not initialize Google Generative AI: {e}")
        return None
