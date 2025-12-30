export const CLIENT_TO_SERVER_SHAPES = {
  // JOIN: client announces a new player name to join the lobby.
  // Server responds with CONNECTED and then LOBBY_UPDATE.
  JOIN: {
    type: "JOIN", // required literal string
    playerName: "string", // display name chosen by player
  },
  // READY: client toggles readiness in the lobby.
  // Server broadcasts LOBBY_UPDATE with updated ready states.
  READY: {
    type: "READY", // required literal string
  },
  // MOVE: client sends movement intent only (never position/state).
  // Server validates collisions and broadcasts GAME_STATE.
  MOVE: {
    type: "MOVE", // required literal string
    direction: "UP|DOWN|LEFT|RIGHT", // grid direction intent
  },
  // BOMB: client requests bomb placement at current player position.
  // Server validates bomb limits and broadcasts GAME_STATE.
  BOMB: {
    type: "BOMB", // required literal string
  },
  // CHAT: client sends a lobby/game chat message.
  // Server broadcasts CHAT_MESSAGE to all clients.
  CHAT: {
    type: "CHAT", // required literal string
    message: "string", // raw chat text
  },
};
