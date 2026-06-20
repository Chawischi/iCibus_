<!--
### Sync Impact Report
- Version change: None -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Layered MVC Backend Architecture
  - [PRINCIPLE_2_NAME] -> II. Component-driven React Frontend
  - [PRINCIPLE_3_NAME] -> III. PostgreSQL Data Integrity
  - [PRINCIPLE_4_NAME] -> IV. Robust Custom Authentication
  - [PRINCIPLE_5_NAME] -> V. API-First Communication
- Added sections:
  - Technical Constraints (Section 2)
  - Testing & Quality Gates (Section 3)
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ updated
  - .specify/templates/spec-template.md: ✅ updated
  - .specify/templates/tasks-template.md: ✅ updated
- Follow-up TODOs: None
-->
# iCibus Constitution

## Core Principles

### I. Layered MVC Backend Architecture
The backend must strictly follow the Model-View-Controller (MVC) pattern. Business logic must reside in controllers, database interactions in models, and routing logic in route files. Middlewares should handle cross-cutting concerns (e.g., authentication, validation, error handling) to ensure high cohesion and loose coupling.

### II. Component-driven React Frontend
The frontend must be built as a Single Page Application (SPA) using React and Vite. Components must be highly reusable, modular, and styled using Tailwind CSS. Inline styling is prohibited. The interface must be responsive, ensuring cross-device compatibility (desktop, tablet, mobile) and loading in under 2 seconds.

### III. PostgreSQL Data Integrity
A relational PostgreSQL database must be used. All tables must have appropriate primary and foreign key constraints, indexes on frequently queried fields, and schema migrations must be versioned. Raw queries should be minimized in favor of parameterized queries or a structured query builder to prevent SQL injection.

### IV. Robust Custom Authentication
iCibus uses a custom authentication system (without external services like Clerk). Passwords must be hashed using bcrypt before storage. Authentication tokens (JWT or sessions) must be signed securely, stored in httpOnly cookies, and validated via backend middlewares on protected routes.

### V. API-First Communication
Communication between frontend and backend must occur exclusively via clean, RESTful API endpoints returning structured JSON. Error responses must have appropriate HTTP status codes (4xx, 5xx) and contain user-friendly, descriptive messages without exposing stack traces.

## Technical Constraints

### 1. Technology Stack
- Backend: Node.js (v18+) and Express.js
- Frontend: React.js (v18+) with Vite, Tailwind CSS (v3+)
- Database: PostgreSQL (v14+)
- Package Manager: npm

### 2. Performance and Availability
- Maximum response time for API endpoints must be under 2 seconds.
- Support up to 100 concurrent requests without service degradation.

## Testing & Quality Gates

### 1. Verification Requirements
- All controller methods and API endpoints must have associated unit or integration tests.
- Frontend components must render correctly on Chrome, Firefox, and Edge browsers.
- No secrets or credentials may be checked into source control.

## Governance
All pull requests must be verified against this Constitution. Changes to database schemas require a migration script. Security reviews are mandatory for any changes to the authentication middleware.

**Version**: 1.0.0 | **Ratified**: 2026-06-20 | **Last Amended**: 2026-06-20
