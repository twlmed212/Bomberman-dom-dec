# Protocol (Team Guide)

This is the full WebSocket protocol guide for Bomberman DOM.
It is intentionally very detailed and example-heavy so nobody has to guess.

If you only read one line: the server is the judge, the client only asks.

---

## 0) Why This Exists

We are building multiplayer. Multiplayer breaks if people guess or improvise.
This document is the contract. If we change the contract, we update this file.

This protocol is designed to be:
- simple for frontend
- strict for backend
- predictable for teammates
- safe against cheating

---

## 1) Core Rules (Toddler Version)

Think of a board game with a referee.
- Players say what they want to do.
- Referee checks if it is allowed.
- Referee tells everyone the result.

Client = player.
Server = referee.

Client never tells the server where it is.
Client only says: "I want to move UP."
Server says: "You are now at (x, y)."

---

## 2) Message Basics

Every message is a JSON object with a `type` string.
No `type` = invalid message.

Example:
```js
{ type: "JOIN", playerName: "Alice" }
```

Do not add extra fields unless agreed by the team.
Do not rename fields without updating this file.

---

## 3) Protocol Files in Code

We keep the canonical list of message types here:
- `shared/messages/clientToServer.js`
- `shared/messages/serverToClient.js`

We keep human-readable shapes and comments here:
- `shared/messages/clientToServerShapes.js`
- `shared/messages/serverToClientShapes.js`

Backend and frontend import the constants.
Humans read the shapes.

---

## 4) Client -> Server Messages (Actions)

The client is only allowed to send these actions:
- JOIN
- READY
- MOVE
- BOMB
- CHAT

All other types are ignored.

### 4.1 JOIN
Client says: "Let me in, my name is X."

Shape:
```js
{ type: "JOIN", playerName: "Alice" }
```

Notes:
- `playerName` is a plain string.
- Backend must sanitize (trim, limit length, remove bad chars).

Flow example:
1) Client sends JOIN.
2) Server sends CONNECTED.
3) Server sends LOBBY_UPDATE to all.

---

### 4.2 READY
Client says: "I am ready" or toggles ready.

Shape:
```js
{ type: "READY" }
```

Notes:
- No payload needed.
- Server flips the ready state for that player.

Flow example:
1) Client sends READY.
2) Server updates player ready state.
3) Server broadcasts LOBBY_UPDATE.
4) If requirements met, server sends GAME_START.

---

### 4.3 MOVE
Client says: "I want to move in a direction."

Shape:
```js
{ type: "MOVE", direction: "UP" }
```

Allowed directions:
- "UP"
- "DOWN"
- "LEFT"
- "RIGHT"

Notes:
- Client never sends x/y coordinates.
- Server checks walls, blocks, bombs, bounds.
- Server updates player position in its own state.

Flow example:
1) Client sends MOVE.
2) Server validates.
3) Server updates player in game state.
4) Server broadcasts GAME_STATE on next tick (20Hz for now).

---

### 4.4 BOMB
Client says: "I want to place a bomb."

Shape:
```js
{ type: "BOMB" }
```

Notes:
- Server checks bomb limits and cooldown.
- Server places bomb at player position in its state.
- Server sets bomb timer (ticksRemaining = 60 for 3s at 20Hz).

Flow example:
1) Client sends BOMB.
2) Server validates.
3) Server adds bomb to state.
4) Server broadcasts GAME_STATE on next tick.

---

### 4.5 CHAT
Client says: "I want to chat."

Shape:
```js
{ type: "CHAT", message: "gg" }
```

Notes:
- Server should trim, limit length, and strip harmful content.
- Server broadcasts CHAT_MESSAGE to all.

Flow example:
1) Client sends CHAT.
2) Server broadcasts CHAT_MESSAGE to all.

---

## 5) Server -> Client Messages (Truth)

These messages are authoritative. The client renders based on them.

### 5.1 CONNECTED
Server says: "You are connected and here is your id."

Shape:
```js
{ type: "CONNECTED", playerId: "p1", playerName: "Alice" }
```

Notes:
- `playerId` is used by the client to identify itself in GAME_STATE.

---

### 5.2 LOBBY_UPDATE
Server says: "Here is the lobby state right now."

Shape:
```js
{
  type: "LOBBY_UPDATE",
  players: [
    { id: "p1", name: "Alice", ready: true },
    { id: "p2", name: "Bob", ready: false }
  ],
  readyCount: 1,
  requiredPlayers: 4
}
```

Notes:
- `requiredPlayers` is the threshold to start (2 or 4).
- Lobby view uses this to render player list and ready count.

---

### 5.3 GAME_START
Server says: "Game starts in N seconds."

Shape:
```js
{ type: "GAME_START", countdown: 10 }
```

Notes:
- Client should show countdown UI.
- Client should disable lobby interactions when countdown begins.

---

### 5.4 GAME_STATE
Server says: "This is the entire world right now."

Shape:
```js
{
  type: "GAME_STATE",
  tick: 120,
  players: [
    {
      id: "p1",
      name: "Alice",
      x: 1,
      y: 1,
      lives: 3,
      powerups: { speed: 1, bombCount: 1, flameRange: 1 },
      isAlive: true
    }
  ],
  bombs: [
    { id: "b1", x: 2, y: 1, ticksRemaining: 180, playerId: "p1" }
  ],
  explosions: [
    { id: "e1", tiles: [{ x: 2, y: 1 }], ticksRemaining: 10 }
  ],
  blocks: [
    { x: 3, y: 3, destructible: true }
  ],
  powerups: [
    { id: "u1", x: 4, y: 4, type: "SPEED" }
  ]
}
```

