from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, FreelancerProfile
from backend.schemas import (
    FreelancerProfileCreate, FreelancerProfileUpdate, FreelancerProfileResponse
)
from backend.security import get_current_user, enforce_ownership, require_freelancer

router = APIRouter(prefix="/profiles", tags=["Freelancer Profiles"])

@router.get("", response_model=List[FreelancerProfileResponse])
def list_freelancer_profiles(
    skill: Optional[str] = Query(None, description="Search by skill"),
    availability: Optional[str] = Query(None),
    max_rate: Optional[float] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """List freelancer profiles with optional skill and rate filters."""
    query = db.query(FreelancerProfile).join(User).filter(User.is_active == True)
    if availability:
        query = query.filter(FreelancerProfile.availability_status == availability)
    if max_rate is not None:
        query = query.filter(FreelancerProfile.hourly_rate <= max_rate)
    if skill:
        query = query.filter(FreelancerProfile.skills.ilike(f"%{skill}%"))
    
    return query.offset(offset).limit(limit).all()

@router.get("/{user_id}", response_model=FreelancerProfileResponse)
def get_freelancer_profile(user_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific freelancer's public profile."""
    profile = db.query(FreelancerProfile).filter(FreelancerProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Freelancer profile not found")
    return profile

@router.post("", response_model=FreelancerProfileResponse, status_code=status.HTTP_201_CREATED)
def create_freelancer_profile(
    data: FreelancerProfileCreate,
    current_user: User = Depends(require_freelancer),
    db: Session = Depends(get_db)
):
    """Create or initialize freelancer profile for the current freelancer user."""
    existing = db.query(FreelancerProfile).filter(FreelancerProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    profile = FreelancerProfile(
        user_id=current_user.id,
        title=data.title,
        hourly_rate=data.hourly_rate,
        currency=data.currency,
        overview=data.overview,
        skills=data.skills,
        experience_years=data.experience_years,
        availability_status=data.availability_status,
        github_url=data.github_url,
        linkedin_url=data.linkedin_url,
        portfolio_items=data.portfolio_items
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.put("/{user_id}", response_model=FreelancerProfileResponse)
def update_freelancer_profile(
    user_id: int,
    data: FreelancerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update freelancer profile. Enforces ownership."""
    enforce_ownership(current_user, user_id, "You can only update your own freelancer profile")
    profile = db.query(FreelancerProfile).filter(FreelancerProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Freelancer profile not found")

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile
