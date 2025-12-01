# 📘 Zen Reader – Distraction-Free Reader Mode with AI Text-to-Speech

**Zen Reader** is a privacy-first browser extension that transforms cluttered web pages into clean, distraction-free reading experiences. It features **AI-powered content extraction** (using Google Gemini) and a powerful **Text-to-Speech** engine.

![Zen Reader Badge](https://img.shields.io/badge/Status-Stable-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-green)

---

## 🚀 Features

- **🧠 AI-Powered Extraction**: Uses Google Gemini (Client-Side) to intelligently parse articles.
- **⚡ Offline Fallback**: Automatically switches to Mozilla Readability if offline or no API key.
- **🔊 Text-to-Speech**: High-quality speech synthesis with adjustable speed (0.5x - 2.0x).
- **🎨 Customization**: Light/Dark mode, fonts (Serif, Sans, Mono), and clean typography.
- **🔒 Privacy First**:
  - No Backend Servers.
  - No Analytics.
  - API Keys stored locally in your browser.

---

## 🛠️ Tech Stack (Apex Standards)

This project is built with the **Apex Toolchain 2025**:
- **Framework**: [WXT (Web Extension Toolbox)](https://wxt.dev)
- **UI**: React 18 + TypeScript + Tailwind CSS
- **Build**: Vite
- **Testing**: Vitest (Unit)
- **Linting**: Biome

---

## 🔧 Installation

### Developer Mode (Chrome / Edge / Brave)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/zen-reader.git
   cd zen-reader
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Extension**:
   ```bash
   npm run build
   ```
   This creates a `.output/chrome-mv3` directory.

4. **Load in Browser**:
   - Go to `chrome://extensions/`
   - Enable **Developer Mode** (top right).
   - Click **Load Unpacked**.
   - Select the `.output/chrome-mv3` folder.

---

## 🔑 Setup AI Extraction

To enable AI-powered extraction:
1. Get a free API Key from [Google AI Studio](https://aistudio.google.com/).
2. Open **Zen Reader** extension popup.
3. Enter Reader Mode on any article.
4. Click the **Settings (⚙️)** icon.
5. Paste your API Key.

---

## ⭐ Support the Project

If Zen Reader improves your reading experience, please consider giving the project a ⭐ on GitHub!

---

## 📜 License

MIT License.
