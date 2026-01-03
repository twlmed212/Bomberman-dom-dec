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
  const state = getState();
  if (!state.playerId) return; // Ignore if we are not a joined player

  console.log('Game starting:', data);
  setState({
    countdown: data.countdown,
    screen: data.countdown > 0 ? 'lobby' : 'game'
  });
});

ws.on(SERVER_TO_CLIENT.GAME_STATE, (data) => {
  const state = getState();
  if (!state.playerId) return; // Ignore if we are not a joined player

  // If we receive game state but we're still in lobby, transition to game
  if (state.screen === 'lobby') {
    setState({ gameState: data, screen: 'game', countdown: null });
  } else {
    // Update game state (render loop handles efficient diffing)
    setState({ gameState: data });
  }
});

ws.on(SERVER_TO_CLIENT.GAME_OVER, (data) => {
  const state = getState();
  if (!state.playerId) return; // Ignore if we are not a joined player

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

// Continuous 60 FPS render loop (like normal games)
let rafId = null;
let needsRender = false;

// FPS counter (global so App can access it)
let frameCount = 0;
let lastFpsTime = performance.now();
let currentFps = 60; // Initialize to avoid flash
let frameId = 0; // Increments every frame to force repaint

function getCurrentFps() {
  return currentFps;
}

// FPS counter element (rendered directly to body)
let fpsElement = null;

function renderLoop() {
  const now = performance.now();
  frameCount++;
  frameId++; // Increment every frame to force DOM update

  // Calculate FPS every second (more accurate calculation)
  if (now - lastFpsTime >= 1000) {
    currentFps = Math.round((frameCount * 1000) / (now - lastFpsTime));
    console.log(`🎮 FPS: ${currentFps}`);
    frameCount = 0;
    lastFpsTime = now;
  }

  // Update FPS counter directly in DOM (bypasses virtual DOM for guaranteed visibility)
  if (!fpsElement) {
    fpsElement = document.createElement('div');
    fpsElement.id = 'fps-counter';
    fpsElement.style.cssText = 'position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.9); color: #0f0; padding: 8px 12px; font-family: monospace; font-size: 16px; font-weight: bold; border-radius: 4px; z-index: 999999999; border: 2px solid #0f0; text-shadow: 0 0 8px #0f0; pointer-events: none;';
    document.body.appendChild(fpsElement);
  }
  // Update text every frame to force repaint
  fpsElement.textContent = `FPS: ${currentFps}`;

  // Update state every frame with frameId to force repaint
  // This ensures DevTools sees continuous paint events (~60 FPS)
  setState({ _fps: currentFps, _frameId: frameId });

  resetHookIndex();
  render(App(), root);
  needsRender = false;
  rafId = requestAnimationFrame(renderLoop);
}

// Also trigger render on state changes (for immediate updates)
subscribe(() => {
  needsRender = true;
});

// Start the 60 FPS render loop
rafId = requestAnimationFrame(renderLoop);

// Initial render
// ws.connect(); // REMOVED: Connect only when joining
resetHookIndex();
render(App(), root);