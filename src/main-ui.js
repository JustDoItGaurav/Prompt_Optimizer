import { showSettings } from './settings.js';

export function showMainApp(improvedTextPromise, onReplaceCallback) {
    let existingModal = document.getElementById('ai-prompt-reframer-main');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'ai-prompt-reframer-main';
    
    Object.assign(modal.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        zIndex: '999999',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px',
        color: '#111827',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    });

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    
    const title = document.createElement('h2');
    title.textContent = 'AI Prompt Reframer';
    title.style.margin = '0';
    title.style.fontSize = '1.25rem';

    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.style.background = 'none';
    settingsBtn.style.border = 'none';
    settingsBtn.style.cursor = 'pointer';
    settingsBtn.style.fontSize = '1.2rem';
    settingsBtn.addEventListener('click', () => {
        showSettings();
    });

    header.appendChild(title);
    header.appendChild(settingsBtn);

    const bodyContainer = document.createElement('div');
    bodyContainer.id = 'pr-body-container';
    bodyContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100px;">
           <span style="display: inline-block; animation: pr-spin 1s linear infinite;">⏳</span>
           <p style="margin-top: 8px; color: #6b7280; font-size: 0.875rem;">Optimizing Prompt with Gemini...</p>
        </div>
        <style>
          @keyframes pr-spin { 100% { transform: rotate(360deg); } }
        </style>
    `;

    const controls = document.createElement('div');
    controls.style.display = 'none';
    controls.style.justifyContent = 'flex-end';
    controls.style.gap = '8px';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.padding = '8px 16px';
    closeBtn.style.border = '1px solid #d1d5db';
    closeBtn.style.background = 'transparent';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.addEventListener('click', () => modal.remove());

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.style.padding = '8px 16px';
    copyBtn.style.border = '1px solid #d1d5db';
    copyBtn.style.background = '#f3f4f6';
    copyBtn.style.borderRadius = '4px';
    copyBtn.style.cursor = 'pointer';

    const replaceBtn = document.createElement('button');
    replaceBtn.textContent = 'Replace & Close';
    replaceBtn.style.padding = '8px 16px';
    replaceBtn.style.border = 'none';
    replaceBtn.style.background = '#2563eb';
    replaceBtn.style.color = 'white';
    replaceBtn.style.borderRadius = '4px';
    replaceBtn.style.fontWeight = '500';
    replaceBtn.style.cursor = 'pointer';

    controls.appendChild(closeBtn);
    controls.appendChild(copyBtn);
    controls.appendChild(replaceBtn);

    modal.appendChild(header);
    modal.appendChild(bodyContainer);
    modal.appendChild(controls);
    document.body.appendChild(modal);

    // Resolve Promise
    improvedTextPromise.then(improvedText => {
        bodyContainer.innerHTML = '';
        
        const textArea = document.createElement('textarea');
        textArea.value = improvedText;
        textArea.readOnly = true;
        textArea.style.width = '100%';
        textArea.style.height = '150px';
        textArea.style.padding = '12px';
        textArea.style.border = '1px solid #d1d5db';
        textArea.style.borderRadius = '4px';
        textArea.style.boxSizing = 'border-box';
        textArea.style.fontFamily = 'monospace';
        textArea.style.fontSize = '0.875rem';
        textArea.style.resize = 'vertical';
        
        bodyContainer.appendChild(textArea);
        
        controls.style.display = 'flex';

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(improvedText);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        });

        replaceBtn.addEventListener('click', () => {
            if (onReplaceCallback) onReplaceCallback(improvedText);
            modal.remove();
        });

    }).catch(error => {
        bodyContainer.innerHTML = `
            <div style="color: #ef4444; background: #fee2e2; border: 1px solid #f87171; padding: 12px; border-radius: 4px; font-size: 0.875rem;">
                <strong>API Request Failed</strong>
                <p style="margin: 4px 0 0 0; word-break: break-all;">${error.message}</p>
            </div>
        `;
        
        controls.innerHTML = ''; // Clear action buttons
        controls.appendChild(closeBtn);
        controls.style.display = 'flex';
        
        if (error.message.includes('API_KEY_MISSING')) {
            showSettings();
            modal.remove(); // Unmount when transitioning to settings natively
        }
    });
}
