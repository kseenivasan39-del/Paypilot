import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database import Base, get_db
from backend.main import app
from backend.seed import seed_database
from backend.security import create_access_token
from backend.models import User

# In-memory SQLite for high-speed, isolated test runs
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    # Seed default plans and accounts
    from backend.models import PricingPlan
    db = TestingSessionLocal()
    import json
    plans = [
        {"code": "free", "name": "Free", "price_monthly": 0.0, "price_annual": 0.0, "currency": "INR", "max_projects": 3, "priority_support": False, "ai_matching_level": "basic", "features": "[]"},
        {"code": "pro", "name": "Pro", "price_monthly": 499.0, "price_annual": 4790.0, "currency": "INR", "max_projects": 50, "priority_support": True, "ai_matching_level": "advanced", "features": "[]"},
        {"code": "business", "name": "Business", "price_monthly": 1999.0, "price_annual": 19190.0, "currency": "INR", "max_projects": 500, "priority_support": True, "ai_matching_level": "advanced", "features": "[]"},
    ]
    for p in plans:
        db.add(PricingPlan(**p))
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_client_user(db_session):
    from backend.security import hash_password
    user = User(
        email="test_client@example.com",
        hashed_password=hash_password("Password123!"),
        full_name="Test Client",
        role="client",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_freelancer_user(db_session):
    from backend.security import hash_password
    from backend.models import FreelancerProfile
    user = User(
        email="test_freelancer@example.com",
        hashed_password=hash_password("Password123!"),
        full_name="Test Freelancer",
        role="freelancer",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    profile = FreelancerProfile(
        user_id=user.id,
        title="Full Stack Developer",
        hourly_rate=1200.0,
        currency="INR",
        skills="React, TypeScript, Python, FastAPI",
        experience_years=3,
        rating=4.9,
        completed_projects_count=5
    )
    db_session.add(profile)
    db_session.commit()
    return user

@pytest.fixture
def test_admin_user(db_session):
    from backend.security import hash_password
    user = User(
        email="test_admin@example.com",
        hashed_password=hash_password("Password123!"),
        full_name="Test Admin",
        role="admin",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def client_headers(test_client_user):
    token = create_access_token({"sub": str(test_client_user.id), "role": test_client_user.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def freelancer_headers(test_freelancer_user):
    token = create_access_token({"sub": str(test_freelancer_user.id), "role": test_freelancer_user.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers(test_admin_user):
    token = create_access_token({"sub": str(test_admin_user.id), "role": test_admin_user.role})
    return {"Authorization": f"Bearer {token}"}
