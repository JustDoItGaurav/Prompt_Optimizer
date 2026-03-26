import { getAdapter } from './adapters/index.js';
import { getSettings } from './storage.js';
import { showSettings } from './settings.js';
import { improvePrompt } from './api.js';
import { showMainApp } from './main-ui.js';

export async function init() {
    const adapter = await getAdapter();
    const originalPrompt = adapter.getPrompt();

    if (!originalPrompt || originalPrompt.trim() === '') {
        alert('AI Prompt Reframer: No detectable text input found. Focus on the text area and type something first!');
        return;
    }

    const settings = await getSettings();
    if (!settings.geminiApiKey) {
        showSettings(() => init()); // Loop back to init after close
        return;
    }

    // Wrap the improvePrompt call in a promise
    const promise = improvePrompt(originalPrompt);

    showMainApp(promise, (improvedText) => {
        const success = adapter.setPrompt(improvedText);
        if (!success) {
            alert('Failed to automatically inject text into this website. Use the Copy button instead.');
        }
    });
}

// Remove auto-execution
