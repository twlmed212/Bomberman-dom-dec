export class Player {
  constructor(id, name, x, y, colorIndex = 0) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.lives = 3;
    this.isAlive = true;
    this.colorIndex = colorIndex;
    this.powerups = {
      speed: 1,
      bombCount: 1,
      flameRange: 1
    };
    this.activeBombs = 0;
  }

  move(direction, map) {
    let distance = 0;
    const maxDistance = this.powerups.speed; // Speed 1 = 1 tile, Speed 2 = 2 tiles
    let movedAny = false;

    while (distance < maxDistance) {
      let newX = this.x;
      let newY = this.y;

      if (direction === 'UP') newY--;
      else if (direction === 'DOWN') newY++;
      else if (direction === 'LEFT') newX--;
      else if (direction === 'RIGHT') newX++;

      // Check if walkable
      if (map.isWalkable(newX, newY)) {
        this.x = newX;
        this.y = newY;
        movedAny = true;
        distance++;
      } else {
        // Hit a wall, stop moving
        break;
      }
    }

    return movedAny;
  }

  canPlaceBomb() {
    return this.isAlive && this.activeBombs < this.powerups.bombCount;
  }

  incrementBombs() {
    this.activeBombs++;
  }

  decrementBombs() {
    if (this.activeBombs > 0) {
      this.activeBombs--;
    }
  }

  takeDamage() {
    if (!this.isAlive) return false;

    this.lives--;

    if (this.lives <= 0) {
      this.isAlive = false;
      return true; // Player died
    }

    return false; // Still alive
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      lives: this.lives,
      isAlive: this.isAlive,
      colorIndex: this.colorIndex,
      powerups: this.powerups
    };
  }
}