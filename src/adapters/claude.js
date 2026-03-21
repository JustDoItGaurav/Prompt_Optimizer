import * as generic from './generic.js';

export function getPrompt() {
    // Claude often targets ProseMirror contenteditable areas inside its chat form
    const specificEl = document.querySelector('div[contenteditable="true"].ProseMirror');
    if (specificEl) {
        return specificEl.innerText || '';
    }
    return generic.getPrompt();
}

export function setPrompt(text) {
    const specificEl = document.querySelector('div[contenteditable="true"].ProseMirror');
    if (specificEl) {
        // We will just try setting textContent/innerText and dispatching for Claude
        specificEl.textContent = text;
        specificEl.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
    }
    return generic.setPrompt(text);
}

export function getSiteName() {
    return 'Claude';
}
