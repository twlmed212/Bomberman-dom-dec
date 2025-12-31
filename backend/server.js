import { WebSocketServer } from './websocket/WebSocketServer.js';
import { LobbyManager } from './lobby/LobbyManager.js';
import { GameManager } from './game/GameManager.js';

const PORT = 8080;

const gameManager = new GameManager();

const wsServer = new WebSocketServer(PORT, null, gameManager);

const lobby = new LobbyManager(wsServer, gameManager);

wsServer.lobby = lobby;

gameManager.onGameState((gameState) => {
  // Handle different event types from GameManager
  if (gameState.type === 'PLAYER_DIED') {
    wsServer.broadcast(gameState);
  } else {
    wsServer.broadcast({
      type: 'GAME_STATE',
      ...gameState
    });
  }
});

gameManager.onGameOver((data) => {
  wsServer.broadcast({
    type: 'GAME_OVER',
    ...data
  });
});

console.log('Bomberman Server Started');
console.log('Listening on port', PORT);