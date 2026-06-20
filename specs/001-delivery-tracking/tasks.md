# Tasks: Real-Time Order and Delivery Tracking

**Input**: Design documents from `/specs/001-delivery-tracking/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are explicitly specified in the descriptions.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure folders under backend/ and frontend/ per implementation plan
- [x] T002 Configure backend package dependencies in backend/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database and routing infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Setup database schema migrations for orders and status history tables in backend/src/db/migrations/
- [x] T004 [P] Configure custom auth verification middleware in backend/src/middlewares/authMiddleware.js
- [x] T005 Setup API router mount in backend/src/app.js

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Client views real-time order status (Priority: P1) 🎯 MVP

**Goal**: Client receives real-time order status updates via Server-Sent Events stream.

**Independent Test**: Client opens the order tracking page and witnesses status transitions without refreshing the browser.

### Implementation for User Story 1

- [x] T006 [P] [US1] Define Order model schema and status constraints in backend/src/models/order.js
- [x] T007 [P] [US1] Create order status history model in backend/src/models/statusHistory.js
- [x] T008 [US1] Implement Server-Sent Events client stream endpoint in backend/src/controllers/orderController.js
- [x] T009 [US1] Mount tracking stream GET route in backend/src/routes/orderRoutes.js
- [x] T010 [P] [US1] Implement frontend SSE listener service in frontend/src/services/trackingService.js
- [x] T011 [US1] Create TrackingTimeline UI component in frontend/src/components/TrackingTimeline.jsx
- [x] T012 [US1] Create TrackingPage view in frontend/src/pages/TrackingPage.jsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Administrator updates order status (Priority: P2)

**Goal**: Restaurant administrators update order status from their dashboard, instantly publishing events to client streams.

**Independent Test**: Changing status in the admin console triggers database write and pushes live update to the client's screen.

### Implementation for User Story 2

- [x] T013 [US2] Implement status update and transition validation logic in backend/src/controllers/orderController.js
- [x] T014 [US2] Mount status update PUT route with auth middleware in backend/src/routes/orderRoutes.js
- [x] T015 [P] [US2] Create AdminOrderControl UI component in frontend/src/components/AdminOrderControl.jsx
- [x] T016 [US2] Create AdminDashboard page in frontend/src/pages/AdminDashboard.jsx

**Checkpoint**: At this point, User Stories 1 and 2 should work seamlessly together.

---

## Phase 5: User Story 3 - Delivery companion map view (Priority: P3)

**Goal**: Visual progress and simulated driver coordinates display when order status changes to "A Caminho".

**Independent Test**: The tracking timeline replaces or expands into a transit map when status is set to "A Caminho".

### Implementation for User Story 3

- [x] T017 [P] [US3] Implement driver coordinate simulation stream in backend/src/controllers/orderController.js
- [x] T018 [US3] Create tracking map simulator component in frontend/src/components/TrackingMap.jsx
- [x] T019 [US3] Integrate map view into TrackingPage in frontend/src/pages/TrackingPage.jsx

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: General improvement and final validation

- [x] T020 [P] Update documentation in README.md
- [x] T021 Run validation scenarios from specs/001-delivery-tracking/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies
- Setup (Phase 1) is immediate.
- Foundational (Phase 2) depends on Phase 1, blocking all stories.
- User Stories depend on Phase 2. They can be executed sequentially or in parallel.
- Polish depends on completion of all stories.

### Parallel Opportunities
- Setup T001 and T002.
- Models T006 and T007 in US1.
- Frontend components T010 and T011 in US1.
- Controls T015 and T016 in US2.

---

## Parallel Example: User Story 1
```bash
# Developer A starts:
Task: "Define Order model schema and status constraints in backend/src/models/order.js"

# Developer B starts in parallel:
Task: "Create order status history model in backend/src/models/statusHistory.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup and Foundational.
2. Complete User Story 1.
3. Verify client receives mock status updates.
