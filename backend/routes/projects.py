import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User, Project, ProjectRequirement, AuditLog
from backend.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from backend.security import get_current_user, require_client, enforce_ownership, get_current_user_optional
from backend.ai.analyzer import analyze_requirements

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    client_id: Optional[int] = Query(None),
    freelancer_id: Optional[int] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """List projects in the marketplace with status and category filtering."""
    query = db.query(Project)
    if status_filter:
        query = query.filter(Project.status == status_filter)
    if category:
        query = query.filter(Project.category.ilike(f"%{category}%"))
    if client_id:
        query = query.filter(Project.client_id == client_id)
    if freelancer_id:
        query = query.filter(Project.selected_freelancer_id == freelancer_id)
    
    return query.order_by(Project.created_at.desc()).offset(offset).limit(limit).all()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    data: ProjectCreate,
    current_user: User = Depends(require_client),
    db: Session = Depends(get_db)
):
    """
    Create a new project.
    If auto_analyze_ai is enabled, automatically analyzes requirements and creates a ProjectRequirement record.
    """
    # 1. Run AI analysis if requested
    ai_data = None
    extracted_skills_str = data.required_skills or ""
    if data.auto_analyze_ai:
        ai_data = analyze_requirements(data.description)
        if not extracted_skills_str and ai_data.get("extracted_skills"):
            extracted_skills_str = ", ".join(ai_data["extracted_skills"])

    # 2. Save Project
    project = Project(
        client_id=current_user.id,
        title=data.title,
        description=data.description,
        category=data.category,
        budget=data.budget,
        currency=data.currency or "INR",
        deadline=data.deadline,
        required_skills=extracted_skills_str,
        status="open"
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # 3. Save Requirements Record
    if ai_data:
        req = ProjectRequirement(
            project_id=project.id,
            extracted_skills=", ".join(ai_data.get("extracted_skills", [])),
            deliverables="\n".join(ai_data.get("deliverables", [])),
            complexity=ai_data.get("complexity", "Medium"),
            estimated_duration=ai_data.get("estimated_duration", "2-3 weeks"),
            raw_analysis=json.dumps(ai_data)
        )
        db.add(req)
        db.commit()

    # 4. Audit Log
    audit = AuditLog(
        user_id=current_user.id,
        action="PROJECT_CREATED",
        entity_type="projects",
        entity_id=str(project.id),
        details=json.dumps({"title": project.title, "budget": project.budget})
    )
    db.add(audit)
    db.commit()

    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Retrieve full project details including AI requirements."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a project. Enforces ownership by the project's client or admin."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    enforce_ownership(current_user, project.client_id, "You can only update projects that you created")

    update_dict = data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project (ownership check)."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    enforce_ownership(current_user, project.client_id, "You can only delete projects you created")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}
