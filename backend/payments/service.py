import json
import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.models import (
    User, Project, Milestone, PaymentOrder, Transaction, 
    Notification, AuditLog
)
from backend.payments.paypal_client import paypal_client
from backend.ai.risk import assess_transaction_risk

logger = logging.getLogger(__name__)

class PaymentService:
    @staticmethod
    def create_payment_order(
        db: Session,
        user: User,
        amount: float,
        currency: str,
        idempotency_key: str,
        project_id: Optional[int] = None,
        milestone_id: Optional[int] = None
    ) -> PaymentOrder:
        """
        Creates a payment order with idempotency check.
        If idempotency_key already exists, returns existing order.
        """
        existing_order = db.query(PaymentOrder).filter(
            PaymentOrder.idempotency_key == idempotency_key
        ).first()

        if existing_order:
            logger.info(f"Idempotent hit for payment order key {idempotency_key}")
            return existing_order

        # Verify project & milestone if provided
        project = None
        if project_id:
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

        milestone = None
        if milestone_id:
            milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
            if not milestone:
                raise HTTPException(status_code=404, detail="Milestone not found")

        # Create PayPal Order
        try:
            paypal_res = paypal_client.create_order(
                amount=amount,
                currency=currency,
                custom_id=f"user_{user.id}_proj_{project_id or 0}_ms_{milestone_id or 0}"
            )
            paypal_order_id = paypal_res["id"]
        except Exception as e:
            logger.error(f"PayPal order creation failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"PayPal order creation failed: {str(e)}"
            )

        # Store payment order
        order = PaymentOrder(
            user_id=user.id,
            project_id=project_id,
            milestone_id=milestone_id,
            paypal_order_id=paypal_order_id,
            idempotency_key=idempotency_key,
            amount=amount,
            currency=currency.upper(),
            intent="CAPTURE",
            status="created",
            raw_paypal_response=json.dumps(paypal_res)
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        # Audit log
        audit = AuditLog(
            user_id=user.id,
            action="CREATE_PAYMENT_ORDER",
            entity_type="payment_orders",
            entity_id=str(order.id),
            details=json.dumps({"amount": amount, "currency": currency, "paypal_order_id": paypal_order_id})
        )
        db.add(audit)
        db.commit()

        return order

    @staticmethod
    def capture_payment_order(
        db: Session,
        user: User,
        paypal_order_id: str
    ) -> Transaction:
        """
        Server-side capture verification.
        Never marks transaction completed based only on frontend input or redirect URL.
        """
        payment_order = db.query(PaymentOrder).filter(
            PaymentOrder.paypal_order_id == paypal_order_id
        ).first()

        if not payment_order:
            raise HTTPException(status_code=404, detail="Payment order not found")

        # Duplicate capture prevention
        if payment_order.status == "captured":
            existing_tx = db.query(Transaction).filter(
                Transaction.payment_order_id == payment_order.id
            ).first()
            if existing_tx:
                return existing_tx

        # Capture on PayPal REST API
        try:
            capture_res = paypal_client.capture_order(paypal_order_id)
        except Exception as e:
            payment_order.status = "failed"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"PayPal payment capture failed: {str(e)}"
            )

        paypal_status = capture_res.get("status")
        if paypal_status != "COMPLETED":
            payment_order.status = "failed"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"PayPal transaction not completed. Status: {paypal_status}"
            )

        # Extract capture ID
        capture_id = None
        purchase_units = capture_res.get("purchase_units", [])
        if purchase_units and "payments" in purchase_units[0]:
            captures = purchase_units[0]["payments"].get("captures", [])
            if captures:
                capture_id = captures[0].get("id")

        if not capture_id:
            capture_id = f"CAP-{paypal_order_id[-8:]}"

        payment_order.status = "captured"
        payment_order.raw_paypal_response = json.dumps(capture_res)

        # Determine Freelancer and Project
        freelancer_id = None
        project = None
        if payment_order.project_id:
            project = db.query(Project).filter(Project.id == payment_order.project_id).first()
            if project:
                freelancer_id = project.selected_freelancer_id

        # Calculate advisory risk score
        risk_result = assess_transaction_risk(
            amount=payment_order.amount,
            currency=payment_order.currency,
            client_id=user.id,
            freelancer_id=freelancer_id or 1,
            project_id=payment_order.project_id
        )

        is_simulated = capture_res.get("is_simulated", False)

        # Create Transaction
        transaction = Transaction(
            payment_order_id=payment_order.id,
            project_id=payment_order.project_id,
            client_id=user.id,
            freelancer_id=freelancer_id,
            transaction_type="milestone_payment",
            paypal_capture_id=capture_id,
            amount=payment_order.amount,
            fee_amount=round(payment_order.amount * 0.03, 2),  # 3% platform fee
            currency=payment_order.currency,
            status="completed",
            ai_risk_score=float(risk_result["risk_score"]),
            is_simulated=is_simulated
        )
        db.add(transaction)

        # Update Milestone status if applicable
        if payment_order.milestone_id:
            milestone = db.query(Milestone).filter(Milestone.id == payment_order.milestone_id).first()
            if milestone:
                milestone.status = "paid"

        # Update Project status if applicable
        if project and project.status == "review":
            project.status = "completed"

        # Create Notifications
        notif_client = Notification(
            user_id=user.id,
            title="Payment Confirmed",
            message=f"Payment of {payment_order.currency} {payment_order.amount:.2f} was successfully captured via PayPal.",
            notification_type="payment",
            link_url="/transactions"
        )
        db.add(notif_client)

        if freelancer_id:
            notif_freelancer = Notification(
                user_id=freelancer_id,
                title="Funds Received",
                message=f"Client released {payment_order.currency} {payment_order.amount:.2f} for your project milestone.",
                notification_type="payment",
                link_url="/transactions"
            )
            db.add(notif_freelancer)

        # Audit log
        audit = AuditLog(
            user_id=user.id,
            action="CAPTURE_PAYMENT",
            entity_type="transactions",
            entity_id=str(transaction.id),
            details=json.dumps({"capture_id": capture_id, "amount": payment_order.amount})
        )
        db.add(audit)

        db.commit()
        db.refresh(transaction)
        return transaction
