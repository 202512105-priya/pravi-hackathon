# Family ID 360

Family ID 360 is a comprehensive, production-ready prototype for a unified state beneficiary management system. It provides a 360-degree view of households, integrates cross-departmental benefits, flags data conflicts, and simulates event-driven reviews.

## Architecture

This project is a full-stack application structured in a monorepo:

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Python 3, FastAPI, SQLAlchemy ORM, Alembic migrations, PyJWT (RBAC).
- **Database**: SQLite (Development) / PostgreSQL (Production ready).

## Prerequisites

- Node.js >= 18
- Python >= 3.9

## Setup Instructions

### 1. Backend Setup

Open a terminal and navigate to the project root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed.py
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
*The API will be available at `http://localhost:8000/docs`.*

### 2. Frontend Setup

Open a new terminal at the project root:

```bash
npm install
npm run dev
```
*The web app will be available at `http://localhost:5173`.*

## Demo Credentials (RBAC)

The application uses Role-Based Access Control (RBAC). Use any of these pre-seeded accounts:

| Username | Password | Role | Scope |
|----------|----------|------|-------|
| `admin` | `demo` | STATE_ADMIN | Statewide |
| `officer_ahmedabad` | `demo` | DISTRICT_OFFICER | Ahmedabad District |
| `health_dept` | `demo` | DEPARTMENT_OFFICER | Health Department |
| `field_sanand` | `demo` | FIELD_WORKER | Sanand Taluka |
| `auditor` | `demo` | AUDITOR | Read-only |

## Guided Demos

When you launch the application and log in, look for the **Interactive Demos** floating widget in the bottom right corner. 

Clicking on a demo will guide you step-by-step through:
1. **Conflict Resolution**: Navigate a high-risk family profile and create an officer review task.
2. **Event Impact**: Simulate a major household life event and track the resulting cross-departmental suspensions.

## Key Routes

- `/dashboard`: High-level operations overview.
- `/families`: The Family Registry search.
- `/families/:familyId`: The 360-degree household view.
- `/schemes`: Pipeline tracking of applications by scheme.
- `/conflicts`: Cross-department identity matching and conflict resolution.
- `/analytics`: Synthetic statewide and district-level aggregations.
