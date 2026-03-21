# DECISIONS.md

> **Purpose**: Architectural Decision Records (ADR)
> **Format**: Context -> Options -> Decision -> Rationale

## [Date] Decision 1: Use vanilla JS/HTML/CSS for v1
- **Context**: Need a fast, portable implementation that can run as a bookmarklet without compilation steps initially. 
- **Decision**: Avoiding heavy libraries like React or Tailwind directly inside the bookmarklet. Will leverage a standalone script file encapsulating all HTML elements dynamically.
- **Rationale**: Minimal layout breakage on target sites, easiest to inject and pack into a single `javascript:(function(){...})()` blob.

## Phase 1 Decisions

**Date:** 2026-03-21

### Scope
- **Extraction Strategy:** Flexible extraction prioritizing `textarea`, `[contenteditable="true"]`, and `role="textbox"` by maximum string length to support generic playgrounds and ensure maximum compatibility.
- **Write Actions:** Must synthetically trigger DOM events (like `input` and `change`) when replacing text to play nicely with React and similar UI frameworks.

### Approach
- **Chose:** Adapter Pattern (Option B).
- **Reason:** Easier to maintain, cleanly modularizes site-specific logic, and naturally prepares the code for the Chrome Extension architecture. Structure will consist of standalone implementations like `adapters/chatgpt.js`, `adapters/claude.js`, `adapters/gemini.js`, `adapters/generic.js`.

### Constraints
- **CSP Risk:** Direct `fetch` calls from a bookmarklet might be blocked due to site Content Security Policies. The API fetcher module must be designed so it can be cleanly detached and executed inside an extension background script later if necessary.
