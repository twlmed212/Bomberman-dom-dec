import { CLIENT_TO_SERVER, SERVER_TO_CLIENT } from '../../shared/messages/index.js';

export class MessageHandler {
  constructor(ws, playerId, lobby, gameManager) {
    this.ws = ws;
    this.playerId = playerId;
    this.lobby = lobby;
    this.gameManager = gameManager;
    this.playerName = null;
  }

  handle(message) {
    if (!message || !message.type) {
      console.log('Invalid message format');
      return;
    }

    switch (message.type) {
      case CLIENT_TO_SERVER.JOIN:
        this.handleJoin(message);
        break;

      case CLIENT_TO_SERVER.CHAT:
        this.handleChat(message);
        break;

      case CLIENT_TO_SERVER.READY:
        this.handleReady(message);
        break;

      case CLIENT_TO_SERVER.MOVE:
        this.handleMove(message);
        break;

      case CLIENT_TO_SERVER.BOMB:
        this.handleBomb(message);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  handleJoin(message) {
    const name = message.playerName?.trim();

    if (!name || name.length < 3 || name.length > 16) {
      this.send(SERVER_TO_CLIENT.ERROR, { message: 'Invalid player name' });
      return;
    }

    // Send CONNECTED first so playerId is set before LOBBY_UPDATE arrives
    this.send(SERVER_TO_CLIENT.CONNECTED, {
      playerId: this.playerId,
      playerName: name
    });

    // Try to add to lobby (checks for duplicates and broadcasts LOBBY_UPDATE)
    const result = this.lobby.addPlayer(this.playerId, name, this.ws);

    if (!result.success) {
      this.send(SERVER_TO_CLIENT.ERROR, { message: result.message });
      return;
    }

    this.playerName = name;
  }

  handleChat(message) {
    const text = message.message?.trim();

    if (!text || text.length > 140) return;

    this.lobby.broadcastChat(this.playerId, this.playerName, text);
  }

  handleReady(message) {
    this.lobby.toggleReady(this.playerId);
  }

  handleMove(message) {
    const direction = message.direction;
    if (!['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(direction)) return;

    // Route to GameManager
    this.gameManager.handleMove(this.playerId, direction);
  }

  handleBomb(message) {
    // Route to GameManager
    this.gameManager.handleBomb(this.playerId);
  }

  send(type, data) {
    this.ws.send(JSON.stringify({ type, ...data }));
  }
}