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

initState({
    nickname: '',
    error: '',
    hooks: []

})

const root = document.getElementById('app');

initEventSystem(root);


subscribe(() => {
  resetHookIndex();
  render(MenuScreen(), root);
});


defineRoutes([
  {path:'/', view: MenuScreen},
  {path:'/lobby', view: LobbyScreen}
]);

initRouter();
