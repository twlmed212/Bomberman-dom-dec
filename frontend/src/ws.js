// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing
// Mock WebSocket for testing


// Simulates server responses

let mockPlayerId = null;
let mockPlayers = [];
let mockMessages = [];
let listeners = {};

// Simulate server responses with delay
function simulateServer(type, data) {
  setTimeout(() => {
    if (listeners[type]) {
      listeners[type](data);
    }
  }, 100);
}

export const ws = {
  // Connect to server
  connect() {
    console.log('🔌 Mock WS: Connecting...');
    
    setTimeout(() => {
      mockPlayerId = 'player_' + Date.now();
      simulateServer('CONNECTED', { playerId: mockPlayerId });
      console.log('✅ Mock WS: Connected', mockPlayerId);
    }, 500);
  },

  // Send JOIN message
  join(nickname) {
    console.log('📤 Mock WS: JOIN', nickname);
    
    // Add self to players
    mockPlayers.push({
      id: mockPlayerId,
      name: nickname
    });
    
    // Simulate other players joining
    setTimeout(() => {
      mockPlayers.push({
        id: 'player_bot1',
        name: 'Bot1'
      });
      simulateServer('LOBBY_UPDATE', { 
        players: [...mockPlayers],
        count: mockPlayers.length
      });
    }, 1000);
    
    // Start game when 2+ players
    setTimeout(() => {
      if (mockPlayers.length >= 2) {
        simulateServer('GAME_START', { countdown: 3 });
      }
    }, 3000);
  },

  // Send CHAT message
  sendChat(message) {
    console.log('📤 Mock WS: CHAT', message);
    
    const chatMsg = {
      from: mockPlayers.find(p => p.id === mockPlayerId)?.name || 'You',
      message: message,
      timestamp: Date.now()
    };
    
    mockMessages.push(chatMsg);
    simulateServer('CHAT_MESSAGE', chatMsg);
    
    // Simulate bot reply
    setTimeout(() => {
      const botMsg = {
        from: 'Bot1',
        message: 'Nice!',
        timestamp: Date.now()
      };
      mockMessages.push(botMsg);
      simulateServer('CHAT_MESSAGE', botMsg);
    }, 1500);
  },

  // Send READY message
  ready() {
    console.log('📤 Mock WS: READY');
    // In our case, auto-ready, so maybe not needed
  },

  // Listen to server messages
  on(eventType, callback) {
    listeners[eventType] = callback;
  },

  // Simulate game over (for testing)
  mockGameOver() {
    setTimeout(() => {
      simulateServer('GAME_OVER', {
        winner: mockPlayers[0].name,
        players: mockPlayers.map((p, idx) => ({
          ...p,
          score: 100 - (idx * 20)
        }))
      });
    }, 1000);
  }
};