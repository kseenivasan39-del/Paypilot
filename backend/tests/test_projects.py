import pytest

def test_create_project_by_client(client, client_headers):
    payload = {
        "title": "E-Commerce Payment Gateway Integration",
        "description": "Integrate official PayPal REST APIs into our Next.js store with webhook verification and error handling.",
        "category": "Web Development",
        "budget": 25000.0,
        "currency": "INR",
        "auto_analyze_ai": True
    }
    res = client.post("/api/v1/projects", json=payload, headers=client_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "open"
    assert data["requirements"] is not None
    assert len(data["requirements"]["extracted_skills"]) > 0

def test_freelancer_cannot_create_project(client, freelancer_headers):
    payload = {
        "title": "Freelancer Project Attempt",
        "description": "This should fail because freelancers cannot post projects as clients.",
        "budget": 5000.0
    }
    res = client.post("/api/v1/projects", json=payload, headers=freelancer_headers)
    assert res.status_code == 403
    assert "Operation not permitted" in res.json()["detail"]

def test_project_ownership_enforcement(client, client_headers, freelancer_headers):
    # 1. Create project by client
    payload = {
        "title": "Client Project For Ownership Check",
        "description": "Testing that another user cannot edit this project.",
        "budget": 10000.0
    }
    create_res = client.post("/api/v1/projects", json=payload, headers=client_headers)
    project_id = create_res.json()["id"]

    # 2. Freelancer tries to update client's project
    update_res = client.put(f"/api/v1/projects/{project_id}", json={"title": "Hacked Title"}, headers=freelancer_headers)
    assert update_res.status_code == 403
    assert "You can only update projects that you created" in update_res.json()["detail"]

def test_list_and_get_projects(client, client_headers):
    res = client.get("/api/v1/projects")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
