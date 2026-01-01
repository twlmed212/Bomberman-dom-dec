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
  setState({
    error: data.message,
    screen: 'menu',     // Force back to menu on any error
    playerId: null,     // Clear playerId
    chatMessages: []    // Clear chat history
  });
});

ws.on(SERVER_TO_CLIENT.CONNECTED, (data) => {
  console.log('Connected:', data);
  setState({ playerId: data.playerId });
});

ws.on(SERVER_TO_CLIENT.LOBBY_UPDATE, (data) => {
  console.log('Lobby update:', data);
  const state = getState();

  // CRITICAL: Never process lobby updates without a valid playerId
  if (!state.playerId) {
    console.log('Ignoring LOBBY_UPDATE - no playerId');
    // Don't change screen here - let Router handle it
    return;
  }

  // Only go to lobby if we're actually in the player list
  const isInLobby = data.players.some(p => p.id === state.playerId);

  if (isInLobby) {
    // Only clear chat when first entering lobby (not on every update)
    const isFirstJoin = state.screen !== 'lobby';

    setState({
      players: data.players,
      screen: 'lobby',
      waiting: data.waiting || false,
      waitingTime: data.waitingTime || 0,
      chatMessages: isFirstJoin ? [] : state.chatMessages  // Clear chat only on first join
    });
  } else {
    // We have a playerId but we're NOT in the lobby player list
    // This means we were rejected, kicked, or game started without us
    console.log('Not in lobby player list - clearing session');
    setState({
      screen: 'menu',
      playerId: null,
      players: [],
      chatMessages: [],  // Clear chat history
      error: ''
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
  const state = getState();

  // Only process countdown if we're in the lobby (we're playing)
  if (state.screen !== 'lobby') {
    console.log('Ignoring GAME_START - not in lobby');
    return;
  }

  setState({
    countdown: data.countdown,
    screen: data.countdown > 0 ? 'lobby' : 'game'
  });
});

ws.on(SERVER_TO_CLIENT.GAME_STATE, (data) => {
  const state = getState();

  // CRITICAL: Only show game if we're actually playing
  const isPlaying = state.playerId && data.players &&
    data.players.some(p => p.id === state.playerId);

  if (!isPlaying) {
    console.log('Ignoring GAME_STATE - not playing in this game');
    return;
  }

  // If we receive game state but we're still in lobby, transition to game
  if (state.screen === 'lobby') {
    setState({ gameState: data, screen: 'game', countdown: null });
  } else {
    setState({ gameState: data });
  }
});

ws.on(SERVER_TO_CLIENT.GAME_OVER, (data) => {
  console.log('Game over:', data);
  const state = getState();

  // CRITICAL: Only show game over if we were playing
  const wasPlaying = state.playerId && data.players &&
    data.players.some(p => p.id === state.playerId);

  if (!wasPlaying) {
    console.log('Ignoring GAME_OVER - was not playing in this game');
    return;
  }

  setState({
    winner: data.winner,
    players: data.players,
    screen: 'gameover',
    chatMessages: []  // Clear chat for next lobby session
  });
});

// Router
function App() {
  const state = getState();

  // Guard: Never show lobby without a playerId
  if (state.screen === 'lobby' && !state.playerId) {
    console.warn('Attempted to show lobby without playerId - showing menu instead');
    return MenuScreen();
  }

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