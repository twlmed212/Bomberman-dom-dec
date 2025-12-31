import { SERVER_TO_CLIENT, CLIENT_TO_SERVER } from '../../shared/messages/index.js';

const WS_URL = 'ws://localhost:8080';

let socket = null;
let listeners = {};

export const ws = {
  connect() {
    console.log('🔌 Connecting to server...');
    
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('✅ Connected to server');
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
      console.error('❌ WebSocket error:', err);
    };

    socket.onclose = () => {
      console.log('🔌 Disconnected from server');
    };
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