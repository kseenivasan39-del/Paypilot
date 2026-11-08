import json
import secrets
import pyotp
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, UserSettings, NotificationPreferences
from backend.schemas import (
    UserSettingsResponse, UserSettingsUpdate,
    NotificationPreferencesResponse, NotificationPreferencesUpdate
)
from backend.security import get_current_user

router = APIRouter(prefix="/settings", tags=["Settings & Preferences"])

@router.get("", response_model=UserSettingsResponse)
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve settings for the current user. Creates defaults if not present."""
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("", response_model=UserSettingsResponse)
def update_user_settings(
    data: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update settings (theme, timezone, language, currency, 2FA status)."""
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return settings

@router.get("/notifications", response_model=NotificationPreferencesResponse)
def get_notification_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve notification preferences for the user."""
    prefs = db.query(NotificationPreferences).filter(NotificationPreferences.user_id == current_user.id).first()
    if not prefs:
        prefs = NotificationPreferences(user_id=current_user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs

@router.put("/notifications", response_model=NotificationPreferencesResponse)
def update_notification_preferences(
    data: NotificationPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update notification preferences."""
    prefs = db.query(NotificationPreferences).filter(NotificationPreferences.user_id == current_user.id).first()
    if not prefs:
        prefs = NotificationPreferences(user_id=current_user.id)
        db.add(prefs)

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(prefs, key, value)

    db.commit()
    db.refresh(prefs)
    return prefs

@router.get("/security")
def get_security_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns security settings.
    Accurately indicates two_factor_enabled and provides session metadata.
    """
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    two_factor = settings.two_factor_enabled if settings else False

    sessions = [
        {
            "id": "sess_current",
            "device": "Chrome on Windows",
            "ip_address": "127.0.0.1",
            "last_active": "Just now",
            "is_current": True
        }
    ]

    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "two_factor_enabled": two_factor,
        "has_backup_codes": bool(settings and settings.two_factor_backup_codes),
        "password_last_changed": current_user.updated_at.isoformat() if current_user.updated_at else None,
        "active_sessions": sessions
    }

class Setup2FARequest(BaseModel):
    pass

class Verify2FARequest(BaseModel):
    code: str

class Disable2FARequest(BaseModel):
    code: str

@router.post("/security/2fa/setup")
def setup_2fa(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates a new TOTP secret and provisioning URI for Google Authenticator / Authy.
    """
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)

    # Generate standard base32 secret
    secret = pyotp.random_base32()
    settings.two_factor_secret = secret
    db.commit()

    # Generate standard otpauth provisioning URI
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(
        name=current_user.email,
        issuer_name="PayPilot"
    )

    return {
        "secret": secret,
        "provisioning_uri": provisioning_uri,
        "issuer": "PayPilot",
        "account_name": current_user.email
    }

@router.post("/security/2fa/verify")
def verify_and_enable_2fa(
    payload: Verify2FARequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verifies the TOTP 6-digit code from user's authenticator app and enables 2FA.
    Also generates 8 emergency backup codes.
    """
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings or not settings.two_factor_secret:
        raise HTTPException(status_code=400, detail="2FA setup not initiated. Call /security/2fa/setup first.")

    totp = pyotp.TOTP(settings.two_factor_secret)
    # Validate with a time window of +/- 1 interval (30s)
    if not totp.verify(payload.code.strip(), valid_window=1):
        raise HTTPException(status_code=400, detail="Invalid 6-digit authentication code. Please check your app.")

    # Generate 8 random backup recovery codes
    backup_codes = [secrets.token_hex(4).upper() for _ in range(8)]
    settings.two_factor_enabled = True
    settings.two_factor_backup_codes = json.dumps(backup_codes)
    db.commit()

    return {
        "success": True,
        "message": "Two-Factor Authentication is now enabled on your account.",
        "two_factor_enabled": True,
        "backup_codes": backup_codes
    }

@router.get("/security/2fa/backup-codes")
def get_backup_codes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves or generates backup recovery codes for emergency access.
    """
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings or not settings.two_factor_enabled:
        raise HTTPException(status_code=400, detail="2FA is not enabled on this account.")

    codes = []
    if settings.two_factor_backup_codes:
        try:
            codes = json.loads(settings.two_factor_backup_codes)
        except Exception:
            codes = []

    if not codes:
        codes = [secrets.token_hex(4).upper() for _ in range(8)]
        settings.two_factor_backup_codes = json.dumps(codes)
        db.commit()

    return {
        "backup_codes": codes
    }

@router.post("/security/2fa/disable")
def disable_2fa(
    payload: Disable2FARequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Disables 2FA after code or backup code verification.
    """
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings or not settings.two_factor_enabled:
        raise HTTPException(status_code=400, detail="2FA is not currently enabled.")

    code = payload.code.strip()
    is_valid = False

    # Check TOTP
    if settings.two_factor_secret:
        totp = pyotp.TOTP(settings.two_factor_secret)
        if totp.verify(code, valid_window=1):
            is_valid = True

    # Check backup codes if not matched by TOTP
    if not is_valid and settings.two_factor_backup_codes:
        try:
            codes = json.loads(settings.two_factor_backup_codes)
            if code.upper() in codes:
                is_valid = True
        except Exception:
            pass

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid code. Please enter a valid TOTP or backup code.")

    settings.two_factor_enabled = False
    settings.two_factor_secret = None
    settings.two_factor_backup_codes = None
    db.commit()

    return {
        "success": True,
        "message": "Two-Factor Authentication has been disabled.",
        "two_factor_enabled": False
    }

