# GameManager (Detailed Guide)

This document explains the `GameManager` state fields and lifecycle in plain language.
It is detailed on purpose so a teammate can pick it up mid-project and still understand.

## State Fields

### tick
- A number that increases every server update step.
- Think of it as the game’s internal clock: tick 0, tick 1, tick 2...
- It never goes backward and resets only when a new game starts.
- Clients can use it to ignore older snapshots (if a late packet arrives).
- Debugging: “bug happens at tick 235” is easier than “it happened after some time.”

### running
- A boolean that says whether the game is currently active.
- `true` means the loop is allowed to advance the game.
- `false` means the game is paused/stopped (usually back in lobby).
- This does NOT mean players are “running.” It means the game simulation is running.

### players
- Array of player objects.
- Each player represents a human in the match.

Expected shape (example):
```js
{
  id: "p1",
  name: "Alice",
  x: 1,
  y: 1,
  lives: 3,
  powerups: { speed: 1, bombCount: 1, flameRange: 1 },
  isAlive: true
}
```

- Why an array (not a map):
  - Easy to serialize to JSON.
  - Easy for clients to loop and render.
- Internally we can still build a lookup map by id when needed.

### bombs
- Array of active bombs.
- Each bomb has a timer (ticks remaining).

Example:
```js
{ id: "b1", x: 4, y: 6, ticksRemaining: 60, playerId: "p1" }
```

- When `ticksRemaining` reaches 0, the bomb explodes.
- We will convert the explosion into tiles and put them in `explosions`.

### explosions
- Array of active explosion groups.
- Explosion tiles are temporary and only exist for a few ticks.

Example:
```js
{ id: "e1", tiles: [{ x: 4, y: 6 }, { x: 5, y: 6 }], ticksRemaining: 8 }
```

- `tiles` is the list of grid cells affected by the explosion.
- `ticksRemaining` controls how long they stay visible and dangerous.

### blocks
- Array of map blocks (walls and destructibles).
- Used for collision and bomb destruction.

Example:
```js
{ x: 3, y: 3, destructible: true }
{ x: 2, y: 2, destructible: false }
```

- Destructible blocks disappear after an explosion.
- Non-destructible blocks (walls) never disappear.

### powerups
- Array of powerups currently on the map.

Example:
```js
{ id: "u1", x: 7, y: 2, type: "SPEED" }
```

- Powerups spawn when a destructible block is destroyed.
- When a player steps on the powerup, it is removed from this list.

### map
- The base grid definition (size + permanent walls).
- Can be stored as a 2D array, while `blocks` stays flat for easy JSON.
- The map is the “world skeleton.” Blocks/powerups are things inside the world.

## Why Arrays Instead of Matrices?
- Arrays are easy to serialize and broadcast to clients.
- Clients can loop through arrays without converting formats.

## Summary
The `state` object is the single source of truth for the game.
Everything else (movement, bombs, rendering) reads from and writes to this state.

---

## Lifecycle (How GameManager Is Used)

### 1) Create the manager
The server creates a single `GameManager` instance.

### 2) Start a game
`startGame(players)` resets the state and marks `running = true`.
- The players passed in become the initial `state.players`.
- `tick` starts from 0 again.

### 3) Tick loop runs
- The loop advances `tick`.
- The loop calls `emitGameState()` every tick.
- `emitGameState()` sends a snapshot to listeners (2A broadcasts it).

### 4) Stop a game
`stopGame()` sets `running = false` and halts the loop.

---

## Public API (What Other Parts Call)

### startGame(players)
- Called by 2A when lobby is ready.
- Starts the game loop and resets state.

### stopGame()
- Called when game ends or all players leave.

### onGameState(handler)
- 2A registers this to broadcast `GAME_STATE`.
- Returns an unsubscribe function.

### onGameOver(handler)
- 2A registers this to broadcast `GAME_OVER`.
- Returns an unsubscribe function.

---

## Mental Model (Plain Language)

GameManager is the referee’s notebook:
- It writes down where everyone is.
- It writes down when bombs go off.
- It writes down which blocks are gone.
- Every tick, it shows the notebook to the audience (clients).

If a teammate only remembers this:
“GameManager is the single source of truth on the server.”
