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
  const state = getState();

  // Check if we are already in the player list (race condition fix)
  const isInLobby = state.players?.some(p => p.id === data.playerId);

  setState({
    playerId: data.playerId,
    screen: isInLobby ? 'lobby' : state.screen
  });
});

ws.on(SERVER_TO_CLIENT.LOBBY_UPDATE, (data) => {
  console.log('Lobby update:', data);
  const state = getState();

  // Always update global player list first
  setState({ players: data.players });

  // Check if we are in the lobby now (using current or new player ID)
  // We might not have playerId yet if CONNECTED hasn't arrived
  const myId = state.playerId;
  const isInLobby = myId && data.players.some(p => p.id === myId);

  if (isInLobby) {
    setState({
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

// Re-render on state change with requestAnimationFrame (naturally throttled to display refresh rate)
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
// Initial render
// ws.connect(); // REMOVED: Connect only when joining
resetHookIndex();
render(App(), root);