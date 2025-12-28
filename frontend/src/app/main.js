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
import { ws } from '../ws.js'

initState({
  screen: 'menu',  // 'menu' | 'lobby' | 'game' | 'gameover'
  nickname: '',
  playerId: null,
  players: [],
  chatMessages: [],
  chatInput: '',
  countdown: null,
  winner: null,
  hooks: []
});

// WebSocket Mockup Testing

// Setup WebSocket listeners
ws.on('CONNECTED', (data) => {
  console.log('Connected:', data);
  setState({ playerId: data.playerId });
});

ws.on('LOBBY_UPDATE', (data) => {
  console.log('Lobby update:', data);
  setState({ 
    players: data.players,
    screen: 'lobby'
  });
});

ws.on('CHAT_MESSAGE', (data) => {
  console.log('New chat:', data);
  const state = getState();
  setState({ 
    chatMessages: [...state.chatMessages, data]
  });
});

ws.on('GAME_START', (data) => {
  console.log('Game starting:', data);
  setState({ 
    countdown: data.countdown,
    // screen: 'game'  // We don't have GameScreen yet, show lobby for now
  });
});

ws.on('GAME_OVER', (data) => {
  console.log('Game over:', data);
  setState({ 
    winner: data.winner,
    players: data.players,
    screen: 'gameover'
  });
});

const root = document.getElementById('app');

initEventSystem(root);

// Router - decides which screen to show
function App() {
  const state = getState();
  
  if (state.screen === 'menu') return MenuScreen();
  if (state.screen === 'lobby') return LobbyScreen();
  if (state.screen === 'gameover') return GameOverScreen();
  
  // Default
  return MenuScreen();
}

// Re-render on state change
subscribe(() => {
  resetHookIndex();
  render(App(), root);
});

// Initial render
ws.connect();
resetHookIndex();
render(App(), root);