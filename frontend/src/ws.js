import { SERVER_TO_CLIENT, CLIENT_TO_SERVER } from '../../shared/messages/index.js';

const WS_URL = 'ws://127.0.0.1:8080';

let socket = null;
let listeners = {};

export const ws = {
  connect() {
    return new Promise((resolve, reject) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      console.log('🔌 Connecting to server...');

      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        console.log('✅ Connected to server');
        resolve();
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const handler = listeners[message.type];

          if (handler) {
            handler(message);
          }
        } catch (err) {
          console.error('Invalid message:', err);
        }
      };

      socket.onerror = (err) => {
        console.error('❌ WebSocket error details:', err);
        // Browser WebSocket 'error' events notably lack detail for security reasons,
        // but we'll log what we can.
        reject(new Error('WebSocket connection failed'));
      };

      socket.onclose = () => {
        console.log('🔌 Disconnected from server');
        socket = null;
      };
    });
  },

  join(nickname) {
    this.send(CLIENT_TO_SERVER.JOIN, { playerName: nickname });
  },

  sendChat(message) {
    this.send(CLIENT_TO_SERVER.CHAT, { message });
  },

  sendMove(direction) {
    this.send(CLIENT_TO_SERVER.MOVE, { direction: direction.toUpperCase() });
  },

  sendBomb() {
    this.send(CLIENT_TO_SERVER.BOMB, {});
  },

  ready() {
    this.send(CLIENT_TO_SERVER.READY, {});
  },

  on(eventType, callback) {
    listeners[eventType] = callback;
  },

  send(type, data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, ...data }));
    }
  }
};