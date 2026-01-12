export class GameManager {
  constructor() {
    this.state = this.createInitialState();
    this.gameStateHandlers = new Set();
    this.gameOverHandlers = new Set();
    this.loopId = null;
  }

  createInitialState() {
    return {
      tick: 0,
      running: false,
      players: [],
      bombs: [],
      explosions: [],
      blocks: [],
      powerups: [],
      map: null,
    };
  }

  // 2A: call this to start a new game after lobby is ready.
  startGame(players) {
    this.state = this.createInitialState();
    this.state.players = players;
    this.state.running = true;
    this.startLoop();
  }

  stopGame() {
    this.state.running = false;
    this.stopLoop();
  }

  onGameState(handler) {
    this.gameStateHandlers.add(handler);
    return () => this.gameStateHandlers.delete(handler);
  }

  onGameOver(handler) {
    this.gameOverHandlers.add(handler);
    return () => this.gameOverHandlers.delete(handler);
  }

  startLoop() {
    if (this.loopId) return;

    const tickRate = 20;
    const tickMs = 1000 / tickRate;

    this.loopId = setInterval(() => {
      if (!this.state.running) return;
      this.state.tick += 1;
      this.emitGameState();
    }, tickMs);
  }

  stopLoop() {
    if (!this.loopId) return;
    clearInterval(this.loopId);
    this.loopId = null;
  }

  emitGameState() {
    const snapshot = { ...this.state };
    this.gameStateHandlers.forEach((fn) => fn(snapshot));
  }
}
