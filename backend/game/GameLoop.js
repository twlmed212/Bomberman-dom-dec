export class GameLoop {
  constructor(tickRate = 20) {
    this.tickRate = tickRate;
    this.tickMs = 1000 / tickRate;
    this.intervalId = null;
    this.tick = 0;
  }

  start(tickCallback) {
    if (this.intervalId) return;

    this.tick = 0;
    this.intervalId = setInterval(() => {
      this.tick++;
      tickCallback(this.tick);
    }, this.tickMs);

    console.log(`Game loop started at ${this.tickRate} ticks/sec`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Game loop stopped');
    }
  }

  isRunning() {
    return this.intervalId !== null;
  }
}