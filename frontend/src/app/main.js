import { initEventSystem } from '../framework/event.js';
import { makeElement, render } from '../framework/dom.js';
import { getState, setState, subscribe, initState, resetHookIndex } from '../framework/state.js';
import { MenuScreen } from '../ui/MenuScreen.js';
import { LobbyScreen } from '../ui/LobbyScreen.js';
import { GameOverScreen } from '../ui/GameOverScreen.js';
import { GameScreen } from '../game/GameScreen.js';
import { ws } from '../ws.js';

const root = document.getElementById('app');

initEventSystem(root);

initState({
  screen: 'menu',
  nickname: '',
  playerId: null,
  players: [],
  chatMessages: [],
  chatInput: '',
  countdown: null,
  winner: null,
  gameState: null,
  hooks: []
});
// For Testing
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
    screen: 'game'  // ← Now we have GameScreen
  });
});

ws.on('GAME_STATE', (data) => {
  setState({ gameState: data });
});

ws.on('GAME_OVER', (data) => {
  console.log('Game over:', data);
  setState({ 
    winner: data.winner,
    players: data.players,
    screen: 'gameover'
  });
});

// Router
function App() {
  const state = getState();
  
  if (state.screen === 'menu') return MenuScreen();
  if (state.screen === 'lobby') return LobbyScreen();
  if (state.screen === 'game') return GameScreen();
  if (state.screen === 'gameover') return GameOverScreen();
  
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