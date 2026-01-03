```
erson 2A: Network & Lobby
Files:

server.js - Main entry point
WebSocketServer.js - WebSocket setup
MessageHandler.js - Handle incoming messages
LobbyManager.js - Lobby state, player ready, countdown

Tasks:

Setup WebSocket server (listen on port)
Handle client connections/disconnections
Process messages: JOIN, CHAT, READY
Send messages: CONNECTED, LOBBY_UPDATE, CHAT_MESSAGE
Start game countdown when 2-4 players ready
Send GAME_START message

Interfaces with:

Client (via WebSocket)
Person 2B (calls GameManager.startGame())


Person 2B: Game Logic
Files:

GameManager.js - Manages active games
GameLoop.js - 60 tick/sec loop
Map.js - Map generation, collision
Player.js - Player state, movement
Bomb.js - Bomb placement, explosion
PowerUp.js - Power-ups (if time)

Tasks:

Create game instance with 15x15 map
Run game loop 60 times/sec
Process MOVE commands (validate, update position)
Process BOMB commands (place bomb, timer)
Calculate explosions (3s after bomb placed)
Check player deaths (lives system)
Detect winner (last player alive)
Send GAME_STATE every tick
Send GAME_OVER when winner

Interfaces with:

Person 2A (receives game events)


Split reasoning:
2A = Communication layer

Handles "who's connected"
Lobby is simpler (just tracking players)
Can start while 2B works on game logic

2B = Game rules

Complex logic (movement, bombs, explosions)
Can test independently with mock inputs
No networking complexity


Shared interface between them:
javascript// 2A calls this when game should start:
GameManager.startGame(players[])

// 2B provides these callbacks:
GameManager.onGameState((data) => {
  // 2A broadcasts to all clients
})

GameManager.onGameOver((data) => {
  // 2A sends GAME_OVER, returns to lobby
})

Dependencies:
Day 1-2:

Both can start in parallel
2A: Basic WebSocket
2B: Map generation, Player class

Day 3:

2A: Lobby working
2B: Movement working
Integration: Can start game

Day 4-6:

2B keeps adding features (bombs, explosions, lives)
2A just broadcasts game state


This good?

```