Notes:
- This message is broadcast at 20Hz during gameplay.
- Client should render all entities based on this.
- Client should not “predict” or correct server positions.

---

### 5.5 PLAYER_DIED
Server says: "A player lost a life."

Shape:
```js
{ type: "PLAYER_DIED", playerId: "p2", killedBy: "p1", livesRemaining: 2 }
```

Notes:
- Client can show death animation, life count update, etc.
- Death and respawn still driven by subsequent GAME_STATE.

---

### 5.6 GAME_OVER
Server says: "Game is finished."

Shape:
```js
{
  type: "GAME_OVER",
  winnerId: "p1",
  winnerName: "Alice",
  finalStats: {
    p1: { kills: 2, deaths: 1, blocksDestroyed: 5 }
  }
}
```

Notes:
- Client shows game over screen.
- If play-again exists, client returns to lobby.

---

### 5.7 CHAT_MESSAGE
Server says: "Here is the chat message."

Shape:
```js
{ type: "CHAT_MESSAGE", playerId: "p1", playerName: "Alice", message: "gg", timestamp: 1700000000000 }
```

Notes:
- Client appends to chat log.

---

## 6) Backend Implementation Guide

### 6.1 Required Validations
- JOIN:
  - limit name length (e.g., 16)
  - trim whitespace
  - reject empty string
- READY:
  - ignore if player not in lobby
- MOVE:
  - ignore if player not alive
  - check map collisions
  - check bounds
- BOMB:
  - ignore if player not alive
  - check bombCount limit
  - check cell not blocked
- CHAT:
  - limit message length (e.g., 140)
  - strip or escape unsafe chars

### 6.2 Game Loop Rules
- Tick at 20Hz (can be increased later if responsiveness suffers).
- Each tick:
  - update movement
  - reduce bomb timers
  - trigger explosions
  - apply damage
  - update powerups
  - broadcast GAME_STATE

### 6.3 Lobby Rules
- Maintain list of players and ready states.
- When player joins/leaves/ready changes, send LOBBY_UPDATE.
- When requirements met:
  - start countdown
  - send GAME_START
  - start game after countdown

---

## 7) Frontend Implementation Guide

### 7.1 General Rule
- Do not store “truth.”
- Always render from GAME_STATE.

### 7.2 Input Handling
- Keypress -> send MOVE or BOMB.
- Do not move locally first.

### 7.3 Rendering
- Use existing DOM nodes and update them.
- Avoid destroying and recreating nodes every tick.
- Only re-render changed positions.

---

## 8) Pitfalls To Avoid

1) Client sends state.
Bad:
```js
{ type: "MOVE", x: 5, y: 6 }
```
Good:
```js
{ type: "MOVE", direction: "UP" }
```

2) Changing the protocol without updating docs.
If you change a field, update this file immediately.

3) Client-side prediction too early.
It makes debugging harder. Start simple.

4) Multiple sources of truth.
Only server state matters.

5) Over-optimizing before you measure.
Profile first, optimize second.

---

## 9) Example Flows (End-to-End)

### 9.1 Join Flow
Client -> Server:
```js
{ type: "JOIN", playerName: "Alice" }
```
Server -> Client:
```js
{ type: "CONNECTED", playerId: "p1", playerName: "Alice" }
{ type: "LOBBY_UPDATE", players: [{ id: "p1", name: "Alice", ready: false }], readyCount: 0, requiredPlayers: 4 }
```

### 9.2 Ready Flow
Client -> Server:
```js
{ type: "READY" }
```
Server -> Client:
```js
{ type: "LOBBY_UPDATE", players: [{ id: "p1", name: "Alice", ready: true }], readyCount: 1, requiredPlayers: 4 }
```

### 9.3 Start Game Flow
Server -> Client:
```js
{ type: "GAME_START", countdown: 10 }
```
After countdown:
```js
{ type: "GAME_STATE", tick: 0, players: [...], bombs: [], explosions: [], blocks: [...], powerups: [] }
```

### 9.4 Move Flow
Client -> Server:
```js
{ type: "MOVE", direction: "LEFT" }
```
Server -> Client:
```js
{ type: "GAME_STATE", tick: 120, players: [...], bombs: [...], explosions: [...], blocks: [...], powerups: [...] }
```

### 9.5 Bomb Flow
Client -> Server:
```js
{ type: "BOMB" }
```
Server -> Client:
```js
{ type: "GAME_STATE", tick: 121, bombs: [{ id: "b1", x: 2, y: 1, ticksRemaining: 180, playerId: "p1" }], ... }
```

### 9.6 Chat Flow
Client -> Server:
```js
{ type: "CHAT", message: "gg" }
```
Server -> Client:
```js
{ type: "CHAT_MESSAGE", playerId: "p1", playerName: "Alice", message: "gg", timestamp: 1700000000000 }
```

---

## 10) Final Reminder

If you are unsure, do not guess. Ask the team and update this file.
This is how we keep multiplayer stable and predictable.
