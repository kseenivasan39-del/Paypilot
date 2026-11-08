import json
import logging
from typing import Dict, Any, List, Optional
from backend.ai.client import get_ai_model
from backend.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are PayPilot AI, an intelligent assistant embedded in PayPilot — an AI-powered freelance marketplace integrated with PayPal payments.
You help clients and freelancers:
1. Formulate project scopes and suggest technical stacks.
2. Recommend suitable freelancers with explainable match reasons.
3. Explain milestone payments, PayPal Sandbox checkout, and deliverable verification.
4. Assist with contract negotiations and invoices.

Always provide helpful, polite, structured advice.
Note: You are strictly advisory and do not authorize financial transfers autonomously.
"""

def chat_with_ai(message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    """
    Handles user chat inquiries with Google Gemini or structured demo fallback.
    """
    model = get_ai_model()
    lower_msg = message.lower()

    # Detect if user asks for freelancer matching or recommendation
    is_freelancer_query = any(k in lower_msg for k in ["freelancer", "developer", "hire", "find me", "designer", "match"])

    freelancers_widget = None
    if is_freelancer_query:
        freelancers_widget = [
            {
                "id": 2,
                "name": "Rahul Kumar",
                "role": "Full Stack Developer",
                "rating": 4.9,
                "reviews_count": 127,
                "skills": ["React", "Next.js", "Tailwind", "Python"],
                "match_score": 96,
                "rate": 3000,
                "currency": "INR",
                "delivery_days": 6,
                "avatar": "https://i.pravatar.cc/150?u=rahul"
            },
            {
                "id": 3,
                "name": "Priya Sharma",
                "role": "UI/UX Designer",
                "rating": 4.8,
                "reviews_count": 89,
                "skills": ["Figma", "UI/UX", "Tailwind", "Design Systems"],
                "match_score": 92,
                "rate": 3500,
                "currency": "INR",
                "delivery_days": 5,
                "avatar": "https://i.pravatar.cc/150?u=priya"
            },
            {
                "id": 4,
                "name": "Arjun Menon",
                "role": "Python & Backend Developer",
                "rating": 4.7,
                "reviews_count": 64,
                "skills": ["Python", "FastAPI", "MongoDB", "Docker"],
                "match_score": 88,
                "rate": 2800,
                "currency": "INR",
                "delivery_days": 7,
                "avatar": "https://i.pravatar.cc/150?u=arjun"
            }
        ]

    if model:
        try:
            conversation_history_text = ""
            if history:
                for h in history[-6:]:
                    role = h.get("sender", "user")
                    text = h.get("text", "")
                    conversation_history_text += f"{role.upper()}: {text}\n"

            prompt = f"{SYSTEM_PROMPT}\n\nChat History:\n{conversation_history_text}\nUSER: {message}\nAI:"
            response = model.generate_content(prompt)
            ai_text = response.text.strip()
            return {
                "response": ai_text,
                "model_used": settings.AI_MODEL_NAME,
                "is_demo_fallback": False,
                "freelancers": freelancers_widget
            }
        except Exception as e:
            logger.error(f"Gemini API chat error: {e}")

    # Structured demo fallback
    if is_freelancer_query:
        reply = (
            "I've analyzed your requirements against our talent directory and found suitable matches based on skills, "
            "delivery speed, and verified ratings. Here are the top 3 recommended candidates:"
        )
    elif any(k in lower_msg for k in ["payment", "paypal", "milestone", "escrow", "safe"]):
        reply = (
            "PayPilot secures payments using official PayPal Sandbox APIs. "
            "When you initiate a project agreement, the milestone order is created on PayPal. "
            "Funds are held until deliverables are submitted and verified by you (with advisory AI checks). "
            "Once approved, you can release payment with one click."
        )
    elif any(k in lower_msg for k in ["invoice", "bill"]):
        reply = (
            "You can generate and download official PDF tax invoices directly from your Transactions page. "
            "Each invoice includes the verified PayPal transaction reference ID, milestone details, and fee breakdown."
        )
    elif any(k in lower_msg for k in ["description", "requirement", "scope", "help"]):
        reply = (
            "To post an effective project: specify clear objectives, target deadlines, expected deliverables "
            "(e.g., responsive source code, documentation, Figma links), and budget boundaries. "
            "Our AI Requirement Analyzer can also extract these automatically from your raw notes!"
        )
    else:
        reply = (
            f"Thanks for asking! I'm PayPilot's AI Assistant. I can help you analyze project requirements, "
            f"match top freelancers, review deliverables, and guide you through PayPal milestone payments. "
            f"What would you like assistance with today?"
        )

    return {
        "response": reply,
        "model_used": "demo-rule-assistant",
        "is_demo_fallback": True,
        "freelancers": freelancers_widget
    }
