import { getSettings, saveSettings } from './storage.js';

export async function showSettings(onCloseCallback) {
    // 1. Unmount existing if applicable
    let existingModal = document.getElementById('ai-prompt-reframer-settings');
    if (existingModal) {
        existingModal.remove();
    }

    // 2. Fetch current
    const current = await getSettings();

    // 3. Create Container
    const modal = document.createElement('div');
    modal.id = 'ai-prompt-reframer-settings';
    
    // Injecting isolation styling securely via shadow-like vanilla container.
    // Using high z-index and fixed position.
    Object.assign(modal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        zIndex: '999999',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px',
        color: '#111827'
    });

    modal.innerHTML = `
        <h2 style="margin: 0 0 16px 0; font-size: 1.25rem;">Reframer Settings</h2>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Gemini API Key</label>
            <input type="password" id="pr-api-key" placeholder="AIzaSy..." value="${current.geminiApiKey}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;">
            <small style="display: block; font-size: 0.75rem; color: #6b7280; margin-top: 4px;">Stored locally. Never shared.</small>
        </div>

        <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Improvement Mode</label>
            <select id="pr-improve-mode" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="Quick" ${current.improvementMode === 'Quick' ? 'selected' : ''}>Quick (Fastest)</option>
                <option value="Standard" ${current.improvementMode === 'Standard' ? 'selected' : ''}>Standard</option>
                <option value="Expert" ${current.improvementMode === 'Expert' ? 'selected' : ''}>Expert (Deep reasoning)</option>
            </select>
        </div>

        <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Adapter Override</label>
            <select id="pr-target-override" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="auto" ${current.targetOverride === 'auto' ? 'selected' : ''}>Auto-Detect</option>
                <option value="chatgpt" ${current.targetOverride === 'chatgpt' ? 'selected' : ''}>ChatGPT</option>
                <option value="claude" ${current.targetOverride === 'claude' ? 'selected' : ''}>Claude</option>
                <option value="gemini" ${current.targetOverride === 'gemini' ? 'selected' : ''}>Gemini</option>
                <option value="generic" ${current.targetOverride === 'generic' ? 'selected' : ''}>Generic Textarea</option>
            </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="pr-settings-close" style="padding: 8px 16px; border: 1px solid #d1d5db; background: transparent; border-radius: 4px; cursor: pointer;">Close</button>
            <button id="pr-settings-save" style="padding: 8px 16px; border: none; background: #2563eb; color: white; border-radius: 4px; cursor: pointer; font-weight: 500;">Save Settings</button>
        </div>
    `;

    // 4. Append to body
    document.body.appendChild(modal);

    // 5. Event Listeners
    document.getElementById('pr-settings-close').addEventListener('click', () => {
        modal.remove();
        if (onCloseCallback) onCloseCallback();
    });

    document.getElementById('pr-settings-save').addEventListener('click', async () => {
        const apiKey = document.getElementById('pr-api-key').value.trim();
        const mode = document.getElementById('pr-improve-mode').value;
        const target = document.getElementById('pr-target-override').value;

        await saveSettings({
            geminiApiKey: apiKey,
            improvementMode: mode,
            targetOverride: target
        });

        modal.remove();
        if (onCloseCallback) onCloseCallback();
    });
}
