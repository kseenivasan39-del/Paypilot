# PayPilot — Full-Stack AI Freelance Marketplace & PayPal Sandbox Payments

> **"AI that understands the work. PayPal that secures the payment."**

PayPilot is a modern, full-stack freelance platform that combines artificial intelligence with official PayPal Sandbox payment processing. Clients can describe projects in plain language, receive structured requirement analyses, review explainable freelancer recommendations, and securely authorize milestone payments through official PayPal REST APIs.

---

## Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router, Turbopack), React, TypeScript, Tailwind CSS, Framer Motion, `@paypal/react-paypal-js`, Axios, Lucide Icons |
| **Backend** | Python 3.11+, FastAPI (REST API), Pydantic v2 schemas, PyJWT, Bcrypt password hashing |
| **Database & ORM** | PostgreSQL (Production/Staging) / SQLite (Local dev), SQLAlchemy 2.0, Alembic database migrations |
| **Payments** | Official PayPal Sandbox REST API (`/v2/checkout/orders`), Server-side capture, Webhook signature verification, Idempotency protection |
| **AI Services** | Google Gemini API (`gemini-1.5-flash`), with labeled Demo Fallbacks for requirements analysis, explainable talent ranking, and transaction risk scoring |
| **Testing** | Pytest, HTTPX, SQLAlchemy in-memory SQLite fixtures (21 unit & integration tests) |

---

## Key Platform Capabilities

### 1. Role-Based Authentication & User Profiles
- Secure registration, login, and token issuance (`/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/me`).
- Password hashing using pure `bcrypt` with salt generation.
- Role-based authorization (`client`, `freelancer`, `admin`) and ownership enforcement on sensitive operations.
- User profile persistence with skills, hourly rates, completion stats, account preferences, and notification settings.

### 2. AI Requirement Analysis & Explainable Matching
- **Natural Language Parsing**: Analyzes raw project descriptions to extract scope, category, suggested budgets, deadlines, and key deliverables.
- **Explainable Talent Ranking**: Matches candidate freelancers against project parameters with explicit, human-readable match justifications (`match_reasons`).
- **Negotiation Recommendations**: Generates milestone and rate compromise suggestions based on scope.
- **Advisory Deliverable Audit**: Compares submitted work against agreed deliverables with an explicit advisory disclaimer.
- **Advisory Risk Assessment**: Computes a 0–100 transaction risk score prior to checkout.
- **Financial Safety**: AI services are strictly labeled advisory. The AI can never authorize disbursements, bypass role checks, or approve irreversible financial transactions.
- **Demo Fallback**: Labeled fallbacks are automatically served when an AI API key is not configured.

### 3. Official PayPal REST API Integration
- **Server-Side Token Retrieval**: Uses PayPal OAuth 2.0 client credentials flow with token caching.
- **Order Creation**: Creates v2 checkout orders with `intent: "CAPTURE"` and transaction references.
- **Official Checkout Flow**: Uses `@paypal/react-paypal-js` for in-browser client approval.
- **Server-Side Capture**: Payments are captured exclusively through `/api/v1/payments/capture-order` after verifying provider response. Transactions are never marked complete based on client input alone.
- **Webhook Verification**: Validates PayPal webhook signatures using headers (`PAYPAL-AUTH-ALGO`, `PAYPAL-CERT-URL`, `PAYPAL-TRANSMISSION-ID`, `PAYPAL-TRANSMISSION-SIG`, `PAYPAL-TRANSMISSION-TIME`).
- **Idempotency**: Prevents duplicate payment captures using unique idempotency keys and state checks.
- **Simulated Test Data Separation**: Testing fixtures and mock records are marked with `is_simulated = True` and kept strictly distinct from actual Sandbox transactions.

### 4. Database-Backed Pricing Catalog & Subscriptions
- Database catalog of platform tiers:
  - **Free**: ₹0 / month — 1 active project, 5 freelancer proposals.
  - **Pro**: ₹499 / month — 10 active projects, priority AI matching, PayPal transaction fee discount.
  - **Business**: ₹1,999 / month — Unlimited projects, dedicated AI audit models, priority support.
- Fully configurable in the database rather than hardcoded in the frontend.
- Feature entitlements endpoint (`/api/v1/subscriptions/entitlements`).
- Plan selection with server-side validation and billing cycle calculations.

### 5. Settings, Security & Notifications
- Granular notification preferences for project updates, messages, payment confirmations, and AI verification alerts.
- Security overview endpoint (`/api/v1/settings/security`) accurately displaying whether 2FA is active and listing authenticated device sessions.

---

## Database Entities (SQLAlchemy & Alembic)

The backend schema includes 19 normalized tables:
- `users`: Core user accounts (email, password hash, role, active status).
- `freelancer_profiles`: Extended profile details (title, hourly rate, skills, reviews, completion rate).
- `projects`: Client projects with status, category, budget, and deadlines.
- `project_requirements`: AI-extracted requirements and deliverables.
- `applications`: Freelancer applications and proposals.
- `contracts`: Binding agreements between clients and freelancers.
- `milestones`: Structured milestone deliverables and escrow amounts.
- `deliverables`: Submitted work items and attachments.
- `ai_verifications`: Advisory deliverable review logs.
- `payment_orders`: PayPal order tracking and idempotency records.
- `transactions`: Ledger of all captured payments and refunds (`is_simulated` flag).
- `pricing_plans`: Database-backed subscription tier catalog.
- `subscriptions`: Active user subscriptions with renewal and status tracking.
- `notification_preferences`: Channel and event subscription preferences.
- `notifications`: User notification history and read flags.
- `user_settings`: User interface preferences (theme, timezone, language, currency).
- `webhook_events`: Incoming PayPal webhook audit trail.
- `audit_logs`: Detailed system audit trail for security and financial actions.
- `reviews`: Client and freelancer ratings and feedback.

