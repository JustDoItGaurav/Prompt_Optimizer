# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
The AI Prompt Reframer is a lightweight, browser-based tool (initially a bookmarklet, later a Chrome Extension) that instantly acts as a "professional prompt engineer" for users. With a single click, it captures the current text input on sites like ChatGPT, Claude, and Gemini, queries the Gemini API to systematically restructure and improve the prompt, and presents a non-intrusive UI to copy or replace the original text with the improved version.

## Goals
1. Capture text seamlessly from active input fields/textareas across multiple AI tools.
2. Automate the restructuring of prompts into detailed, professionally-engineered formats using the Gemini API.
3. Provide a fast, vanilla HTML/CSS modal UI for the user to view, copy, or replace the improved prompt.
4. Manage Gemini API keys securely via browser `localStorage` to ensure a personalized, serverless architecture.
5. Architect modular code to facilitate an easy transition from a script/bookmarklet to a fully packaged Chrome Extension.

## Non-Goals (Out of Scope)
- Persisting improved prompts in a remote database or synchronizing across devices.
- Heavy frameworks like React, Vue, or UI component libraries (Tailwind, Material UI).
- Handling non-text inputs (like images or document uploads).
- Integrating with APIs other than Gemini for prompt improvement (in Version 1).
- User accounts, authentication, or roles.
- Cloud database, application hosting, or cloud deployments.
- Payment system or monetization.
- Usage tracking or analytics.

## Users
Professionals, developers, and writers heavily leveraging AI tools who want to maximize their outputs by automatically applying advanced prompt engineering techniques (role, context, steps, output format) to their stream-of-consciousness input.

## Constraints
- **Technical**: Must be vanilla JavaScript, HTML, and CSS to remain portable as a bookmarklet. Must securely fetch from Gemini API directly in the browser. 
- **Security**: Because it's client-side only, the API key must be locally managed (`localStorage`). Avoid hardcoding keys at all costs.
- **UX**: The injected UI must be clean, use a shadow DOM (or uniquely scoped classes) to avoid breaking the host site's layout.
- **Development Goal**: Local-first tool strictly for personal development. Do not over-engineer authentication, hosting, or production infrastructure.

## Success Criteria
- [ ] Bookmarklet correctly identifies and extracts text from ChatGPT, Claude, and Gemini input boxes.
- [ ] On first run, prompts user for Gemini API Key and reliably stores/fetches it from `localStorage`.
- [ ] Successfully calls the Gemini API with a system prompt optimized for improving user queries.
- [ ] Simple modal displays Title, Spinner (while fetching), Improved text, Copy/Replace/Close/Reset Key buttons.
- [ ] "Replace" functionality successfully overwrites the original textarea and triggers necessary input events to notify the web app.
