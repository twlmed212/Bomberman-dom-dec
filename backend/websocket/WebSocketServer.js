import { WebSocketServer as WSServer } from 'ws';
import { MessageHandler } from './MessageHandler.js';

export class WebSocketServer {
  constructor(port, lobby, gameManager) {
    this.wss = new WSServer({ port });
    this.lobby = lobby;
    this.gameManager = gameManager;
    this.clients = new Map(); // playerId -> { ws, handler }
    
    console.log(`🚀 WebSocket Server running on port ${port}`);
    
    this.wss.on('connection', (ws) => this.handleConnection(ws));
  }

  handleConnection(ws) {
    console.log('✅ Client connected');
    
    const playerId = 'player_' + Date.now();
    const handler = new MessageHandler(ws, playerId, this.lobby, this.gameManager);
    
    this.clients.set(playerId, { ws, handler });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        handler.handle(message);
      } catch (err) {
        console.error('Invalid message:', err);
      }
    });

    ws.on('close', () => {
      console.log('❌ Client disconnected:', playerId);
      this.clients.delete(playerId);
      this.lobby.removePlayer(playerId);
      this.gameManager.handlePlayerDisconnect(playerId);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    this.clients.forEach(({ ws }) => {
      if (ws.readyState === 1) { // OPEN
        ws.send(data);
      }
    });
  }

  sendToPlayer(playerId, message) {
    const client = this.clients.get(playerId);
    if (client && client.ws.readyState === 1) {
      client.ws.send(JSON.stringify(message));
    }
  }
}