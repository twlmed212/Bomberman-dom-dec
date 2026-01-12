export const SERVER_TO_CLIENT_SHAPES = {
  // CONNECTED: sent once after JOIN is accepted.
  CONNECTED: {
    type: "CONNECTED", // required literal string
    playerId: "string", // server-assigned unique id
    playerName: "string", // echoed player name
  },
  // LOBBY_UPDATE: sent on join/leave/ready changes.
  LOBBY_UPDATE: {
    type: "LOBBY_UPDATE", // required literal string
    players: [{ id: "string", name: "string", ready: "boolean" }],
    readyCount: "number", // number of ready players
    requiredPlayers: "number", // min players to start (2 or 4)
  },
  // GAME_START: sent once when countdown begins.
  GAME_START: {
    type: "GAME_START", // required literal string
    countdown: "number", // seconds until game begins
  },
  // GAME_STATE: authoritative snapshot, broadcast at 20Hz during gameplay.
  GAME_STATE: {
    type: "GAME_STATE", // required literal string
    tick: "number", // server tick counter
    players: [
      {
        id: "string",
        name: "string",
        x: "number", // grid x
        y: "number", // grid y
        lives: "number",
        powerups: {
          speed: "number", // movement multiplier, 1.0 = normal
          bombCount: "number", // max bombs placed at once
          flameRange: "number", // explosion radius
        },
        isAlive: "boolean",
      },
    ],
    bombs: [
      {
        id: "string",
        x: "number",
        y: "number",
        ticksRemaining: "number", // 60 ticks = 3s at 20Hz
        playerId: "string",
      },
    ],
    explosions: [
      {
        id: "string",
        tiles: [{ x: "number", y: "number" }],
        ticksRemaining: "number", // how long to render explosion
      },
    ],
    blocks: [
      {
        x: "number",
        y: "number",
        destructible: "boolean",
      },
    ],
    powerups: [
      {
        id: "string",
        x: "number",
        y: "number",
        type: "SPEED|BOMB_COUNT|FLAME_RANGE",
      },
    ],
  },
  // PLAYER_DIED: sent when a player loses a life.
  PLAYER_DIED: {
    type: "PLAYER_DIED", // required literal string
    playerId: "string",
    killedBy: "string", // playerId of killer
    livesRemaining: "number",
  },
  // GAME_OVER: sent when only one player remains alive.
  GAME_OVER: {
    type: "GAME_OVER", // required literal string
    winnerId: "string",
    winnerName: "string",
    finalStats: {
      playerId: {
        kills: "number",
        deaths: "number",
        blocksDestroyed: "number",
      },
    },
  },
  // CHAT_MESSAGE: broadcast for each chat message.
  CHAT_MESSAGE: {
    type: "CHAT_MESSAGE", // required literal string
    playerId: "string",
    playerName: "string",
    message: "string",
    timestamp: "number", // epoch ms
  },
};
