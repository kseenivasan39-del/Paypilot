import pytest

def test_list_pricing_plans_catalog(client):
    res = client.get("/api/v1/plans")
    assert res.status_code == 200
    plans = res.json()
    assert len(plans) >= 3
    codes = [p["code"] for p in plans]
    assert "free" in codes
    assert "pro" in codes
    assert "business" in codes

    free_plan = next(p for p in plans if p["code"] == "free")
    assert free_plan["price_monthly"] == 0.0

    pro_plan = next(p for p in plans if p["code"] == "pro")
    assert pro_plan["price_monthly"] == 499.0

    biz_plan = next(p for p in plans if p["code"] == "business")
    assert biz_plan["price_monthly"] == 1999.0

def test_user_current_subscription_and_entitlements(client, client_headers):
    # 1. Fetch current subscription (auto-assigns Free plan if none)
    sub_res = client.get("/api/v1/subscriptions/current", headers=client_headers)
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["status"] == "active"
    assert sub_data["plan"]["code"] == "free"

    # 2. Check entitlements
    ent_res = client.get("/api/v1/subscriptions/entitlements", headers=client_headers)
    assert ent_res.status_code == 200
    ent_data = ent_res.json()
    assert ent_data["plan_code"] == "free"
    assert ent_data["max_projects"] == 3

    # 3. Select Pro plan
    select_res = client.post("/api/v1/subscriptions/select", json={
        "plan_code": "pro",
        "billing_cycle": "monthly"
    }, headers=client_headers)
    assert select_res.status_code == 200
    assert select_res.json()["plan"]["code"] == "pro"

    # 4. Verify upgraded entitlements
    ent_upgraded = client.get("/api/v1/subscriptions/entitlements", headers=client_headers)
    assert ent_upgraded.json()["plan_code"] == "pro"
    assert ent_upgraded.json()["priority_support"] is True
