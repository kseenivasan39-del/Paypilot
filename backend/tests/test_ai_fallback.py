import pytest

def test_ai_analyze_requirements_fallback(client):
    res = client.post("/api/v1/ai/analyze-requirements", json={
        "description": "Build a React and Python technical dashboard for solar energy monitoring with PDF report exports."
    })
    assert res.status_code == 200
    data = res.json()
    assert len(data["extracted_skills"]) > 0
    assert len(data["deliverables"]) > 0
    assert data["complexity"] in ["Low", "Medium", "High"]
    assert "is_demo_fallback" in data

def test_ai_freelancer_matching_and_ranking(client, test_freelancer_user):
    res = client.post("/api/v1/ai/match-freelancers", json={
        "project_description": "React.js frontend developer needed for Tailwind dashboard.",
        "required_skills": ["React", "TypeScript", "Tailwind CSS"],
        "budget": 15000.0
    })
    assert res.status_code == 200
    data = res.json()
    assert "matches" in data
    assert len(data["matches"]) > 0
    first_match = data["matches"][0]
    assert "match_score" in first_match
    assert "match_reason" in first_match
    assert "key_strengths" in first_match

def test_ai_negotiation_advice(client):
    res = client.post("/api/v1/ai/negotiation-advice", json={
        "project_id": 1,
        "freelancer_id": 2,
        "client_budget": 5000.0,
        "freelancer_rate": 8000.0,
        "scope_notes": "Technical writing and research paper on renewable energy"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["recommended_compromise_rate"] == 6500.0
    assert len(data["suggested_milestones"]) == 3
    assert len(data["talking_points"]) > 0

def test_ai_deliverable_verification_advisory(client, client_headers):
    res = client.post("/api/v1/ai/verify-deliverable", json={
        "deliverable_id": 1,
        "deliverable_title": "React Dashboard Source Code and Deployment",
        "submission_notes": "Completed all components and verified with Next.js build.",
        "project_requirements": "Responsive dark-mode UI with zero compilation warnings."
    }, headers=client_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["verification_status"] in ["passed", "flagged", "inconclusive"]
    assert "disclaimer" in data
    assert "advisory" in data["disclaimer"].lower()

def test_ai_transaction_risk_assessment_advisory(client):
    res = client.post("/api/v1/ai/risk-assessment", json={
        "amount": 3500.0,
        "currency": "INR",
        "client_id": 1,
        "freelancer_id": 2
    })
    assert res.status_code == 200
    data = res.json()
    assert 0 <= data["risk_score"] <= 100
    assert data["risk_level"] in ["LOW RISK", "MEDIUM RISK", "HIGH RISK"]
    assert len(data["factors_evaluated"]) > 0
    assert "advisory" in data["disclaimer"].lower()
