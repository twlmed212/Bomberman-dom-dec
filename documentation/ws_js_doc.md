# ws.js Guide (Toddler-Level + Rich Examples)

This document explains `frontend/src/ws.js` in baby-simple words with many examples.
If you are confused, read this top to bottom and you will get it.

---

## 1) What is ws.js?

`ws.js` is a tiny helper around WebSocket.
It does two simple things:
1) opens a WebSocket connection
2) lets you listen to messages by type

Think of it like a mailman:
- The server sends envelopes.
- Each envelope has a label (the `type`).
- ws.js opens the mailbox and gives each envelope to the right person.

---

## 2) The Five Big Ideas

1) There is only ONE socket.
2) Messages are JSON with a `type`.
3) We store listeners by type.
4) When a message arrives, we call all listeners for that type.
5) We provide tiny helper functions to make this easy.

---

## 3) The Main Functions (What You Actually Use)

### 3.1 connect(url)
Open the connection.

Example:
```js
import { connect } from "./ws.js";

connect("ws://localhost:8080");
```

What happens:
- The socket opens.
- The app can now send and receive messages.

---

### 3.2 send(type, payload)
Send a message to the server.

Example:
```js
import { send } from "./ws.js";

send("JOIN", { playerName: "Alice" });
```

This sends:
```json
{ "type": "JOIN", "playerName": "Alice" }
```

Another example:
```js
send("MOVE", { direction: "UP" });
```

---

### 3.3 on(type, handler)
Listen for a specific message type.

Example:
```js
import { on } from "./ws.js";

on("CHAT_MESSAGE", (msg) => {
  console.log("Chat:", msg.message);
});
```

If the server sends:
```json
{ "type": "CHAT_MESSAGE", "message": "gg" }
```
Then your handler runs and prints "gg".

---

### 3.4 onLobby(handler)
Shortcut for `LOBBY_UPDATE`.

Example:
```js
import { onLobby } from "./ws.js";

onLobby((msg) => {
  console.log("Players:", msg.players);
});
```

---

### 3.5 onSnapshot(handler)
Shortcut for `GAME_STATE`.

Example:
```js
import { onSnapshot } from "./ws.js";

onSnapshot((state) => {
  console.log("Tick:", state.tick);
});
```

---

### 3.6 onEnd(handler)
Shortcut for `GAME_OVER`.

Example:
```js
import { onEnd } from "./ws.js";

onEnd((msg) => {
  console.log("Winner:", msg.winnerName);
});
```

---

### 3.7 onOpen / onClose / onError
Listen to socket lifecycle events.

Example:
```js
import { onOpen, onClose, onError } from "./ws.js";

onOpen(() => console.log("connected"));
onClose(() => console.log("disconnected"));
onError((e) => console.log("socket error", e));
```

---

## 4) How ws.js Routes Messages (Visual)

Incoming server message:
```json
{ "type": "LOBBY_UPDATE", "players": [...] }
```

Flow:
1) ws.js parses JSON
2) ws.js reads `type = "LOBBY_UPDATE"`
3) ws.js finds every listener for that type
4) ws.js calls all of them

---

## 5) What The Internal Storage Looks Like (Simple)

Imagine this table:

```
"LOBBY_UPDATE" -> [fn1, fn2]
"GAME_STATE"   -> [fn3]
"CHAT_MESSAGE" -> [fn4, fn5]
```

When `GAME_STATE` arrives, only `fn3` is called.
When `CHAT_MESSAGE` arrives, `fn4` and `fn5` are called.

---

## 6) Examples by Feature

### 6.1 Join Flow
```js
connect("ws://localhost:8080");

onOpen(() => {
  send("JOIN", { playerName: "Alice" });
});
```

### 6.2 Lobby UI
```js
onLobby((msg) => {
  renderLobby(msg.players, msg.readyCount);
});
```

### 6.3 Game Rendering
```js
onSnapshot((state) => {
  renderPlayers(state.players);
  renderBombs(state.bombs);
  renderExplosions(state.explosions);
});
```

### 6.4 Chat Panel
```js
on("CHAT_MESSAGE", (msg) => {
  appendChat(msg.playerName, msg.message);
});

function sendChat(text) {
  send("CHAT", { message: text });
}
```

### 6.5 Game Over Screen
```js
onEnd((msg) => {
  showGameOver(msg.winnerName);
});
```

---

## 7) The "Unsubscribe" Function

`on(type, handler)` returns a function that removes that listener.
You only need this if you want to stop listening later.

