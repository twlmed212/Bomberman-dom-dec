// Mock WebSocket for testing
// Simulates server responses

let mockPlayerId = null;
let mockPlayers = [];
let mockMessages = [];
let listeners = {};
let gameLoopInterval = null;
let mockMap = null;  // ← Add this - store map once


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
      
      mockMap = createMockMap();  // ← Create map ONCE here
      
      // Start game state loop
      gameLoopInterval = setInterval(() => {
        const mockGameState = {
          map: mockMap,  // ← Use same map
          players: mockPlayers.map((p, i) => ({
            ...p,
            x: i === 0 ? 1 : 13,
            y: i === 0 ? 1 : 13,
            lives: 3
          })),
          bombs: [],
          explosions: [],
          timer: '02:30'
        };
        
        simulateServer('GAME_STATE', mockGameState);
      }, 100);
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

  // Send MOVE message
  sendMove(direction) {
    console.log('📤 Mock WS: MOVE', direction);
    // Real ws will send to server
  },

  // Send BOMB message
  sendBomb() {
    console.log('📤 Mock WS: BOMB');
    // Real ws will send to server
  },

  // Send READY message
  ready() {
    console.log('📤 Mock WS: READY');
  },

  // Listen to server messages
  on(eventType, callback) {
    listeners[eventType] = callback;
  },

  // Simulate game over (for testing)
  mockGameOver() {
    if (gameLoopInterval) {
      clearInterval(gameLoopInterval);
    }
    
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

// Create mock map
function createMockMap() {
  const map = [];
  for (let y = 0; y < 15; y++) {
    const row = [];
    for (let x = 0; x < 15; x++) {
      // Border walls
      if (x === 0 || x === 14 || y === 0 || y === 14) {
        row.push(1); // wall
      }
      // Grid pattern walls
      else if (x % 2 === 0 && y % 2 === 0) {
        row.push(1); // wall
      }
      // Some blocks (not at corners)
      else if ((x > 2 || y > 2) && (x < 12 || y < 12) && Math.random() > 0.7) {
        row.push(2); // block
      }
      else {
        row.push(0); // empty
      }
    }
    map.push(row);
  }
  return map;
}