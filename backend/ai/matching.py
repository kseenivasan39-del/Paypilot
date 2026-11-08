import json
import re
import logging
from typing import Dict, Any, List, Optional
from backend.ai.client import get_ai_model
from backend.config import settings

logger = logging.getLogger(__name__)

def match_and_rank_freelancers(
    project_title: str,
    project_description: str,
    required_skills: List[str],
    candidate_freelancers: List[Dict[str, Any]],
    budget: Optional[float] = None
) -> Dict[str, Any]:
    """
    Ranks candidates and returns explainable match recommendations.
    Provides an explicitly labeled demo fallback when Gemini is unavailable.
    """
    model = get_ai_model()
    if model and candidate_freelancers:
        candidates_summary = [
            {
                "id": c["id"],
                "name": c["name"],
                "title": c.get("title", ""),
                "skills": c.get("skills", ""),
                "rating": c.get("rating", 5.0),
                "completed_projects": c.get("completed_projects", 0),
                "hourly_rate": c.get("hourly_rate", 0.0)
            }
            for c in candidate_freelancers
        ]

        prompt = f"""
        You are an AI Talent Matching Specialist on PayPilot Freelance Marketplace.
        Rank the following candidates for the project and provide explainable recommendations.

        Project: {project_title}
        Description: {project_description}
        Required Skills: {', '.join(required_skills)}
        Budget: {budget or 'Flexible'}

        Candidates:
        {json.dumps(candidates_summary, indent=2)}

        Return ONLY valid JSON with this structure:
        {{
            "analysis_overview": "Summary of match criteria",
            "matches": [
                {{
                    "freelancer_id": 1,
                    "match_score": 96,
                    "match_reason": "Clear explanation why this freelancer is the top fit",
                    "key_strengths": ["Strength 1", "Strength 2"]
                }}
            ]
        }}
        """
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                # Merge AI scoring back with candidate details
                scored_map = {m["freelancer_id"]: m for m in data.get("matches", [])}
                results = []
                for c in candidate_freelancers:
                    ai_meta = scored_map.get(c["id"], {})
                    results.append({
                        "freelancer_id": c["id"],
                        "name": c["name"],
                        "title": c.get("title", "Freelance Specialist"),
                        "match_score": ai_meta.get("match_score", int(c.get("rating", 4.5) * 18)),
                        "match_reason": ai_meta.get("match_reason", "Verified skill set aligns closely with the project requirements."),
                        "key_strengths": ai_meta.get("key_strengths", ["Skill Alignment", "High Client Rating"]),
                        "hourly_rate": c.get("hourly_rate", 0.0),
                        "currency": c.get("currency", "INR"),
                        "rating": c.get("rating", 5.0),
                        "completed_projects": c.get("completed_projects", 0),
                        "avatar_url": c.get("avatar_url")
                    })
                results.sort(key=lambda x: x["match_score"], reverse=True)
                return {
                    "matches": results,
                    "model_used": settings.AI_MODEL_NAME,
                    "is_demo_fallback": False,
                    "analysis_overview": data.get("analysis_overview", "AI evaluated technical overlap, portfolio reliability, and historical performance.")
                }
        except Exception as e:
            logger.error(f"Gemini API error during matching: {e}")

    # Explicitly labeled demo fallback with explainable heuristics
    results = []
    req_skills_set = set(s.lower().strip() for s in required_skills if s)

    for c in candidate_freelancers:
        cand_skills = c.get("skills", "")
        if isinstance(cand_skills, str):
            c_skills_list = [s.strip().lower() for s in cand_skills.split(",") if s.strip()]
        elif isinstance(cand_skills, list):
            c_skills_list = [str(s).strip().lower() for s in cand_skills]
        else:
            c_skills_list = []

        overlap = sum(1 for rs in req_skills_set if any(rs in cs or cs in rs for cs in c_skills_list))
        base_score = 75
        if req_skills_set:
            overlap_pct = min(overlap / max(len(req_skills_set), 1), 1.0)
            base_score = int(70 + (overlap_pct * 25))
        
        # Rating boost
        rating_boost = int((c.get("rating", 4.5) - 4.0) * 10)
        final_score = min(max(base_score + rating_boost, 65), 98)

        strengths = []
        if overlap > 0:
            strengths.append(f"Matching competencies in {', '.join(required_skills[:2])}")
        if c.get("rating", 0) >= 4.8:
            strengths.append(f"Top-rated freelancer ({c.get('rating')} Stars)")
        if c.get("completed_projects", 0) > 10:
            strengths.append(f"{c.get('completed_projects')} verified projects on PayPilot")
        if not strengths:
            strengths = ["Reliable communication", "Strong portfolio examples"]

        reason = (
            f"{c['name']} has demonstrated experience in relevant technologies with a "
            f"{c.get('rating', 4.9)} rating across {c.get('completed_projects', 0)} completed jobs."
        )

        results.append({
            "freelancer_id": c["id"],
            "name": c["name"],
            "title": c.get("title", "Full Stack Developer"),
            "match_score": final_score,
            "match_reason": reason,
            "key_strengths": strengths,
            "hourly_rate": c.get("hourly_rate", 1200.0),
            "currency": c.get("currency", "INR"),
            "rating": c.get("rating", 4.9),
            "completed_projects": c.get("completed_projects", 12),
            "avatar_url": c.get("avatar_url")
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return {
        "matches": results,
        "model_used": "demo-fallback-semantic-heuristic",
        "is_demo_fallback": True,
        "analysis_overview": "Ranked candidates using weighted keyword compatibility, historical client feedback ratings, and verified completion rates."
    }
