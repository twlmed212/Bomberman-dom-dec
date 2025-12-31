export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'bomb', 'flame', 'speed'
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      type: this.type
    };
  }
}

// Random power-up type generator
export function randomPowerUpType() {
  const types = ['bomb', 'flame', 'speed'];
  return types[Math.floor(Math.random() * types.length)];
}
