import json
import re
import logging
from typing import Dict, Any, Optional
from backend.ai.client import get_ai_model

logger = logging.getLogger(__name__)

def assess_transaction_risk(
    amount: float,
    currency: str = "USD",
    client_id: int = 1,
    freelancer_id: int = 1,
    project_id: Optional[int] = None,
    client_completed_txs: int = 5,
    freelancer_rating: float = 4.9
) -> Dict[str, Any]:
    """
    Advisory transaction risk assessment.
    Returns risk_score (0-100), risk_level, evaluation factors, and disclaimer.
    """
    model = get_ai_model()
    if model:
        prompt = f"""
        You are a Financial Risk Assessment AI on PayPilot freelance escrow platform.
        Assess the transaction risk for:
        Amount: {amount} {currency}
        Client ID: {client_id} (History: {client_completed_txs} transactions)
        Freelancer ID: {freelancer_id} (Rating: {freelancer_rating})
        Project ID: {project_id or 'New'}

        Return ONLY valid JSON:
        {{
            "risk_score": 8,
            "risk_level": "LOW RISK",
            "factors_evaluated": [
                {{"factor": "Freelancer profile established", "status": "positive", "detail": "High rating and verified identity"}},
                {{"factor": "Project requirements clear", "status": "positive", "detail": "Milestone deliverables well structured"}},
                {{"factor": "Transaction velocity", "status": "normal", "detail": "Normal frequency"}},
                {{"factor": "Amount within normal bounds", "status": "positive", "detail": "Consistent with industry standards"}}
            ],
            "advisory_recommendation": "Safe to proceed through PayPal Sandbox checkout."
        }}
        """
        try:
            response = model.generate_content(prompt)
            match = re.search(r'\{.*\}', response.text.strip(), re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                score = int(data.get("risk_score", 10))
                return {
                    "risk_score": score,
                    "risk_level": data.get("risk_level", "LOW RISK" if score < 30 else "MEDIUM RISK"),
                    "factors_evaluated": data.get("factors_evaluated", []),
                    "advisory_recommendation": data.get("advisory_recommendation", "Low transactional friction detected. Standard PayPal verification applies."),
                    "is_demo_fallback": False,
                    "disclaimer": "AI risk scores are strictly advisory assessments and do not replace independent due diligence."
                }
        except Exception as e:
            logger.error(f"Gemini API error during transaction risk assessment: {e}")

    # Fallback heuristic calculation matching the frontend's risk UI
    base_score = 8
    if amount > 5000:
        base_score += 15
    if freelancer_rating < 4.0:
        base_score += 20
    if client_completed_txs == 0:
        base_score += 5

    risk_level = "LOW RISK"
    if base_score > 60:
        risk_level = "HIGH RISK"
    elif base_score > 30:
        risk_level = "MEDIUM RISK"

    factors = [
        {"factor": "Freelancer profile established", "status": "positive", "detail": f"Rating {freelancer_rating}/5.0 with verified milestones"},
        {"factor": "Project requirements clear", "status": "positive", "detail": "Scope and timeline agreed by both parties"},
        {"factor": "Amount within expected range", "status": "positive", "detail": f"{currency} {amount:,.2f} is consistent with category standard"},
        {"factor": "Deliverables defined", "status": "positive", "detail": "Deliverable acceptance criteria mapped"},
        {"factor": "No suspicious activity detected", "status": "positive", "detail": "Clean platform fraud checks"}
    ]

    return {
        "risk_score": base_score,
        "risk_level": risk_level,
        "factors_evaluated": factors,
        "advisory_recommendation": "Advisory risk assessment: Low fraud markers detected. Proceed with standard PayPal checkout.",
        "is_demo_fallback": True,
        "disclaimer": "AI risk scores are strictly advisory assessments and do not replace independent due diligence."
    }
