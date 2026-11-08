import json
import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, PaymentOrder, WebhookEvent, AuditLog
from backend.schemas import (
    CreatePaymentOrderRequest, CreatePaymentOrderResponse,
    CapturePaymentOrderRequest, CapturePaymentOrderResponse
)
from backend.security import get_current_user
from backend.payments.service import PaymentService
from backend.payments.paypal_client import paypal_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["Payments & PayPal"])

@router.post("/create-order", response_model=CreatePaymentOrderResponse, status_code=status.HTTP_201_CREATED)
def create_payment_order(
    data: CreatePaymentOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Creates a PayPal order with duplicate-request protection / idempotency key.
    Returns the PayPal Order ID and approval link.
    """
    order = PaymentService.create_payment_order(
        db=db,
        user=current_user,
        amount=data.amount,
        currency=data.currency,
        idempotency_key=data.idempotency_key,
        project_id=data.project_id,
        milestone_id=data.milestone_id
    )

    approval_url = None
    if order.raw_paypal_response:
        try:
            raw = json.loads(order.raw_paypal_response)
            for link in raw.get("links", []):
                if link.get("rel") in ["approve", "payer-action"]:
                    approval_url = link.get("href")
                    break
        except Exception:
            pass

    return {
        "payment_order_id": order.id,
        "paypal_order_id": order.paypal_order_id,
        "status": order.status,
        "approval_url": approval_url,
        "amount": order.amount,
        "currency": order.currency
    }

@router.post("/capture-order", response_model=CapturePaymentOrderResponse)
def capture_payment_order(
    data: CapturePaymentOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Server-side payment capture after buyer approves via PayPal.
    Verifies payment with PayPal REST API before recording completed transaction.
    Never marks a transaction completed based only on frontend redirect URLs.
    """
    transaction = PaymentService.capture_payment_order(
        db=db,
        user=current_user,
        paypal_order_id=data.paypal_order_id
    )

    return {
        "transaction_id": transaction.id,
        "paypal_order_id": data.paypal_order_id,
        "paypal_capture_id": transaction.paypal_capture_id or "",
        "amount": transaction.amount,
        "currency": transaction.currency,
        "status": transaction.status,
        "message": "Payment verified and captured successfully via PayPal."
    }

@router.get("/orders/{paypal_order_id}")
def get_order_status(
    paypal_order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves current order status directly from PayPal REST API."""
    order = db.query(PaymentOrder).filter(PaymentOrder.paypal_order_id == paypal_order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Payment order not found")

    try:
        paypal_details = paypal_client.get_order_details(paypal_order_id)
        return {
            "payment_order_id": order.id,
            "paypal_order_id": paypal_order_id,
            "local_status": order.status,
            "paypal_status": paypal_details.get("status"),
            "amount": order.amount,
            "currency": order.currency,
            "paypal_details": paypal_details
        }
    except Exception as e:
        logger.error(f"Error fetching PayPal order {paypal_order_id}: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def paypal_webhook_listener(
    request: Request,
    paypal_transmission_id: str = Header(None, alias="paypal-transmission-id"),
    paypal_transmission_time: str = Header(None, alias="paypal-transmission-time"),
    paypal_cert_url: str = Header(None, alias="paypal-cert-url"),
    paypal_auth_algo: str = Header(None, alias="paypal-auth-algo"),
    paypal_transmission_sig: str = Header(None, alias="paypal-transmission-sig"),
    db: Session = Depends(get_db)
):
    """
    Verified PayPal Webhook Receiver.
    Validates webhook signature against PayPal's verification service.
    Protects against replay attacks and duplicate webhook event processing.
    """
    body_bytes = await request.body()
    try:
        event_payload = json.loads(body_bytes.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_id = event_payload.get("id")
    event_type = event_payload.get("event_type", "UNKNOWN")

    if not event_id:
        raise HTTPException(status_code=400, detail="Missing event ID")

    # Check if event already processed
    existing_event = db.query(WebhookEvent).filter(WebhookEvent.event_id == event_id).first()
    if existing_event:
        logger.info(f"Duplicate webhook event {event_id} ignored.")
        return {"status": "duplicate_ignored", "event_id": event_id}

    # Verify signature
    is_valid = paypal_client.verify_webhook_signature(
        transmission_id=paypal_transmission_id or "",
        transmission_time=paypal_transmission_time or "",
        cert_url=paypal_cert_url or "",
        auth_algo=paypal_auth_algo or "",
        transmission_sig=paypal_transmission_sig or "",
        webhook_id="",
        webhook_event_payload=event_payload
    )

    if not is_valid:
        logger.warning(f"Invalid webhook signature for event {event_id}")
        # In production, unverified signatures should be rejected
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    # Record event
    webhook_record = WebhookEvent(
        event_id=event_id,
        event_type=event_type,
        resource_type=event_payload.get("resource_type"),
        summary=event_payload.get("summary"),
        payload=json.dumps(event_payload),
        status="processed"
    )
    db.add(webhook_record)

    # Handle known event types
    if event_type == "CHECKOUT.ORDER.APPROVED":
        # Order approved by user
        resource = event_payload.get("resource", {})
        order_id = resource.get("id")
        if order_id:
            order = db.query(PaymentOrder).filter(PaymentOrder.paypal_order_id == order_id).first()
            if order and order.status == "created":
                order.status = "approved"

    elif event_type in ["PAYMENT.CAPTURE.COMPLETED", "CHECKOUT.ORDER.COMPLETED"]:
        logger.info(f"Capture completed webhook received for {event_id}")

    elif event_type in ["PAYMENT.CAPTURE.DENIED", "PAYMENT.CAPTURE.DECLINED"]:
        resource = event_payload.get("resource", {})
        order_id = resource.get("supplementary_data", {}).get("related_ids", {}).get("order_id")
        if order_id:
            order = db.query(PaymentOrder).filter(PaymentOrder.paypal_order_id == order_id).first()
            if order:
                order.status = "failed"

    db.commit()
    return {"status": "processed", "event_id": event_id}
