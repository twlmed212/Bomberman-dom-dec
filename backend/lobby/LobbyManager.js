import { SERVER_TO_CLIENT } from '../../shared/messages/index.js';

export class LobbyManager {
  constructor(wsServer, gameManager) {
    this.wsServer = wsServer;
    this.gameManager = gameManager;
    this.players = new Map();
    this.requiredPlayers = 2;
    this.countdownTimer = null;
    this.currentCountdown = 0;
    this.waitingTimer = null;
    this.waitingCountdown = 0;
  }

  addPlayer(playerId, name, ws) {
    // Check 1: Is game currently running?
    if (this.gameManager.state.running || this.players.size == 4) {
      console.log('Join rejected - game in progress:', name);
      return { success: false, error: 'Game in progress, please wait' };
    }

    // Check 2: Is lobby full? (Max 4 players)
    const activePlayerCount = Array.from(this.players.values())
      .filter(p => p.ws.readyState === 1).length;

    if (activePlayerCount >= 4) {
      console.log('Join rejected - room full:', name);
      return { success: false, error: 'Room is full (4/4)' };
    }

    // Check 3: Duplicate name with active connection
    for (const [id, player] of this.players.entries()) {
      if (player.name === name) {
        // If WebSocket is closed/closing, remove the old player
        if (player.ws.readyState !== 1) { // 1 = OPEN
          console.log('Removing stale player:', name);
          this.players.delete(id);
        } else {
          console.log('Duplicate name rejected:', name);
          return { success: false, error: 'Name already taken' };
        }
      }
    }

    this.players.set(playerId, {
      name,
      ready: false,
      ws
    });

    console.log('Player joined lobby:', name);
    // Don't broadcast here - MessageHandler will do it after sending CONNECTED
    return { success: true };
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    console.log('Player left lobby:', playerId);

    if (this.players.size < this.requiredPlayers) {
      this.cancelWaiting();
      this.cancelCountdown();
    }

    this.broadcastLobbyUpdate();
    this.checkStartConditions();
  }

  toggleReady(playerId) {
    const player = this.players.get(playerId);
    if (!player) return;

    player.ready = !player.ready;
    console.log('Player ready toggle:', player.name, player.ready);

    this.broadcastLobbyUpdate();
    this.checkStartConditions();
  }

  broadcastLobbyUpdate() {
    const playerList = Array.from(this.players.entries()).map(([id, p]) => ({
      id,
      name: p.name,
      ready: p.ready
    }));

    const readyCount = playerList.filter(p => p.ready).length;

    this.wsServer.broadcast({
      type: SERVER_TO_CLIENT.LOBBY_UPDATE,
      players: playerList,
      readyCount,
      requiredPlayers: this.requiredPlayers
    });
  }

  broadcastChat(playerId, playerName, message) {
    this.wsServer.broadcast({
      type: SERVER_TO_CLIENT.CHAT_MESSAGE,
      playerId,
      playerName,
      message,
      timestamp: Date.now()
    });
  }

  checkStartConditions() {
    const totalPlayers = this.players.size;

    if (totalPlayers >= 4) {
      // 4 players: immediate 10-second countdown
      this.cancelWaiting();
      this.startCountdown(10);
    } else if (totalPlayers >= 2) {
      // 2-3 players: wait 20 seconds, then 10-second countdown
      this.startWaiting(20);
    } else {
      // Less than 2 players: cancel everything
      this.cancelWaiting();
      this.cancelCountdown();
    }
  }

  startWaiting(duration) {
    // Already waiting, don't restart
    if (this.waitingTimer) return;

    console.log(`Waiting ${duration} seconds for more players...`);

    this.waitingCountdown = duration;

    // Broadcast initial waiting countdown
    this.broadcastWaitingUpdate();

    // Update countdown every second
    this.waitingTimer = setInterval(() => {
      this.waitingCountdown--;

      this.broadcastWaitingUpdate();

      if (this.waitingCountdown <= 0) {
        this.cancelWaiting();
        if (this.players.size >= 2) {
          this.startGame();
        }
      }
    }, 1000);
  }

  broadcastWaitingUpdate() {
    this.wsServer.broadcast({
      type: SERVER_TO_CLIENT.LOBBY_UPDATE,
      players: Array.from(this.players.entries()).map(([id, p]) => ({
        id,
        name: p.name,
        ready: p.ready
      })),
      readyCount: Array.from(this.players.values()).filter(p => p.ready).length,
      requiredPlayers: this.requiredPlayers,
      waiting: true,
      waitingTime: this.waitingCountdown
    });
  }

  cancelWaiting() {
    if (this.waitingTimer) {
      clearInterval(this.waitingTimer);
      this.waitingTimer = null;
      this.waitingCountdown = 0;
      console.log('Waiting period cancelled');
    }
  }

  startCountdown(duration) {
    // If countdown running with different duration, restart
    if (this.countdownTimer && this.currentCountdown !== duration) {
      this.cancelCountdown();
    }

    // Already counting with same duration
    if (this.countdownTimer && this.currentCountdown === duration) return;

    console.log(`Starting game countdown: ${duration} seconds`);
    
    this.currentCountdown = duration;

    this.wsServer.broadcast({
      type: SERVER_TO_CLIENT.GAME_START,
      countdown: this.currentCountdown
    });

    this.countdownTimer = setInterval(() => {
      this.currentCountdown--;

      // Broadcast updated countdown (including 0)
      this.wsServer.broadcast({
        type: SERVER_TO_CLIENT.GAME_START,
        countdown: this.currentCountdown
      });

      if (this.currentCountdown <= 0) {
        this.cancelCountdown();
        this.startGame();
      }
    }, 1000);
  }

  cancelCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
      this.currentCountdown = 0;
      console.log('Countdown cancelled');
    }
  }

  startGame() {
    console.log('🎮 Starting game!');
    
    const playerList = Array.from(this.players.entries()).map(([id, p]) => ({
      id,
      name: p.name
    }));

    // Clear lobby
    this.players.clear();

    // Tell GameManager to start
    this.gameManager.startGame(playerList);
  }
}