import {makeElement} from '../framework/dom.js';
import { navigate } from '../framework/router.js';
import {getState, setState} from '../framework/state.js';
import { ws } from '../ws.js';

export function MenuScreen() {
    const state  = getState();


    return (
        makeElement('div', {class: 'menu-screen'}, [
            makeElement('div', {class: 'header-bar'}, [
                makeElement('div', {class: 'logo'}, [
                    makeElement('img', {src: '../public/images/logo.png', alt: 'Bomberman Logo'})
                ]),
                makeElement('h1', {class: 'title'}, 'Bomber Man'),
                makeElement('span', {class: 'title-sub'}, 'Enter your nickname to start playing!'),
            ]),

            makeElement('div', {class: 'menu-box'}, [
                
                makeElement('div', {class: 'input-container'}, [
                    makeElement('label', {for: 'nickname'}, 'Nickname'),
                    makeElement('input', {
                        type: 'text', id: 'nickname', placeholder: 'Enter your nickname', maxlength: 15,
                        value: state.nickname, onInput: (e) => {
                            setState({nickname: e.target.value});
                        },
                        onKeyDown: (e) => {
                            setState({nickname: e.target.value});
                            if (e.key === 'Enter') {
                                checkUser();
                            }
                        }
                    }),
                    makeElement('img', {src: '../public/images/user-icon.png', alt: 'User Icon', class: 'icon-person'}),
                ]),
                makeElement('button', {id: 'joinBtn',
                    onClick: joinGame
                }, 'Enter Game ->'),
                makeElement('p', {id: 'error', class: 'error', style: `display: ${state.error ? 'block' : 'none'}`}, state.error || ''),
            ]),
        ])
    );
}

function joinGame() {
  const state = getState();
  const name = state.nickname?.trim();
  
  if (!name || name.length < 3) {
    setState({ error: 'Nickname must be 3+ characters' });
    return;
  }
  
  setState({ error: '' });
  ws.join(name);
}