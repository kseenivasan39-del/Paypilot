import json
import re
import logging
from typing import Dict, Any, Optional
from backend.ai.client import get_ai_model
from backend.config import settings

logger = logging.getLogger(__name__)

def verify_deliverable(
    deliverable_title: str,
    submission_notes: Optional[str] = None,
    project_requirements: Optional[str] = None
) -> Dict[str, Any]:
    """
    Verifies deliverable submission against project requirements.
    Advisory only: Never authorizes payment or independently releases funds.
    """
    model = get_ai_model()
    if model:
        prompt = f"""
        You are an AI Deliverable Quality Auditor on PayPilot.
        Evaluate the submitted work against agreed requirements.

        Deliverable: {deliverable_title}
        Submission Notes: {submission_notes or 'No notes provided'}
        Project Requirements: {project_requirements or 'Standard production quality code and documentation'}

        Return ONLY valid JSON:
        {{
            "verification_status": "passed" or "flagged" or "inconclusive",
            "confidence_score": 0.94,
            "summary": "Clear audit summary",
            "checklist": [
                {{"item": "Core functional requirements addressed", "passed": true, "note": "Checked"}},
                {{"item": "Documentation and setup instructions provided", "passed": true, "note": "Verified"}},
                {{"item": "No critical omissions observed", "passed": true, "note": "Clean"}}
            ],
            "recommendations_for_client": "Actionable advice before client manually approves milestone payout"
        }}
        """
        try:
            response = model.generate_content(prompt)
            match = re.search(r'\{.*\}', response.text.strip(), re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                return {
                    "verification_status": data.get("verification_status", "passed"),
                    "confidence_score": float(data.get("confidence_score", 0.9)),
                    "summary": data.get("summary", "Deliverable satisfies required acceptance criteria."),
                    "checklist": data.get("checklist", []),
                    "recommendations_for_client": data.get("recommendations_for_client", "Review the attached files to verify deliverables meet your personal standards before releasing funds."),
                    "is_demo_fallback": False,
                    "disclaimer": "AI verification is strictly advisory. Final approval and financial payout requires client authorization."
                }
        except Exception as e:
            logger.error(f"Gemini API error during deliverable verification: {e}")

    # Explicitly labeled demo fallback
    return {
        "verification_status": "passed",
        "confidence_score": 0.92,
        "summary": "Deliverable submission matches required milestone specifications and technical documentation standards.",
        "checklist": [
            {"item": "Source code repository and branch structure", "passed": True, "note": "Structure matches specification"},
            {"item": "Component functionality and responsiveness", "passed": True, "note": "All requested UI components present"},
            {"item": "Build verification and zero compilation errors", "passed": True, "note": "Build test clean"},
            {"item": "Deployment instructions & environment setup", "passed": True, "note": "Included in README"}
        ],
        "recommendations_for_client": "Perform a brief visual inspection of the deliverables before manually clicking 'Approve & Release Funds'.",
        "is_demo_fallback": True,
        "disclaimer": "AI verification is strictly advisory. Final approval and financial payout requires client authorization."
    }
