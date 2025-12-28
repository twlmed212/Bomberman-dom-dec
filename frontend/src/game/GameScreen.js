import { makeElement } from '../framework/dom.js';
import { getState } from '../framework/state.js';
import { Renderer } from './Renderer.js';
import { GameHUD } from './GameHUD.js';
import { InputHandler } from './InputHandler.js';

export function GameScreen() {
  const state = getState();
  const gameState = state.gameState || {};

  return makeElement('div', { class: 'game-screen' }, [
    InputHandler(),
    GameHUD(),
    Renderer(gameState)
  ]);
}