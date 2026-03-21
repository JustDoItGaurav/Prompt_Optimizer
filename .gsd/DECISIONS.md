# DECISIONS.md

> **Purpose**: Architectural Decision Records (ADR)
> **Format**: Context -> Options -> Decision -> Rationale

## [Date] Decision 1: Use vanilla JS/HTML/CSS for v1
- **Context**: Need a fast, portable implementation that can run as a bookmarklet without compilation steps initially. 
- **Decision**: Avoiding heavy libraries like React or Tailwind directly inside the bookmarklet. Will leverage a standalone script file encapsulating all HTML elements dynamically.
- **Rationale**: Minimal layout breakage on target sites, easiest to inject and pack into a single `javascript:(function(){...})()` blob.
