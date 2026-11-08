from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import get_db
from backend.models import (
    User, Project, Transaction, Contract, AIVerification, AuditLog
)
from backend.schemas import PlatformStatsResponse, AuditLogResponse
from backend.security import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats", response_model=PlatformStatsResponse)
def get_admin_platform_stats(
    current_admin = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Platform-wide operational analytics for admin dashboard."""
    total_users = db.query(User).count()
    total_clients = db.query(User).filter(User.role == "client").count()
    total_freelancers = db.query(User).filter(User.role == "freelancer").count()
    total_projects = db.query(Project).count()
    active_contracts = db.query(Contract).filter(Contract.status == "active").count()
    ai_verifications_count = db.query(AIVerification).count()

    volume_query = db.query(func.sum(Transaction.amount)).filter(Transaction.status == "completed").scalar()
    total_volume = float(volume_query or 0.0)

    return {
        "total_users": total_users,
        "total_clients": total_clients,
        "total_freelancers": total_freelancers,
        "total_projects": total_projects,
        "total_volume_processed": total_volume,
        "active_contracts": active_contracts,
        "ai_verifications_count": ai_verifications_count
    }

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_admin = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Retrieve system audit logs for administrative security monitoring."""
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).offset(offset).limit(limit).all()
    return logs