Example:
```js
const stop = on("GAME_STATE", (state) => {
  console.log(state.tick);
});

// Later
stop();
```

---

## 8) Common Questions

### Q: Do I need to use on("*")?
A: No. It is optional. It listens to ALL messages.

### Q: Do I need Map/Set knowledge?
A: No. Just use onLobby/onSnapshot/send and ignore the rest.

### Q: Can I add my own message types?
A: Only if you update the protocol in `shared/messages/` and `protocol.md`.

---

## 9) Minimal Copy/Paste Usage

```js
import {
  connect,
  send,
  onOpen,
  onLobby,
  onSnapshot,
  onEnd
} from "./ws.js";

connect("ws://localhost:8080");

onOpen(() => {
  send("JOIN", { playerName: "Alice" });
});

onLobby((msg) => {
  console.log("Lobby players:", msg.players);
});

onSnapshot((state) => {
  console.log("Tick:", state.tick);
});

onEnd((msg) => {
  console.log("Winner:", msg.winnerName);
});
```

---

## 10) If You Are Still Confused

Ignore everything except:
- `connect(url)`
- `send(type, payload)`
- `onLobby(handler)`
- `onSnapshot(handler)`
- `onEnd(handler)`

That is enough to build the whole game.

---

## 11) Visual Diagram (Simple Flow)

```
Client                     ws.js                     Server
  |                          |                          |
  | connect(url)             |                          |
  |------------------------->|  opens WebSocket         |
  |                          |------------------------->|
  |                          |                          |
  | send("JOIN", {...})      |                          |
  |------------------------->|  JSON.stringify          |
  |                          |------------------------->|
  |                          |                          |
  |                          |  { type: "CONNECTED" }   |
  |                          |<-------------------------|
  |                          |  parse + dispatch        |
  | on("CONNECTED", fn)      |                          |
  | fn(message)              |                          |
  |                          |                          |
  |                          |  { type: "LOBBY_UPDATE"} |
  |                          |<-------------------------|
  | onLobby(fn)              |                          |
  | fn(message)              |                          |
```

---

## 12) Common Bugs and How to Avoid Them

1) **Trying to send before connect**
   - Symptom: `send()` returns false, nothing happens.
   - Fix: call `connect()` first, then `onOpen(() => send(...))`.

2) **Forgetting to include `type`**
   - Symptom: server ignores your message.
   - Fix: always send `{ type: "SOMETHING", ... }`.

3) **Listening to the wrong message type**
   - Symptom: your handler never runs.
   - Fix: check the exact string in `shared/messages/serverToClient.js`.

4) **Using lowercase types**
   - Symptom: nothing happens.
   - Fix: types are uppercase by design (`MOVE`, not `move`).

5) **Parsing errors**
   - Symptom: no handlers called.
   - Fix: make sure server sends valid JSON.

6) **Multiple connect calls without closing**
   - Symptom: you see duplicate messages.
   - Fix: only call `connect()` once unless you intentionally reconnect.

7) **Client tries to set positions**
   - Symptom: server ignores updates or state feels wrong.
   - Fix: only send intent (`MOVE`, `BOMB`). Server decides positions.

---

## 13) Glossary (Tiny Dictionary)

- **socket**: the live WebSocket connection.
- **handler**: a function that runs when a message arrives.
- **message type**: the string in `message.type`, like `"GAME_STATE"`.
- **dispatch**: the act of calling the right handlers for a message.
- **listener**: same as handler.
- **payload**: the data inside a message.

---

## 14) First Connection Walkthrough (Step by Step)

1) Connect to the server:
```js
connect("ws://localhost:8080");
```

2) When the socket opens, send JOIN:
```js
onOpen(() => {
  send("JOIN", { playerName: "Alice" });
});
```

3) Listen to lobby updates:
```js
onLobby((msg) => {
  console.log("Players:", msg.players);
});
```

4) When the server starts the game:
```js
on("GAME_START", (msg) => {
  console.log("Game starts in", msg.countdown);
});
```

5) Render game snapshots:
```js
onSnapshot((state) => {
  console.log("Tick:", state.tick);
});
```

---

## 15) Minimal Backend Stub (Speaks the Protocol)

This is not production code. It is a teaching stub.

