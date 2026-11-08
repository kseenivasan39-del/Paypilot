import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_ai_chat_freelancer_query():
    response = client.post("/api/v1/ai/chat", json={
        "message": "Find me a React developer for my website project"
    })
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["model_used"] in ["demo-rule-assistant", "gemini-1.5-flash"]
    assert "freelancers" in data
    assert len(data["freelancers"]) > 0
    assert data["freelancers"][0]["name"] == "Rahul Kumar"

def test_ai_chat_payment_query():
    response = client.post("/api/v1/ai/chat", json={
        "message": "How does milestone payment work with PayPal?"
    })
    assert response.status_code == 200
    data = response.json()
    assert "paypal" in data["response"].lower() or "milestone" in data["response"].lower()
    assert "disclaimer" in data
