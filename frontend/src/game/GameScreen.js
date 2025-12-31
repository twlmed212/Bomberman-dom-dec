import { makeElement } from '../framework/dom.js';
import { getState } from '../framework/state.js';
import { Renderer } from './Renderer.js';
import { GameHUD } from './GameHUD.js';
import { ws } from '../ws.js';

export function GameScreen() {
  const state = getState();
  const gameState = state.gameState || {};

  return makeElement('div', {
    class: 'game-screen',
    tabindex: 0,
    autofocus: true,
    style: 'outline: none;',
    onKeyDown: (e) => {
      // Prevent default for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'].includes(e.key)) {
        e.preventDefault();
      }

      let direction = null;

      if (e.key === 'ArrowUp') direction = 'up';
      else if (e.key === 'ArrowDown') direction = 'down';
      else if (e.key === 'ArrowLeft') direction = 'left';
      else if (e.key === 'ArrowRight') direction = 'right';
      else if (e.key === 'Spacebar' || e.key === ' ') {
        ws.sendBomb();
        return;
      }

      if (direction) ws.sendMove(direction);
    }
  }, [
    GameHUD(),
    Renderer(gameState)
  ]);
}