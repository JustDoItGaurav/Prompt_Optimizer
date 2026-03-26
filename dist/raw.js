(()=>{var R=Object.defineProperty;var w=(e,t)=>{for(var n in t)R(e,n,{get:t[n],enumerable:!0})};var E={};w(E,{getPrompt:()=>_,getSiteName:()=>z,setPrompt:()=>M});var y={};w(y,{getPrompt:()=>g,getSiteName:()=>N,setPrompt:()=>f,simulateFrameworkInput:()=>v});function C(){let e=[];if(document.querySelectorAll("textarea").forEach(o=>e.push(o)),document.querySelectorAll('[contenteditable="true"]').forEach(o=>e.push(o)),document.querySelectorAll('[role="textbox"]').forEach(o=>{e.includes(o)||e.push(o)}),e.length===0)return null;let i=null,a=-1;for(let o of e){let s="";o.tagName.toLowerCase()==="textarea"||o.tagName.toLowerCase()==="input"?s=o.value||"":s=o.innerText||o.textContent||"",s.length>a&&(a=s.length,i=o)}return i}function v(e,t){if(!e)return;if(e.focus(),e.tagName.toLowerCase()==="textarea"||e.tagName.toLowerCase()==="input"){let r=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,"value").set;r?r.call(e,t):e.value=t}else e.innerText=t;e.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new InputEvent("input",{bubbles:!0,data:t,inputType:"insertText"}))}function g(){let e=C();return e?e.tagName.toLowerCase()==="textarea"||e.tagName.toLowerCase()==="input"?e.value||"":e.innerText||e.textContent||"":""}function f(e){let t=C();return t?(v(t,e),!0):!1}function N(){return"Generic"}function _(){let e=document.querySelector("#prompt-textarea");if(e){let t=e.tagName.toLowerCase()==="textarea"?e.value:e.innerText||e.textContent;if(t)return t}return g()}function M(e){let t=document.querySelector("#prompt-textarea");return t?(v(t,e),!0):f(e)}function z(){return"ChatGPT"}var S={};w(S,{getPrompt:()=>G,getSiteName:()=>H,setPrompt:()=>Y});function G(){let e=document.querySelector('div[contenteditable="true"].ProseMirror');return e?e.innerText||"":g()}function Y(e){let t=document.querySelector('div[contenteditable="true"].ProseMirror');return t?(t.textContent=e,t.dispatchEvent(new Event("input",{bubbles:!0})),!0):f(e)}function H(){return"Claude"}var I={};w(I,{getPrompt:()=>B,getSiteName:()=>K,setPrompt:()=>$});function B(){let e=document.querySelector('rich-textarea div[contenteditable="true"]');return e?e.innerText||"":g()}function $(e){let t=document.querySelector('rich-textarea div[contenteditable="true"]');return t?(t.textContent=e,t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0})),!0):f(e)}function K(){return"Gemini"}var x="ai_prompt_reframer_settings",k={geminiApiKey:"",improvementMode:"Standard",targetOverride:"auto"};async function m(){if(typeof chrome<"u"&&chrome.storage)return new Promise(e=>{chrome.storage.local.get([x],t=>{t[x]?e({...k,...t[x]}):e(k)})});if(typeof window<"u"&&window.localStorage)try{let e=window.localStorage.getItem(x);if(e)return{...k,...JSON.parse(e)}}catch(e){console.warn("AI Prompt Reframer: Failed to read from localStorage",e)}return k}async function P(e){let n={...await m(),...e};if(typeof chrome<"u"&&chrome.storage)return new Promise(r=>{chrome.storage.local.set({[x]:n},()=>{r(!0)})});if(typeof window<"u"&&window.localStorage)try{return window.localStorage.setItem(x,JSON.stringify(n)),!0}catch(r){return console.error("AI Prompt Reframer: Failed to save to localStorage",r),!1}return!1}async function T(){let e=await m();if(e.targetOverride&&e.targetOverride!=="auto")switch(e.targetOverride){case"chatgpt":return E;case"claude":return S;case"gemini":return I;case"generic":return y}let t=window.location.hostname;return t.includes("chatgpt.com")?E:t.includes("claude.ai")?S:t.includes("gemini.google.com")?I:y}async function b(e){let t=document.getElementById("ai-prompt-reframer-settings");t&&t.remove();let n=await m(),r=document.createElement("div");r.id="ai-prompt-reframer-settings",Object.assign(r.style,{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"400px",backgroundColor:"#ffffff",borderRadius:"8px",boxShadow:"0 4px 24px rgba(0,0,0,0.15)",zIndex:"999999",fontFamily:"system-ui, -apple-system, sans-serif",padding:"24px",color:"#111827"}),r.innerHTML=`
        <h2 style="margin: 0 0 16px 0; font-size: 1.25rem;">Reframer Settings</h2>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Gemini API Key</label>
            <input type="password" id="pr-api-key" placeholder="AIzaSy..." value="${n.geminiApiKey}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;">
            <small style="display: block; font-size: 0.75rem; color: #6b7280; margin-top: 4px;">Stored locally. Never shared.</small>
        </div>

        <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Improvement Mode</label>
            <select id="pr-improve-mode" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="Quick" ${n.improvementMode==="Quick"?"selected":""}>Quick (Fastest)</option>
                <option value="Standard" ${n.improvementMode==="Standard"?"selected":""}>Standard</option>
                <option value="Expert" ${n.improvementMode==="Expert"?"selected":""}>Expert (Deep reasoning)</option>
            </select>
        </div>

        <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Adapter Override</label>
            <select id="pr-target-override" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                <option value="auto" ${n.targetOverride==="auto"?"selected":""}>Auto-Detect</option>
                <option value="chatgpt" ${n.targetOverride==="chatgpt"?"selected":""}>ChatGPT</option>
                <option value="claude" ${n.targetOverride==="claude"?"selected":""}>Claude</option>
                <option value="gemini" ${n.targetOverride==="gemini"?"selected":""}>Gemini</option>
                <option value="generic" ${n.targetOverride==="generic"?"selected":""}>Generic Textarea</option>
            </select>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button id="pr-settings-close" style="padding: 8px 16px; border: 1px solid #d1d5db; background: transparent; border-radius: 4px; cursor: pointer;">Close</button>
            <button id="pr-settings-save" style="padding: 8px 16px; border: none; background: #2563eb; color: white; border-radius: 4px; cursor: pointer; font-weight: 500;">Save Settings</button>
        </div>
    `,document.body.appendChild(r),document.getElementById("pr-settings-close").addEventListener("click",()=>{r.remove(),e&&e()}),document.getElementById("pr-settings-save").addEventListener("click",async()=>{let i=document.getElementById("pr-api-key").value.trim(),a=document.getElementById("pr-improve-mode").value,o=document.getElementById("pr-target-override").value;await P({geminiApiKey:i,improvementMode:a,targetOverride:o}),r.remove(),e&&e()})}var D="gemini-2.5-flash",F="https://generativelanguage.googleapis.com/v1beta/models",q=3,j=800,U={coding:{keywords:/\b(code|function|class|bug|error|implement|refactor|api|script|algorithm|sql|regex|debug|typescript|python|rust|go|java)\b/i,persona:"a principal software engineer with 15+ years of experience across systems, web, and ML engineering",extras:"Specify language, runtime, constraints, edge cases, expected I/O, and error handling requirements."},writing:{keywords:/\b(write|essay|article|blog|email|letter|copy|tone|audience|persuasive|narrative|draft|edit|proofread)\b/i,persona:"an award-winning editor and content strategist who has written for top-tier publications",extras:"Define the target audience, tone (formal/casual/persuasive), format, and desired emotional impact."},analysis:{keywords:/\b(analyze|compare|evaluate|assess|review|pros|cons|trade-?off|research|summarize|breakdown|explain)\b/i,persona:"a senior research analyst skilled in structured reasoning and evidence-based synthesis",extras:"Frame the analysis with clear criteria, depth of reasoning required, and output structure (table, bullets, prose)."},design:{keywords:/\b(design|ui|ux|layout|component|wireframe|figma|visual|branding|color|typography|mockup)\b/i,persona:"a principal product designer with deep expertise in UX research and visual design systems",extras:"Include target platform, user persona, accessibility needs, and stylistic direction."},data:{keywords:/\b(data|dataset|csv|excel|chart|graph|visualization|statistics|trend|metric|dashboard|pandas|excel)\b/i,persona:"a senior data scientist and analyst who specializes in insight extraction and data storytelling",extras:"Specify data structure, analysis goal, visualization preferences, and any statistical constraints."},creative:{keywords:/\b(story|poem|creative|fiction|character|plot|world-?build|imagine|brainstorm|idea|concept|invent)\b/i,persona:"a versatile creative director with experience in fiction, screenwriting, and conceptual ideation",extras:"Specify genre, tone, stylistic inspirations, length, and any constraints or themes to explore."}};function Q(e){for(let[t,n]of Object.entries(U))if(n.keywords.test(e))return{type:t,...n};return{type:"general",persona:"an expert AI systems prompt engineer and cognitive task strategist",extras:"Ensure full clarity, context, output format, and success criteria are present."}}function X(e){let t=[],n=e.trim().split(/\s+/).length;return n<8&&t.push("extremely terse \u2014 expand scope and intent"),/\bwhy\b|\bgoal\b|\bfor\b|\bbecause\b/i.test(e)||t.push("no stated purpose or goal"),/\bformat\b|\blist\b|\btable\b|\bsummary\b|\bparagraph\b|\bsteps\b/i.test(e)||t.push("no output format specified"),/\bexample\b|\blike\b|\bsuch as\b|\be\.g\b/i.test(e)||t.push("no examples or reference points"),n>300&&t.push("possibly over-specified \u2014 consider splitting into sub-tasks"),t}function J(e,t){let n=Q(e),r=X(e),i=r.length?`
**Detected Weaknesses to Fix:**
${r.map(o=>`  - ${o}`).join(`
`)}`:`
**Note:** The input has reasonable structure \u2014 focus on elevating precision and richness.`,a={Quick:`
**Mode: Quick** \u2014 Be concise. Prioritize structure and clarity over exhaustive detail. Aim for \u2264150 words.`,Expert:`
**Mode: Expert** \u2014 Apply chain-of-thought decomposition. Break complex goals into layered sub-tasks. Add reasoning scaffolding, conditional logic, and edge-case handling.`,Standard:""}[t]??"";return`You are ${n.persona}, acting as an elite prompt engineering system.

Your ONLY job is to transform the user's raw input into a production-grade, highly optimized prompt for a large language model.

\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
 TASK TYPE DETECTED: ${n.type.toUpperCase()}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
${i}

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
- ${n.extras}

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
${a}`}async function W(e,t=q,n=j){for(let r=1;r<=t;r++)try{return await e()}catch(i){let a=r===t,o=/5\d\d|429|network/i.test(i.message);if(a||!o)throw i;await new Promise(s=>setTimeout(s,n*r))}}function V(e){let t=e?.candidates?.[0],n=t?.content?.parts?.map(r=>r.text??"").join("").trim();if(!n){let r=t?.finishReason;throw r==="SAFETY"?new Error("SAFETY_BLOCK: Response blocked by Gemini safety filters."):r==="MAX_TOKENS"?new Error("TOKEN_LIMIT: Response was cut off. Try a shorter input."):new Error(`UNEXPECTED_RESPONSE: ${JSON.stringify(e)}`)}return n}function Z(e,t){return new Promise((n,r)=>{chrome.runtime.sendMessage({action:"FETCH_GEMINI",url:e,body:t},i=>{if(chrome.runtime.lastError)return r(new Error(chrome.runtime.lastError.message));if(i?.error)return r(new Error(i.error));n(i.text)})})}async function ee(e,t,n){let r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t),signal:n});if(!r.ok){let a=await r.text().catch(()=>"unknown error"),o=r.status;throw o===429?new Error("429: Rate limited by Gemini API. Wait a moment and retry."):o===400?new Error("400: Bad request \u2014 check your prompt or API key."):o===403?new Error("403: Invalid or unauthorized API key."):new Error(`API_ERROR: ${o} \u2014 ${a}`)}let i=await r.json();return V(i)}async function O(e,t={}){if(!e?.trim())throw new Error("EMPTY_INPUT: No prompt text provided.");let n=await m(),r=n.geminiApiKey;if(!r)throw new Error("API_KEY_MISSING");let i=t.mode??n.improvementMode??"Standard",a=t.signal??null,o=J(e,i),s=`${F}/${D}:generateContent?key=${r}`,c={systemInstruction:{parts:[{text:o}]},contents:[{role:"user",parts:[{text:e}]}],generationConfig:{temperature:i==="Expert"?.4:.25,maxOutputTokens:i==="Quick"?1024:2048,topP:.9,topK:40},safetySettings:[{category:"HARM_CATEGORY_HARASSMENT",threshold:"BLOCK_ONLY_HIGH"},{category:"HARM_CATEGORY_HATE_SPEECH",threshold:"BLOCK_ONLY_HIGH"},{category:"HARM_CATEGORY_SEXUALLY_EXPLICIT",threshold:"BLOCK_ONLY_HIGH"},{category:"HARM_CATEGORY_DANGEROUS_CONTENT",threshold:"BLOCK_ONLY_HIGH"}]},p=typeof chrome<"u"&&chrome.runtime?.sendMessage;return W(async()=>p?Z(s,c):ee(s,c,a))}function L(e,t){let n=document.getElementById("ai-prompt-reframer-main");n&&n.remove();let r=document.createElement("div");r.id="ai-prompt-reframer-main",Object.assign(r.style,{position:"fixed",top:"20px",right:"20px",width:"400px",backgroundColor:"#ffffff",borderRadius:"8px",boxShadow:"0 4px 24px rgba(0,0,0,0.15)",zIndex:"999999",fontFamily:"system-ui, -apple-system, sans-serif",padding:"24px",color:"#111827",display:"flex",flexDirection:"column",gap:"16px"});let i=document.createElement("div");i.style.display="flex",i.style.justifyContent="space-between",i.style.alignItems="center";let a=document.createElement("h2");a.textContent="AI Prompt Reframer",a.style.margin="0",a.style.fontSize="1.25rem";let o=document.createElement("button");o.innerHTML="\u2699\uFE0F",o.style.background="none",o.style.border="none",o.style.cursor="pointer",o.style.fontSize="1.2rem",o.addEventListener("click",()=>{b()}),i.appendChild(a),i.appendChild(o);let s=document.createElement("div");s.id="pr-body-container",s.innerHTML=`
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100px;">
           <span style="display: inline-block; animation: pr-spin 1s linear infinite;">\u23F3</span>
           <p style="margin-top: 8px; color: #6b7280; font-size: 0.875rem;">Optimizing Prompt with Gemini...</p>
        </div>
        <style>
          @keyframes pr-spin { 100% { transform: rotate(360deg); } }
        </style>
    `;let c=document.createElement("div");c.style.display="none",c.style.justifyContent="flex-end",c.style.gap="8px";let p=document.createElement("button");p.textContent="Close",p.style.padding="8px 16px",p.style.border="1px solid #d1d5db",p.style.background="transparent",p.style.borderRadius="4px",p.style.cursor="pointer",p.addEventListener("click",()=>r.remove());let l=document.createElement("button");l.textContent="Copy",l.style.padding="8px 16px",l.style.border="1px solid #d1d5db",l.style.background="#f3f4f6",l.style.borderRadius="4px",l.style.cursor="pointer";let u=document.createElement("button");u.textContent="Replace & Close",u.style.padding="8px 16px",u.style.border="none",u.style.background="#2563eb",u.style.color="white",u.style.borderRadius="4px",u.style.fontWeight="500",u.style.cursor="pointer",c.appendChild(p),c.appendChild(l),c.appendChild(u),r.appendChild(i),r.appendChild(s),r.appendChild(c),document.body.appendChild(r),e.then(h=>{s.innerHTML="";let d=document.createElement("textarea");d.value=h,d.readOnly=!0,d.style.width="100%",d.style.height="150px",d.style.padding="12px",d.style.border="1px solid #d1d5db",d.style.borderRadius="4px",d.style.boxSizing="border-box",d.style.fontFamily="monospace",d.style.fontSize="0.875rem",d.style.resize="vertical",s.appendChild(d),c.style.display="flex",l.addEventListener("click",()=>{navigator.clipboard.writeText(h),l.textContent="Copied!",setTimeout(()=>{l.textContent="Copy"},2e3)}),u.addEventListener("click",()=>{t&&t(h),r.remove()})}).catch(h=>{s.innerHTML=`
            <div style="color: #ef4444; background: #fee2e2; border: 1px solid #f87171; padding: 12px; border-radius: 4px; font-size: 0.875rem;">
                <strong>API Request Failed</strong>
                <p style="margin: 4px 0 0 0; word-break: break-all;">${h.message}</p>
            </div>
        `,c.innerHTML="",c.appendChild(p),c.style.display="flex",h.message.includes("API_KEY_MISSING")&&(b(),r.remove())})}async function A(){let e=await T(),t=e.getPrompt();if(!t||t.trim()===""){alert("AI Prompt Reframer: No detectable text input found. Focus on the text area and type something first!");return}if(!(await m()).geminiApiKey){b(()=>A());return}let r=O(t);L(r,i=>{e.setPrompt(i)||alert("Failed to automatically inject text into this website. Use the Copy button instead.")})}typeof document<"u"&&A();})();
