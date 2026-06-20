# GitHub Issues for Real-Time Order and Delivery Tracking

The following issues are generated from `tasks.md` and mapped to `https://github.com/Chawischi/iCibus_` for tracking.

---

## Foundational & Setup Issues

### Issue #1: `T001: Create project structure folders under backend/ and frontend/ per implementation plan`
- **Description**: Set up the folder structures needed for the delivery tracking feature.
- **Paths**: `backend/src/models/`, `backend/src/controllers/`, `backend/src/routes/`, `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/services/`
- **Dependencies**: None

### Issue #2: `T002: Configure backend package dependencies in backend/package.json`
- **Description**: Install required dependencies for SSE (e.g. pg).
- **Paths**: `backend/package.json`
- **Dependencies**: T001

### Issue #3: `T003: Setup database schema migrations for orders and status history tables in backend/src/db/migrations/`
- **Description**: Create database tables for tracking.
- **Paths**: `backend/src/db/migrations/`
- **Dependencies**: T002

### Issue #4: `T004: Configure custom auth verification middleware in backend/src/middlewares/authMiddleware.js`
- **Description**: Secure status modification endpoints.
- **Paths**: `backend/src/middlewares/authMiddleware.js`
- **Dependencies**: T002

### Issue #5: `T005: Setup API router mount in backend/src/app.js`
- **Description**: Mount the tracking router.
- **Paths**: `backend/src/app.js`
- **Dependencies**: T002

---

## User Story 1 (P1) - Client Views Status

### Issue #6: `T006: Define Order model schema and status constraints in backend/src/models/order.js`
- **Description**: Update order model with constraints.
- **Paths**: `backend/src/models/order.js`
- **Dependencies**: T003

### Issue #7: `T007: Create order status history model in backend/src/models/statusHistory.js`
- **Description**: Store history log of transitions.
- **Paths**: `backend/src/models/statusHistory.js`
- **Dependencies**: T003

### Issue #8: `T008: Implement Server-Sent Events client stream endpoint in backend/src/controllers/orderController.js`
- **Description**: Create active SSE streams for clients.
- **Paths**: `backend/src/controllers/orderController.js`
- **Dependencies**: T004, T005, T006, T007

### Issue #9: `T009: Mount tracking stream GET route in backend/src/routes/orderRoutes.js`
- **Description**: Route GET requests to stream.
- **Paths**: `backend/src/routes/orderRoutes.js`
- **Dependencies**: T008

### Issue #10: `T010: Implement frontend SSE listener service in frontend/src/services/trackingService.js`
- **Description**: Subscribe to SSE events from the React frontend.
- **Paths**: `frontend/src/services/trackingService.js`
- **Dependencies**: T001

### Issue #11: `T011: Create TrackingTimeline UI component in frontend/src/components/TrackingTimeline.jsx`
- **Description**: Visualize current progress status.
- **Paths**: `frontend/src/components/TrackingTimeline.jsx`
- **Dependencies**: T001

### Issue #12: `T012: Create TrackingPage view in frontend/src/pages/TrackingPage.jsx`
- **Description**: Mount components and listen to service.
- **Paths**: `frontend/src/pages/TrackingPage.jsx`
- **Dependencies**: T010, T011

---

## User Story 2 (P2) - Admin Status Update

### Issue #13: `T013: Implement status update and transition validation logic in backend/src/controllers/orderController.js`
- **Description**: Validate database state machine transitions.
- **Paths**: `backend/src/controllers/orderController.js`
- **Dependencies**: T008

### Issue #14: `T014: Mount status update PUT route with auth middleware in backend/src/routes/orderRoutes.js`
- **Description**: Update order route.
- **Paths**: `backend/src/routes/orderRoutes.js`
- **Dependencies**: T013

### Issue #15: `T015: Create AdminOrderControl UI component in frontend/src/components/AdminOrderControl.jsx`
- **Description**: Dropdowns and controls for changing status.
- **Paths**: `frontend/src/components/AdminOrderControl.jsx`
- **Dependencies**: T001

### Issue #16: `T016: Create AdminDashboard page in frontend/src/pages/AdminDashboard.jsx`
- **Description**: Admin management panel.
- **Paths**: `frontend/src/pages/AdminDashboard.jsx`
- **Dependencies**: T015

---

## User Story 3 (P3) - Transit Map

### Issue #17: `T017: Implement driver coordinate simulation stream in backend/src/controllers/orderController.js`
- **Description**: Emit dummy lat/lng coordinates.
- **Paths**: `backend/src/controllers/orderController.js`
- **Dependencies**: T013

### Issue #18: `T018: Create tracking map simulator component in frontend/src/components/TrackingMap.jsx`
- **Description**: Render driver coordinates on a timeline or map.
- **Paths**: `frontend/src/components/TrackingMap.jsx`
- **Dependencies**: T001

### Issue #19: `T019: Integrate map view into TrackingPage in frontend/src/pages/TrackingPage.jsx`
- **Description**: Embed map component when state is "A Caminho".
- **Paths**: `frontend/src/pages/TrackingPage.jsx`
- **Dependencies**: T012, T018

---

## Polish & Verification

### Issue #20: `T020: Update documentation in README.md`
- **Description**: Document features.
- **Paths**: `README.md`
- **Dependencies**: T012, T016, T019

### Issue #21: `T021: Run validation scenarios from specs/001-delivery-tracking/quickstart.md`
- **Description**: Run e2e tests.
- **Paths**: `specs/001-delivery-tracking/quickstart.md`
- **Dependencies**: T020
