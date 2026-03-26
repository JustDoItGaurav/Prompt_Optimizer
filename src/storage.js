const STORAGE_KEY = 'ai_prompt_reframer_settings';

const DEFAULT_SETTINGS = {
    geminiApiKey: '',
    improvementMode: 'Standard', // Quick, Standard, Expert
    targetOverride: 'auto' // auto, chatgpt, claude, gemini, generic
};

export async function getSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        return new Promise((resolve) => {
            chrome.storage.local.get([STORAGE_KEY], (result) => {
                if (result[STORAGE_KEY]) {
                    resolve({ ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] });
                } else {
                    resolve(DEFAULT_SETTINGS);
                }
            });
        });
    }
    
    // Fallback for non-extension environments (bookmarklet)
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.warn('AI Prompt Reframer: Failed to read from localStorage', e);
        }
    }
    
    return DEFAULT_SETTINGS;
}

export async function saveSettings(settings) {
    const current = await getSettings();
    const updated = { ...current, ...settings };

    if (typeof chrome !== 'undefined' && chrome.storage) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
                resolve(true);
            });
        });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return true;
        } catch (e) {
            console.error('AI Prompt Reframer: Failed to save to localStorage', e);
            return false;
        }
    }
    return false;
}

export async function clearSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        return new Promise((resolve) => {
            chrome.storage.local.remove([STORAGE_KEY], () => {
                resolve(true);
            });
        });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('AI Prompt Reframer: Failed to clear localStorage', e);
            return false;
        }
    }
    return false;
}
