/**
 * Generic DOM extraction logic. Searches across various common element types
 * to find the most likely user-input field.
 */

function findLargestInput() {
    const candidates = [];

    // 1. Textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(t => candidates.push(t));

    // 2. Contenteditables
    const editables = document.querySelectorAll('[contenteditable="true"]');
    editables.forEach(e => candidates.push(e));

    // 3. role="textbox"
    const textboxes = document.querySelectorAll('[role="textbox"]');
    textboxes.forEach(t => {
        if (!candidates.includes(t)) {
            candidates.push(t);
        }
    });

    if (candidates.length === 0) return null;

    // Find the one with the maximum text length
    let largest = null;
    let maxLen = -1;

    for (const el of candidates) {
        let text = '';
        if (el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'input') {
            text = el.value || '';
        } else {
            text = el.innerText || '';
        }

        if (text.length > maxLen) {
            maxLen = text.length;
            largest = el;
        }
    }

    return largest;
}

/**
 * Helper to dispatch all necessary events for modern frontend frameworks (React, Vue, etc.)
 */
export function simulateFrameworkInput(element, value) {
    if (!element) return;

    // Normalize focus
    element.focus();

    const isTextareaOrInput = element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input';

    // Some sites use React 16+ which tracks value setters internally on the node.
    // To trigger React's onChange, we must call the native setter.
    if (isTextareaOrInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, value);
        } else {
            element.value = value;
        }
    } else {
        // CONTENTEDITABLE
        element.innerText = value;
    }

    // Dispatch a series of events to ensure state syncs
    element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    element.dispatchEvent(new InputEvent('input', { bubbles: true, data: value, inputType: 'insertText' }));
}

export function getPrompt() {
    const el = findLargestInput();
    if (!el) return '';

    if (el.tagName.toLowerCase() === 'textarea' || el.tagName.toLowerCase() === 'input') {
        return el.value || '';
    } else {
        return el.innerText || '';
    }
}

export function setPrompt(text) {
    const el = findLargestInput();
    if (el) {
        simulateFrameworkInput(el, text);
        return true;
    }
    return false;
}

export function getSiteName() {
    return 'Generic';
}
