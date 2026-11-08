import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database import engine, Base
from backend.seed import seed_database

# Import routers
from backend.routes import (
    auth_router,
    users_router,
    profiles_router,
    projects_router,
    applications_router,
    contracts_router,
    milestones_router,
    ai_router,
    payments_router,
    transactions_router,
    subscriptions_router,
    plans_router,
    notifications_router,
    settings_router,
    admin_router,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed demo catalog
    logger.info("Initializing PayPilot backend tables and seed catalog...")
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        logger.warning(f"Seed step encountered note: {e}")
    yield
    # Shutdown
    logger.info("PayPilot backend shutting down...")

app = FastAPI(
    title="PayPilot API",
    description="Backend services for PayPilot — AI-Powered Freelancer Marketplace & PayPal Payment Agent",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Root & Health check
@app.get("/", tags=["Health"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs",
        "environment": settings.PAYPAL_ENVIRONMENT
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ai_configured": bool(settings.AI_API_KEY and not settings.AI_API_KEY.startswith("your_")),
        "paypal_configured": bool(settings.PAYPAL_CLIENT_ID and not settings.PAYPAL_CLIENT_ID.startswith("mock_"))
    }

# Register all routes under /api/v1
prefix = settings.API_V1_PREFIX
app.include_router(auth_router, prefix=prefix)
app.include_router(users_router, prefix=prefix)
app.include_router(profiles_router, prefix=prefix)
app.include_router(projects_router, prefix=prefix)
app.include_router(applications_router, prefix=prefix)
app.include_router(contracts_router, prefix=prefix)
app.include_router(milestones_router, prefix=prefix)
app.include_router(ai_router, prefix=prefix)
app.include_router(payments_router, prefix=prefix)
app.include_router(transactions_router, prefix=prefix)
app.include_router(subscriptions_router, prefix=prefix)
app.include_router(plans_router, prefix=prefix)
app.include_router(notifications_router, prefix=prefix)
app.include_router(settings_router, prefix=prefix)
app.include_router(admin_router, prefix=prefix)
