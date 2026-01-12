import { SERVER_TO_CLIENT } from "../../shared/messages/index.js";

let socket = null;

const handlers = new Map();
const lifecycleHandlers = {
  open: new Set(),
  close: new Set(),
  error: new Set(),
};

function dispatch(type, payload) {
  const set = handlers.get(type);
  if (!set) return;
  set.forEach((fn) => fn(payload));
}

export function connect(url) {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
  }

  socket = new WebSocket(url);

  socket.onopen = (event) => {
    lifecycleHandlers.open.forEach((fn) => fn(event));
  };

  socket.onclose = (event) => {
    lifecycleHandlers.close.forEach((fn) => fn(event));
  };

  socket.onerror = (event) => {
    lifecycleHandlers.error.forEach((fn) => fn(event));
  };

  socket.onmessage = (event) => {
    let data = null;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      return;
    }

    if (!data || !data.type) return;
    dispatch("*", data);
    dispatch(data.type, data);
  };

  return socket;
}

export function send(typeOrMessage, payload = {}) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;

  const message =
    typeof typeOrMessage === "string"
      ? { type: typeOrMessage, ...payload }
      : typeOrMessage;

  socket.send(JSON.stringify(message));
  return true;
}

export function on(type, handler) {
  if (!handlers.has(type)) handlers.set(type, new Set());
  handlers.get(type).add(handler);
  return () => handlers.get(type)?.delete(handler);
}

export function onOpen(handler) {
  lifecycleHandlers.open.add(handler);
  return () => lifecycleHandlers.open.delete(handler);
}

export function onClose(handler) {
  lifecycleHandlers.close.add(handler);
  return () => lifecycleHandlers.close.delete(handler);
}

export function onError(handler) {
  lifecycleHandlers.error.add(handler);
  return () => lifecycleHandlers.error.delete(handler);
}

export function onLobby(handler) {
  return on(SERVER_TO_CLIENT.LOBBY_UPDATE, handler);
}

export function onSnapshot(handler) {
  return on(SERVER_TO_CLIENT.GAME_STATE, handler);
}

export function onEnd(handler) {
  return on(SERVER_TO_CLIENT.GAME_OVER, handler);
}
