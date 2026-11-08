import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# ----------------- Base Config -----------------
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True
        protected_namespaces = ()


# ----------------- Auth & Users -----------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(..., min_length=2)
    role: str = Field("client", description="client or freelancer")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseSchema):
    id: int
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime.datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

# ----------------- Profiles -----------------
class FreelancerProfileCreate(BaseModel):
    title: Optional[str] = None
    hourly_rate: float = 0.0
    currency: str = "INR"
    overview: Optional[str] = None
    skills: Optional[str] = None
    experience_years: int = 1
    availability_status: str = "available"
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_items: Optional[str] = None

class FreelancerProfileUpdate(BaseModel):
    title: Optional[str] = None
    hourly_rate: Optional[float] = None
    currency: Optional[str] = None
    overview: Optional[str] = None
    skills: Optional[str] = None
    experience_years: Optional[int] = None
    availability_status: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_items: Optional[str] = None

class FreelancerProfileResponse(BaseSchema):
    id: int
    user_id: int
    title: Optional[str] = None
    hourly_rate: float
    currency: str
    overview: Optional[str] = None
    skills: Optional[str] = None
    experience_years: int
    completed_projects_count: int
    rating: float
    availability_status: str
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_items: Optional[str] = None
    user: Optional[UserResponse] = None

# ----------------- Projects & Requirements -----------------
class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    category: Optional[str] = "Web Development"
    budget: Optional[float] = None
    currency: Optional[str] = "INR"
    deadline: Optional[datetime.datetime] = None
    required_skills: Optional[str] = None
    auto_analyze_ai: bool = True

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = None
    deadline: Optional[datetime.datetime] = None
    status: Optional[str] = None
    required_skills: Optional[str] = None
    selected_freelancer_id: Optional[int] = None

class ProjectRequirementResponse(BaseSchema):
    id: int
    project_id: int
    extracted_skills: Optional[str] = None
    deliverables: Optional[str] = None
    complexity: str
    estimated_duration: Optional[str] = None
    raw_analysis: Optional[str] = None

class ProjectResponse(BaseSchema):
    id: int
    client_id: int
    title: str
    description: str
    category: Optional[str] = None
    budget: Optional[float] = None
    currency: str
    deadline: Optional[datetime.datetime] = None
    status: str
    required_skills: Optional[str] = None
    selected_freelancer_id: Optional[int] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    client: Optional[UserResponse] = None
    requirements: Optional[ProjectRequirementResponse] = None

# ----------------- Applications -----------------
class ApplicationCreate(BaseModel):
    project_id: int
    cover_letter: str = Field(..., min_length=10)
    proposed_rate: float
    currency: str = "INR"
    proposed_timeline: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: str = Field(..., description="pending, shortlisted, accepted, rejected, withdrawn")

class ApplicationResponse(BaseSchema):
    id: int
    project_id: int
    freelancer_id: int
    cover_letter: str
    proposed_rate: float
    currency: str
    proposed_timeline: Optional[str] = None
    status: str
    created_at: datetime.datetime
    freelancer: Optional[UserResponse] = None
    project: Optional[ProjectResponse] = None

# ----------------- Contracts & Milestones -----------------
class ContractCreate(BaseModel):
    project_id: int
    freelancer_id: int
    title: str
    terms: Optional[str] = None
    total_amount: float
    currency: str = "INR"

class MilestoneCreate(BaseModel):
    contract_id: int
    title: str
    description: Optional[str] = None
    amount: float
    currency: str = "INR"
    due_date: Optional[datetime.datetime] = None
    order_index: int = 1

class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    due_date: Optional[datetime.datetime] = None

class DeliverableCreate(BaseModel):
    milestone_id: int
    project_id: int
    title: str
    file_url: Optional[str] = None
    submission_notes: Optional[str] = None

class DeliverableResponse(BaseSchema):
    id: int
    milestone_id: int
    project_id: int
    freelancer_id: int
    title: str
    file_url: Optional[str] = None
    submission_notes: Optional[str] = None
    status: str
    submitted_at: datetime.datetime

class MilestoneResponse(BaseSchema):
    id: int
    contract_id: int
    title: str
    description: Optional[str] = None
    amount: float
    currency: str
    due_date: Optional[datetime.datetime] = None
    status: str
    order_index: int
    deliverables: List[DeliverableResponse] = []

class ContractResponse(BaseSchema):
    id: int
    project_id: int
    client_id: int
    freelancer_id: int
    title: str
    terms: Optional[str] = None
    total_amount: float
    currency: str
    status: str
    start_date: datetime.datetime
    end_date: Optional[datetime.datetime] = None
    milestones: List[MilestoneResponse] = []
    client: Optional[UserResponse] = None
    freelancer: Optional[UserResponse] = None

# ----------------- AI Services -----------------
class AIRequirementAnalysisRequest(BaseModel):
    description: str = Field(..., min_length=10)

class AIRequirementAnalysisResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    extracted_skills: List[str]
    deliverables: List[str]
    complexity: str
    estimated_duration: str
    recommended_budget_range: Dict[str, float]
    model_used: str
    is_demo_fallback: bool
    summary: str

class FreelancerMatchItem(BaseModel):
    freelancer_id: int
    name: str
    title: str
    match_score: int
    match_reason: str
    key_strengths: List[str]
    hourly_rate: float
    currency: str
    rating: float
    completed_projects: int
    avatar_url: Optional[str] = None

