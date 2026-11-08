from sqlalchemy import (
    Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean, UniqueConstraint
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="client")  # client, freelancer, admin
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True, default="India")
    timezone = Column(String(100), nullable=True, default="Asia/Kolkata")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    freelancer_profile = relationship("FreelancerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    projects_as_client = relationship("Project", back_populates="client", foreign_keys="[Project.client_id]")
    projects_as_freelancer = relationship("Project", back_populates="selected_freelancer", foreign_keys="[Project.selected_freelancer_id]")
    applications = relationship("Application", back_populates="freelancer")
    contracts_as_client = relationship("Contract", back_populates="client", foreign_keys="[Contract.client_id]")
    contracts_as_freelancer = relationship("Contract", back_populates="freelancer", foreign_keys="[Contract.freelancer_id]")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    notification_preferences = relationship("NotificationPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")


class FreelancerProfile(Base):
    __tablename__ = "freelancer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    title = Column(String(255), nullable=True)
    hourly_rate = Column(Float, default=0.0)
    currency = Column(String(10), default="INR")
    overview = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)  # JSON string or comma-separated list
    experience_years = Column(Integer, default=1)
    completed_projects_count = Column(Integer, default=0)
    rating = Column(Float, default=5.0)
    availability_status = Column(String(50), default="available")  # available, busy, not_looking
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    portfolio_items = Column(Text, nullable=True)  # JSON array
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="freelancer_profile")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    budget = Column(Float, nullable=True)
    currency = Column(String(10), default="INR")
    deadline = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="open")  # draft, open, in_progress, review, completed, cancelled
    required_skills = Column(Text, nullable=True)  # comma separated
    selected_freelancer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    client = relationship("User", foreign_keys=[client_id], back_populates="projects_as_client")
    selected_freelancer = relationship("User", foreign_keys=[selected_freelancer_id], back_populates="projects_as_freelancer")
    requirements = relationship("ProjectRequirement", back_populates="project", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="project", cascade="all, delete-orphan")
    contracts = relationship("Contract", back_populates="project", cascade="all, delete-orphan")
    ai_verifications = relationship("AIVerification", back_populates="project", cascade="all, delete-orphan")


class ProjectRequirement(Base):
    __tablename__ = "project_requirements"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), unique=True, nullable=False)
    extracted_skills = Column(Text, nullable=True)
    deliverables = Column(Text, nullable=True)
    complexity = Column(String(50), default="Medium")  # Low, Medium, High
    estimated_duration = Column(String(100), nullable=True)
    raw_analysis = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="requirements")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    freelancer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    cover_letter = Column(Text, nullable=False)
    proposed_rate = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    proposed_timeline = Column(String(100), nullable=True)
    status = Column(String(50), default="pending")  # pending, shortlisted, accepted, rejected, withdrawn
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="applications")
    freelancer = relationship("User", back_populates="applications")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    freelancer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    terms = Column(Text, nullable=True)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(50), default="active")  # draft, active, completed, terminated
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    project = relationship("Project", back_populates="contracts")
    client = relationship("User", foreign_keys=[client_id], back_populates="contracts_as_client")
    freelancer = relationship("User", foreign_keys=[freelancer_id], back_populates="contracts_as_freelancer")
    milestones = relationship("Milestone", back_populates="contract", cascade="all, delete-orphan")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    due_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="pending")  # pending, funded, submitted, approved, paid
    order_index = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    contract = relationship("Contract", back_populates="milestones")
    deliverables = relationship("Deliverable", back_populates="milestone", cascade="all, delete-orphan")


