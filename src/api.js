import { getSettings } from './storage.js';

export async function improvePrompt(originalText) {
    const settings = getSettings();
    const apiKey = settings.geminiApiKey;

    if (!apiKey) {
        throw new Error('API_KEY_MISSING');
    }

    const mode = settings.improvementMode || 'Standard';
    
    // Construct Meta-Prompt
    let systemInstruction = "You are an expert prompt engineer. Your job is to restructure the user's stream-of-consciousness input into a highly effective, professional prompt.";
    systemInstruction += " Ensure you define a clear role, context, explicit steps, and an output format. Preserve the original intent exactly. Do not add conversational filler. Output ONLY the improved prompt text.";
    
    if (mode === 'Quick') {
        systemInstruction += " Be concise, fast, and structured.";
    } else if (mode === 'Expert') {
        systemInstruction += " Use advanced reasoning frameworks and highly specific constraints. Break down complex requests into granular sub-tasks.";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        systemInstruction: {
            parts: [{ text: systemInstruction }]
        },
        contents: [
            {
                role: "user",
                parts: [{ text: originalText }]
            }
        ],
        generationConfig: {
            temperature: 0.3, // Low temperature for deterministic/professional output
            maxOutputTokens: 2048,
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API_ERROR: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0].text) {
            throw new Error(`UNEXPECTED_RESPONSE: ${JSON.stringify(data)}`);
        }

        return candidate.content.parts[0].text;

    } catch (e) {
        if (e.message === 'API_KEY_MISSING') throw e; // Forward specific errors
        console.error('Gemini API Fetch failed:', e);
        throw e;
    }
}
