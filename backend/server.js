import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });


wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    
    // Echo back for testing
    ws.send(JSON.stringify({ type: 'ECHO', data: data.toString() }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
 
  // Send welcome message
  ws.send(JSON.stringify({ type: 'CONNECTED', playerId: 'test_123' }));
});