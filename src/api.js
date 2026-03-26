// ============================================================
//  improvePrompt.js  —  Prompt Engineering Engine v2
//  Drop-in replacement. Same public API, massively upgraded.
// ============================================================

import { getSettings } from './storage.js';

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────

const MODEL        = 'gemini-2.5-flash';
const API_BASE     = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_RETRIES  = 3;
const RETRY_DELAY  = 800; // ms, doubles each attempt

// ─────────────────────────────────────────────
//  TASK CLASSIFIER
//  Sniffs the intent of the raw input so we can
//  inject the right specialist persona + format rules.
// ─────────────────────────────────────────────

const TASK_PROFILES = {
  coding: {
    keywords: /\b(code|function|class|bug|error|implement|refactor|api|script|algorithm|sql|regex|debug|typescript|python|rust|go|java)\b/i,
    persona:  'a principal software engineer with 15+ years of experience across systems, web, and ML engineering',
    extras:   'Specify language, runtime, constraints, edge cases, expected I/O, and error handling requirements.',
  },
  writing: {
    keywords: /\b(write|essay|article|blog|email|letter|copy|tone|audience|persuasive|narrative|draft|edit|proofread)\b/i,
    persona:  'an award-winning editor and content strategist who has written for top-tier publications',
    extras:   'Define the target audience, tone (formal/casual/persuasive), format, and desired emotional impact.',
  },
  analysis: {
    keywords: /\b(analyze|compare|evaluate|assess|review|pros|cons|trade-?off|research|summarize|breakdown|explain)\b/i,
    persona:  'a senior research analyst skilled in structured reasoning and evidence-based synthesis',
    extras:   'Frame the analysis with clear criteria, depth of reasoning required, and output structure (table, bullets, prose).',
  },
  design: {
    keywords: /\b(design|ui|ux|layout|component|wireframe|figma|visual|branding|color|typography|mockup)\b/i,
    persona:  'a principal product designer with deep expertise in UX research and visual design systems',
    extras:   'Include target platform, user persona, accessibility needs, and stylistic direction.',
  },
  data: {
    keywords: /\b(data|dataset|csv|excel|chart|graph|visualization|statistics|trend|metric|dashboard|pandas|excel)\b/i,
    persona:  'a senior data scientist and analyst who specializes in insight extraction and data storytelling',
    extras:   'Specify data structure, analysis goal, visualization preferences, and any statistical constraints.',
  },
  creative: {
    keywords: /\b(story|poem|creative|fiction|character|plot|world-?build|imagine|brainstorm|idea|concept|invent)\b/i,
    persona:  'a versatile creative director with experience in fiction, screenwriting, and conceptual ideation',
    extras:   'Specify genre, tone, stylistic inspirations, length, and any constraints or themes to explore.',
  },
};

function classifyTask(text) {
  for (const [type, profile] of Object.entries(TASK_PROFILES)) {
    if (profile.keywords.test(text)) return { type, ...profile };
  }
  return {
    type:    'general',
    persona: 'an expert AI systems prompt engineer and cognitive task strategist',
    extras:  'Ensure full clarity, context, output format, and success criteria are present.',
  };
}

// ─────────────────────────────────────────────
//  QUALITY ANALYSIS
//  Diagnoses weaknesses in the raw prompt so the
//  system instruction can call them out directly.
// ─────────────────────────────────────────────

function analyzePromptQuality(text) {
  const issues = [];
  const word_count = text.trim().split(/\s+/).length;

  if (word_count < 8)          issues.push('extremely terse — expand scope and intent');
  if (!/\bwhy\b|\bgoal\b|\bfor\b|\bbecause\b/i.test(text)) issues.push('no stated purpose or goal');
  if (!/\bformat\b|\blist\b|\btable\b|\bsummary\b|\bparagraph\b|\bsteps\b/i.test(text)) issues.push('no output format specified');
  if (!/\bexample\b|\blike\b|\bsuch as\b|\be\.g\b/i.test(text)) issues.push('no examples or reference points');
  if (word_count > 300)        issues.push('possibly over-specified — consider splitting into sub-tasks');

  return issues;
}

// ─────────────────────────────────────────────
//  SYSTEM INSTRUCTION BUILDER
//  Constructs a dynamic, context-aware meta-prompt.
// ─────────────────────────────────────────────

function buildSystemInstruction(rawText, mode) {
  const task   = classifyTask(rawText);
  const issues = analyzePromptQuality(rawText);
  const issueBlock = issues.length
    ? `\n**Detected Weaknesses to Fix:**\n${issues.map(i => `  - ${i}`).join('\n')}`
    : '\n**Note:** The input has reasonable structure — focus on elevating precision and richness.';

  const modeBlock = {
    Quick:  '\n**Mode: Quick** — Be concise. Prioritize structure and clarity over exhaustive detail. Aim for ≤150 words.',
    Expert: '\n**Mode: Expert** — Apply chain-of-thought decomposition. Break complex goals into layered sub-tasks. Add reasoning scaffolding, conditional logic, and edge-case handling.',
    Standard: '',
  }[mode] ?? '';

  return `You are ${task.persona}, acting as an elite prompt engineering system.

Your ONLY job is to transform the user's raw input into a production-grade, highly optimized prompt for a large language model.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TASK TYPE DETECTED: ${task.type.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${issueBlock}

## Your Transformation Protocol

### Step 1 — Deconstruct Intent
Identify the atomic goal. Strip ambiguity. Recover what the user *actually* wants, even if they expressed it poorly.

### Step 2 — Apply Role Engineering
Open with a precise role assignment that primes the model for expert-level output.
Example: "You are a [specific expert] with deep experience in [domain]..."

### Step 3 — Inject Context & Constraints
Add all relevant context the model needs:
- Domain-specific vocabulary or standards
- Constraints (length, format, tone, audience, tech stack, etc.)
- ${task.extras}

### Step 4 — Specify Output Format Explicitly
Define the exact structure of the expected response:
- Use headers, lists, tables, code blocks, or prose as appropriate
- Specify length expectations if relevant
- Add quality gates: "Ensure no step is skipped", "Validate all edge cases", etc.

### Step 5 — Add Grounding Anchors
Include 1–2 clarifying instructions that prevent the model from going off-track:
- "If X is ambiguous, assume Y"
- "Prioritize Z over W"
- "Do not include boilerplate or caveats"

## Hard Rules
- Return ONLY the improved prompt — zero commentary, zero preamble
- Do NOT answer, solve, or respond to the content of the prompt
- Do NOT wrap output in quotes or code blocks
- Preserve the original intent — enhance, never distort
${modeBlock}`;
}

