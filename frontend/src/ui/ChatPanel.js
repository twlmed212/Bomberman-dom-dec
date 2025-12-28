import { makeElement } from "../framework/dom.js";
import { getState, setState } from "../framework/state.js";
import { ws } from "../ws.js";

export function ChatPanel() {
  const state = getState();
  const chatMessages = state.chatMessages || [];

  return makeElement("div", { class: "chat-panel" }, [
    makeElement(
      "div",
      { class: "chat-messages" },
      chatMessages.map((msg, idx) => {
        return makeElement("div", { class: "chat-message", key: idx }, [
          makeElement("strong", {}, `${msg.from}: `),
          makeElement("span", {}, msg.message),
        ]);
      })
    ),
    makeElement("div", { class: "chat-input-container" }, [
      makeElement("input", {
        type: "text",
        class: "chat-input",
        placeholder: "Type your message...",
        value: state.chatInput || '',
        onInput: (e) => {
          setState({ chatInput: e.target.value });
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        },
      }),
      makeElement(
        "button",
        {
          class: "chat-send-button",
          onClick: sendMessage
        },
        "Send"
      ),
    ]),
  ]);
}

function sendMessage() {
  const state = getState();
  const msg = state.chatInput?.trim();
  
  if (!msg) return;
  
  ws.sendChat(msg);
  
    setState({ chatInput: '' });
}