# Quickstart Validation Guide: Order Tracking

This guide outlines the validation scenarios to confirm the real-time order tracking feature functions correctly end-to-end.

## Prerequisites and Setup
1. Ensure the PostgreSQL database is running.
2. Initialize database schemas (run migrations).
3. Start the backend Express server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. Start the frontend Vite server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Scenario 1: End-to-End Tracking Lifecycle Validation

### 1. Place a Simulated Order
- Authenticate as a client.
- Create an order. Let the returned order ID be `ORDER_ID`.

### 2. Open client-side tracking view
- Open a web browser to the tracking URL: `http://localhost:5173/orders/ORDER_ID`.
- Verify the screen displays "Pedido Recebido" and connects to the event stream successfully.

### 3. Transition to "Em Preparação" (Admin Action)
- Authenticate as an admin.
- Update the order status using curl or the admin dashboard:
  ```bash
  curl -X PUT http://localhost:3000/api/orders/ORDER_ID/status \
    -H "Content-Type: application/json" \
    -H "Cookie: session=ADMIN_JWT_TOKEN" \
    -d '{"status": "Preparacao"}'
  ```
- **Expected Outcome**: The client tracking view instantly updates to display "Em Preparação" without manual refresh.

### 4. Transition to "A Caminho" (Admin Action)
- As admin, run:
  ```bash
  curl -X PUT http://localhost:3000/api/orders/ORDER_ID/status \
    -H "Content-Type: application/json" \
    -H "Cookie: session=ADMIN_JWT_TOKEN" \
    -d '{"status": "A Caminho"}'
  ```
- **Expected Outcome**: The client tracking page displays "A Caminho" and shows the estimated delivery progress map/bar.

### 5. Transition to "Entregue" (Delivery Action)
- As admin or driver, run:
  ```bash
  curl -X PUT http://localhost:3000/api/orders/ORDER_ID/status \
    -H "Content-Type: application/json" \
    -H "Cookie: session=ADMIN_JWT_TOKEN" \
    -d '{"status": "Entregue"}'
  ```
- **Expected Outcome**: The tracking page marks the order as successfully "Entregue".

---

## Scenario 2: Validation of Invalid Transitions

Verify that the backend rejects state violations (e.g. jumping from Recebido directly to Entregue).

1. Place another simulated order (`ORDER_ID_2`).
2. Run curl to jump states:
   ```bash
   curl -i -X PUT http://localhost:3000/api/orders/ORDER_ID_2/status \
     -H "Content-Type: application/json" \
     -H "Cookie: session=ADMIN_JWT_TOKEN" \
     -d '{"status": "Entregue"}'
   ```
3. **Expected Outcome**: HTTP 400 Bad Request with error message `Invalid status transition`. Verify order status remains `Recebido` in the database.
