import { makeElement } from "../framework/dom.js";
import { getState, setState, useState } from "../framework/state.js";

export function ChatPanel() {
  const state = getState();
  const chatMessages = state.chatMessages || [];

  return makeElement("div", { class: "chat-panel" }, [
    makeElement(
      "div",
      { class: "chat-messages" },
      // TODO Chat messages will go here
      chatMessages.map((msg) => {
        return makeElement("div", { class: "chat-message" }, [
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
        value: state.chatInput || "",
        onInput: (e) => {
          setState({ chatInput: e.target.value });
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            sendMessage(state.chatInput)
          }
        },
      }),
      makeElement(
        "button",
        {
          class: "chat-send-button",
          onClick: () => {
            sendMessage(state.chatInput)
          },
        },
        "Send"
      ),
    ]),
  ]);
}


function sendMessage(message) {
  const msg = message?.trim();
  
  if (!msg) return;
  
  console.log('Sending:', msg);
  // TODO: Send to server
  
  setState({ chatInput: '' });
}