// ─────────────────────────────────────────────
//  RETRY WRAPPER
// ─────────────────────────────────────────────

async function withRetry(fn, retries = MAX_RETRIES, delayMs = RETRY_DELAY) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLast = attempt === retries;
      const isRetryable = /5\d\d|429|network/i.test(err.message);
      if (isLast || !isRetryable) throw err;
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
}

// ─────────────────────────────────────────────
//  RESPONSE EXTRACTOR
//  Handles Gemini's slightly annoying response shape.
// ─────────────────────────────────────────────

function extractText(data) {
  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.map(p => p.text ?? '').join('').trim();

  if (!text) {
    const reason = candidate?.finishReason;
    if (reason === 'SAFETY')   throw new Error('SAFETY_BLOCK: Response blocked by Gemini safety filters.');
    if (reason === 'MAX_TOKENS') throw new Error('TOKEN_LIMIT: Response was cut off. Try a shorter input.');
    throw new Error(`UNEXPECTED_RESPONSE: ${JSON.stringify(data)}`);
  }

  return text;
}

// ─────────────────────────────────────────────
//  EXTENSION MESSAGE BRIDGE
// ─────────────────────────────────────────────

function sendViaExtension(url, body) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'FETCH_GEMINI', url, body }, (response) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (response?.error)          return reject(new Error(response.error));
      resolve(response.text);
    });
  });
}

// ─────────────────────────────────────────────
//  DIRECT FETCH (Bookmarklet context)
// ─────────────────────────────────────────────

async function fetchDirect(url, body, signal) {
  const response = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
    signal:  signal
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => 'unknown error');
    const code    = response.status;
    if (code === 429) throw new Error(`429: Rate limited by Gemini API. Wait a moment and retry.`);
    if (code === 400) throw new Error(`400: Bad request — check your prompt or API key.`);
    if (code === 403) throw new Error(`403: Invalid or unauthorized API key.`);
    throw new Error(`API_ERROR: ${code} — ${errText}`);
  }

  const data = await response.json();
  return extractText(data);
}

// ─────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────

/**
 * Improves a raw user prompt using Gemini.
 *
 * @param {string} originalText  - The raw prompt to improve
 * @param {object} [overrides]   - Optional: { mode, signal } for per-call control
 * @returns {Promise<string>}    - The improved prompt text
 */
export async function improvePrompt(originalText, overrides = {}) {
  if (!originalText?.trim()) throw new Error('EMPTY_INPUT: No prompt text provided.');

  const settings  = await getSettings();
  const apiKey    = settings.geminiApiKey;
  if (!apiKey)    throw new Error('API_KEY_MISSING');

  const mode      = overrides.mode ?? settings.improvementMode ?? 'Standard';
  const signal    = overrides.signal ?? null; // AbortController support

  const systemInstruction = buildSystemInstruction(originalText, mode);
  const url = `${API_BASE}/${MODEL}:generateContent?key=${apiKey}`;

  const requestBody = {
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [{
      role:  'user',
      parts: [{ text: originalText }],
    }],
    generationConfig: {
      temperature:      mode === 'Expert' ? 0.4 : 0.25,
      maxOutputTokens:  mode === 'Quick'  ? 1024 : 2048,
      topP:             0.9,
      topK:             40,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  const isExtension = typeof chrome !== 'undefined' && chrome.runtime?.sendMessage;

  return withRetry(async () => {
    if (isExtension) {
      return sendViaExtension(url, requestBody);
    }
    return fetchDirect(url, requestBody, signal);
  });
}

// ─────────────────────────────────────────────
//  BONUS: BATCH IMPROVE
//  Improves multiple prompts in parallel with
//  concurrency control so you don't nuke the API.
// ─────────────────────────────────────────────

/**
 * Improve multiple prompts with capped concurrency.
 *
 * @param {string[]} prompts    - Array of raw prompts
 * @param {object}   [options]  - { mode, concurrency }
 * @returns {Promise<Array<{ input, output, error }>>}
 */
export async function batchImprovePrompts(prompts, options = {}) {
  const { mode = 'Standard', concurrency = 3 } = options;
  const results = [];

  for (let i = 0; i < prompts.length; i += concurrency) {
    const chunk = prompts.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      chunk.map(p => improvePrompt(p, { mode }))
    );
    settled.forEach((result, idx) => {
      results.push({
        input:  chunk[idx],
        output: result.status === 'fulfilled' ? result.value : null,
        error:  result.status === 'rejected'  ? result.reason.message : null,
      });
    });
  }

  return results;
}