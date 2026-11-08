import pytest
import uuid

def test_webhook_event_processing_and_deduplication(client):
    event_id = f"WH-{uuid.uuid4().hex}"
    payload = {
        "id": event_id,
        "event_type": "CHECKOUT.ORDER.APPROVED",
        "resource_type": "checkout-order",
        "summary": "Buyer approved order checkout",
        "resource": {
            "id": f"ORD-{uuid.uuid4().hex[:8]}"
        }
    }

    # 1. First webhook transmission
    res1 = client.post("/api/v1/payments/webhook", json=payload)
    assert res1.status_code == 200
    assert res1.json()["status"] == "processed"

    # 2. Duplicate transmission ignored
    res2 = client.post("/api/v1/payments/webhook", json=payload)
    assert res2.status_code == 200
    assert res2.json()["status"] == "duplicate_ignored"