class Deliverable(Base):
    __tablename__ = "deliverables"

    id = Column(Integer, primary_key=True, index=True)
    milestone_id = Column(Integer, ForeignKey("milestones.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    freelancer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=True)
    submission_notes = Column(Text, nullable=True)
    status = Column(String(50), default="submitted")  # submitted, under_review, verified_by_ai, approved, changes_requested
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    milestone = relationship("Milestone", back_populates="deliverables")
    ai_verifications = relationship("AIVerification", back_populates="deliverable")


class AIVerification(Base):
    __tablename__ = "ai_verifications"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    deliverable_id = Column(Integer, ForeignKey("deliverables.id", ondelete="SET NULL"), nullable=True)
    verification_type = Column(String(100), nullable=False)  # deliverable_check, requirement_analysis, risk_assessment, match_recommendation, negotiation_advice
    model_used = Column(String(100), default="gemini-1.5-flash")
    is_demo_fallback = Column(Boolean, default=False)
    status = Column(String(50), default="passed")  # passed, flagged, inconclusive
    confidence_score = Column(Float, default=0.9)
    summary = Column(Text, nullable=False)
    details = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="ai_verifications")
    deliverable = relationship("Deliverable", back_populates="ai_verifications")


class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    milestone_id = Column(Integer, ForeignKey("milestones.id", ondelete="SET NULL"), nullable=True)
    paypal_order_id = Column(String(100), unique=True, index=True, nullable=False)
    idempotency_key = Column(String(100), unique=True, index=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    intent = Column(String(20), default="CAPTURE")
    status = Column(String(50), default="created")  # created, approved, captured, voided, failed, cancelled
    raw_paypal_response = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    transactions = relationship("Transaction", back_populates="payment_order")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    payment_order_id = Column(Integer, ForeignKey("payment_orders.id", ondelete="SET NULL"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    freelancer_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    transaction_type = Column(String(50), default="milestone_payment")  # milestone_payment, subscription_fee, refund
    paypal_capture_id = Column(String(100), unique=True, nullable=True, index=True)
    amount = Column(Float, nullable=False)
    fee_amount = Column(Float, default=0.0)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="completed")  # pending, completed, failed, refunded
    ai_risk_score = Column(Float, nullable=True)
    is_simulated = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    payment_order = relationship("PaymentOrder", back_populates="transactions")
    project = relationship("Project")
    client = relationship("User", foreign_keys=[client_id])
    freelancer = relationship("User", foreign_keys=[freelancer_id])


class PricingPlan(Base):
    __tablename__ = "pricing_plans"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)  # free, pro, business
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price_monthly = Column(Float, nullable=False)
    price_annual = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    features = Column(Text, nullable=True)  # JSON array
    max_projects = Column(Integer, default=3)
    priority_support = Column(Boolean, default=False)
    ai_matching_level = Column(String(50), default="basic")  # basic, advanced
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    subscriptions = relationship("Subscription", back_populates="plan")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey("pricing_plans.id", ondelete="CASCADE"), nullable=False)
    paypal_subscription_id = Column(String(100), nullable=True)
    billing_cycle = Column(String(20), default="monthly")  # monthly, annual
    status = Column(String(50), default="active")  # active, past_due, cancelled, expired
    current_period_start = Column(DateTime(timezone=True), server_default=func.now())
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="subscriptions")
    plan = relationship("PricingPlan", back_populates="subscriptions")


class NotificationPreferences(Base):
    __tablename__ = "notification_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    email_notifications = Column(Boolean, default=True)
    project_updates = Column(Boolean, default=True)
    payment_alerts = Column(Boolean, default=True)
    ai_insights = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="notification_preferences")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="system")  # project, payment, ai, message, system
    link_url = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    theme = Column(String(20), default="dark")
    language = Column(String(10), default="en")
    timezone = Column(String(100), default="Asia/Kolkata")
    currency_preference = Column(String(10), default="INR")
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(64), nullable=True)
    two_factor_backup_codes = Column(Text, nullable=True)  # JSON list
    active_sessions = Column(Text, nullable=True)  # JSON list
    payment_preferences = Column(Text, nullable=True)  # JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="settings")


class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(100), unique=True, index=True, nullable=False)
    event_type = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=True)
    summary = Column(Text, nullable=True)
    payload = Column(Text, nullable=True)  # JSON
    status = Column(String(50), default="received")  # received, processed, ignored, failed
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    ip_address = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)  # JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reviewee_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project")
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    reviewee = relationship("User", foreign_keys=[reviewee_id])
