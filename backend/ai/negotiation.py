import json
import re
import logging
from typing import Dict, Any, Optional
from backend.ai.client import get_ai_model
from backend.config import settings

logger = logging.getLogger(__name__)

def suggest_negotiation(
    client_budget: float,
    freelancer_rate: float,
    currency: str = "INR",
    scope_notes: Optional[str] = None
) -> Dict[str, Any]:
    """
    Provides win-win milestone and rate negotiation suggestions.
    Explicitly labeled demo fallback if AI provider is unavailable.
    """
    model = get_ai_model()
    if model:
        prompt = f"""
        Act as an impartial freelance contract mediator on PayPilot.
        Client budget: {client_budget} {currency}
        Freelancer quote/rate: {freelancer_rate} {currency}
        Scope notes: {scope_notes or 'Standard freelance software deliverable'}

        Suggest a fair compromise and milestone payment plan.
        Return ONLY valid JSON:
        {{
            "recommended_compromise_rate": 2500.0,
            "talking_points": ["Point 1", "Point 2"],
            "suggested_milestones": [
                {{"title": "Phase 1 - Design & Prototype", "percentage": 30, "amount": 750.0}},
                {{"title": "Phase 2 - Core Implementation", "percentage": 40, "amount": 1000.0}},
                {{"title": "Phase 3 - Testing & Delivery", "percentage": 30, "amount": 750.0}}
            ],
            "advisory_notes": "Rationale for both parties"
        }}
        """
        try:
            response = model.generate_content(prompt)
            match = re.search(r'\{.*\}', response.text.strip(), re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                return {
                    "recommended_compromise_rate": float(data.get("recommended_compromise_rate", (client_budget + freelancer_rate) / 2)),
                    "currency": currency,
                    "suggested_milestones": data.get("suggested_milestones", []),
                    "talking_points": data.get("talking_points", []),
                    "advisory_notes": data.get("advisory_notes", "Structured compromise balancing risk and developer compensation."),
                    "is_demo_fallback": False
                }
        except Exception as e:
            logger.error(f"Gemini API error during negotiation advice: {e}")

    # Fallback compromise calculation
    compromise = round((client_budget + freelancer_rate) / 2.0, 2)
    m1 = round(compromise * 0.30, 2)
    m2 = round(compromise * 0.40, 2)
    m3 = round(compromise - m1 - m2, 2)

    return {
        "recommended_compromise_rate": compromise,
        "currency": currency,
        "suggested_milestones": [
            {"title": "Milestone 1: Wireframes & Technical Specification", "percentage": 30, "amount": m1},
            {"title": "Milestone 2: Functional Core MVP Implementation", "percentage": 40, "amount": m2},
            {"title": "Milestone 3: Final Polishing, QA & Deployment", "percentage": 30, "amount": m3}
        ],
        "talking_points": [
            f"Propose a structured 3-stage milestone release to minimize delivery risk.",
            f"Offer {currency} {compromise} with a potential bonus if completed ahead of schedule.",
            "Clarify deliverable boundaries to prevent out-of-scope revisions."
        ],
        "advisory_notes": "A 30/40/30 milestone breakdown protects client capital while guaranteeing steady cashflow to the freelancer.",
        "is_demo_fallback": True
    }
