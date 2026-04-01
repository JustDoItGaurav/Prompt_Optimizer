# AI Prompt Reframer

**AI Prompt Reframer** is a local-first Chrome Extension that instantly upgrades your everyday AI prompts using professional prompt engineering techniques. Powered by the Gemini API, it analyzes your input, structures your thoughts, and delivers a fully optimized prompt that you can copy or apply directly into your favorite AI tool.

## 🚀 Features

- **On-the-Fly Prompt Reframing:** Improve your inputs instantly before hitting send to ChatGPT, Gemini, Claude, or other AI playgrounds.
- **Two Modes (Quick & Expert):**
  - **Quick**: A fast, concise enhancement that refines your question without adding unnecessary length.
  - **Expert**: A 6-step prompt engineering framework that deeply structures your thoughts, role-plays, specifies the format, and adds strict constraints.
- **Secure & Local-First:** Your Gemini API keys are strictly and securely saved in your browser's local storage. There is no middleman server tracking your prompts.
- **Universal Compatibility:** Built using a flexible "Adapter Pattern" that allows the extension to interact with various AI query input boxes across different websites.
- **Clean UI & Workflow:** Presents the heavily structured output in a clean, non-intrusive modal, letting you quickly copy or seamlessly replace the original text.

## 🛠️ Installation

Since this extension requires a Gemini API key and is operated locally, you can easily install it into Chrome via **Developer Mode**.

### 1. Download the code
1. Go to the [GitHub Repository](https://github.com/JustDoItGaurav/Prompt_Optimizer) (or download this project files locally).
2. Click on the `<> Code` button and select **Download ZIP**.
3. Extract the downloaded ZIP file to a convenient location on your computer.

### 2. Add to Chrome
1. Open Google Chrome.
2. In the URL bar, navigate to `chrome://extensions/`.
3. In the top right corner, toggle **Developer mode** to ON.
4. Click the **Load unpacked** button on the top left.
5. Select the `dist` folder located inside the folder you extracted in Step 1.

### 3. Setup Gemini API Key
1. In Chrome, click the Puzzle piece icon (Extensions) in the top right.
2. Pin **AI Prompt Reframer**.
3. Click the extension icon. You will be prompted to enter your **Gemini API Key**.
   *(You can grab a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*
4. Paste the key, save it, and start reframing!

## 💡 Usage

1. Navigate to your favorite AI platform (like ChatGPT, Gemini, or Claude).
2. Type your rough idea into the chat box.
3. Depending on how the adapters have been set up for the page, trigger the reframing or use the extension popup to hit "Reframe Prompt".
4. A modal will appear showing your newly engineered, structured prompt.
5. Hit **"Copy"** or allow it to **"Replace"** your text directly in the chat box, and hit send!

## 💻 Tech Stack
- Vanilla JavaScript
- Chrome Extension Manifest V3
- HTML/CSS (Clean, modern glassmorphism or minimalist UI)
- Chrome Storage API (for local secure key management)

## 🤝 Contributing
Want to improve the prompt engineering algorithms, add quick adapters for more sites, or refine the UI? Feel free to fork the repo, make your changes, and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is open-source. Feel free to use and modify the code!
