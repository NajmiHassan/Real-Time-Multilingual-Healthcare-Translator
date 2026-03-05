# Real-Time Healthcare Translator

A React-Vite web application that enables real-time, multilingual communication between patients and healthcare providers. Convert spoken or typed input into text, get it translated, and play it back—all without requiring any API keys or paid services.

## Features

- **Speech recognition** — Speak into your microphone to capture text (Chrome/Chromium recommended)
- **Manual text input** — Type directly if speech recognition isn't available or fails (e.g., network issues)
- **Text enhancement** — Client-side formatting (capitalization, punctuation)
- **Translation** — Uses MyMemory Translation API (free, no API key required)
- **Audio playback** — Speak the translated text aloud using the browser's speech synthesis

## Tech Stack

- **React 18** + **TypeScript** + **Vite 6**
- **Tailwind CSS** for styling
- **Web Speech API** for speech recognition and synthesis
- **MyMemory API** for translation (free tier)
- **Axios** for HTTP requests

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NajmiHassan/Real-Time-Multilingual-Healthcare-Translator.git
   cd Real-Time-Multilingual-Healthcare-Translator
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **No configuration required** — the app works out of the box. No API keys, `.env` file, or external services to set up.

## Running the Project

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. For speech recognition, use Chrome or another Chromium-based browser.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/    # React components (Main.tsx)
├── hooks/        # Custom hooks (useSpeechRecognitionHook)
├── services/     # Translation and enhancement logic
│   ├── translationService.ts   # MyMemory API integration
│   └── openaiService.ts       # Client-side text enhancement
├── App.tsx
├── main.tsx
└── index.css
```

For a detailed explanation of the project and data flow, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Usage

1. Select the **input language** (language you'll speak or type in)
2. Select the **target language** (language you want the translation in)
3. Either:
   - Click **Start Listening** and speak, or
   - Type in the text area and click **Submit**
4. Click **Translate** to get the translated text
5. Optionally, click **Speak Translated Text** to hear the translation

## Limitations

- **Speech recognition** requires Chrome/Chromium and a stable internet connection; it sends audio to Google's servers
- **MyMemory free tier** has a daily character limit (~5,000 characters); for heavier use, consider their paid tier
- Translation quality is general-purpose, not medical-specific; for critical healthcare decisions, use professional interpreters

## License

This project is licensed under the MIT License.
