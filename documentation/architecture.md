# 💣 BOMBERMAN-DOM - Complete Architecture Guide

**Project Timeline:** 7 Days  
**Team Size:** 4 People  
**Tech Stack:** Vanilla JavaScript + Mini-Framework (No external frameworks)  
**Architecture:** Client-Server with WebSocket communication  

---

## 📋 Table of Contents

1. [Team Structure & Roles](#team-structure--roles)
2. [Project File Structure](#project-file-structure)
3. [Day-by-Day Task Breakdown](#day-by-day-task-breakdown)
4. [Data Flow Architecture](#data-flow-architecture)
5. [WebSocket Message Protocol](#websocket-message-protocol)
6. [Integration Milestones](#integration-milestones)
7. [Success Criteria](#success-criteria)
8. [Critical Design Principles](#critical-design-principles)

---

## 👥 Team Structure & Roles

### 🟣 Integrator (Infrastructure Person)

**Primary Responsibility:** Build foundational infrastructure on Day 0 to unblock all other team members.

**Core Deliverables:**
- WebSocket wrapper library (`ws.js`)
- Frozen protocol definition (`shared/messages.js`)
- Fake data for parallel development (`shared/examples.js`)
- Framework verification and utilities

**Files Owned:**
- `shared/messages.js`
- `shared/gameConstants.js`
- `shared/mapGen.js`
- `shared/examples.js`
- `frontend/src/ws.js`
- `frontend/src/framework/` (verification only)

**Why This Role Exists:**
This person removes ALL dependencies for the other three team members. By completing infrastructure on Day 0, Server Guy, UI Guy, and Game Rendering Guy can work in parallel from Day 1 without blocking each other.

---

### 🟢 Server Guy (Game Authority)

**Primary Responsibility:** All server-side game logic, validation, and authority.

**Core Deliverables:**
- WebSocket server with connection handling
- Game loop running at 20 ticks per second (raise if responsiveness suffers)
- Movement validation and collision detection
- Bomb mechanics and explosion patterns
- Lives system and win condition detection
- Power-up spawning and effects

**Files Owned:**
- `backend/server.js`
- `backend/websocket/WebSocketServer.js`
- `backend/websocket/MessageHandler.js`
- `backend/game/GameManager.js`
- `backend/game/GameLoop.js`
- `backend/game/Map.js`
- `backend/game/Player.js`
- `backend/game/Bomb.js`
- `backend/game/PowerUp.js`

**Critical Principle:**
Server is ALWAYS authoritative. Clients send ACTIONS (intent), never state. Server validates everything and broadcasts state to all clients.

---

### 🔵 UI Guy (Screen Management)

**Primary Responsibility:** All UI screens EXCEPT the game rendering itself.

**Core Deliverables:**
- Nickname entry screen
- Lobby/waiting room with player list
- Ready-up system and countdown timer
- Chat panel with message history
- Game over screen with winner display
- Play again functionality

**Files Owned:**
- `frontend/src/ui/MenuScreen.js`
- `frontend/src/ui/LobbyScreen.js`
- `frontend/src/ui/ChatPanel.js`
- `frontend/src/ui/GameOverScreen.js`

**Why This Split:**
UI screens are a completely different context from real-time game rendering. They have different data flows, different update patterns, and different UX concerns.

---

### 🟡 Game Rendering Guy (Gameplay Visuals)

**Primary Responsibility:** Everything visible during active gameplay.

**Core Deliverables:**
- Static map rendering (15x15 grid)
- Player sprite rendering and animations
- Bomb and explosion visual effects
- Power-up sprite rendering
- Keyboard input handling
- HUD (lives counter, power-up indicators)
- 60 FPS rendering loop (client only)

**Files Owned:**
- `frontend/src/game/Renderer.js`
- `frontend/src/game/GameScreen.js`
- `frontend/src/game/InputHandler.js`
- `frontend/src/game/GameHUD.js`

**Why HUD is Here:**
The HUD updates in real-time during gameplay at 60 FPS. It's part of the same rendering context as the game itself.

---

## 📁 Project File Structure

```
bomberman-dom/
├── shared/                           # 🟣 Integrator - Day 0
│   ├── messages.js                   # Frozen protocol definition
│   ├── gameConstants.js              # Game constants (grid size, speeds, etc)
│   ├── mapGen.js                     # Map generation utilities
│   └── examples.js                   # Fake data for parallel development
│
├── backend/                          # 🟢 Server Guy
│   ├── server.js                     # Main server entry point
│   ├── websocket/
│   │   ├── WebSocketServer.js        # WebSocket connection management
│   │   └── MessageHandler.js         # Message routing and handling
│   └── game/
│       ├── GameManager.js            # Game state orchestration
│       ├── GameLoop.js               # 20 tick/s game loop
│       ├── Map.js                    # Map state and block management
│       ├── Player.js                 # Player entity and movement
│       ├── Bomb.js                   # Bomb placement and explosions
│       └── PowerUp.js                # Power-up spawning and effects
│
└── frontend/                         
    ├── public/
    │   └── index.html                # Main HTML file
    ├── styles/
    │   ├── main.css                  # Global styles
    │   ├── game.css                  # Game rendering styles
    │   ├── lobby.css                 # Lobby UI styles
    │   └── chat.css                  # Chat panel styles
    └── src/
        ├── framework/                # 🟣 Integrator verifies Day 0
        │   ├── dom.js                # DOM manipulation utilities
        │   ├── state.js              # State management
        │   ├── events.js             # Event handling
        │   └── router.js             # Screen routing
        │
        ├── ws.js                     # 🟣 Integrator - WebSocket wrapper
        │
        ├── ui/                       # 🔵 UI Guy
        │   ├── MenuScreen.js         # Nickname entry
        │   ├── LobbyScreen.js        # Waiting room
        │   ├── ChatPanel.js          # Chat functionality
        │   └── GameOverScreen.js     # Winner display
        │
        └── game/                     # 🟡 Game Rendering Guy
            ├── Renderer.js           # Main game renderer
            ├── GameScreen.js         # Game screen component
            ├── InputHandler.js       # Keyboard input
            └── GameHUD.js            # Lives, power-ups display
```

---

## 📅 Day-by-Day Task Breakdown

### Legend
- 🔴 **Critical Path** - Must be completed or project fails
- 🟠 **Blocks Others** - Other people are waiting on this
- 🟡 **Blocked** - Waiting on dependencies
- 🟢 **Independent** - Can work immediately

---

### Day 0 - INFRASTRUCTURE (Tonight)

#### 🟣 Integrator
1. **Build ws.js wrapper (connect, send, on*)** 🔴 CRITICAL
   - Dependencies: None
   - Creates the WebSocket abstraction layer
   - Must expose: `connect()`, `send()`, `onLobby()`, `onSnapshot()`, `onEnd()`

2. **Freeze protocol in shared/messages.js** 🔴 CRITICAL
   - Dependencies: None
   - Define ALL message types for the entire project
   - No changes allowed after Day 0

3. **Create fake data in shared/examples.js** 🔴 CRITICAL
   - Dependencies: None
   - Sample lobby states, game snapshots, player data
   - Allows UI Guy and Game Rendering Guy to work in parallel

4. **Verify mini-framework works** 🔴 CRITICAL
   - Dependencies: None
   - Ensure framework functions are accessible
   - Document any quirks or usage patterns

#### 🟢 Server Guy
- **Sketch server architecture** 🟢
  - Dependencies: None
  - Plan file structure and data flow

#### 🔵 UI Guy
- **Read protocol, plan lobby layout** 🟢
  - Dependencies: None
  - Design mockups for screens

#### 🟡 Game Rendering Guy
- **Read protocol, plan render structure** 🟢
  - Dependencies: None
  - Plan sprite rendering approach

---

### Day 1 - PARALLEL WORK BEGINS

#### 🟣 Integrator
1. **Push shared/ folder to repo** 🔴 CRITICAL
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Create fake data
     - Day 0: Integrator - Verify framework
   - This unblocks everyone else

2. **Help anyone blocked** 🟢
   - Dependencies: None

#### 🟢 Server Guy
1. **WebSocket server setup** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
   - Blocks: UI Guy lobby connection

2. **Basic lobby state (players list)** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
   - Blocks: UI Guy lobby UI

#### 🔵 UI Guy
1. **Nickname screen UI** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework

2. **Lobby screen layout (use fake data)** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 0: Integrator - Create fake data

#### 🟡 Game Rendering Guy
1. **Static map renderer (use fake data)** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 0: Integrator - Create fake data

2. **CSS Grid 15x15 layout** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework

---

### Day 2 - INTEGRATION CHECKPOINT

#### 🟣 Integrator
1. **Test UI Guy + Server Guy lobby connection** 🔴 CRITICAL
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Server Guy - Basic lobby state
     - Day 1: UI Guy - Lobby screen layout
   - First major integration test

2. **Test Game Rendering Guy + Server Guy snapshot flow** 🔴 CRITICAL
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Game Rendering Guy - Static map renderer
   - Verify game state broadcasting works

#### 🟢 Server Guy
1. **Lobby timer + ready logic** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Server Guy - Basic lobby state

2. **Game start transition** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Server Guy - Basic lobby state
     - Day 2: Server Guy - Lobby timer + ready logic
   - Blocks: Game Rendering Guy game start

#### 🔵 UI Guy
1. **Connect lobby to real server** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Server Guy - Basic lobby state
     - Day 1: UI Guy - Lobby screen layout

2. **Display player list from LOBBY msg** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Server Guy - Basic lobby state
     - Day 1: UI Guy - Lobby screen layout
     - Day 2: UI Guy - Connect lobby to real server

#### 🟡 Game Rendering Guy
1. **Player sprite rendering** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 0: Integrator - Create fake data
     - Day 1: Game Rendering Guy - Static map renderer

2. **Connect to server snapshots** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Game Rendering Guy - Static map renderer

---

### Day 3 - CORE GAMEPLAY

#### 🟣 Integrator
1. **Debug movement sync issues** 🟢
   - Dependencies: None

2. **Performance profiling** 🟢
   - Dependencies: None

#### 🟢 Server Guy
1. **Game loop 20 tick/s** 🔴 CRITICAL 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: Server Guy - Basic lobby state
     - Day 2: Server Guy - Lobby timer + ready logic
     - Day 2: Server Guy - Game start transition
   - Blocks: Game Rendering Guy realtime updates
   - This is the heart of the server

2. **Movement validation (WASD)** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 2: Server Guy - Game start transition
     - Day 3: Server Guy - Game loop 60 tick/s
   - Blocks: Game Rendering Guy input handler

3. **Wall collision detection** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 2: Server Guy - Game start transition
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 3: Server Guy - Movement validation

#### 🔵 UI Guy
1. **Chat panel UI** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: UI Guy - Lobby screen layout
     - Day 2: UI Guy - Connect lobby to real server

2. **Chat message sending** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 1: Server Guy - WebSocket server setup
     - Day 1: UI Guy - Lobby screen layout
     - Day 2: UI Guy - Connect lobby to real server
     - Day 3: UI Guy - Chat panel UI

#### 🟡 Game Rendering Guy
1. **Keyboard input handler** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: Game Rendering Guy - Static map renderer
     - Day 2: Game Rendering Guy - Connect to server snapshots

2. **Send MOVE messages to server** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 1: Server Guy - WebSocket server setup
     - Day 2: Game Rendering Guy - Connect to server snapshots
     - Day 3: Server Guy - Movement validation
     - Day 3: Game Rendering Guy - Keyboard input handler

3. **Real-time position updates** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 1: Game Rendering Guy - Static map renderer
     - Day 2: Game Rendering Guy - Player sprite rendering
     - Day 2: Game Rendering Guy - Connect to server snapshots
     - Day 3: Server Guy - Game loop 60 tick/s

---

### Day 4 - BOMBS & EXPLOSIONS

#### 🟣 Integrator
1. **Integration testing all features** 🟢
   - Dependencies: None

2. **Fix any blocking bugs** 🔴 CRITICAL
   - Dependencies: None

#### 🟢 Server Guy
1. **Bomb placement logic** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 2: Server Guy - Game start transition
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 3: Server Guy - Movement validation
   - Blocks: Game Rendering Guy bomb rendering

2. **3-second bomb timers** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 4: Server Guy - Bomb placement logic

3. **Explosion pattern calculation** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 4: Server Guy - Bomb placement logic
     - Day 4: Server Guy - 3-second bomb timers
   - Blocks: Game Rendering Guy explosion animation

4. **Destructible block removal** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 4: Server Guy - Explosion pattern calculation

#### 🔵 UI Guy
1. **Chat message display** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 3: UI Guy - Chat panel UI
     - Day 3: UI Guy - Chat message sending

2. **Countdown timer display** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: UI Guy - Lobby screen layout
     - Day 2: Server Guy - Lobby timer + ready logic

#### 🟡 Game Rendering Guy
1. **Bomb sprite rendering** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: Game Rendering Guy - Static map renderer
     - Day 2: Game Rendering Guy - Player sprite rendering
     - Day 3: Game Rendering Guy - Real-time position updates
     - Day 4: Server Guy - Bomb placement logic

2. **Explosion animation** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: Game Rendering Guy - Static map renderer
     - Day 3: Game Rendering Guy - Real-time position updates
     - Day 4: Server Guy - Explosion pattern calculation

3. **Send BOMB command on spacebar** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 3: Game Rendering Guy - Keyboard input handler
     - Day 4: Server Guy - Bomb placement logic

---

### Day 5 - COMBAT SYSTEM

#### 🟣 Integrator
1. **Cross-team debugging session** 🔴 CRITICAL
   - Dependencies: None
   - Dedicated time for fixing integration issues

2. **Performance optimization** 🟢
   - Dependencies: None

#### 🟢 Server Guy
1. **Lives system (3 lives/player)** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 4: Server Guy - Explosion pattern calculation
   - Blocks: Game Rendering Guy HUD lives counter

2. **Death detection from explosions** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 4: Server Guy - Explosion pattern calculation
     - Day 5: Server Guy - Lives system

3. **Respawn logic** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 4: Server Guy - Explosion pattern calculation
     - Day 5: Server Guy - Lives system
     - Day 5: Server Guy - Death detection

4. **Power-up spawn from blocks** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 4: Server Guy - Destructible block removal
   - Blocks: Game Rendering Guy power-up sprites

#### 🔵 UI Guy
1. **Start game over screen UI** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework

2. **Winner banner design** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 5: UI Guy - Start game over screen UI

#### 🟡 Game Rendering Guy
1. **HUD: Lives counter** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: Game Rendering Guy - Static map renderer
     - Day 3: Game Rendering Guy - Real-time position updates
     - Day 5: Server Guy - Lives system

2. **HUD: Power-up icons** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: Game Rendering Guy - Static map renderer

3. **Power-up sprite rendering** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 1: Game Rendering Guy - Static map renderer
     - Day 3: Game Rendering Guy - Real-time position updates
     - Day 5: Server Guy - Power-up spawn from blocks

4. **Death animation** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 2: Game Rendering Guy - Player sprite rendering
     - Day 3: Game Rendering Guy - Real-time position updates
     - Day 5: Server Guy - Death detection

---

### Day 6 - FEATURES & POLISH

#### 🟣 Integrator
1. **Final integration tests** 🔴 CRITICAL
   - Dependencies: None
   - Ensure everything works together

2. **Emergency bug fixes** 🟢
   - Dependencies: None

#### 🟢 Server Guy
1. **Power-up pickup detection** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 5: Server Guy - Power-up spawn from blocks

2. **Power-up effects (speed/bombs/range)** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 3: Server Guy - Movement validation
     - Day 4: Server Guy - Bomb placement logic
     - Day 5: Server Guy - Power-up spawn from blocks
     - Day 6: Server Guy - Power-up pickup detection

3. **Win condition detection** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 3: Server Guy - Game loop 60 tick/s
     - Day 5: Server Guy - Lives system
     - Day 5: Server Guy - Death detection
   - Blocks: UI Guy game over screen

4. **Send GAME_OVER message** 🟠 BLOCKS OTHERS
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 1: Server Guy - WebSocket server setup
     - Day 5: Server Guy - Lives system
     - Day 6: Server Guy - Win condition detection
   - Blocks: UI Guy game over screen

#### 🔵 UI Guy
1. **Game over screen completion** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 5: UI Guy - Start game over screen UI
     - Day 5: UI Guy - Winner banner design
     - Day 6: Server Guy - Win condition detection
     - Day 6: Server Guy - Send GAME_OVER message

2. **Display winner name** 🟡
   - Dependencies:
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 5: UI Guy - Winner banner design
     - Day 6: Server Guy - Send GAME_OVER message
     - Day 6: UI Guy - Game over screen completion

3. **Play again button** 🟡
   - Dependencies:
     - Day 0: Integrator - Build ws.js wrapper
     - Day 0: Integrator - Freeze protocol
     - Day 0: Integrator - Verify framework
     - Day 6: UI Guy - Game over screen completion

4. **UI animations & polish** 🟢
   - Dependencies: None

#### 🟡 Game Rendering Guy
1. **Power-up visual effects** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 5: Game Rendering Guy - Power-up sprite rendering
     - Day 6: Server Guy - Power-up effects

2. **Smooth movement interpolation** 🟡
   - Dependencies:
     - Day 0: Integrator - Verify framework
     - Day 3: Game Rendering Guy - Real-time position updates

3. **Client 60 FPS optimization** 🟢
   - Dependencies: None

4. **Explosion sound effects (optional)** 🟡
   - Dependencies:
     - Day 4: Game Rendering Guy - Explosion animation

---

### Day 7 - FINAL PUSH

#### 🟣 Integrator
1. **Full system test** 🔴 CRITICAL
   - Dependencies: None
   - End-to-end testing of all features

2. **Edge case fixes** 🔴 CRITICAL
   - Dependencies: None
   - Handle simultaneous actions, disconnections, etc.

3. **Deployment preparation** 🔴 CRITICAL
   - Dependencies: None
   - Build scripts, hosting setup, documentation

#### 🟢 Server Guy
1. **Server optimization** 🟢
   - Dependencies: None
   - Performance tuning for 20 tick/s (raise if needed)

2. **Handle disconnections** 🟢
   - Dependencies: None
   - Graceful handling of player disconnects

3. **Edge cases (simultaneous bombs, etc)** 🟢
   - Dependencies: None
   - Fix race conditions and edge cases

#### 🔵 UI Guy
1. **Final UI polish** 🟢
   - Dependencies: None
   - Visual refinements and animations

2. **Responsive layout fixes** 🟢
   - Dependencies: None
   - Ensure UI works on different screen sizes

3. **Cross-browser testing** 🟢
   - Dependencies: None
   - Test on Chrome, Firefox, Safari

#### 🟡 Game Rendering Guy
1. **Performance tuning** 🟢
   - Dependencies: None
   - Optimize rendering loop

2. **Visual polish** 🟢
   - Dependencies: None
   - Improve animations and effects

3. **Input lag fixes** 🟢
   - Dependencies: None
   - Minimize delay between input and visual feedback

---

## 🔄 Data Flow Architecture

### Overview
The architecture follows a **client-server model with authoritative server**:

1. **Client sends ACTIONS** (intent to move, place bomb, etc.)
2. **Server validates** and applies actions to game state
3. **Server broadcasts STATE** to all clients at 20 Hz (raise if needed)
4. **Clients render** whatever the server tells them

### Client-Side Flow

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Keyboard Input] → [InputHandler]                       │
│         ↓                                                 │
│  [Create Action]  → [WebSocket Client]                   │
│         ↓                                                 │
│  [Send to Server] ← uses ws.js wrapper                   │
│                                                           │
│  ═══════════════════════════════════════════════════     │
│                                                           │
│  [Receive State]  ← [WebSocket Client]                   │
│         ↓                                                 │
│  [Update Local]   → [Game State Object]                  │
│         ↓                                                 │
│  [Render Loop]    → [Renderer] → [DOM Update]            │
│                          ↓                                │
│                     [60 FPS Display]                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Server-Side Flow

```
┌─────────────────────────────────────────────────────────┐
│                   SERVER (Node.js)                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [WebSocket Server] ← [Receive Action from Client]       │
│         ↓                                                 │
│  [Message Handler] → [Route to Game Manager]             │
│         ↓                                                 │
│  [Validate Action] ← Check collisions, rules, etc.       │
│         ↓                                                 │
│  [Apply to State]  → [Game State (AUTHORITATIVE)]        │
│                                                           │
│  ═══════════════════════════════════════════════════     │
│                                                           │
│  [Game Loop - 20Hz] → [Update Physics/Timers]            │
│         ↓                                                 │
│  [Check Win Condition] → [Bomb Explosions]               │
│         ↓                                                 │
│  [Broadcast State] → [All Connected Clients]             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Server is Always Right**
   - Client never modifies game state locally
   - Client only renders what server tells it to render
   - No client-side prediction (keeps it simple)

2. **Actions Flow Up, State Flows Down**
   - Client sends: `{ type: 'MOVE', direction: 'UP' }`
   - Server responds: `{ type: 'GAME_STATE', players: [...], bombs: [...] }`

3. **20 Hz Updates**
   - Server game loop runs at 20 ticks per second (raise if needed)
   - State broadcast to all clients 20 times per second
   - Clients render at 60 FPS using latest snapshot

4. **WebSocket Wrapper Decouples Concerns**
   - UI Guy writes: `ws.onLobby(data => updateLobby(data))`
   - Game Rendering Guy writes: `ws.onSnapshot(data => render(data))`
   - No "WebSocket person" bottleneck

---

## 📨 WebSocket Message Protocol

### Client → Server Messages

#### JOIN
```javascript
{
  type: 'JOIN',
  playerName: string
}
```
**When:** Player enters nickname and joins lobby  
**Response:** CONNECTED message with playerId

---

#### READY
```javascript
{
  type: 'READY'
}
```
**When:** Player clicks "Ready" button in lobby  
**Response:** LOBBY_UPDATE with updated ready count

---

#### MOVE
```javascript
{
  type: 'MOVE',
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
}
```
**When:** Player presses arrow keys during gameplay  
**Response:** GAME_STATE with updated player position (validated by server)

---

#### BOMB
```javascript
{
  type: 'BOMB'
}
```
**When:** Player presses spacebar during gameplay  
**Response:** GAME_STATE with new bomb in bombs array (if allowed)

---

#### CHAT
```javascript
{
  type: 'CHAT',
  message: string
}
```
**When:** Player sends a chat message  
**Response:** CHAT_MESSAGE broadcast to all players

---

### Server → Client Messages

#### CONNECTED
```javascript
{
  type: 'CONNECTED',
  playerId: string,
  playerName: string
}
```
**When:** Server accepts player's JOIN request  
**Purpose:** Tell client their assigned ID

---

#### LOBBY_UPDATE
```javascript
{
  type: 'LOBBY_UPDATE',
  players: [
    { id: string, name: string, ready: boolean }
  ],
  readyCount: number,
  requiredPlayers: number
}
```
**When:** Player joins, leaves, or changes ready status  
**Purpose:** Keep lobby UI synchronized  
**Frequency:** On changes only

---

#### GAME_START
```javascript
{
  type: 'GAME_START',
  countdown: number // seconds until game begins
}
```
**When:** All players are ready  
**Purpose:** Trigger countdown UI  
**Frequency:** Once per game

---

#### GAME_STATE
```javascript
{
  type: 'GAME_STATE',
  tick: number,
  players: [
    {
      id: string,
      name: string,
      x: number,
      y: number,
      lives: number,
      powerups: {
        speed: number, // 1.0 = normal, 1.5 = 50% faster
        bombCount: number, // how many bombs player can place at once
        flameRange: number // explosion radius
      },
      isAlive: boolean
    }
  ],
  bombs: [
    {
      id: string,
      x: number,
      y: number,
      ticksRemaining: number, // 60 ticks = 3 seconds at 20Hz
      playerId: string
    }
  ],
  explosions: [
    {
      id: string,
      tiles: [{ x: number, y: number }],
      ticksRemaining: number // how long explosion stays visible
    }
  ],
  blocks: [
    {
      x: number,
      y: number,
      destructible: boolean
    }
  ],
  powerups: [
    {
      id: string,
      x: number,
      y: number,
      type: 'SPEED' | 'BOMB_COUNT' | 'FLAME_RANGE'
    }
  ]
}
```
**When:** Continuously during gameplay  
**Purpose:** Complete game state for rendering  
**Frequency:** 20 times per second

---

#### PLAYER_DIED
```javascript
{
  type: 'PLAYER_DIED',
  playerId: string,
  killedBy: string, // playerId of killer
  livesRemaining: number
}
```
**When:** Player hit by explosion and loses a life  
**Purpose:** Trigger death animation and respawn  
**Frequency:** On death only

---

#### GAME_OVER
```javascript
{
  type: 'GAME_OVER',
  winnerId: string,
  winnerName: string,
  finalStats: {
    [playerId: string]: {
      kills: number,
      deaths: number,
      blocksDestroyed: number
    }
  }
}
```
**When:** Only one player has lives remaining  
**Purpose:** Display winner and end game  
**Frequency:** Once per game

---

#### CHAT_MESSAGE
```javascript
{
  type: 'CHAT_MESSAGE',
  playerId: string,
  playerName: string,
  message: string,
  timestamp: number
}
```
**When:** Player sends chat message  
**Purpose:** Display message in chat panel  
**Frequency:** On message send

---

## 🎯 Integration Milestones

### Day 2 Checkpoint: Basic Connection
- ✅ Server running and accepting WebSocket connections
- ✅ Client can connect and receive player ID
- ✅ Lobby displays list of connected players
- ✅ Players can see each other join/leave

**Test:** Open 2+ browser windows, each should see the others in the lobby

---

### Day 3 Checkpoint: Game Start
- ✅ Players can click "Ready" button
- ✅ Countdown starts when all ready
- ✅ Map displays on all clients
- ✅ Players spawn in corners of map

**Test:** Ready up with 2+ players, game should start and show map

---

### Day 4 Checkpoint: Movement & Bombs
- ✅ Arrow keys move player
- ✅ Movement synchronized across all clients
- ✅ Spacebar places bomb
- ✅ Bomb explodes after 3 seconds

**Test:** Move around and place bombs, other clients should see same thing

---

### Day 5 Checkpoint: Combat
- ✅ Lives system working (3 lives per player)
- ✅ Explosions damage players
- ✅ Death detection and respawn
- ✅ Destructible blocks break and spawn power-ups

**Test:** Kill each other with bombs, verify lives decrease and respawn works

---

### Day 6 Checkpoint: Power-ups & Polish
- ✅ Power-ups spawn from broken blocks
- ✅ Pickup works and effects apply
- ✅ Winner detected when only one player alive
- ✅ Chat works during lobby and game

**Test:** Collect power-ups, verify effects. Play full game to winner.

---

### Day 7 Checkpoint: FINAL
- ✅ Game over screen displays winner
- ✅ Play again button returns to lobby
- ✅ 60 FPS stable on all clients (client render)
- ✅ All edge cases handled (disconnects, simultaneous bombs, etc.)

**Test:** Full end-to-end playthrough with 4 players, multiple rounds

---

## ✅ Success Criteria

### Core Gameplay
- [ ] 2-4 player multiplayer support
- [ ] Real-time synchronization (20 Hz, raise if needed)
- [ ] Movement works (WASD or arrow keys)
- [ ] Bomb placement works (spacebar)
- [ ] Lives system (3 lives per player)
- [ ] Winner detection (last player standing)

### Features
- [ ] Power-ups spawn from blocks:
  - Speed boost
  - Extra bomb capacity
  - Increased flame range
- [ ] In-game chat panel
- [ ] Destructible walls
- [ ] Game over screen with winner display
- [ ] Play again functionality

### Technical Requirements
- [ ] Mini-framework used (no external frameworks)
- [ ] Server validates all actions (authoritative)
- [ ] 60 FPS performance on client
- [ ] WebSocket communication
- [ ] No localStorage/sessionStorage (not supported in artifact environment)

### Polish (Nice to Have)
- [ ] Smooth animations for explosions
- [ ] Visual feedback for power-up pickups
- [ ] Sound effects for bombs/explosions
- [ ] Countdown timer before game start
- [ ] Player colors/skins

---

## 🧠 Critical Design Principles

### 1. Infrastructure First
**Why Day 0 matters:**
- WebSocket wrapper eliminates bottleneck
- Frozen protocol prevents integration hell
- Fake data enables parallel work
- Framework verification catches issues early

**Without this:** Days 1-2 wasted on "waiting for X to finish"

---

### 2. No "WebSocket Person"
**Bad approach:** One person owns all WebSocket code
**Problem:** Everyone waits on them

**Good approach:** 
```javascript
// Integrator builds this once (Day 0):
// ws.js
export function onLobby(handler) { ... }
export function onSnapshot(handler) { ... }

// Then UI Guy writes this:
import { onLobby } from '../ws.js';
onLobby(data => updateLobby(data));

// And Game Rendering Guy writes this:
import { onSnapshot } from '../ws.js';
onSnapshot(data => render(data));
```

No dependencies! Everyone works in parallel!

---

### 3. Split by Context, Not Technology
**Bad split:** "Frontend Person 1" and "Frontend Person 2"
**Problem:** What does each person own? Overlap and confusion.

**Good split:** "UI Guy" (lobby/chat/end) and "Game Rendering Guy" (gameplay visuals)
**Why:** Completely different contexts with different update patterns

---

### 4. Server is Authoritative
**Client never does:**
```javascript
// ❌ BAD - Client modifying state
player.x += 1;
if (checkCollision(player)) {
  player.x -= 1;
}
```

**Client always does:**
```javascript
// ✅ GOOD - Client sending intent
ws.send({ type: 'MOVE', direction: 'RIGHT' });

// Then renders whatever server says
ws.onSnapshot(data => {
  renderPlayers(data.players); // Server's truth
});
```

**Why:** Eliminates desync and cheating. Server validates everything.

---

### 5. No Local Prediction
**Many multiplayer games do:**
- Client predicts movement locally
- Server confirms/corrects later
- Requires reconciliation logic

**We don't do this because:**
- Only 7 days to build
- Reconciliation is complex
- 20 Hz updates are fast enough (raise if needed)
- Keeps code simple

**Result:** Slight input lag, but rock-solid synchronization

---

### 6. Dependency Chain Awareness
**Critical path tasks:**
- Day 0: All Integrator tasks
- Day 3: Server Guy's game loop
- Day 6: Server Guy's win condition

**If these slip, project fails.**

**Non-critical tasks:**
- Chat (nice to have, but not core)
- Sound effects (optional)
- Visual polish (can be done last day)

**Strategy:** Focus on critical path first, add polish if time permits

---

### 7. Integration Checkpoints
**Don't wait until Day 7 to integrate!**

**Schedule:**
- Day 2: First integration (lobby + map display)
- Day 4: Second integration (movement + bombs)
- Day 6: Third integration (full gameplay)

**Each checkpoint:**
- Stop feature work
- Everyone tests together
- Fix blocking bugs immediately
- Resume parallel work

**Why:** Catch integration issues early when they're cheap to fix

---

## 🚀 Getting Started Checklist

### Tonight (Day 0) - Integrator's Critical Tasks

- [ ] Create `shared/messages.js` with all message type definitions
- [ ] Create `shared/gameConstants.js` with grid size, speeds, etc.
- [ ] Create `shared/examples.js` with fake lobby and game data
- [ ] Create `frontend/src/ws.js` WebSocket wrapper library
- [ ] Verify mini-framework works and document usage
- [ ] Push all shared code to repository
- [ ] Notify team that infrastructure is ready

### Day 1 Morning - Everyone Else

- [ ] **Server Guy:** Pull shared/ folder, start WebSocket server
- [ ] **UI Guy:** Pull shared/ folder, start building lobby with fake data
- [ ] **Game Rendering Guy:** Pull shared/ folder, start map renderer with fake data

### Communication Protocol

**Daily standup (15 min max):**
- What did you complete yesterday?
- What are you working on today?
- Are you blocked on anything?

**Integrator's job:** Unblock people immediately

**Blocking bug policy:** Drop everything, fix it together

---

## 📚 Additional Resources

### WebSocket Wrapper Example (ws.js)
```javascript
let ws = null;
const handlers = {};

export function connect(url) {
  ws = new WebSocket(url);
  
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const handler = handlers[msg.type];
    if (handler) handler(msg);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket closed');
    // Optional: Implement reconnection logic
  };
}

export function send(data) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

export function onLobby(handler) {
  handlers['LOBBY_UPDATE'] = handler;
}

export function onSnapshot(handler) {
  handlers['GAME_STATE'] = handler;
}

export function onGameStart(handler) {
  handlers['GAME_START'] = handler;
}

export function onGameOver(handler) {
  handlers['GAME_OVER'] = handler;
}

export function onChat(handler) {
  handlers['CHAT_MESSAGE'] = handler;
}
```

### Game Constants Example
```javascript
export const GRID_SIZE = 15;
export const TILE_SIZE = 40; // pixels
export const PLAYER_SPEED = 2; // tiles per second
export const BOMB_TIMER = 3; // seconds
export const EXPLOSION_DURATION = 0.5; // seconds
export const LIVES_PER_PLAYER = 3;
export const TICK_RATE = 20; // Hz (raise if needed)

export const POWER_UP_TYPES = {
  SPEED: 'SPEED',
  BOMB_COUNT: 'BOMB_COUNT',
  FLAME_RANGE: 'FLAME_RANGE'
};

export const SPAWN_POSITIONS = [
  { x: 0, y: 0 }, // Top-left
  { x: 14, y: 0 }, // Top-right
  { x: 0, y: 14 }, // Bottom-left
  { x: 14, y: 14 } // Bottom-right
];
```

---

## ⚠️ Common Pitfalls to Avoid

### 1. Changing the Protocol After Day 0
**Problem:** Everyone has to update their code  
**Solution:** Freeze protocol on Day 0, no exceptions

### 2. Client-Side State Management
**Problem:** State gets out of sync with server  
**Solution:** Client only stores what server sends, never modifies

### 3. Working in Isolation Too Long
**Problem:** Integration hell on Day 7  
**Solution:** Daily integration checkpoints starting Day 2

### 4. Perfectionism
**Problem:** Spending 2 days on bomb animations  
**Solution:** Get it working first, polish later if time permits

### 5. Ignoring Performance Until Day 7
**Problem:** Discovering 20 FPS bottleneck at the end  
**Solution:** Profile performance on Day 3, optimize early

### 6. Using localStorage in Artifacts
**Problem:** localStorage doesn't work in Claude artifact environment  
**Solution:** Use in-memory state only (already designed this way)

---

## 🎓 Final Words

This is an **aggressive** 7-day timeline. Success depends on:

1. **Day 0 infrastructure** being rock-solid
2. **Parallel work** from Day 1 onwards
3. **Early integration** starting Day 2
4. **Clear ownership** of files and responsibilities
5. **Ruthless prioritization** of core features over polish

The architecture is designed to **minimize dependencies** and **maximize parallel work**. Trust the structure, stick to your role, and help each other when blocked.

**You've got this. Build something awesome.** 💣🎮

---

*Last updated: Day 0 - Ready to deploy*
