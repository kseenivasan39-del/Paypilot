from .auth import router as auth_router
from .users import router as users_router
from .profiles import router as profiles_router
from .projects import router as projects_router
from .applications import router as applications_router
from .contracts import router as contracts_router
from .milestones import router as milestones_router
from .ai import router as ai_router
from .payments import router as payments_router
from .transactions import router as transactions_router
from .subscriptions import router as subscriptions_router
from .plans import router as plans_router
from .notifications import router as notifications_router
from .settings import router as settings_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "users_router",
    "profiles_router",
    "projects_router",
    "applications_router",
    "contracts_router",
    "milestones_router",
    "ai_router",
    "payments_router",
    "transactions_router",
    "subscriptions_router",
    "plans_router",
    "notifications_router",
    "settings_router",
    "admin_router",
]
