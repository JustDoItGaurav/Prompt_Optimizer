import * as generic from './generic.js';

export function getPrompt() {
    // Specifically target ChatGPT's primary prompt textarea
    const specificEl = document.querySelector('#prompt-textarea');
    if (specificEl) {
        const text = specificEl.tagName.toLowerCase() === 'textarea' ? specificEl.value : (specificEl.innerText || specificEl.textContent);
        if (text) return text;
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
