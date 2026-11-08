import pytest
import uuid

def test_create_payment_order_idempotency(client, client_headers):
    idempotency_key = f"test-idemp-{uuid.uuid4().hex}"
    payload = {
        "amount": 250.0,
        "currency": "USD",
        "idempotency_key": idempotency_key
    }

    # 1. First order creation
    res1 = client.post("/api/v1/payments/create-order", json=payload, headers=client_headers)
    assert res1.status_code == 201
    data1 = res1.json()
    assert "paypal_order_id" in data1
    assert data1["status"] == "created"

    # 2. Second order creation with SAME idempotency key returns exact same order
    res2 = client.post("/api/v1/payments/create-order", json=payload, headers=client_headers)
    assert res2.status_code == 201
    data2 = res2.json()
    assert data2["payment_order_id"] == data1["payment_order_id"]
    assert data2["paypal_order_id"] == data1["paypal_order_id"]

def test_capture_payment_order(client, client_headers):
    # 1. Create order
    idempotency_key = f"test-capture-{uuid.uuid4().hex}"
    create_res = client.post("/api/v1/payments/create-order", json={
        "amount": 100.0,
        "currency": "USD",
        "idempotency_key": idempotency_key
    }, headers=client_headers)
    assert create_res.status_code == 201
    paypal_order_id = create_res.json()["paypal_order_id"]

    # 2. Capture payment order
    capture_res = client.post("/api/v1/payments/capture-order", json={
        "paypal_order_id": paypal_order_id
    }, headers=client_headers)
    assert capture_res.status_code == 200
    capture_data = capture_res.json()
    assert capture_data["status"] == "completed"
    assert "paypal_capture_id" in capture_data

    # 3. Duplicate capture returns existing transaction without re-executing
    dup_capture = client.post("/api/v1/payments/capture-order", json={
        "paypal_order_id": paypal_order_id
    }, headers=client_headers)
    assert dup_capture.status_code == 200
    assert dup_capture.json()["transaction_id"] == capture_data["transaction_id"]

    # 4. Check transaction appears in transactions list
    tx_list = client.get("/api/v1/transactions", headers=client_headers)
    assert tx_list.status_code == 200
    txs = tx_list.json()
    assert any(t["id"] == capture_data["transaction_id"] for t in txs)
