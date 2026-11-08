from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import PricingPlan
from backend.schemas import PricingPlanResponse

router = APIRouter(prefix="/plans", tags=["Pricing Plans"])

@router.get("", response_model=List[PricingPlanResponse])
def list_pricing_plans(db: Session = Depends(get_db)):
    """
    Returns the database-backed catalog of active pricing plans (Free, Pro, Business).
    Prices and feature allocations are dynamically configurable in the database.
    """
    plans = db.query(PricingPlan).filter(PricingPlan.is_active == True).order_by(PricingPlan.price_monthly.asc()).all()
    return plans

@router.get("/{plan_code}", response_model=PricingPlanResponse)
def get_pricing_plan(plan_code: str, db: Session = Depends(get_db)):
    """Retrieve details and entitlements for a specific plan by its code (free, pro, business)."""
    plan = db.query(PricingPlan).filter(PricingPlan.code == plan_code.lower()).first()
    if not plan:
        raise HTTPException(status_code=404, detail=f"Plan '{plan_code}' not found")
    return plan
