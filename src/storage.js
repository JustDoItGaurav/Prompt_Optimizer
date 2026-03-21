const STORAGE_KEY = 'ai_prompt_reframer_settings';

const DEFAULT_SETTINGS = {
    geminiApiKey: '',
    improvementMode: 'Standard', // Quick, Standard, Expert
    targetOverride: 'auto' // auto, chatgpt, claude, gemini, generic
};

export function getSettings() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return DEFAULT_SETTINGS;
    }
    
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.warn('AI Prompt Reframer: Failed to read from localStorage', e);
    }
    
    return DEFAULT_SETTINGS;
}

export function saveSettings(settings) {
    if (typeof window === 'undefined' || !window.localStorage) {
        return false;
    }
    
    try {
        const current = getSettings();
        const updated = { ...current, ...settings };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (e) {
        console.error('AI Prompt Reframer: Failed to save to localStorage', e);
        return false;
    }
}

export function clearSettings() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return false;
    }
    try {
        window.localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (e) {
        console.error('AI Prompt Reframer: Failed to clear localStorage', e);
        return false;
    }
}
