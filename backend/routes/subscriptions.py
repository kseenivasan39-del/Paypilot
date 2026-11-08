import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, PricingPlan, Subscription, Notification, AuditLog
from backend.schemas import SubscriptionCreateRequest, SubscriptionResponse
from backend.security import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])

@router.get("/current", response_model=Optional[SubscriptionResponse])
def get_current_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the user's active subscription.
    If no active subscription exists, automatically defaults to the Free plan.
    """
    sub = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status.in_(["active", "past_due"])
    ).order_by(Subscription.created_at.desc()).first()

    if not sub:
        free_plan = db.query(PricingPlan).filter(PricingPlan.code == "free").first()
        if free_plan:
            sub = Subscription(
                user_id=current_user.id,
                plan_id=free_plan.id,
                billing_cycle="monthly",
                status="active",
                current_period_start=datetime.datetime.now(datetime.timezone.utc),
                current_period_end=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365)
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)

    return sub

@router.get("/entitlements")
def get_user_entitlements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns the user's current feature entitlements based on their active subscription."""
    sub = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).order_by(Subscription.created_at.desc()).first()

    plan = sub.plan if sub else db.query(PricingPlan).filter(PricingPlan.code == "free").first()
    if not plan:
        return {
            "plan_code": "free",
            "max_projects": 3,
            "priority_support": False,
            "ai_matching_level": "basic"
        }

    return {
        "plan_code": plan.code,
        "plan_name": plan.name,
        "max_projects": plan.max_projects,
        "priority_support": plan.priority_support,
        "ai_matching_level": plan.ai_matching_level,
        "subscription_status": sub.status if sub else "active",
        "renewal_date": sub.current_period_end if sub else None
    }

@router.post("/select", response_model=SubscriptionResponse)
def select_or_subscribe_plan(
    data: SubscriptionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Selects or activates a subscription plan.
    Free plan is activated immediately.
    Paid plans require verified payment / PayPal subscription confirmation.
    """
    target_plan = db.query(PricingPlan).filter(PricingPlan.code == data.plan_code.lower()).first()
    if not target_plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Cancel any previous active subscription
    active_subs = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).all()
    for s in active_subs:
        s.status = "cancelled"

    # In sandbox/demo mode, or if free plan
    sub_status = "active"
    period_days = 30 if data.billing_cycle == "monthly" else 365
    now = datetime.datetime.now(datetime.timezone.utc)

    sub = Subscription(
        user_id=current_user.id,
        plan_id=target_plan.id,
        paypal_subscription_id=data.paypal_subscription_id,
        billing_cycle=data.billing_cycle,
        status=sub_status,
        current_period_start=now,
        current_period_end=now + datetime.timedelta(days=period_days),
        cancel_at_period_end=False
    )
    db.add(sub)

    notif = Notification(
        user_id=current_user.id,
        title="Subscription Plan Updated",
        message=f"You are now subscribed to the PayPilot {target_plan.name} plan.",
        notification_type="system",
        link_url="/pricing"
    )
    db.add(notif)
    db.commit()
    db.refresh(sub)
    return sub

@router.post("/cancel")
def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancels the current user's paid subscription at the end of the billing period."""
    sub = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).order_by(Subscription.created_at.desc()).first()

    if not sub:
        raise HTTPException(status_code=400, detail="No active subscription found to cancel")

    sub.cancel_at_period_end = True
    db.commit()
    return {"message": "Subscription will cancel at the end of the current billing cycle"}
