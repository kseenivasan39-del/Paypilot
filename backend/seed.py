import json
import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from backend.database import SessionLocal, engine, Base
from backend.models import (
    User, FreelancerProfile, Project, ProjectRequirement,
    Application, Contract, Milestone, PricingPlan, Subscription,
    NotificationPreferences, UserSettings, Transaction, Review
)
from backend.security import hash_password

logger = logging.getLogger(__name__)

def seed_database():
    """Seeds the database with required pricing plans and local development demo accounts."""
    db: Session = SessionLocal()
    try:
        # 1. Seed Pricing Plans (Section 5)
        plans = [
            {
                "code": "free",
                "name": "Free",
                "description": "Get started with essential features at no cost.",
                "price_monthly": 0.0,
                "price_annual": 0.0,
                "currency": "INR",
                "max_projects": 3,
                "priority_support": False,
                "ai_matching_level": "basic",
                "features": json.dumps([
                    "Create up to 3 projects",
                    "Find and apply to projects",
                    "Basic AI matching",
                    "Secure PayPal payments"
                ])
            },
            {
                "code": "pro",
                "name": "Pro",
                "description": "Unlock more opportunities and advanced AI features.",
                "price_monthly": 499.0,
                "price_annual": 4790.0,
                "currency": "INR",
                "max_projects": 50,
                "priority_support": True,
                "ai_matching_level": "advanced",
                "features": json.dumps([
                    "Unlimited projects",
                    "Advanced AI matching",
                    "Priority in search results",
                    "Detailed analytics",
                    "Custom profile badge",
                    "Priority support",
                    "Early access to new features"
                ])
            },
            {
                "code": "business",
                "name": "Business",
                "description": "For agencies and power users with larger operational needs.",
                "price_monthly": 1999.0,
                "price_annual": 19190.0,
                "currency": "INR",
                "max_projects": 500,
                "priority_support": True,
                "ai_matching_level": "advanced",
                "features": json.dumps([
                    "Everything in Pro",
                    "Team accounts (up to 5 members)",
                    "Advanced project management",
                    "Dedicated account manager",
                    "API access",
                    "Custom integrations",
                    "Priority support (24/7)"
                ])
            }
        ]

        for p_data in plans:
            existing = db.query(PricingPlan).filter(PricingPlan.code == p_data["code"]).first()
            if not existing:
                plan = PricingPlan(**p_data)
                db.add(plan)
        db.commit()

        # 2. Seed Demo Users
        demo_password_hash = hash_password("Password123!")
        admin_password_hash = hash_password("AdminPass123!")

        # Client: Sarah
        client = db.query(User).filter(User.email == "client@paypilot.demo").first()
        if not client:
            client = User(
                email="client@paypilot.demo",
                hashed_password=demo_password_hash,
                full_name="Sarah Jenkins",
                role="client",
                avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                bio="Tech entrepreneur and startup founder hiring full-stack talent.",
                country="India",
                timezone="Asia/Kolkata",
                is_active=True,
                is_verified=True
            )
            db.add(client)
            db.commit()
            db.refresh(client)

            db.add(NotificationPreferences(user_id=client.id))
            db.add(UserSettings(user_id=client.id))
            db.commit()

        # Freelancer 1: Rahul
        freelancer_rahul = db.query(User).filter(User.email == "rahul@paypilot.demo").first()
        if not freelancer_rahul:
            freelancer_rahul = User(
                email="rahul@paypilot.demo",
                hashed_password=demo_password_hash,
                full_name="Rahul Kumar",
                role="freelancer",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                bio="Full-Stack React & Node.js Developer with 5 years experience.",
                country="India",
                timezone="Asia/Kolkata",
                is_active=True,
                is_verified=True
            )
            db.add(freelancer_rahul)
            db.commit()
            db.refresh(freelancer_rahul)

            db.add(NotificationPreferences(user_id=freelancer_rahul.id))
            db.add(UserSettings(user_id=freelancer_rahul.id))

            profile_rahul = FreelancerProfile(
                user_id=freelancer_rahul.id,
                title="Full-Stack React & Node.js Engineer",
                hourly_rate=1500.0,
                currency="INR",
                overview="Specializing in building clean, scalable React applications and interactive dashboards.",
                skills="React, TypeScript, Next.js, Tailwind CSS, Python, Node.js",
                experience_years=5,
                completed_projects_count=14,
                rating=4.9,
                availability_status="available"
            )
            db.add(profile_rahul)
            db.commit()

        # Freelancer 2: Priya
        freelancer_priya = db.query(User).filter(User.email == "priya@paypilot.demo").first()
        if not freelancer_priya:
            freelancer_priya = User(
                email="priya@paypilot.demo",
                hashed_password=demo_password_hash,
                full_name="Priya Sharma",
                role="freelancer",
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                bio="Data visualization and frontend performance specialist.",
                country="India",
                timezone="Asia/Kolkata",
                is_active=True,
                is_verified=True
            )
            db.add(freelancer_priya)
            db.commit()
            db.refresh(freelancer_priya)

            db.add(NotificationPreferences(user_id=freelancer_priya.id))
            db.add(UserSettings(user_id=freelancer_priya.id))

            profile_priya = FreelancerProfile(
                user_id=freelancer_priya.id,
                title="AI & Data Visualization Specialist",
                hourly_rate=1800.0,
                currency="INR",
                overview="Expert in turning complex datasets into intuitive interactive charts and AI tools.",
                skills="Python, PyTorch, Data Analysis, Recharts, React, FastAPI",
                experience_years=4,
                completed_projects_count=9,
                rating=4.8,
                availability_status="available"
            )
            db.add(profile_priya)
            db.commit()

        # Admin
        admin = db.query(User).filter(User.email == "admin@paypilot.demo").first()
        if not admin:
            admin = User(
                email="admin@paypilot.demo",
                hashed_password=admin_password_hash,
                full_name="PayPilot Admin",
                role="admin",
                is_active=True,
                is_verified=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

            db.add(NotificationPreferences(user_id=admin.id))
            db.add(UserSettings(user_id=admin.id))
            db.commit()

        # 3. Seed Demo Project
        demo_project = db.query(Project).filter(Project.title == "React Dashboard Development").first()
        if not demo_project and client:
            demo_project = Project(
                client_id=client.id,
                title="React Dashboard Development",
                description="We need an interactive, dark-mode analytics dashboard built with React and Tailwind CSS. The dashboard should display real-time earnings stats and project milestone tables.",
                category="Web Development",
                budget=15000.0,
                currency="INR",
                status="open",
                required_skills="React, TypeScript, Tailwind CSS, Recharts",
                deadline=datetime.now(timezone.utc) + timedelta(days=21)
            )
            db.add(demo_project)
            db.commit()
            db.refresh(demo_project)

            req = ProjectRequirement(
                project_id=demo_project.id,
                extracted_skills="React, TypeScript, Tailwind CSS, Recharts",
                deliverables="Interactive dashboard UI\nResponsive layouts\nComponent documentation",
                complexity="Medium",
                estimated_duration="2-3 weeks",
                raw_analysis=json.dumps({
                    "extracted_skills": ["React", "TypeScript", "Tailwind CSS", "Recharts"],
                    "deliverables": ["Interactive dashboard UI", "Responsive layouts", "Component documentation"],
                    "complexity": "Medium"
                })
            )
            db.add(req)
            db.commit()

        # 4. Seed Simulated Transaction (Clearly tagged is_simulated=True per Section 10)
        existing_tx = db.query(Transaction).filter(Transaction.paypal_capture_id == "SIMULATED-CAP-DEMO-001").first()
        if not existing_tx and client and freelancer_rahul:
            tx = Transaction(
                project_id=demo_project.id if demo_project else None,
                client_id=client.id,
                freelancer_id=freelancer_rahul.id,
                transaction_type="milestone_payment",
                paypal_capture_id="SIMULATED-CAP-DEMO-001",
                amount=3500.0,
                fee_amount=105.0,
                currency="INR",
                status="completed",
                ai_risk_score=8.0,
                is_simulated=True
            )
            db.add(tx)
            db.commit()

        logger.info("Database seeded successfully with plans, demo accounts, and projects.")
        print("Database seeded successfully.")
    except Exception as e:
        db.rollback()
        logger.error(f"Seeding error: {e}")
        print(f"Seeding error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
