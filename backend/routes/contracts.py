from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Project, Contract, Milestone, Notification
from backend.schemas import ContractCreate, ContractResponse
from backend.security import get_current_user, require_client, enforce_ownership

router = APIRouter(prefix="/contracts", tags=["Contracts"])

@router.get("", response_model=List[ContractResponse])
def list_contracts(
    project_id: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List contracts where current user is either client or freelancer."""
    query = db.query(Contract)
    if current_user.role != "admin":
        query = query.filter(
            (Contract.client_id == current_user.id) | (Contract.freelancer_id == current_user.id)
        )
    if project_id:
        query = query.filter(Contract.project_id == project_id)
    if status_filter:
        query = query.filter(Contract.status == status_filter)

    return query.order_by(Contract.created_at.desc()).all()

@router.post("", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
def create_contract(
    data: ContractCreate,
    current_user: User = Depends(require_client),
    db: Session = Depends(get_db)
):
    """Client creates an agreement / contract with the selected freelancer."""
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    enforce_ownership(current_user, project.client_id, "Only the project owner can create a contract")

    contract = Contract(
        project_id=data.project_id,
        client_id=current_user.id,
        freelancer_id=data.freelancer_id,
        title=data.title,
        terms=data.terms or "Standard PayPilot freelance milestone agreement.",
        total_amount=data.total_amount,
        currency=data.currency,
        status="active"
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    # Automatically create a primary milestone if not specified
    milestone = Milestone(
        contract_id=contract.id,
        title="Complete Project Deliverables",
        description="All deliverables as specified in project requirements.",
        amount=data.total_amount,
        currency=data.currency,
        status="pending",
        order_index=1
    )
    db.add(milestone)

    # Notify Freelancer
    notif = Notification(
        user_id=data.freelancer_id,
        title="New Contract Created",
        message=f"{current_user.full_name} created a contract for '{data.title}'.",
        notification_type="project",
        link_url=f"/projects/{project.id}"
    )
    db.add(notif)
    db.commit()
    db.refresh(contract)

    return contract

@router.get("/{contract_id}", response_model=ContractResponse)
def get_contract(
    contract_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve full contract details with all milestones."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if current_user.role != "admin" and current_user.id not in [contract.client_id, contract.freelancer_id]:
        raise HTTPException(status_code=403, detail="Not authorized to view this contract")

    return contract
