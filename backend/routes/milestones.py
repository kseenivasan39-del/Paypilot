from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Contract, Milestone, Deliverable, Notification, Project
from backend.schemas import (
    MilestoneCreate, MilestoneUpdate, MilestoneResponse,
    DeliverableCreate, DeliverableResponse
)
from backend.security import get_current_user, require_client, require_freelancer, enforce_ownership

router = APIRouter(prefix="/milestones", tags=["Milestones & Deliverables"])

@router.post("", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
def create_milestone(
    data: MilestoneCreate,
    current_user: User = Depends(require_client),
    db: Session = Depends(get_db)
):
    """Add a milestone to an active contract."""
    contract = db.query(Contract).filter(Contract.id == data.contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    enforce_ownership(current_user, contract.client_id, "Only the client can add milestones")

    milestone = Milestone(
        contract_id=data.contract_id,
        title=data.title,
        description=data.description,
        amount=data.amount,
        currency=data.currency,
        due_date=data.due_date,
        status="pending",
        order_index=data.order_index
    )
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone

@router.put("/{milestone_id}", response_model=MilestoneResponse)
def update_milestone(
    milestone_id: int,
    data: MilestoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update milestone details or status."""
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    contract = db.query(Contract).filter(Contract.id == milestone.contract_id).first()
    if current_user.role != "admin" and current_user.id not in [contract.client_id, contract.freelancer_id]:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(milestone, key, value)
    
    db.commit()
    db.refresh(milestone)
    return milestone

@router.post("/{milestone_id}/deliverables", response_model=DeliverableResponse, status_code=status.HTTP_201_CREATED)
def submit_deliverable(
    milestone_id: int,
    data: DeliverableCreate,
    current_user: User = Depends(require_freelancer),
    db: Session = Depends(get_db)
):
    """Freelancer submits work deliverables for a milestone."""
    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    contract = db.query(Contract).filter(Contract.id == milestone.contract_id).first()
    if contract.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only assigned freelancer can submit deliverables")

    deliverable = Deliverable(
        milestone_id=milestone_id,
        project_id=contract.project_id,
        freelancer_id=current_user.id,
        title=data.title,
        file_url=data.file_url,
        submission_notes=data.submission_notes,
        status="submitted"
    )
    db.add(deliverable)

    milestone.status = "submitted"

    # Update Project status to review
    project = db.query(Project).filter(Project.id == contract.project_id).first()
    if project:
        project.status = "review"

    # Notify Client
    notif = Notification(
        user_id=contract.client_id,
        title="Deliverable Submitted for Review",
        message=f"{current_user.full_name} submitted work for '{milestone.title}'. Review deliverables or run AI verification.",
        notification_type="project",
        link_url=f"/projects/verification?milestone_id={milestone_id}"
    )
    db.add(notif)
    db.commit()
    db.refresh(deliverable)
    return deliverable
