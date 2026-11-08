import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Project, FreelancerProfile, AIVerification, Deliverable
from backend.schemas import (
    AIRequirementAnalysisRequest, AIRequirementAnalysisResponse,
    AIMatchingRequest, AIMatchingResponse,
    AINegotiationRequest, AINegotiationResponse,
    AIDeliverableVerificationRequest, AIDeliverableVerificationResponse,
    AIRiskAssessmentRequest, AIRiskAssessmentResponse,
    AIChatRequest, AIChatResponse
)
from backend.security import get_current_user_optional, get_current_user
from backend.ai.analyzer import analyze_requirements
from backend.ai.matching import match_and_rank_freelancers
from backend.ai.negotiation import suggest_negotiation
from backend.ai.verification import verify_deliverable
from backend.ai.risk import assess_transaction_risk
from backend.ai.chat import chat_with_ai

router = APIRouter(prefix="/ai", tags=["AI Services"])

@router.post("/analyze-requirements", response_model=AIRequirementAnalysisResponse)
def api_analyze_requirements(data: AIRequirementAnalysisRequest):
    """
    Analyzes project specifications using Google Gemini or explicitly labeled demo fallback.
    Extracts skills, deliverables, complexity, duration, and budget estimate.
    """
    result = analyze_requirements(data.description)
    return result

@router.post("/match-freelancers", response_model=AIMatchingResponse)
def api_match_freelancers(data: AIMatchingRequest, db: Session = Depends(get_db)):
    """
    Ranks freelancer candidates for a project with explainable recommendations.
    Uses real Gemini call when available or intelligent semantic heuristic fallback.
    """
    # 1. Fetch Candidates from database
    profiles = db.query(FreelancerProfile).join(User).filter(User.is_active == True).all()
    candidates = []
    for p in profiles:
        candidates.append({
            "id": p.user_id,
            "name": p.user.full_name,
            "title": p.title or "Freelance Specialist",
            "skills": p.skills or "",
            "rating": p.rating,
            "completed_projects": p.completed_projects_count,
            "hourly_rate": p.hourly_rate,
            "currency": p.currency,
            "avatar_url": p.user.avatar_url
        })

    title = "Freelance Project"
    description = data.project_description or ""
    required_skills = data.required_skills or []

    # If project_id provided, fetch details from DB
    if data.project_id:
        proj = db.query(Project).filter(Project.id == data.project_id).first()
        if proj:
            title = proj.title
            description = proj.description
            if not required_skills and proj.required_skills:
                required_skills = [s.strip() for s in proj.required_skills.split(",") if s.strip()]

    result = match_and_rank_freelancers(
        project_title=title,
        project_description=description,
        required_skills=required_skills,
        candidate_freelancers=candidates,
        budget=data.budget
    )
    return result

@router.post("/negotiation-advice", response_model=AINegotiationResponse)
def api_negotiation_advice(data: AINegotiationRequest, db: Session = Depends(get_db)):
    """
    Generates structured milestone recommendations and compromise rates.
    """
    result = suggest_negotiation(
        client_budget=data.client_budget,
        freelancer_rate=data.freelancer_rate,
        scope_notes=data.scope_notes
    )
    return result

@router.post("/verify-deliverable", response_model=AIDeliverableVerificationResponse)
def api_verify_deliverable(
    data: AIDeliverableVerificationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates deliverable completion against requirements.
    Advisory only: does not release payments or bypass permissions.
    """
    result = verify_deliverable(
        deliverable_title=data.deliverable_title,
        submission_notes=data.submission_notes,
        project_requirements=data.project_requirements
    )

    # Record AI verification audit record
    deliverable = db.query(Deliverable).filter(Deliverable.id == data.deliverable_id).first()
    project_id = deliverable.project_id if deliverable else None

    verification = AIVerification(
        project_id=project_id,
        deliverable_id=data.deliverable_id if deliverable else None,
        verification_type="deliverable_check",
        model_used=result.get("model_used", "gemini-1.5-flash"),
        is_demo_fallback=result.get("is_demo_fallback", True),
        status=result.get("verification_status", "passed"),
        confidence_score=result.get("confidence_score", 0.9),
        summary=result.get("summary", ""),
        details=json.dumps(result.get("checklist", []))
    )
    db.add(verification)
    db.commit()

    return result

@router.post("/risk-assessment", response_model=AIRiskAssessmentResponse)
def api_risk_assessment(data: AIRiskAssessmentRequest, db: Session = Depends(get_db)):
    """
    Advisory transaction risk assessment.
    Returns 0-100 risk score and factor breakdown. Never blocks or approves payments autonomously.
    """
    result = assess_transaction_risk(
        amount=data.amount,
        currency=data.currency,
        client_id=data.client_id,
        freelancer_id=data.freelancer_id,
        project_id=data.project_id
    )
    return result

@router.post("/chat", response_model=AIChatResponse)
def api_chat(data: AIChatRequest):
    """
    Interactive PayPilot AI chat assistant.
    Provides project scoping, freelancer recommendation widgets, and payment workflow guidance.
    """
    result = chat_with_ai(message=data.message, history=data.history)
    return result