```js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let players = [];

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    if (msg.type === "JOIN") {
      const player = { id: `p${players.length + 1}`, name: msg.playerName, ready: false };
      players.push(player);
      ws.send(JSON.stringify({ type: "CONNECTED", playerId: player.id, playerName: player.name }));
      broadcast({ type: "LOBBY_UPDATE", players, readyCount: countReady(players), requiredPlayers: 4 });
    }

    if (msg.type === "READY") {
      const player = players[0];
      if (player) player.ready = !player.ready;
      broadcast({ type: "LOBBY_UPDATE", players, readyCount: countReady(players), requiredPlayers: 4 });
    }
  });
});

function broadcast(payload) {
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => client.send(data));
}

function countReady(list) {
  return list.filter((p) => p.ready).length;
}
```

---

## 16) Minimal Frontend Usage (Lobby + Game)

```js
import { connect, send, onOpen, onLobby, onSnapshot } from "./ws.js";

connect("ws://localhost:8080");

onOpen(() => {
  send("JOIN", { playerName: "Alice" });
});

onLobby((msg) => {
  // Render lobby list
  renderLobby(msg.players);
});

onSnapshot((state) => {
  // Render the game
  renderPlayers(state.players);
  renderBombs(state.bombs);
});
```

---

## 17) Debug Checklist (When Nothing Works)

1) Is `connect()` called?
2) Does `onOpen()` fire?
3) Are you sending `JOIN` after open?
4) Is the server receiving the message?
5) Does the server send back JSON with `type`?
6) Are you listening to the correct `type` string?
7) Try `on("*", console.log)` to log all messages.
8) Check the browser console for errors.

---

## 18) Animation Timing Tips (Keep 60 FPS)

These are basic rules to keep the game smooth:

1) **Use requestAnimationFrame** for visuals.
   - It syncs with the browser refresh.

2) **Do not re-create DOM nodes every frame.**
   - Create once, then update style/position.

3) **Keep game logic on the server.**
   - Client only renders snapshots.

4) **Do not run expensive loops inside render.**
   - Pre-calc once, reuse.

5) **Batch DOM updates.**
   - Update all positions together, not one-by-one with layout reads in between.

6) **Avoid layout thrashing.**
   - Do not read `offsetLeft`/`getBoundingClientRect` after writing styles repeatedly.

7) **Skip rendering if state has not changed.**
   - Compare `tick` or a simple hash.

8) **Clamp animation to server ticks.**
   - You can interpolate visually, but always snap to the latest server state.

---

## 19) State Rendering Tips (Front-End Logic)

### 19.1 The Basic Rule
Render only from `GAME_STATE`. Do not invent positions.

### 19.2 Suggested Rendering Flow
1) Receive `GAME_STATE`.\n
2) Update player DOM nodes (position, lives, alive).\n
3) Update bombs (add new, update timers, remove expired).\n
4) Update explosions (add tiles, remove expired).\n
5) Update blocks (destructible vs wall).\n
6) Update powerups (spawn/pickup states).

### 19.3 Keep a Map of DOM Nodes
```js
const playerNodes = new Map();

function renderPlayers(players) {
  players.forEach((p) => {
    if (!playerNodes.has(p.id)) {
      const node = document.createElement("div");
      node.className = "player";
      playerNodes.set(p.id, node);
      gameRoot.appendChild(node);
    }
    const node = playerNodes.get(p.id);
    node.style.transform = `translate(${p.x * TILE}px, ${p.y * TILE}px)`;
    node.style.display = p.isAlive ? "block" : "none";
  });
}
```

### 19.4 Avoid Expensive Reads in the Loop
Bad:
```js
const rect = node.getBoundingClientRect();
node.style.left = rect.left + 10 + "px";
```
Good:
```js
node.style.left = (p.x * TILE) + "px";
```

### 19.5 Use One Root Container
Keep all game elements under a single container for faster updates.

---

## 20) WebSocket Timing + Rendering (Keep It Smooth)

These tips connect ws.js usage to smooth rendering:

1) **Store the latest GAME_STATE only.**
   - If snapshots arrive faster than you render, replace the old one.

2) **Render on requestAnimationFrame.**
   - Use a loop that always renders the most recent state.

Example:
```js
let latestState = null;

onSnapshot((state) => {
  latestState = state;
});

function renderLoop() {
  if (latestState) renderGame(latestState);
  requestAnimationFrame(renderLoop);
}

renderLoop();
```

3) **Avoid per-message DOM updates.**
   - Do not update the DOM directly inside `onSnapshot`.
   - Instead, store state, then render in the animation loop.

4) **Handle disconnects gracefully.**
   - If `onClose` fires, pause rendering and show a reconnect banner.

5) **Log only in development.**
   - Logging every `GAME_STATE` can kill FPS.
