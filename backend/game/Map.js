export class Map {
  constructor() {
    this.grid = this.generateMap();
  }

  generateMap() {
    const size = 15;
    const map = [];

    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        // Border walls
        if (x === 0 || x === size - 1 || y === 0 || y === size - 1) {
          row.push(1); // Wall
        }
        // Grid pattern walls (every other cell)
        else if (x % 2 === 0 && y % 2 === 0) {
          row.push(1); // Wall
        }
        // Keep corners clear for player spawn (5x5 safe zones)
        else if ((x <= 3 && y <= 3) || (x >= 11 && y <= 3) ||
                 (x <= 3 && y >= 11) || (x >= 11 && y >= 11)) {
          row.push(0); // Empty
        }
        // Random destructible blocks
        else if (Math.random() > 0.6) {
          row.push(2); // Block
        }
        else {
          row.push(0); // Empty
        }
      }
      map.push(row);
    }

    return map;
  }

  isWalkable(x, y) {
    if (x < 0 || x >= 15 || y < 0 || y >= 15) return false;
    return this.grid[y][x] === 0;
  }

  destroyBlock(x, y) {
    if (this.grid[y][x] === 2) {
      this.grid[y][x] = 0;
      return true;
    }
    return false;
  }

  getGrid() {
    return this.grid;
  }
}