# Feature Specification: Real-Time Order and Delivery Tracking

**Feature Branch**: `001-delivery-tracking`

**Created**: 2026-06-20

**Status**: Ready

**Input**: User description: "Rastreamento de Pedido e Entrega em Tempo Real"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Client views real-time order status (Priority: P1)

As a customer, I want to view the current status of my active order (e.g., Pedido Recebido, Em Preparação, A Caminho, Entregue) so that I know when my food will arrive.

**Why this priority**: Crucial for customer transparency and satisfaction. It represents the core value of the tracking feature.

**Independent Test**: Can be verified by placing a simulated order and observing status updates change sequentially from "Recebido" to "Entregue" on the client interface.

**Acceptance Scenarios**:

1. **Given** a client has placed an order successfully, **When** they navigate to the order tracking page, **Then** they see the order marked as "Pedido Recebido".
2. **Given** the order is in progress, **When** the restaurant or delivery driver updates the status, **Then** the customer's page updates automatically in under 2 seconds without requiring a manual page refresh.

---

### User Story 2 - Administrator updates order status (Priority: P2)

As a restaurant administrator, I want to update the status of active orders (e.g., mark as "Em Preparação", "A Caminho") so that the kitchen and customers stay synchronized.

**Why this priority**: Allows the restaurant to manage its workflow and drives the status changes seen by the customer.

**Independent Test**: Can be tested by accessing the admin dashboard, selecting an active order, changing its status, and verifying that the database record updates correctly.

**Acceptance Scenarios**:

1. **Given** an administrator is on the admin dashboard, **When** they click "Iniciar Preparo" on a pending order, **Then** the order status changes to "Em Preparação" and a confirmation notification appears.
2. **Given** an order is prepared, **When** the administrator clicks "Enviar para Entrega", **Then** the status changes to "A Caminho" and the delivery details are locked.

---

### User Story 3 - Delivery companion map view (Priority: P3)

As a customer, I want to view a visual progress indicator or map showing the delivery progress when my order is "A Caminho" so that I can estimate the delivery time more accurately.

**Why this priority**: Enhances user experience but is not strictly necessary for the MVP core functionality.

**Independent Test**: Can be tested by setting an order to "A Caminho" and verifying that the progress map or timeline displays the delivery driver's simulated transit path.

**Acceptance Scenarios**:

1. **Given** an order status is "A Caminho", **When** the customer views the tracking page, **Then** a visual route tracker or progress bar indicating estimated time of arrival (ETA) is displayed.

---

### Edge Cases

- **Connectivity Loss**: If the customer loses internet connection during transit, the interface should display a user-friendly offline warning and reconnect automatically when signal returns, showing the latest status.
- **Order Cancellation**: If an order is cancelled by the admin while the customer is viewing the tracking page, the interface must instantly transition to a "Pedido Cancelado" screen, explaining the cancellation.
- **Concurrent Updates**: If two administrators attempt to update the same order status simultaneously, the system must process the first request and gracefully inform the second administrator that the order has already been updated.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST persist order status transitions (Recebido -> Em Preparação -> A Caminho -> Entregue -> Cancelado) in the database.
- **FR-002**: The admin dashboard MUST provide clear interface controls (buttons/dropdowns) to trigger status transitions.
- **FR-003**: The client tracking page MUST display status updates in real-time using WebSockets, Server-Sent Events, or short polling.
- **FR-004**: The system MUST prevent illegal state transitions (e.g., an order cannot go from "Recebido" directly to "Entregue").
- **FR-005**: The system MUST log all status change events, including the timestamp and the actor who performed the action.

### Key Entities *(include if feature involves data)*

- **Pedido (Order)**: Represents the customer order. Key attributes: `id`, `status` (enum), `data_criacao`, `valor_total`, `cliente_id`, `restaurante_id`.
- **HistoricoStatus (StatusHistory)**: Represents historical changes of an order status. Key attributes: `id`, `pedido_id`, `status_anterior`, `novo_status`, `data_alteracao`, `usuario_alteracao_id`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers receive status updates on their screen in under 2 seconds after the administrator triggers the update.
- **SC-002**: The admin dashboard updates status lists in real-time, allowing admins to process orders within 15 seconds of receiving them.
- **SC-003**: 98% of active orders complete their lifecycle without database state conflicts or duplicate updates.
- **SC-004**: System supports tracking for 100 concurrent active orders without page lag or server response delays exceeding 1 second.

## Assumptions

- The project's existing custom authentication system will be used to identify customers and administrators.
- Real-time communication will be supported on standard modern browsers (Chrome, Firefox, Edge, Safari).
- Order notifications and updates will only be active while the client keeps the order tracking page open.
