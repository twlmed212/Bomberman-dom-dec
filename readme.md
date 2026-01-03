# Bomberman DOM

A multiplayer Bomberman game built with vanilla JavaScript and a custom mini-framework.

## About

Classic Bomberman gameplay in your browser. Battle against 2-4 players in real-time. Place bombs, collect power-ups, and be the last one standing!

## How to Play

### Starting the Game

1. Run the servers:
   
bash
   node ./backend/server.js
   
2. Run the Front:
   
bash
   python3 -m http.server
   
3. Open your browser:
   

   http://localhost:5500/frontend/public/index.html
   
3. Enter your nickname and join the lobby

4. Wait for other players (2-4 players total)

5. Game starts automatically when ready

### Controls

- **Arrow Keys** or **WASD** - Move your player
- **Spacebar** - Place a bomb

### Game Rules

- Each player starts with **3 lives**
- Bombs explode after 3 seconds
- Avoid explosions or lose a life
- Destroy blocks to find power-ups
- Last player alive wins!

### Power-ups

- **Bomb** - Place more bombs at once
- **Flame** - Bigger explosion range
- **Speed** - Move faster

### Chat

Use the chat panel to communicate with other players during the game.

## Technical Details

- **Backend**: Node.js with WebSocket (port 8080)
- **Frontend**: Vanilla JavaScript with custom framework (port 5173)
- **Rendering**: 60 FPS using requestAnimationFrame
- **Architecture**: Server-authoritative multiplayer

## Requirements

- Node.js
- Python 3 (for serving frontend files)

---

Good luck and have fun!
# Bomberman DOM

A multiplayer Bomberman game built with vanilla JavaScript and a custom mini-framework.

## About
Expand
README.md
2 KB
﻿
TwlMed212
twlmed212
 
 
 
# Bomberman DOM

A multiplayer Bomberman game built with vanilla JavaScript and a custom mini-framework.

## About

Classic Bomberman gameplay in your browser. Battle against 2-4 players in real-time. Place bombs, collect power-ups, and be the last one standing!

## How to Play

### Starting the Game

1. Run the servers:
   ```bash
   node ./backend/server.js
   ```

2. Run the Front:
   ```bash
   python3 -m http.server
   ```

3. Open your browser:
   ```
   http://localhost:5500/frontend/public/index.html
   ```

3. Enter your nickname and join the lobby

4. Wait for other players (2-4 players total)

5. Game starts automatically when ready

### Controls

- **Arrow Keys** or **WASD** - Move your player
- **Spacebar** - Place a bomb

### Game Rules

- Each player starts with **3 lives**
- Bombs explode after 3 seconds
- Avoid explosions or lose a life
- Destroy blocks to find power-ups
- Last player alive wins!

### Power-ups

- **Bomb** - Place more bombs at once
- **Flame** - Bigger explosion range
- **Speed** - Move faster

### Chat

Use the chat panel to communicate with other players during the game.

## Technical Details

- **Backend**: Node.js with WebSocket (port 8080)
- **Frontend**: Vanilla JavaScript with custom framework (port 5173)
- **Rendering**: 60 FPS using requestAnimationFrame
- **Architecture**: Server-authoritative multiplayer

## Requirements

- Node.js
- Python 3 (for serving frontend files)