---

## API Organization (`/api/v1`)

| Router | Prefix | Description |
|---|---|---|
| `auth` | `/api/v1/auth` | Registration, login, current user profile, logout |
| `users` | `/api/v1/users` | User directory and profile updates |
| `profiles` | `/api/v1/profiles` | Freelancer directory with skill and rate filtering |
| `projects` | `/api/v1/projects` | Project CRUD, status lifecycle, requirement linking |
| `applications`| `/api/v1/applications` | Freelancer proposals and client acceptance |
| `contracts` | `/api/v1/contracts` | Milestone contracts and agreements |
| `milestones` | `/api/v1/milestones` | Milestone creation, deliverable submission, fund release |
| `ai` | `/api/v1/ai` | Requirement extraction, matching, negotiation, verification, risk assessment |
| `payments` | `/api/v1/payments` | PayPal order creation, server-side capture, webhooks |
| `transactions`| `/api/v1/transactions` | Financial ledger and transaction detail inspection |
| `plans` | `/api/v1/plans` | Database-backed pricing plan catalog |
| `subscriptions`| `/api/v1/subscriptions` | Subscription status, entitlements, tier selection |
| `notifications`| `/api/v1/notifications`| Notification listing and mark-as-read |
| `settings` | `/api/v1/settings` | Settings, notification preferences, security overview |
| `admin` | `/api/v1/admin` | Administrative platform statistics and audit inspection |

OpenAPI interactive documentation is available at `http://localhost:8000/docs`.

---

## Demo Credentials (Seeded)

The database includes seed accounts with pre-populated transactions and projects:

| Role | Email | Password | Details |
|---|---|---|---|
| **Client** | `client@paypilot.demo` | `Password123!` | Sarah Johnson (Active client with projects) |
| **Freelancer** | `rahul@paypilot.demo` | `Password123!` | Rahul Kumar (Full Stack Dev, 98% completion) |
| **Freelancer** | `priya@paypilot.demo` | `Password123!` | Priya Sharma (Content Strategist, 94% completion) |
| **Admin** | `admin@paypilot.demo` | `Password123!` | System Administrator |

---

## Setup & Local Run Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env
```
Fill in your PayPal Sandbox credentials and Gemini API key as needed. Safe local defaults (SQLite, demo fallbacks) work out of the box if external keys are omitted.

### 2. Backend Setup
```bash
# Activate existing virtual environment or create a new one
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run database migrations with Alembic
alembic upgrade head

# Seed demo data (demo accounts, projects, pricing plans, test transactions)
python -m backend.seed

# Start the FastAPI backend
python -m uvicorn backend.main:app --reload --port 8000
```
Backend API will be running on `http://localhost:8000` (docs at `http://localhost:8000/docs`).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running on `http://localhost:3000`.

---

## Automated Test Suite

A comprehensive automated test suite (21 tests) covers core security, business logic, payments, AI fallbacks, and subscriptions:

```bash
# Run the test suite
.\venv\Scripts\python.exe -m pytest -v
```

### Test Coverage Highlights:
- `backend/tests/test_auth.py`: Registration, duplicate rejection, login, token issuance, protected routes, role restrictions.
- `backend/tests/test_projects.py`: Project creation, ownership checks, status transitions.
- `backend/tests/test_applications.py`: Freelancer bidding, client acceptance, unauthorized proposal protections.
- `backend/tests/test_ai_fallback.py`: Requirement extraction, explainable talent ranking, advisory deliverable audit fallbacks.
- `backend/tests/test_payments.py`: PayPal order creation, idempotency key enforcement, duplicate capture prevention.
- `backend/tests/test_subscriptions.py`: Plan listing, subscription selection, entitlement enforcement.
- `backend/tests/test_webhooks.py`: PayPal webhook event processing and idempotency recording.

---

## Verification & Status Report

- **Authentication**: Fully functional with pure `bcrypt`, JWT access tokens, role-based protection, and demo accounts.
- **Projects & Marketplace**: Fully functional CRUD with requirements extraction and application workflow.
- **AI Services**: Fully functional modular architecture with real Google Gemini integration and labeled demo fallbacks. AI outputs are strictly advisory.
- **PayPal Sandbox**: Server-side client, order creation, capture verification, webhook handling, and idempotency protection fully implemented. (Requires valid Sandbox Client ID and Secret in `.env` for live checkout; demo capture fallback available).
- **Pricing & Subscriptions**: Database catalog (₹0 Free, ₹499 Pro, ₹1,999 Business) dynamically rendered and connected.
- **Settings & Security**: Fully persisted preferences and accurate 2FA status reporting.
- **UI & Layout**: 100% preservation of all existing styling, navigation, branding, and motion animations.
