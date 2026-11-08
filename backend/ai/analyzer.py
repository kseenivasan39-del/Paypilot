import json
import re
import logging
from typing import Dict, Any, List
from backend.ai.client import get_ai_model
from backend.config import settings

logger = logging.getLogger(__name__)

def analyze_requirements(description: str) -> Dict[str, Any]:
    """
    Analyzes project description using Gemini AI or provides an explicitly labeled demo fallback.
    Returns extracted_skills, deliverables, complexity, duration, recommended budget, summary.
    """
    model = get_ai_model()
    if model:
        prompt = f"""
        You are an expert AI software project manager.
        Analyze the following project description and extract structured specifications.
        Return ONLY valid JSON (no markdown formatting or extra text) with the following structure:
        {{
            "extracted_skills": ["Skill1", "Skill2", "Skill3"],
            "deliverables": ["Deliverable 1 description", "Deliverable 2 description"],
            "complexity": "Low" or "Medium" or "High",
            "estimated_duration": "X weeks" or "X days",
            "recommended_budget_range": {{"min": 1000.0, "max": 5000.0}},
            "summary": "Brief executive summary of project requirements"
        }}

        Project Description:
        {description}
        """
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            # Extract JSON block if wrapped in markdown
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                return {
                    "extracted_skills": data.get("extracted_skills", []),
                    "deliverables": data.get("deliverables", []),
                    "complexity": data.get("complexity", "Medium"),
                    "estimated_duration": data.get("estimated_duration", "2-3 weeks"),
                    "recommended_budget_range": data.get("recommended_budget_range", {"min": 500.0, "max": 2500.0}),
                    "summary": data.get("summary", "AI analyzed project requirements successfully."),
                    "model_used": settings.AI_MODEL_NAME,
                    "is_demo_fallback": False
                }
        except Exception as e:
            logger.error(f"Gemini API error during requirement analysis: {e}")

    # Explicitly labeled demo fallback
    desc_lower = description.lower()
    skills = []
    if any(k in desc_lower for k in ["react", "frontend", "dashboard", "next", "web", "ui"]):
        skills.extend(["React.js", "TypeScript", "Tailwind CSS", "REST APIs"])
    if any(k in desc_lower for k in ["python", "backend", "api", "fastapi", "django"]):
        skills.extend(["Python", "FastAPI", "SQLAlchemy", "Database Design"])
    if any(k in desc_lower for k in ["report", "technical", "solar", "writing", "paper", "documentation"]):
        skills.extend(["Technical Writing", "Research", "Documentation", "Data Synthesis"])
    if any(k in desc_lower for k in ["design", "figma", "ui/ux", "graphic"]):
        skills.extend(["Figma", "UI/UX Design", "Wireframing", "Prototyping"])
    if not skills:
        skills = ["Software Engineering", "Problem Solving", "Deliverable Management"]

    complexity = "Medium"
    if any(k in desc_lower for k in ["quick", "simple", "landing", "basic", "small"]):
        complexity = "Low"
    elif any(k in desc_lower for k in ["enterprise", "ai", "machine learning", "distributed", "complex", "scalable"]):
        complexity = "High"

    duration = "1-2 weeks"
    if complexity == "Low":
        duration = "3-5 days"
    elif complexity == "High":
        duration = "4-6 weeks"

    deliverables = [
        "Fully functional source code repository with clear documentation",
        "Configured deployment environment and integration testing report",
        "Milestone demonstration and handover session"
    ]
    if "report" in desc_lower or "writing" in desc_lower:
        deliverables = [
            "Comprehensive technical report draft for initial review",
            "Final revised PDF and editable source document with citations",
            "Executive summary deck"
        ]

    return {
        "extracted_skills": skills,
        "deliverables": deliverables,
        "complexity": complexity,
        "estimated_duration": duration,
        "recommended_budget_range": {"min": 2000.0, "max": 7500.0},
        "summary": "Identified core architectural deliverables, required technical competencies, and preliminary milestone scopes.",
        "model_used": "demo-fallback-heuristic-engine",
        "is_demo_fallback": True
    }
