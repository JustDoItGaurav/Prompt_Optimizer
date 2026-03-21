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

### Phase 1: Core Extractor and Fetcher
**Status**: ⬜ Not Started
**Objective**: Build vanilla JavaScript modules to 1) extract text from known AI playgrounds, 2) handle the API key initialization/storage, and 3) manage the asynchronous Gemini REST API call.
**Requirements**: REQ-01, REQ-02, REQ-03

### Phase 2: Vanilla UI Layer
**Status**: ⬜ Not Started
**Objective**: Design and inject a clean, modular HTML/CSS modal into the page via a bookmarklet execution that displays a spinner during loading, then the Gemini result or any errors.
**Requirements**: REQ-04

### Phase 3: Text Replacer & Interaction Wiring
**Status**: ⬜ Not Started
**Objective**: Add robust Javascript routines that replace the textbox contents seamlessly, firing necessary DOM events to trigger framework updates (e.g., React's `onChange`), and hook up the Copy, Close, and Reset logic.
**Requirements**: REQ-05

### Phase 4: Bookmarklet Packaging & Testing
**Status**: ⬜ Not Started
**Objective**: Minify the solution, generate the URI-encoded bookmarklet link, test on target sites (Claude, ChatGPT, Gemini), and fix cross-origin or CSP (Content Security Policy) issues that might occur.
**Requirements**: REQ-06

### Phase 5: Chrome Extension Transition (v2.0)
**Status**: ⬜ Not Started
**Objective**: Refactor the codebase to execute as a true Chrome profile extension instead of a bookmarklet execution, using `manifest.json`, background workers, and content scripts.
