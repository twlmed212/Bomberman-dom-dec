import { makeElement } from '../framework/dom.js';

export function Renderer(gameState) {
  // Create map from blocks or use empty
  const map = createMapFromGameState(gameState);
  const players = gameState.players || [];
  const bombs = gameState.bombs || [];
  const explosions = gameState.explosions || [];
  const powerups = gameState.powerups || [];

  return makeElement('div', { class: 'game-renderer' }, [
    makeElement('div', { class: 'game-grid' }, 
      map.map((row, y) => 
        makeElement('div', { class: 'grid-row', key: y }, 
          row.map((cell, x) => {
            const player = players.find(p => p.x === x && p.y === y && p.isAlive);
            const bomb = bombs.find(b => b.x === x && b.y === y);
            const explosion = isInExplosion(x, y, explosions);
            const powerup = powerups.find(p => p.x === x && p.y === y);

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

            return makeElement('div', { class: cellClass, key: x }, content);
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