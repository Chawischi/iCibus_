# API Contracts: Order Tracking

These endpoints manage status updates and real-time streaming. All endpoints require a valid custom authentication token (JWT session cookie).

---

## 1. Update Order Status

Updates the status of an order. Only authorized restaurant administrators or delivery agents can update status.

* **URL**: `/api/orders/:id/status`
* **Method**: `PUT`
* **Headers**:
  * `Content-Type: application/json`
  * `Cookie: session=<token>`
* **URL Params**:
  * `id` [string, required]: The order UUID.
* **Request Body**:
  ```json
  {
    "status": "Preparacao",
    "motivo_cancelamento": null
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Order status updated successfully",
    "data": {
      "id": "e2a05cfc-fce1-4c6e-8a07-84a1a0dbcf08",
      "status": "Preparacao",
      "data_atualizacao": "2026-06-20T20:30:00.000Z"
    }
  }
  ```
* **Error Responses**:
  * **400 Bad Request** (Invalid transition / missing params):
    ```json
    {
      "success": false,
      "error": "Invalid status transition from 'Recebido' to 'Entregue'"
    }
    ```
  * **401 Unauthorized** (No session or invalid token):
    ```json
    {
      "success": false,
      "error": "Authentication required"
    }
    ```
  * **403 Forbidden** (User is not an administrator/restaurant owner):
    ```json
    {
      "success": false,
      "error": "Access denied"
    }
    ```
  * **404 Not Found** (Order does not exist):
    ```json
    {
      "success": false,
      "error": "Order not found"
    }
    ```

---

## 2. Order Real-Time Status Stream (SSE)

Establishes a Server-Sent Events stream to receive real-time updates for an active order.

* **URL**: `/api/orders/:id/tracking`
* **Method**: `GET`
* **Headers**:
  * `Accept: text/event-stream`
  * `Cache-Control: no-cache`
  * `Connection: keep-alive`
  * `Cookie: session=<token>`
* **URL Params**:
  * `id` [string, required]: The order UUID.
* **Stream Events**:
  * **Event: `connected`** (Triggered immediately on handshake):
    ```json
    { "connected": true, "order_id": "e2a05cfc-fce1-4c6e-8a07-84a1a0dbcf08" }
    ```
  * **Event: `status_update`** (Triggered whenever status changes):
    ```json
    {
      "order_id": "e2a05cfc-fce1-4c6e-8a07-84a1a0dbcf08",
      "status": "Preparacao",
      "data_atualizacao": "2026-06-20T20:30:00.000Z"
    }
    ```
  * **Event: `error`** (If client tries to track unauthorized order):
    ```json
    { "error": "Access denied to order tracking" }
    ```
