# Research: Real-Time Communication Protocol for Order Tracking

## Decision: Server-Sent Events (SSE)

We will use Server-Sent Events (SSE) to push order status updates from the Node.js/Express backend to the React client.

### Rationale
1. **Unidirectional Data Flow**: Order status tracking is purely read-only from the customer's perspective. The client only needs to receive status changes triggered by the admin dashboard. SSE is designed specifically for unidirectional server-to-client streaming.
2. **Standard HTTP**: SSE works over standard HTTP/1.1 or HTTP/2, requiring no custom protocols, custom parsers, or complex firewall configurations. It utilizes standardExpress middleware.
3. **Automatic Reconnection**: Browsers automatically attempt to reconnect to SSE streams if the connection drops, handling packet loss and temporary network disconnects natively without client-side logic.
4. **Efficiency**: It is significantly more efficient than HTTP polling and uses fewer server resources than maintaining a full bi-directional WebSocket connection.

### Alternatives Considered

#### Alternative 1: WebSockets (Socket.io)
- **Evaluation**: Replaced.
- **Why Rejected**: WebSockets support bi-directional communication, which is not required for this feature since the client does not send messages to the server during tracking. WebSockets also require a custom handshake, add transport layer overhead, and require additional library dependencies on both backend and frontend.

#### Alternative 2: HTTP Short Polling
- **Evaluation**: Replaced.
- **Why Rejected**: Polling makes a new HTTP request every X seconds. This creates significant overhead on the Express server and PostgreSQL database under high concurrency (100+ tracking sessions), violating our performance goal of under 2s updates and standard resource efficiency.
