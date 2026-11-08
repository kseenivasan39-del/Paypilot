from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Transaction
from backend.schemas import TransactionResponse
from backend.security import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def list_transactions(
    project_id: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List transactions for the authenticated user (client or freelancer)."""
    query = db.query(Transaction)
    if current_user.role != "admin":
        query = query.filter(
            (Transaction.client_id == current_user.id) | (Transaction.freelancer_id == current_user.id)
        )
    if project_id:
        query = query.filter(Transaction.project_id == project_id)
    if status_filter:
        query = query.filter(Transaction.status == status_filter)

    return query.order_by(Transaction.created_at.desc()).offset(offset).limit(limit).all()

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve details for a single verified transaction."""
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if current_user.role != "admin" and current_user.id not in [tx.client_id, tx.freelancer_id]:
        raise HTTPException(status_code=403, detail="Not authorized to view this transaction")

    return tx
