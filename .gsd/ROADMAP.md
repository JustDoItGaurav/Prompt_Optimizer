# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Read contents from main AI chatbot input fields (ChatGPT, Claude, Gemini).
- [ ] API Key initialization and secure `localStorage` management.
- [ ] API Request generation to Gemini using a strict meta-prompt for prompt improvement.
- [ ] A vanilla UI modal presenting Title, Loading State, Improved Prompt, and Action Buttons.
- [ ] "Copy" & "Replace" functionality correctly interacting with page elements.

## Phases

### Phase 1: Bookmarklet MVP (Local First)
**Status**: ⬜ Not Started
**Objective**: Build a fully functional, local browser bookmarklet encompassing extraction, UI presentation, API calling, and replacing text to serve as the v1 MVP.
**Requirements**: 
- Extract prompt from page using adapter pattern.
- Improve prompt using Gemini API.
- Show improved prompt in modal (loading indicator, error handling).
- Copy button & Replace button.
- Settings button & settings modal (manage API Key, Improvement Mode, Target AI).
- Save API key securely in `localStorage`.
- Comprehensive error handling for missing keys and API failures.

### Phase 2: Chrome Extension Transition (v2.0)
**Status**: ⬜ Not Started
**Objective**: Refactor the bookmarklet codebase to execute as a true Chrome profile extension, using `manifest.json`, background workers, and content scripts, to bypass CSP restrictions.
