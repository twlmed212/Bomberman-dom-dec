import { initEventSystem } from '../framework/event.js';
import { makeElement, render } from '../framework/dom.js';
import { getState, setState, subscribe, initState, resetHookIndex } from '../framework/state.js';
import { MenuScreen } from '../ui/MenuScreen.js';
import { LobbyScreen } from '../ui/LobbyScreen.js';
import { GameOverScreen } from '../ui/GameOverScreen.js';
import { GameScreen } from '../game/GameScreen.js';
import { ws } from '../ws.js';
import { SERVER_TO_CLIENT } from '../../../shared/messages/index.js';

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
  waiting: false,
  waitingTime: 0,
  winner: null,
  gameState: null,
  error: '',
  hooks: []
});

// Setup WebSocket listeners
ws.on(SERVER_TO_CLIENT.ERROR, (data) => {
  console.log('Error:', data.message);
  setState({ error: data.message });
});

ws.on(SERVER_TO_CLIENT.CONNECTED, (data) => {
  console.log('Connected:', data);
  setState({ playerId: data.playerId });
});

ws.on(SERVER_TO_CLIENT.LOBBY_UPDATE, (data) => {
  console.log('Lobby update:', data);
  const state = getState();

  // Only go to lobby if we're actually in the player list
  const isInLobby = data.players.some(p => p.id === state.playerId);

  if (isInLobby) {
    setState({
      players: data.players,
      screen: 'lobby',
      waiting: data.waiting || false,
      waitingTime: data.waitingTime || 0
    });
  }
});

ws.on(SERVER_TO_CLIENT.CHAT_MESSAGE, (data) => {
  console.log('New chat:', data);
  const state = getState();
  setState({ 
    chatMessages: [...state.chatMessages, data]
  });
});

ws.on(SERVER_TO_CLIENT.GAME_START, (data) => {
  console.log('Game starting:', data);
  setState({
    countdown: data.countdown,
    screen: data.countdown > 0 ? 'lobby' : 'game'
  });
});

ws.on(SERVER_TO_CLIENT.GAME_STATE, (data) => {
  const state = getState();
  // If we receive game state but we're still in lobby, transition to game
  if (state.screen === 'lobby') {
    setState({ gameState: data, screen: 'game', countdown: null });
  } else {
    setState({ gameState: data });
  }
});

ws.on(SERVER_TO_CLIENT.GAME_OVER, (data) => {
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

// Re-render on state change with requestAnimationFrame
let rafScheduled = false;

subscribe(() => {
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      resetHookIndex();
      render(App(), root);
    });
  }
});

// Initial render
ws.connect();
resetHookIndex();
render(App(), root);