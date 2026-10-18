---
name: realtime
description: "WebSocket, Server-Sent Events, and real-time data patterns."
when_to_use: "Use when adding real-time data: WebSockets or Server-Sent Events."
version: "1.0.0"
category: [integration, backend]
priority: medium
phase: any
tech_stack:
  languages: [typescript, javascript, python, go]
scale: [medium, large]
auto_invoke:
  enabled: false
  conditions:
    - phrase: ["websocket", "sse", "realtime", "live updates"]
  skill_tier: optional
triggers:
  phrases:
    - "websocket"
    - "sse"
    - "live updates"
    - "server-sent events"
    - "webhook"
capabilities: [implementation]
dependencies: [api-design]
integrates_with: [api-design]
---

# REALTIME v1.0

WebSocket, SSE, and real-time patterns.

## WebSocket

### 1. Client Hook

```typescript
export function useSocket<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setStatus('open');
    ws.onclose = () => setStatus('closed');
    ws.onmessage = (e) => setData(JSON.parse(e.data));

    return () => ws.close();
  }, [url]);

  return { data, status, send: ws.send.bind(ws) };
}
```

### 2. Server (Node.js)

```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
```

### 3. Reconnection

```typescript
function useRealtime<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [retryCount, setRetry] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (e) => setData(JSON.parse(e.data));
    ws.onclose = () => {
      if (retryCount < 3) {
        setTimeout(() => {
          setRetry(c => c + 1);
        ws.connect(url);
        // Reconnect logic
        ws = new WebSocket(url);
      }
    };

    return () => ws.close();
  }, [url, retryCount]);

  return data;
}
```

## Server-Sent Events

### 1. Server (Node.js)

```typescript
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
  }, 1000);

  req.on('close', () => clearInterval(interval));
});
```

### 2. React Hook

```typescript
export function useEventSource<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const es = new EventSource(url);

    es.onmessage = (e) => setData(JSON.parse(e.data));
    es.onerror = () => es.close();

    return () => es.close();
  }, [url]);

  return data;
}
```

## Webhooks

### 1. Verification

```typescript
import crypto from 'crypto';

export function verifyWebhook(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}
```

### 2. Handler

```typescript
app.post('/webhooks/github', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!verifyWebhook(req.body, signature, process.env.GITHUB_WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process event
  const event = req.headers['x-github-event'];

  if (event === 'push') {
    await handlePush(req.body);
  }

  res.status(200).send('OK');
});
```

---

*Author: TheVoidSyntax*
