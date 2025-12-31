import { makeElement } from "../framework/dom.js";
import { ws } from "../ws.js";

export function InputHandler(){
    return makeElement('div', {
        class: 'input-handler',
        tabindex: -1,
        style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; outline: none;',
        autofocus: true,
        onKeyDown: (e) => {
            // Prevent default for arrow keys and space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'].includes(e.key)) {
                e.preventDefault();
            }

            let direction = null;

            if (e.key === 'ArrowUp') direction = 'up';
            else if (e.key === 'ArrowDown') direction = 'down';
            else if (e.key === 'ArrowLeft') direction = 'left';
            else if (e.key === 'ArrowRight') direction = 'right';
            else if (e.key === 'Spacebar' || e.key === ' '){
                ws.sendBomb();
                return;
            }

            if (direction) ws.sendMove(direction);
        }
    });
}