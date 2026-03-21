import * as chatgpt from './chatgpt.js';
import * as claude from './claude.js';
import * as gemini from './gemini.js';
import * as generic from './generic.js';
import { getSettings } from '../storage.js';

export function getAdapter() {
    // Check settings for manual override
    const settings = getSettings();
    if (settings.targetOverride && settings.targetOverride !== 'auto') {
        switch (settings.targetOverride) {
            case 'chatgpt': return chatgpt;
            case 'claude': return claude;
            case 'gemini': return gemini;
            case 'generic': return generic;
        }
    }

    // Auto-detect based on hostname
    const host = window.location.hostname;
    if (host.includes('chatgpt.com')) return chatgpt;
    if (host.includes('claude.ai')) return claude;
    if (host.includes('gemini.google.com')) return gemini;
    
    // Fallback to generic DOM heuristics
    return generic;
}
