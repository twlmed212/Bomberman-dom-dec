import {makeElement} from '../framework/dom.js';
import { getState, setState, useState } from '../framework/state.js';
import { ChatPanel } from './ChatPanel.js';

export function LobbyScreen() {
    const state = getState();
    const players = state.players || [];


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
                ChatPanel()
            ])
        ])
    );
}