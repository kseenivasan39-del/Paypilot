import pytest

def test_freelancer_apply_to_project(client, client_headers, freelancer_headers):
    # 1. Client creates project
    proj_res = client.post("/api/v1/projects", json={
        "title": "Mobile App UI Design",
        "description": "Figma design for iOS and Android healthcare app with 15 screens.",
        "budget": 30000.0,
        "auto_analyze_ai": False
    }, headers=client_headers)
    project_id = proj_res.json()["id"]

    # 2. Freelancer applies
    app_res = client.post("/api/v1/applications", json={
        "project_id": project_id,
        "cover_letter": "I have 4 years of UI/UX design experience and have designed multiple healthcare apps.",
        "proposed_rate": 28000.0,
        "currency": "INR",
        "proposed_timeline": "14 days"
    }, headers=freelancer_headers)
    assert app_res.status_code == 201
    app_data = app_res.json()
    assert app_data["status"] == "pending"
    assert app_data["proposed_rate"] == 28000.0
    app_id = app_data["id"]

    # 3. Duplicate application rejected
    dup_res = client.post("/api/v1/applications", json={
        "project_id": project_id,
        "cover_letter": "Applying again should fail.",
        "proposed_rate": 25000.0
    }, headers=freelancer_headers)
    assert dup_res.status_code == 400
    assert "already applied" in dup_res.json()["detail"]

    # 4. Client accepts proposal
    accept_res = client.put(f"/api/v1/applications/{app_id}/status", json={"status": "accepted"}, headers=client_headers)
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "accepted"

    # 5. Project reflects selected freelancer
    proj_check = client.get(f"/api/v1/projects/{project_id}")
    assert proj_check.json()["status"] == "in_progress"
    assert proj_check.json()["selected_freelancer_id"] is not None
