import { initEventSystem } from '../framework/event.js';
import { defineRoutes, navigate, initRouter } from '../framework/router.js';
import { makeElement, render } from '../framework/dom.js';
import {
  getState,
  setState,
  subscribe,
  initState,
  resetHookIndex,
  useState,
} from '../framework/state.js';
import { MenuScreen } from '../ui/MenuScreen.js';
import { LobbyScreen } from '../ui/LobbyScreen.js';
import { GameOverScreen } from '../ui/GameOverScreen.js';

initState({
    nickname: '',
    error: '',
    players: [
      {name: 'Alice'},
      {name: 'Bob'}
    ],
    chatMessages: [],
    countdownActive: false,
    countdownSkipping: false,
    chatInput: '',
    countdown: 20,
    hooks: []

})

// TEst DATA

for (let i = 0; i < 100; i++) {
  // testing message mook
  const state = getState();
  state.chatMessages.push({ from: `${ state.players[i % 2].name}`, message: `This is message number ${i + 1}` });
}
const root = document.getElementById('app');

initEventSystem(root);


subscribe(() => {
  resetHookIndex();
  render(MenuScreen(), root);
});


defineRoutes([
  {path:'/', view: MenuScreen},
  {path:'/lobby', view: LobbyScreen},
  {path:'/gameover', view: GameOverScreen}
]);

initRouter();
