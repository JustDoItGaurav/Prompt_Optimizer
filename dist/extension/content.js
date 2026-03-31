(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/adapters/chatgpt.js
  var chatgpt_exports = {};
  __export(chatgpt_exports, {
    getPrompt: () => getPrompt2,
    getSiteName: () => getSiteName2,
    setPrompt: () => setPrompt2
  });

  // src/adapters/generic.js
  var generic_exports = {};
  __export(generic_exports, {
    getPrompt: () => getPrompt,
    getSiteName: () => getSiteName,
    setPrompt: () => setPrompt,
    simulateFrameworkInput: () => simulateFrameworkInput
  });
  function findLargestInput() {
    const candidates = [];
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((t) => candidates.push(t));
    const editables = document.querySelectorAll('[contenteditable="true"]');
    editables.forEach((e) => candidates.push(e));
    const textboxes = document.querySelectorAll('[role="textbox"]');
    textboxes.forEach((t) => {
      if (!candidates.includes(t)) {
        candidates.push(t);
      }
    });
    if (candidates.length === 0) return null;
    let largest = null;
    let maxLen = -1;
    for (const el of candidates) {
      let text = "";
      if (el.tagName.toLowerCase() === "textarea" || el.tagName.toLowerCase() === "input") {
        text = el.value || "";
      } else {
        text = el.innerText || el.textContent || "";
      }
      if (text.length > maxLen) {
        maxLen = text.length;
        largest = el;
      }
    }
    return largest;
  }
  function simulateFrameworkInput(element, value) {
    if (!element) return;
    element.focus();
    const isTextareaOrInput = element.tagName.toLowerCase() === "textarea" || element.tagName.toLowerCase() === "input";
    if (isTextareaOrInput) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, value);
      } else {
        element.value = value;
      }
    } else {
      element.innerText = value;
    }
    element.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    element.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    element.dispatchEvent(new InputEvent("input", { bubbles: true, data: value, inputType: "insertText" }));
  }
  function getPrompt() {
    const el = findLargestInput();
    if (!el) return "";
    if (el.tagName.toLowerCase() === "textarea" || el.tagName.toLowerCase() === "input") {
      return el.value || "";
    } else {
      return el.innerText || el.textContent || "";
    }
  }
  function setPrompt(text) {
    const el = findLargestInput();
    if (el) {
      simulateFrameworkInput(el, text);
      return true;
    }
    return false;
  }
  function getSiteName() {
    return "Generic";
  }

  // src/adapters/chatgpt.js
  function getPrompt2() {
    const specificEl = document.querySelector("#prompt-textarea");
    if (specificEl) {
      const text = specificEl.tagName.toLowerCase() === "textarea" ? specificEl.value : specificEl.innerText || specificEl.textContent;
      if (text) return text;
    }
    return getPrompt();
  }
  function setPrompt2(text) {
    const specificEl = document.querySelector("#prompt-textarea");
    if (specificEl) {
      simulateFrameworkInput(specificEl, text);
      return true;
    }
    return setPrompt(text);
  }
  function getSiteName2() {
    return "ChatGPT";
  }

  // src/adapters/claude.js
  var claude_exports = {};
  __export(claude_exports, {
    getPrompt: () => getPrompt3,
    getSiteName: () => getSiteName3,
    setPrompt: () => setPrompt3
  });
  function getPrompt3() {
    const specificEl = document.querySelector('div[contenteditable="true"].ProseMirror');
    if (specificEl) {
      return specificEl.innerText || "";
    }
    return getPrompt();
  }
  function setPrompt3(text) {
    const specificEl = document.querySelector('div[contenteditable="true"].ProseMirror');
    if (specificEl) {
      specificEl.textContent = text;
      specificEl.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }
    return setPrompt(text);
  }
  function getSiteName3() {
    return "Claude";
  }

  // src/adapters/gemini.js
  var gemini_exports = {};
  __export(gemini_exports, {
    getPrompt: () => getPrompt4,
    getSiteName: () => getSiteName4,
    setPrompt: () => setPrompt4
  });
  function getPrompt4() {
    const specificEl = document.querySelector('rich-textarea div[contenteditable="true"]');
    if (specificEl) {
      return specificEl.innerText || "";
    }
    return getPrompt();
  }
  function setPrompt4(text) {
    const specificEl = document.querySelector('rich-textarea div[contenteditable="true"]');
    if (specificEl) {
      specificEl.textContent = text;
      specificEl.dispatchEvent(new Event("input", { bubbles: true }));
      specificEl.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    return setPrompt(text);
  }
  function getSiteName4() {
    return "Gemini";
  }

  // src/storage.js
  var STORAGE_KEY = "ai_prompt_reframer_settings";
  var DEFAULT_SETTINGS = {
    geminiApiKey: "",
    improvementMode: "Standard",
    // Quick, Standard, Expert
    targetOverride: "auto"
    // auto, chatgpt, claude, gemini, generic
  };
  async function getSettings() {
    if (typeof chrome !== "undefined" && chrome.storage) {
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
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
      } catch (e) {
        console.warn("AI Prompt Reframer: Failed to read from localStorage", e);
      }
    }
    return DEFAULT_SETTINGS;
  }
  async function saveSettings(settings) {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
          resolve(true);
        });
      });
    }
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
      } catch (e) {
        console.error("AI Prompt Reframer: Failed to save to localStorage", e);
        return false;
      }
    }
    return false;
  }

  // src/adapters/index.js
  async function getAdapter() {
    const settings = await getSettings();
    if (settings.targetOverride && settings.targetOverride !== "auto") {
      switch (settings.targetOverride) {
        case "chatgpt":
          return chatgpt_exports;
        case "claude":
          return claude_exports;
        case "gemini":
          return gemini_exports;
        case "generic":
          return generic_exports;
      }
    }
    const host = window.location.hostname;
    if (host.includes("chatgpt.com")) return chatgpt_exports;
    if (host.includes("claude.ai")) return claude_exports;
    if (host.includes("gemini.google.com")) return gemini_exports;
    return generic_exports;
  }

  // src/settings.js
  async function showSettings(onCloseCallback) {
    let existingModal = document.getElementById("ai-prompt-reframer-settings");
    if (existingModal) {
      existingModal.remove();
    }
    const current = await getSettings();
    const modal = document.createElement("div");
    modal.id = "ai-prompt-reframer-settings";
    Object.assign(modal.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      zIndex: "999999",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "24px",
      color: "#111827"
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
                <option value="Quick" ${current.improvementMode === "Quick" ? "selected" : ""}>Quick (Fastest)</option>
                <option value="Standard" ${current.improvementMode === "Standard" ? "selected" : ""}>Standard</option>
                <option value="Expert" ${current.improvementMode === "Expert" ? "selected" : ""}>Expert (Deep reasoning)</option>
            </select>
        </div>

        <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Adapter Override</label>
            <select id="pr-target-override" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="auto" ${current.targetOverride === "auto" ? "selected" : ""}>Auto-Detect</option>
                <option value="chatgpt" ${current.targetOverride === "chatgpt" ? "selected" : ""}>ChatGPT</option>
                <option value="claude" ${current.targetOverride === "claude" ? "selected" : ""}>Claude</option>
                <option value="gemini" ${current.targetOverride === "gemini" ? "selected" : ""}>Gemini</option>
                <option value="generic" ${current.targetOverride === "generic" ? "selected" : ""}>Generic Textarea</option>
            </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="pr-settings-close" style="padding: 8px 16px; border: 1px solid #d1d5db; background: transparent; border-radius: 4px; cursor: pointer;">Close</button>
            <button id="pr-settings-save" style="padding: 8px 16px; border: none; background: #2563eb; color: white; border-radius: 4px; cursor: pointer; font-weight: 500;">Save Settings</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("pr-settings-close").addEventListener("click", () => {
      modal.remove();
      if (onCloseCallback) onCloseCallback();
    });
    document.getElementById("pr-settings-save").addEventListener("click", async () => {
      const apiKey = document.getElementById("pr-api-key").value.trim();
      const mode = document.getElementById("pr-improve-mode").value;
      const target = document.getElementById("pr-target-override").value;
      await saveSettings({
        geminiApiKey: apiKey,
        improvementMode: mode,
        targetOverride: target
      });
      modal.remove();
      if (onCloseCallback) onCloseCallback();
    });
  }

  // src/api.js
  var MODEL = "gemini-2.5-flash";
  var API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
  var MAX_RETRIES = 3;
  var RETRY_DELAY = 800;
  var TASK_PROFILES = {
    coding: {
      keywords: /\b(code|function|class|bug|error|implement|refactor|api|script|algorithm|sql|regex|debug|typescript|python|rust|go|java)\b/i,
      persona: "a principal software engineer with 15+ years of experience across systems, web, and ML engineering",
      extras: "Specify language, runtime, constraints, edge cases, expected I/O, and error handling requirements."
    },
    writing: {
      keywords: /\b(write|essay|article|blog|email|letter|copy|tone|audience|persuasive|narrative|draft|edit|proofread)\b/i,
      persona: "an award-winning editor and content strategist who has written for top-tier publications",
      extras: "Define the target audience, tone (formal/casual/persuasive), format, and desired emotional impact."
    },
    analysis: {
      keywords: /\b(analyze|compare|evaluate|assess|review|pros|cons|trade-?off|research|summarize|breakdown|explain)\b/i,
      persona: "a senior research analyst skilled in structured reasoning and evidence-based synthesis",
      extras: "Frame the analysis with clear criteria, depth of reasoning required, and output structure (table, bullets, prose)."
    },
    design: {
      keywords: /\b(design|ui|ux|layout|component|wireframe|figma|visual|branding|color|typography|mockup)\b/i,
      persona: "a principal product designer with deep expertise in UX research and visual design systems",
      extras: "Include target platform, user persona, accessibility needs, and stylistic direction."
    },
    data: {
      keywords: /\b(data|dataset|csv|excel|chart|graph|visualization|statistics|trend|metric|dashboard|pandas|excel)\b/i,
      persona: "a senior data scientist and analyst who specializes in insight extraction and data storytelling",
      extras: "Specify data structure, analysis goal, visualization preferences, and any statistical constraints."
    },
    creative: {
      keywords: /\b(story|poem|creative|fiction|character|plot|world-?build|imagine|brainstorm|idea|concept|invent)\b/i,
      persona: "a versatile creative director with experience in fiction, screenwriting, and conceptual ideation",
      extras: "Specify genre, tone, stylistic inspirations, length, and any constraints or themes to explore."
    }
  };
  function classifyTask(text) {
    for (const [type, profile] of Object.entries(TASK_PROFILES)) {
      if (profile.keywords.test(text)) return { type, ...profile };
    }
    return {
      type: "general",
      persona: "an expert AI systems prompt engineer and cognitive task strategist",
      extras: "Ensure full clarity, context, output format, and success criteria are present."
    };
  }
  function analyzePromptQuality(text) {
    const issues = [];
    const word_count = text.trim().split(/\s+/).length;
    if (word_count < 8) issues.push("extremely terse \u2014 expand scope and intent");
    if (!/\bwhy\b|\bgoal\b|\bfor\b|\bbecause\b/i.test(text)) issues.push("no stated purpose or goal");
    if (!/\bformat\b|\blist\b|\btable\b|\bsummary\b|\bparagraph\b|\bsteps\b/i.test(text)) issues.push("no output format specified");
    if (!/\bexample\b|\blike\b|\bsuch as\b|\be\.g\b/i.test(text)) issues.push("no examples or reference points");
    if (word_count > 300) issues.push("possibly over-specified \u2014 consider splitting into sub-tasks");
    return issues;
  }
  function buildSystemInstruction(rawText, mode) {
    const task = classifyTask(rawText);
    const issues = analyzePromptQuality(rawText);
    const issueBlock = issues.length ? `
**Detected Weaknesses to Fix:**
${issues.map((i) => `  - ${i}`).join("\n")}` : "\n**Note:** The input has reasonable structure \u2014 focus on elevating precision and richness.";
    const modeBlock = {
      Quick: "\n**Mode: Quick** \u2014 Be concise. Prioritize structure and clarity over exhaustive detail. Aim for \u2264150 words.",
      Expert: "\n**Mode: Expert** \u2014 Apply chain-of-thought decomposition. Break complex goals into layered sub-tasks. Add reasoning scaffolding, conditional logic, and edge-case handling.",
      Standard: ""
    }[mode] ?? "";
    return `You are ${task.persona}, acting as an elite prompt engineering system.

Your ONLY job is to transform the user's raw input into a production-grade, highly optimized prompt for a large language model.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
 TASK TYPE DETECTED: ${task.type.toUpperCase()}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${issueBlock}

## Your Transformation Protocol

### Step 1 \u2014 Deconstruct Intent
Identify the atomic goal. Strip ambiguity. Recover what the user *actually* wants, even if they expressed it poorly.

### Step 2 \u2014 Apply Role Engineering
Open with a precise role assignment that primes the model for expert-level output.
Example: "You are a [specific expert] with deep experience in [domain]..."

### Step 3 \u2014 Inject Context & Constraints
Add all relevant context the model needs:
- Domain-specific vocabulary or standards
- Constraints (length, format, tone, audience, tech stack, etc.)
- ${task.extras}

### Step 4 \u2014 Specify Output Format Explicitly
Define the exact structure of the expected response:
- Use headers, lists, tables, code blocks, or prose as appropriate
- Specify length expectations if relevant
- Add quality gates: "Ensure no step is skipped", "Validate all edge cases", etc.

### Step 5 \u2014 Add Grounding Anchors
Include 1\u20132 clarifying instructions that prevent the model from going off-track:
- "If X is ambiguous, assume Y"
- "Prioritize Z over W"
- "Do not include boilerplate or caveats"

## Hard Rules
- Return ONLY the improved prompt \u2014 zero commentary, zero preamble
- Do NOT answer, solve, or respond to the content of the prompt
- Do NOT wrap output in quotes or code blocks
- Preserve the original intent \u2014 enhance, never distort
${modeBlock}`;
  }
  async function withRetry(fn, retries = MAX_RETRIES, delayMs = RETRY_DELAY) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        const isLast = attempt === retries;
        const isRetryable = /5\d\d|429|network/i.test(err.message);
        if (isLast || !isRetryable) throw err;
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      }
    }
  }
  function extractText(data) {
    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("").trim();
    if (!text) {
      const reason = candidate?.finishReason;
      if (reason === "SAFETY") throw new Error("SAFETY_BLOCK: Response blocked by Gemini safety filters.");
      if (reason === "MAX_TOKENS") throw new Error("TOKEN_LIMIT: Response was cut off. Try a shorter input.");
      throw new Error(`UNEXPECTED_RESPONSE: ${JSON.stringify(data)}`);
    }
    return text;
  }
  function sendViaExtension(url, body) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "FETCH_GEMINI", url, body }, (response) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (response?.error) return reject(new Error(response.error));
        resolve(response.text);
      });
    });
  }
  async function fetchDirect(url, body, signal) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => "unknown error");
      const code = response.status;
      if (code === 429) throw new Error(`429: Rate limited by Gemini API. Wait a moment and retry.`);
      if (code === 400) throw new Error(`400: Bad request \u2014 check your prompt or API key.`);
      if (code === 403) throw new Error(`403: Invalid or unauthorized API key.`);
      throw new Error(`API_ERROR: ${code} \u2014 ${errText}`);
    }
    const data = await response.json();
    return extractText(data);
  }
  async function improvePrompt(originalText, overrides = {}) {
    if (!originalText?.trim()) throw new Error("EMPTY_INPUT: No prompt text provided.");
    const settings = await getSettings();
    const apiKey = settings.geminiApiKey;
    if (!apiKey) throw new Error("API_KEY_MISSING");
    const mode = overrides.mode ?? settings.improvementMode ?? "Standard";
    const signal = overrides.signal ?? null;
    const systemInstruction = buildSystemInstruction(originalText, mode);
    const url = `${API_BASE}/${MODEL}:generateContent?key=${apiKey}`;
    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{
        role: "user",
        parts: [{ text: originalText }]
      }],
      generationConfig: {
        temperature: mode === "Expert" ? 0.4 : 0.25,
        maxOutputTokens: mode === "Quick" ? 1024 : 2048,
        topP: 0.9,
        topK: 40
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
      ]
    };
    const isExtension = typeof chrome !== "undefined" && chrome.runtime?.sendMessage;
    return withRetry(async () => {
      if (isExtension) {
        return sendViaExtension(url, requestBody);
      }
      return fetchDirect(url, requestBody, signal);
    });
  }

  // src/main-ui.js
  function showMainApp(improvedTextPromise, onReplaceCallback) {
    let existingModal = document.getElementById("ai-prompt-reframer-main");
    if (existingModal) existingModal.remove();
    const modal = document.createElement("div");
    modal.id = "ai-prompt-reframer-main";
    Object.assign(modal.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "400px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      zIndex: "999999",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "24px",
      color: "#111827",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    });
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    const title = document.createElement("h2");
    title.textContent = "AI Prompt Reframer";
    title.style.margin = "0";
    title.style.fontSize = "1.25rem";
    const settingsBtn = document.createElement("button");
    settingsBtn.innerHTML = "\u2699\uFE0F";
    settingsBtn.style.background = "none";
    settingsBtn.style.border = "none";
    settingsBtn.style.cursor = "pointer";
    settingsBtn.style.fontSize = "1.2rem";
    settingsBtn.addEventListener("click", () => {
      showSettings();
    });
    header.appendChild(title);
    header.appendChild(settingsBtn);
    const bodyContainer = document.createElement("div");
    bodyContainer.id = "pr-body-container";
    bodyContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100px;">
           <span style="display: inline-block; animation: pr-spin 1s linear infinite;">\u23F3</span>
           <p style="margin-top: 8px; color: #6b7280; font-size: 0.875rem;">Optimizing Prompt with Gemini...</p>
        </div>
        <style>
          @keyframes pr-spin { 100% { transform: rotate(360deg); } }
        </style>
    `;
    const controls = document.createElement("div");
    controls.style.display = "none";
    controls.style.justifyContent = "flex-end";
    controls.style.gap = "8px";
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.padding = "8px 16px";
    closeBtn.style.border = "1px solid #d1d5db";
    closeBtn.style.background = "transparent";
    closeBtn.style.borderRadius = "4px";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => modal.remove());
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.style.padding = "8px 16px";
    copyBtn.style.border = "1px solid #d1d5db";
    copyBtn.style.background = "#f3f4f6";
    copyBtn.style.borderRadius = "4px";
    copyBtn.style.cursor = "pointer";
    const replaceBtn = document.createElement("button");
    replaceBtn.textContent = "Replace & Close";
    replaceBtn.style.padding = "8px 16px";
    replaceBtn.style.border = "none";
    replaceBtn.style.background = "#2563eb";
    replaceBtn.style.color = "white";
    replaceBtn.style.borderRadius = "4px";
    replaceBtn.style.fontWeight = "500";
    replaceBtn.style.cursor = "pointer";
    controls.appendChild(closeBtn);
    controls.appendChild(copyBtn);
    controls.appendChild(replaceBtn);
    modal.appendChild(header);
    modal.appendChild(bodyContainer);
    modal.appendChild(controls);
    document.body.appendChild(modal);
    improvedTextPromise.then((improvedText) => {
      bodyContainer.innerHTML = "";
      const textArea = document.createElement("textarea");
      textArea.value = improvedText;
      textArea.readOnly = true;
      textArea.style.width = "100%";
      textArea.style.height = "150px";
      textArea.style.padding = "12px";
      textArea.style.border = "1px solid #d1d5db";
      textArea.style.borderRadius = "4px";
      textArea.style.boxSizing = "border-box";
      textArea.style.fontFamily = "monospace";
      textArea.style.fontSize = "0.875rem";
      textArea.style.resize = "vertical";
      bodyContainer.appendChild(textArea);
      controls.style.display = "flex";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(improvedText);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 2e3);
      });
      replaceBtn.addEventListener("click", () => {
        if (onReplaceCallback) onReplaceCallback(improvedText);
        modal.remove();
      });
    }).catch((error) => {
      bodyContainer.innerHTML = `
            <div style="color: #ef4444; background: #fee2e2; border: 1px solid #f87171; padding: 12px; border-radius: 4px; font-size: 0.875rem;">
                <strong>API Request Failed</strong>
                <p style="margin: 4px 0 0 0; word-break: break-all;">${error.message}</p>
            </div>
        `;
      controls.innerHTML = "";
      controls.appendChild(closeBtn);
      controls.style.display = "flex";
      if (error.message.includes("API_KEY_MISSING")) {
        showSettings();
        modal.remove();
      }
    });
  }

  // src/index.js
  async function init() {
    const adapter = await getAdapter();
    const originalPrompt = adapter.getPrompt();
    if (!originalPrompt || originalPrompt.trim() === "") {
      alert("AI Prompt Reframer: No detectable text input found. Focus on the text area and type something first!");
      return;
    }
    const settings = await getSettings();
    if (!settings.geminiApiKey) {
      showSettings(() => init());
      return;
    }
    const promise = improvePrompt(originalPrompt);
    showMainApp(promise, (improvedText) => {
      const success = adapter.setPrompt(improvedText);
      if (!success) {
        alert("Failed to automatically inject text into this website. Use the Copy button instead.");
      }
    });
  }

  // src/content.js
  if (!window.__AI_PROMPT_REFRAMER_INJECTED__) {
    window.__AI_PROMPT_REFRAMER_INJECTED__ = true;
  }
  init();
})();
