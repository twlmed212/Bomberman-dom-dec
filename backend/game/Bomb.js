export class Bomb {
  constructor(id, x, y, playerId, flameRange = 1) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this.flameRange = flameRange;
    this.ticksRemaining = 60; // 3 seconds at 20 ticks/sec
  }

  tick() {
    this.ticksRemaining--;
    return this.ticksRemaining <= 0;
  }

  explode(map) {
    const explosionTiles = [];
    const destroyedBlocks = [];

    // Center tile
    explosionTiles.push({ x: this.x, y: this.y });

    // Four directions
    const directions = [
      { dx: 0, dy: -1 }, // UP
      { dx: 0, dy: 1 },  // DOWN
      { dx: -1, dy: 0 }, // LEFT
      { dx: 1, dy: 0 }   // RIGHT
    ];

    directions.forEach(({ dx, dy }) => {
      for (let i = 1; i <= this.flameRange; i++) {
        const x = this.x + (dx * i);
        const y = this.y + (dy * i);

        // Out of bounds
        if (x < 0 || x >= 15 || y < 0 || y >= 15) break;

        const cell = map.grid[y][x];

        // Wall - stop explosion
        if (cell === 1) break;

        // Add to explosion
        explosionTiles.push({ x, y });

        // Block - destroy and stop
        if (cell === 2) {
          map.destroyBlock(x, y);
          destroyedBlocks.push({ x, y });
          break;
        }
      }
    });

    return { tiles: explosionTiles, destroyedBlocks };
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      ticksRemaining: this.ticksRemaining,
      playerId: this.playerId
    };
  }
}