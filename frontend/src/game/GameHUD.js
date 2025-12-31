import { makeElement } from '../framework/dom.js';
import { getState } from '../framework/state.js';

export function GameHUD() {
  const state = getState();
  const gameState = state.gameState || {};
  const players = gameState.players || [];
  const myId = state.playerId;

  const me = players.find(p => p.id === myId);
  const bombCount = me?.powerups?.bombCount || 1;
  const flameRange = me?.powerups?.flameRange || 1;

  return makeElement('div', { class: 'game-hud' }, [
    makeElement('div', { class: 'hud-player-info' }, [
      makeElement('span', { class: 'player-name' }, me?.name || 'Player'),
      makeElement('span', { class: 'player-lives' },
        '❤️'.repeat(me?.lives || 3)
      ),
      makeElement('span', { class: 'player-stats' },
        `💣×${bombCount} 🔥×${flameRange}`
      )
    ]),

    makeElement('div', { class: 'hud-timer' },
      `Time: ${gameState.timer || '00:00'}`
    )
  ]);
}