class AIMatchingRequest(BaseModel):
    project_id: Optional[int] = None
    project_description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    budget: Optional[float] = None

class AIMatchingResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    matches: List[FreelancerMatchItem]
    model_used: str
    is_demo_fallback: bool
    analysis_overview: str

class AINegotiationRequest(BaseModel):
    project_id: int
    freelancer_id: int
    client_budget: float
    freelancer_rate: float
    scope_notes: Optional[str] = None

class AINegotiationResponse(BaseModel):
    recommended_compromise_rate: float
    currency: str
    suggested_milestones: List[Dict[str, Any]]
    talking_points: List[str]
    advisory_notes: str
    is_demo_fallback: bool

class AIDeliverableVerificationRequest(BaseModel):
    deliverable_id: int
    deliverable_title: str
    submission_notes: Optional[str] = None
    project_requirements: Optional[str] = None

class AIDeliverableVerificationResponse(BaseModel):
    verification_status: str  # passed, flagged, inconclusive
    confidence_score: float
    summary: str
    checklist: List[Dict[str, Any]]
    recommendations_for_client: str
    is_demo_fallback: bool
    disclaimer: str = "AI verification is advisory only. Human client approval is required to release funds."

class AIRiskAssessmentRequest(BaseModel):
    amount: float
    currency: str = "USD"
    client_id: int
    freelancer_id: int
    project_id: Optional[int] = None

class AIRiskAssessmentResponse(BaseModel):
    risk_score: int  # 0 to 100
    risk_level: str  # LOW RISK, MEDIUM RISK, HIGH RISK
    factors_evaluated: List[Dict[str, Any]]
    advisory_recommendation: str
    is_demo_fallback: bool
    disclaimer: str = "AI risk scores are strictly advisory assessments and do not replace independent due diligence."

class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = None

class AIChatResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    response: str
    model_used: str
    is_demo_fallback: bool
    freelancers: Optional[List[Dict[str, Any]]] = None
    disclaimer: str = "PayPilot AI provides automated guidance and recommendations. All contract commitments require manual user confirmation."

# ----------------- Payments & PayPal -----------------
class CreatePaymentOrderRequest(BaseModel):
    project_id: Optional[int] = None
    milestone_id: Optional[int] = None
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    idempotency_key: str = Field(..., min_length=8)

class CreatePaymentOrderResponse(BaseModel):
    payment_order_id: int
    paypal_order_id: str
    status: str
    approval_url: Optional[str] = None
    amount: float
    currency: str

class CapturePaymentOrderRequest(BaseModel):
    paypal_order_id: str

class CapturePaymentOrderResponse(BaseModel):
    transaction_id: int
    paypal_order_id: str
    paypal_capture_id: str
    amount: float
    currency: str
    status: str
    message: str

# ----------------- Transactions -----------------
class TransactionResponse(BaseSchema):
    id: int
    project_id: Optional[int] = None
    client_id: int
    freelancer_id: Optional[int] = None
    transaction_type: str
    paypal_capture_id: Optional[str] = None
    amount: float
    fee_amount: float
    currency: str
    status: str
    ai_risk_score: Optional[float] = None
    is_simulated: bool
    created_at: datetime.datetime
    project: Optional[ProjectResponse] = None
    client: Optional[UserResponse] = None
    freelancer: Optional[UserResponse] = None

# ----------------- Pricing & Subscriptions -----------------
class PricingPlanResponse(BaseSchema):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    price_monthly: float
    price_annual: float
    currency: str
    features: Optional[str] = None
    max_projects: int
    priority_support: bool
    ai_matching_level: str
    is_active: bool

class SubscriptionCreateRequest(BaseModel):
    plan_code: str
    billing_cycle: str = "monthly"  # monthly, annual
    paypal_subscription_id: Optional[str] = None

class SubscriptionResponse(BaseSchema):
    id: int
    user_id: int
    plan_id: int
    paypal_subscription_id: Optional[str] = None
    billing_cycle: str
    status: str
    current_period_start: datetime.datetime
    current_period_end: Optional[datetime.datetime] = None
    cancel_at_period_end: bool
    plan: Optional[PricingPlanResponse] = None

# ----------------- Notifications & Settings -----------------
class NotificationResponse(BaseSchema):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    link_url: Optional[str] = None
    is_read: bool
    created_at: datetime.datetime

class NotificationPreferencesResponse(BaseSchema):
    id: int
    user_id: int
    email_notifications: bool
    project_updates: bool
    payment_alerts: bool
    ai_insights: bool
    marketing_emails: bool

class NotificationPreferencesUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    project_updates: Optional[bool] = None
    payment_alerts: Optional[bool] = None
    ai_insights: Optional[bool] = None
    marketing_emails: Optional[bool] = None

class UserSettingsResponse(BaseSchema):
    id: int
    user_id: int
    theme: str
    language: str
    timezone: str
    currency_preference: str
    two_factor_enabled: bool
    active_sessions: Optional[str] = None
    payment_preferences: Optional[str] = None

class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    currency_preference: Optional[str] = None
    two_factor_enabled: Optional[bool] = None
    payment_preferences: Optional[str] = None

# ----------------- Admin & Audit -----------------
class PlatformStatsResponse(BaseModel):
    total_users: int
    total_clients: int
    total_freelancers: int
    total_projects: int
    total_volume_processed: float
    active_contracts: int
    ai_verifications_count: int

class AuditLogResponse(BaseSchema):
    id: int
    user_id: Optional[int] = None
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    ip_address: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime.datetime
