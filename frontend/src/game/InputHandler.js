import { makeElement } from "../framework/dom.js";
import { ws } from "../ws.js";


export function InputHandler(){
    return makeElement('div', {
        class: 'input-handler',
        tabindex: 0,
        onKeyDown: (e) => {
            e.preventDefault();

            let direction = null;

            if (e.key === 'ArrowUp') direction = 'up';
            else if (e.key === 'ArrowDown') direction = 'down';
            else if (e.key === 'ArrowLeft') direction = 'left';
            else if (e.key === 'ArrowRight') direction = 'right';
            else if (e.key === 'Spacebar' || e.key === ' '){
                ws.sendBomb();
                return ;
            }

            if (direction) ws.sendMove(direction);
        }
    });
}