import { on } from './event.js';

export function makeElement(tag, attrs = {}, children = []) {
    let key = undefined;
    if ('key' in attrs) {
        key = attrs.key;
        delete attrs.key;
    }

    children = Array.isArray(children) ? children : [children];
    children = children.filter(child => child !== null && child !== undefined);
    children = children.map((child) =>
        typeof child === "string" || typeof child === "number"
            ? { tag: "#text", attrs: {}, children: [], text: String(child) }
            : child
    );

    return { tag, attrs, children, element: null, key };
}

function createDOM(vnode) {
    if (!vnode || !vnode.tag) {
        console.warn('invalid virtual node', vnode);
        return document.createComment('invalid');
    }

    if (vnode.tag === '#text') {
        const textNode = document.createTextNode(vnode.text);
        vnode.element = textNode;
        return textNode;
    }

    const element = document.createElement(vnode.tag);
    vnode.element = element;

    for (const [key, value] of Object.entries(vnode.attrs)) {
        if (key.startsWith('on')) {
            const eventType = key.toLowerCase().slice(2);
            on(element, eventType, value);
        } else if (key === 'checked') {
            if (value) {
                element.setAttribute('checked', '');
                element.checked = true;
            }
        } else if (key === 'value') {
            element.setAttribute('value', value);
            element.value = value;
        } else if (key === 'autofocus') {
            if (value) {
                element.setAttribute('autofocus', '');
                setTimeout(() => element.focus(), 0);
            }
        } else if (key === 'autoscroll') {
            if (value) {
                setTimeout(() => {
                    element.scrollTop = element.scrollHeight;
                }, 0);
            }
        } else {
            element.setAttribute(key, value);
        }
    }

    vnode.children.forEach(child => {
        element.appendChild(createDOM(child));
    });

    return element;
}

let prevVNode = null;

export function render(vnode, container) {
    if (!prevVNode) {
        container.innerHTML = "";
        container.appendChild(createDOM(vnode));
    } else {
        updateDOM(prevVNode, vnode, container);
    }
    prevVNode = vnode;
}

function updateDOM(oldVnode, newVnode, parent) {
    if (!oldVnode || !oldVnode.element) {
        const newElem = createDOM(newVnode);
        if (parent && newElem) parent.appendChild(newElem);
        return;
    }

    if (oldVnode.tag === '#text' && newVnode.tag === '#text') {
        if (oldVnode.text !== newVnode.text) {
            oldVnode.element.nodeValue = newVnode.text;
        }
        newVnode.element = oldVnode.element;
        return;
    }

    if (oldVnode.tag !== newVnode.tag) {
        const newElem = createDOM(newVnode);
        parent.replaceChild(newElem, oldVnode.element);
        return;
    }

    newVnode.element = oldVnode.element;

    updateAttributes(oldVnode, newVnode);
    updateChildren(oldVnode, newVnode);
}

function updateAttributes(oldVnode, newVnode) {
    const elem = newVnode.element;
    const oldAttrs = oldVnode.attrs;
    const newAttrs = newVnode.attrs;

    for (const key of Object.keys(oldAttrs)) {
        if (!(key in newAttrs)) {
            if (key.startsWith('on')) {
                const eventType = key.toLowerCase().slice(2);
                on(elem, eventType, () => {});
            } else {
                elem.removeAttribute(key);
            }
        }
    }

    for (const [key, value] of Object.entries(newAttrs)) {
        if (oldAttrs[key] !== value) {
            if (key.startsWith('on')) {
                const eventType = key.toLowerCase().slice(2);
                on(elem, eventType, value);
            } else if (key === 'checked') {
                if (value) {
                    elem.setAttribute('checked', '');
                    elem.checked = true;
                } else {
                    elem.removeAttribute('checked');
                    elem.checked = false;
                }
            } else if (key === 'value') {
                elem.setAttribute('value', value);
                elem.value = value;
            } else if (key === 'autofocus') {
                if (value) {
                    elem.setAttribute('autofocus', '');
                    setTimeout(() => elem.focus(), 0);
                }
            } else if (key === 'autoscroll') {
                if (value) {
                    setTimeout(() => {
                        elem.scrollTop = elem.scrollHeight;
                    }, 0);
                }
            } else {
                elem.setAttribute(key, value);
            }
        }
    }

    // Always focus if autofocus is true (even if unchanged)
    if (newAttrs.autofocus) {
        setTimeout(() => elem.focus(), 0);
    }

    // Always scroll if autoscroll is true (even if unchanged)
    if (newAttrs.autoscroll) {
        setTimeout(() => {
            elem.scrollTop = elem.scrollHeight;
        }, 0);
    }
}
function updateChildren(oldVnode, newVnode) {
    const parentElement = newVnode.element;
    const oldKids = oldVnode.children || [];
    const newKids = newVnode.children || [];

    // Use key-based diffing for better performance when keys are present
    // Build map of old nodes by key for O(1) lookup
    const oldKeyMap = new Map();
    oldKids.forEach((child) => {
        if (child && child.key !== undefined) {
            oldKeyMap.set(child.key, child);
        }
    });

    // Track which old nodes have been used
    const usedOldNodes = new Set();
    
    // First pass: process new children in order, matching by key when possible
    newKids.forEach((newChild, newIdx) => {
        let oldChild = null;
        let oldIdx = -1;
        
        // Try to find matching old node by key
        if (newChild && newChild.key !== undefined) {
            const matchedOld = oldKeyMap.get(newChild.key);
            if (matchedOld && !usedOldNodes.has(matchedOld)) {
                oldChild = matchedOld;
                oldIdx = oldKids.indexOf(matchedOld);
                usedOldNodes.add(matchedOld);
            }
        }
        
        // If no key match, try to match by position (for nodes without keys)
        if (!oldChild && newIdx < oldKids.length) {
            const candidate = oldKids[newIdx];
            // Only use if it hasn't been matched by key and has no key itself
            if (candidate && !usedOldNodes.has(candidate) && 
                (candidate.key === undefined || !oldKeyMap.has(candidate.key))) {
                // Check if tags match
                if (candidate.tag === newChild.tag) {
                    oldChild = candidate;
                    oldIdx = newIdx;
                    usedOldNodes.add(candidate);
                }
            }
        }
        
        // Get the current DOM element at this position
        const currentDOMChild = parentElement.children[newIdx];
        
        if (oldChild && oldChild.element) {
            // Update existing node
            if (currentDOMChild !== oldChild.element) {
                // Need to move element to correct position
                parentElement.insertBefore(oldChild.element, currentDOMChild);
            }
            updateDOM(oldChild, newChild, parentElement);
        } else {
            // Create new node
            const newElem = createDOM(newChild);
            if (currentDOMChild) {
                parentElement.insertBefore(newElem, currentDOMChild);
            } else {
                parentElement.appendChild(newElem);
            }
        }
    });
    
    // Remove any old nodes that weren't matched
    oldKids.forEach((oldChild) => {
        if (oldChild && oldChild.element && !usedOldNodes.has(oldChild)) {
            if (oldChild.element.parentNode === parentElement) {
                parentElement.removeChild(oldChild.element);
            }
        }
    });
}