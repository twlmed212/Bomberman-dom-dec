import {makeElement} from '../framework/dom.js';
import { getState, setState, useState } from '../framework/state.js';
import { ChatPanel } from './ChatPanel.js';

export function LobbyScreen() {
    const state = getState();

    // Guard: If no playerId, don't render lobby (just show loading)
    // The LOBBY_UPDATE handler will redirect to menu
    if (!state.playerId || state.players.length === 0) {
        return makeElement('div', { class: 'lobby-screen' }, [
            makeElement('div', { class: 'loading' }, 'Loading...')
        ]);
    }

    const players = state.players || [];

    // Determine what message to show
    let statusMessage = '';
    if (state.countdown) {
        statusMessage = `Game starts in: ${state.countdown} seconds`;
    } else if (state.waiting) {
        statusMessage = `Waiting for more players... ${state.waitingTime || 20} seconds`;
    } else if (players.length < 2) {
        statusMessage = 'Waiting for players to join...';
    }
    return(
        makeElement('div', {class: 'lobby-screen'}, [
            makeElement('div', {class: 'lobby-container'}, [

                makeElement('div', {class: 'players-section'}, [
                    makeElement('h2', {class: 'players-title'}, `Players (${players.length}/4)`),
                    makeElement('h3', {class: 'players-subtitle'}, `List of Joined Players:`),
                    makeElement('div', {class: 'player-list'},
                        players.map((player, idx) => {
                            return makeElement('div', {class: 'player-item', key: idx}, `${idx + 1}. ${player.name}`);
                        })
                    ),
                    makeElement('div', {
                        class: 'countdown-timer',
                        style: `display: ${statusMessage ? 'block' : 'none'}`
                    }, statusMessage),
                ]),
                makeElement("div", { class: "chat-section" }, [
                    ChatPanel()
                ])
            ])
        ])
    );
}
