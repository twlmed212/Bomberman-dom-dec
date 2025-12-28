import { makeElement } from '../framework/dom.js';
import { getState, setState } from '../framework/state.js';

export function GameOverScreen() {
  const state = getState();
  const winner = state.winner || 'Unknown';
  const players = state.players || [];

  return makeElement('div', { class: 'gameover-screen' }, [
    makeElement('div', { class: 'gameover-box' }, [
      
      makeElement('h1', { class: 'gameover-title' }, 'GAME OVER'),
      
      makeElement('div', { class: 'winner-banner' }, [
        makeElement('h2', {}, 'Winner'),
        makeElement('p', { class: 'winner-name' }, winner)
      ]),
      
      makeElement('div', { class: 'final-scores' }, [
        makeElement('h3', {}, 'Final Standings'),
        makeElement('div', { class: 'scores-list' },
          players.map((player, idx) => 
            makeElement('div', { 
              class: `score-item ${player.name === winner ? 'winner' : ''}`,
              key: idx 
            }, [
              makeElement('span', {}, `${idx + 1}. ${player.name}`),
              makeElement('span', { class: 'score' }, `${player.score || 0} pts`)
            ])
          )
        )
      ]),
      
      makeElement('button', {
        class: 'play-again-btn',
        onClick: () => {
          console.log('Play again clicked');
          setState({ 
            screen: 'menu',
            nickname: '',
            players: [],
            chatMessages: [],
            winner: null
          });
        }
      }, 'Play Again')
    ])
  ]);
}