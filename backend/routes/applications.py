from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Project, Application, Notification, AuditLog
from backend.schemas import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from backend.security import get_current_user, require_freelancer, enforce_ownership

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationResponse])
def list_applications(
    project_id: Optional[int] = Query(None),
    freelancer_id: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List applications.
    Clients can see applications for their projects.
    Freelancers can see their own submitted applications.
    """
    query = db.query(Application)

    if current_user.role == "freelancer":
        query = query.filter(Application.freelancer_id == current_user.id)
    elif current_user.role == "client":
        if project_id:
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project or project.client_id != current_user.id:
                raise HTTPException(status_code=403, detail="Not authorized to view these applications")
            query = query.filter(Application.project_id == project_id)
        else:
            # All applications for client's projects
            query = query.join(Project).filter(Project.client_id == current_user.id)
    
    if status_filter:
        query = query.filter(Application.status == status_filter)

    return query.order_by(Application.created_at.desc()).all()

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_application(
    data: ApplicationCreate,
    current_user: User = Depends(require_freelancer),
    db: Session = Depends(get_db)
):
    """Allow a freelancer to apply to an open project."""
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status != "open":
        raise HTTPException(status_code=400, detail="Cannot apply to a project that is not open")

    # Prevent duplicate applications
    existing = db.query(Application).filter(
        Application.project_id == data.project_id,
        Application.freelancer_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this project")

    application = Application(
        project_id=data.project_id,
        freelancer_id=current_user.id,
        cover_letter=data.cover_letter,
        proposed_rate=data.proposed_rate,
        currency=data.currency,
        proposed_timeline=data.proposed_timeline,
        status="pending"
    )
    db.add(application)

    # Notify Client
    notif = Notification(
        user_id=project.client_id,
        title="New Proposal Received",
        message=f"{current_user.full_name} submitted a proposal for '{project.title}'.",
        notification_type="project",
        link_url=f"/projects/{project.id}"
    )
    db.add(notif)
    db.commit()
    db.refresh(application)
    return application

@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Allow client to accept/reject/shortlist proposal.
    If accepted, sets selected_freelancer on the project.
    """
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    project = db.query(Project).filter(Project.id == application.project_id).first()
    enforce_ownership(current_user, project.client_id, "Only the project owner can update proposal status")

    application.status = data.status

    if data.status == "accepted":
        project.selected_freelancer_id = application.freelancer_id
        project.status = "in_progress"
        
        # Notify Freelancer
        notif = Notification(
            user_id=application.freelancer_id,
            title="Proposal Accepted!",
            message=f"Congratulations! Your proposal for '{project.title}' was accepted by {current_user.full_name}.",
            notification_type="project",
            link_url=f"/projects/{project.id}"
        )
        db.add(notif)

    db.commit()
    db.refresh(application)
    return application
