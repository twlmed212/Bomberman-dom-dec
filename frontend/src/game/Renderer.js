import { makeElement } from '../framework/dom.js';

export function Renderer(gameState) {
  // Create map from blocks or use empty
  const map = createMapFromGameState(gameState);
  // Pre-process entities into lookup maps for O(1) access
  const playerMap = new Array(15).fill(null).map(() => new Array(15).fill(null));
  const bombMap = new Array(15).fill(null).map(() => new Array(15).fill(null));
  const explosionMap = new Array(15).fill(null).map(() => new Array(15).fill(false));
  const powerupMap = new Array(15).fill(null).map(() => new Array(15).fill(null));

  // Populate maps
  if (gameState.players) {
    gameState.players.forEach(p => {
      if (p.isAlive && p.x >= 0 && p.x < 15 && p.y >= 0 && p.y < 15) {
        playerMap[p.y][p.x] = p;
      }
    });
  }

  if (gameState.bombs) {
    gameState.bombs.forEach(b => {
      if (b.x >= 0 && b.x < 15 && b.y >= 0 && b.y < 15) {
        bombMap[b.y][b.x] = b;
      }
    });
  }

  if (gameState.explosions) {
    gameState.explosions.forEach(exp => {
      if (exp.tiles) {
        exp.tiles.forEach(tile => {
          if (tile.x >= 0 && tile.x < 15 && tile.y >= 0 && tile.y < 15) {
            explosionMap[tile.y][tile.x] = true;
          }
        });
      }
    });
  }

  if (gameState.powerups) {
    gameState.powerups.forEach(p => {
      if (p.x >= 0 && p.x < 15 && p.y >= 0 && p.y < 15) {
        powerupMap[p.y][p.x] = p;
      }
    });
  }

  return makeElement('div', { class: 'game-renderer' }, [
    makeElement('div', { class: 'game-grid' },
      map.map((row, y) =>
        makeElement('div', { class: 'grid-row', key: `row-${y}` },
          row.map((cell, x) => {
            // O(1) lookups
            const player = playerMap[y][x];
            const bomb = bombMap[y][x];
            const explosion = explosionMap[y][x];
            const powerup = powerupMap[y][x];

            let cellClass = 'grid-cell';
            let content = '';

            if (cell === 1) {
              cellClass += ' wall';
              content = ' ';
            } else if (cell === 2) {
              cellClass += ' block';
              content = '📦';
            } else if (explosion) {
              cellClass += ' explosion';
              content = '💥';
            } else if (player) {
              cellClass += ' player';
              content = getPlayerSprite(player);
            } else if (bomb) {
              cellClass += ' bomb';
              content = '💣';
            } else if (powerup) {
              cellClass += ' powerup';
              content = getPowerUpSprite(powerup.type);
            }

            return makeElement('div', { class: cellClass, key: `cell-${y}-${x}` }, content);
          })
        )
      )
    )
  ]);
}

function createMapFromGameState(gameState) {
  // Create empty 15x15 grid
  const map = Array(15).fill(null).map(() => Array(15).fill(0));

  // Add borders
  for (let i = 0; i < 15; i++) {
    map[0][i] = 1;
    map[14][i] = 1;
    map[i][0] = 1;
    map[i][14] = 1;
  }

  // Add grid pattern walls
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      if (x % 2 === 0 && y % 2 === 0) {
        map[y][x] = 1;
      }
    }
  }

  // Add blocks from server
  if (gameState.blocks) {
    gameState.blocks.forEach(block => {
      if (block.destructible) {
        map[block.y][block.x] = 2;
      }
    });
  }

  return map;
}

function isInExplosion(x, y, explosions) {
  return explosions.some(exp =>
    exp.tiles.some(tile => tile.x === x && tile.y === y)
  );
}

function getPlayerSprite(player) {
  const sprites = ['🔴', '🔵', '🟢', '🟡'];
  const index = player.colorIndex || 0;
  return sprites[index % 4];
}

function getPowerUpSprite(type) {
  if (type === 'bomb') return '🎁';
  if (type === 'flame') return '🔥';
  if (type === 'speed') return '⚡';
  return '⭐';
}