chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'FETCH_GEMINI') {
        const { url, body } = request;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(async (response) => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API_ERROR: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const candidate = data.candidates?.[0];
            if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0].text) {
                throw new Error(`UNEXPECTED_RESPONSE: ${JSON.stringify(data)}`);
            }

            sendResponse({ text: candidate.content.parts[0].text });
        })
        .catch(error => {
            console.error('Gemini API Background Fetch failed:', error);
            sendResponse({ error: error.message });
        });

        // Return true to indicate we will send a response asynchronously
        return true;
    }
});
