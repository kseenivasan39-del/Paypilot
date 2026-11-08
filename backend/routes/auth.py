from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json

from backend.database import get_db
from backend.models import User, FreelancerProfile, NotificationPreferences, UserSettings, AuditLog
from backend.schemas import (
    RegisterRequest, LoginRequest, TokenResponse, UserResponse,
    PasswordChangeRequest
)
from backend.security import (
    hash_password, verify_password, create_access_token, get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account as client, freelancer, or admin."""
    # Check duplicate email
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Normalize role
    role = data.role.lower()
    if role not in ["client", "freelancer", "admin"]:
        role = "client"

    # Create User
    user = User(
        email=data.email.lower(),
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=role,
        is_active=True,
        is_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If freelancer, create initial freelancer profile
    if role == "freelancer":
        profile = FreelancerProfile(
            user_id=user.id,
            title="Professional Freelancer",
            hourly_rate=1200.0,
            currency="INR",
            overview="Passionate professional ready to collaborate on high-impact projects.",
            skills="React.js, TypeScript, Python, Tailwind CSS",
            experience_years=2,
            rating=5.0
        )
        db.add(profile)

    # Default Preferences and Settings
    prefs = NotificationPreferences(user_id=user.id)
    settings = UserSettings(user_id=user.id)
    audit = AuditLog(
        user_id=user.id,
        action="USER_REGISTERED",
        entity_type="users",
        entity_id=str(user.id),
        details=json.dumps({"role": role, "email": user.email})
    )
    db.add(prefs)
    db.add(settings)
    db.add(audit)
    db.commit()

    # Generate JWT Token
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=TokenResponse)
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password to receive a JWT access token."""
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been suspended or deactivated."
        )

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        action="USER_LOGIN",
        entity_type="users",
        entity_id=str(user.id)
    )
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve the currently authenticated user's profile."""
    return current_user

@router.post("/logout")
def logout_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Logs out the user and logs the audit event."""
    audit = AuditLog(
        user_id=current_user.id,
        action="USER_LOGOUT",
        entity_type="users",
        entity_id=str(current_user.id)
    )
    db.add(audit)
    db.commit()
    return {"message": "Logged out successfully"}

@router.post("/change-password")
def change_password(
    data: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the current user's password."""
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    current_user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}
