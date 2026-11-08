import pytest

def test_register_client_success(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "newclient@example.com",
        "password": "Password123!",
        "full_name": "New Client",
        "role": "client"
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newclient@example.com"
    assert data["user"]["role"] == "client"

def test_register_duplicate_email_fails(client, test_client_user):
    res = client.post("/api/v1/auth/register", json={
        "email": test_client_user.email,
        "password": "Password123!",
        "full_name": "Duplicate User",
        "role": "client"
    })
    assert res.status_code == 400
    assert "already exists" in res.json()["detail"]

def test_login_success(client, test_client_user):
    res = client.post("/api/v1/auth/login", json={
        "email": test_client_user.email,
        "password": "Password123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_client_user.email

def test_login_invalid_password_fails(client, test_client_user):
    res = client.post("/api/v1/auth/login", json={
        "email": test_client_user.email,
        "password": "WrongPassword!"
    })
    assert res.status_code == 401
    assert "Invalid email or password" in res.json()["detail"]

def test_get_current_user_profile(client, client_headers):
    res = client.get("/api/v1/auth/me", headers=client_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "test_client@example.com"
    assert data["role"] == "client"

def test_protected_route_without_token_fails(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
