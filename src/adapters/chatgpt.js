import * as generic from './generic.js';

export function getPrompt() {
    // Specifically target ChatGPT's primary prompt textarea
    const specificEl = document.querySelector('#prompt-textarea');
    if (specificEl) {
        return specificEl.value || '';
    }
    return generic.getPrompt();
}

export function setPrompt(text) {
    const specificEl = document.querySelector('#prompt-textarea');
    if (specificEl) {
        generic.simulateFrameworkInput(specificEl, text);
        return true;
    }
    return generic.setPrompt(text);
}

export function getSiteName() {
    return 'ChatGPT';
}
