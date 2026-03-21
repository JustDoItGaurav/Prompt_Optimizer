import * as generic from './generic.js';

export function getPrompt() {
    // Gemini often wraps its rich text inputs
    const specificEl = document.querySelector('rich-textarea div[contenteditable="true"]');
    if (specificEl) {
        return specificEl.innerText || '';
    }
    return generic.getPrompt();
}

export function setPrompt(text) {
    const specificEl = document.querySelector('rich-textarea div[contenteditable="true"]');
    if (specificEl) {
        specificEl.textContent = text;
        specificEl.dispatchEvent(new Event('input', { bubbles: true }));
        specificEl.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }
    return generic.setPrompt(text);
}

export function getSiteName() {
    return 'Gemini';
}
