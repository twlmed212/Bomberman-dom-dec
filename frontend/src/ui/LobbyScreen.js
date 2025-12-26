// Elements needed in LobbyScreen:
// Left side (Players):

// Title: "Players (2/4)"
// Player list (name + maybe color/avatar)
// Countdown timer when players ready? (check subject)

// Right side (Chat):

// Chat messages area (scrollable)
// Input box to type
// Send button (or Enter key)


import {makeElement} from '../framework/dom.js';
import { getState, setState, useState } from '../framework/state.js';

export function LobbyScreen() {
    const state = getState();
    const players = state.players || [];

    const chatMessages = state.chatMessages || [];

    return(
        makeElement('div', {class: 'lobby-screen'}, [
            makeElement('div', {class: 'lobby-container'}, [

                makeElement('div', {class: 'players-section'}, [
                    makeElement('h2', {class: 'players-title'}, `Players (${players.length}/4)`),
                    makeElement('h3', {class: 'players-subtitle'}, `List of Joined Players:`),
                    makeElement('div', {class: 'player-list'}, 
                        players.map((player, idx) => {
                            console.log("tojslfjslkdfj", idx);
                            console.log("tojslfjslkdfj", player);
                            
                            return makeElement('div', {class: 'player-item', key: idx}, `${idx} - ${player.name}`);
                        })
                    ),
                    makeElement('div', {
                        class: 'countdown-timer',
                        style: `display: ${state.countdownActive ? 'block' : 'none'}`
                    }, 'Game starts in: 00:20'),
                ]),
                makeElement('div', {class: 'chat-section'}, [
                    makeElement('div', {class: 'chat-messages'}, 
                        // TODO Chat messages will go here
                        chatMessages.map(msg => {
                            return makeElement('div', {class: 'chat-message'}, [
                                makeElement('strong', {}, `${msg.from}: `),
                                makeElement('span', {}, msg.message)
                            ]);
                        })
                    ),
                    makeElement('div', {class: 'chat-input-container'}, [
                        makeElement('input', {
                            type: 'text',
                            class: 'chat-input',
                            placeholder: 'Type your message...',
                            value: state.chatInput || '',
                            onInput: (e) => {
                                setState({ chatInput: e.target.value });
                            },
                            onKeyDown: (e) => {
                                 if (e.key === 'Enter') {
                                    // TODO Send the message through
                                    // websocket or appropriate method
                                    console.log('Send message');
                                    setState({chatInput: ''});
                                }
                            }
                        }),
                        makeElement('button', {
                            class: 'chat-send-button',
                            onClick: () => {
                                console.log('Send message:', state.chatInput);
                                setState({chatInput: ''});
                            }
                        }, 'Send')
                    ])
                ])
            ])
        ])
    );
}