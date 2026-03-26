import { init } from './index.js';

// If injected multiple times, ensure we don't start conflicting executions
if (!window.__AI_PROMPT_REFRAMER_INJECTED__) {
    window.__AI_PROMPT_REFRAMER_INJECTED__ = true;
}

init();
