# Implementation Plan: Real-Time Order and Delivery Tracking

**Branch**: `001-delivery-tracking` | **Date**: 2026-06-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-delivery-tracking/spec.md`

## Summary
The goal is to implement real-time tracking of orders for the iCibus platform. Customers will view active order status updates instantly without manual page refresh, while restaurant administrators will update these states from the admin dashboard. We will use a Node.js/Express backend with a custom REST API and Server-Sent Events (SSE) or WebSockets for real-time updates, persisting state transitions in PostgreSQL.

## Technical Context

**Language/Version**: Node.js (v18+) for Backend, React (v18+) + Vite for Frontend.

**Primary Dependencies**: Express.js, pg (PostgreSQL driver), socket.io or Server-Sent Events (native Express response) for real-time updates.

**Storage**: PostgreSQL (v14+) database.

**Testing**: Jest and Supertest for backend controller/API testing.

**Target Platform**: Modern web browsers (Chrome, Firefox, Edge, Safari) and Node.js server.

**Project Type**: Web application (frontend + backend).

**Performance Goals**: Order status updates rendered on client screens within 2 seconds of admin trigger; API responses < 1 second.

**Constraints**: Security (authentication required for all status changes), strict database transition constraints (no skipping order states).

**Scale/Scope**: Up to 100 concurrent active tracking sessions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Layered MVC Backend Architecture**: Yes, routes, controllers, and models will be clearly separated in the `backend/` project directory.
- **Component-driven React Frontend**: Yes, UI components for tracking and admin dashboards will be modular React components in `frontend/`.
- **PostgreSQL Data Integrity**: Yes, order status will use a strict custom enum, and state changes will be recorded in a history table.
- **Robust Custom Authentication**: Yes, state-changing endpoints will require authorization verified by checking JWT session cookies.
- **API-First Communication**: Yes, client-server updates will use standard REST API routes for updates and Server-Sent Events for real-time events.

## Project Structure

### Documentation (this feature)

```text
specs/001-delivery-tracking/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md # API contracts
└── checklists/
    └── requirements.md  # Spec checklist
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # Order state and history models
│   ├── controllers/     # Order tracking and admin controllers
│   ├── routes/          # API endpoints for tracking
│   └── middlewares/     # Auth and validation middlewares
└── tests/               # Integration tests

frontend/
├── src/
│   ├── components/      # Tracking progress components
│   ├── pages/           # Order tracking and admin page
│   └── services/        # Real-time event consumer service
└── tests/               # Frontend rendering verification tests
```

**Structure Decision**: Option 2 (Web Application) is selected since iCibus has separate frontend and backend directories already.

## Complexity Tracking

No violations of the Constitution. The architecture strictly complies with iCibus core principles.
