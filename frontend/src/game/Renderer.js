import { makeElement } from '../framework/dom.js';

export function Renderer(gameState) {
  const map = gameState.map || createEmptyMap();
  const players = gameState.players || [];
  const bombs = gameState.bombs || [];
  const explosions = gameState.explosions || [];

  return makeElement('div', { class: 'game-renderer' }, [
    makeElement('div', { class: 'game-grid' }, 
      map.map((row, y) => 
        makeElement('div', { class: 'grid-row', key: y }, 
          row.map((cell, x) => {
            const player = players.find(p => p.x === x && p.y === y);
            const bomb = bombs.find(b => b.x === x && b.y === y);
            const explosion = explosions.find(e => e.x === x && e.y === y);

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
            } else if (bomb) {
              cellClass += ' bomb';
              content = '💣';
            } else if (player) {
              cellClass += ' player';
              content = getPlayerSprite(player.id);
            }

            return makeElement('div', { class: cellClass, key: x }, content);
          })
        )
      )
    )
  ]);
}

function createEmptyMap() {
  const map = [];
  for (let y = 0; y < 15; y++) {
    const row = [];
    for (let x = 0; x < 15; x++) {
      if (x === 0 || x === 14 || y === 0 || y === 14) {
        row.push(1);
      }
      else if (x % 2 === 0 && y % 2 === 0) {
        row.push(1);
      }
      else if (Math.random() > 0.7) {
        row.push(2);
      }
      else {
        row.push(0);
      }
    }
    map.push(row);
  }
  return map;
}

function getPlayerSprite(playerId) {
  const sprites = ['🔴', '🔵', '🟢', '🟡'];
  const index = parseInt(playerId.slice(-1)) % 4;
  return sprites[index];
}