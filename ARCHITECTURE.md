# Project Architecture & Backend Flow

This document describes how the Real-Time Healthcare Translator works, including the data flow, services, and external APIs.

---

## Overview

The application is a **client-side SPA** (Single Page Application). All processing runs in the browser; there is no custom backend server. The app connects to:

1. **Google's Speech Recognition** (via Web Speech API) — for speech-to-text
2. **MyMemory Translation API** — for text translation
3. **Browser Speech Synthesis** — for text-to-speech playback

---

## High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INPUT                                      │
├──────────────────────────────┬──────────────────────────────────────────┤
│   Speech (microphone)        │   Manual text (typed)                      │
└──────────────┬───────────────┴───────────────────┬──────────────────────┘
               │                                    │
               ▼                                    │
┌──────────────────────────────┐                    │
│  Web Speech API (Chrome)     │                    │
│  - Sends audio to Google     │                    │
│  - Returns transcript        │                    │
└──────────────┬───────────────┘                    │
               │                                    │
               └────────────────┬───────────────────┘
                                ▼
┌──────────────────────────────┐
│  Enhancement (client-side)   │
│  - Capitalize first letter  │
│  - Add punctuation           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  MyMemory Translation API   │
│  - HTTP GET request         │
│  - Returns translated text   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Speech Synthesis (browser)  │
│  - Optional audio playback   │
└──────────────────────────────┘
```

---

## Component Structure

### 1. Main Component (`src/components/Main.tsx`)

The top-level UI component. It:

- Renders language selectors (input and target)
- Renders action buttons (Start Listening, Stop Listening, Submit, Translate, Speak)
- Displays the text area for manual input
- Displays original transcript, enhanced text, and translated text
- Shows errors (e.g., "network" for speech recognition failures)

**State:** `inputLanguage`, `targetLanguage`, `manualInput`

### 2. useSpeechRecognition Hook (`src/hooks/useSpeechRecognitionHook.tsx`)

Central logic and state management. It:

- Initializes `webkitSpeechRecognition` for browsers that support it
- Manages state: `text`, `enhancedText`, `translatedText`, `isListening`, `error`, `sourceLang`
- Handles speech recognition events: `onstart`, `onend`, `onerror`, `onresult`
- Exposes functions: `startListening`, `stopListening`, `translate`, `speakText`, `setManualText`, `updateSourceLang`

**Flow:**
- `startListening(lang)` → sets `sourceLang`, starts recognition
- `onresult` → gets transcript → calls `enhanceTranscription()` → sets `enhancedText`
- `setManualText(text)` → sets `text`, calls `enhanceTranscription()` → sets `enhancedText`
- `translate(targetLang)` → calls `translateText(enhancedText, sourceLang, targetLang)` → sets `translatedText`

---

## Services (Backend Flow)

### 1. Translation Service (`src/services/translationService.ts`)

**API:** MyMemory Translation API  
**Endpoint:** `https://api.mymemory.translated.net/get`  
**Method:** GET  
**Parameters:**

- `q` — text to translate
- `langpair` — `sourceLang|targetLang` (e.g. `en|es`)

**Response:** JSON with `responseData.translatedText`

**No API key required** — the free tier allows anonymous requests (with a daily limit).

**Example request:**
```
GET https://api.mymemory.translated.net/get?q=Hello&langpair=en|es
```

### 2. Enhancement Service (`src/services/openaiService.ts`)

**Runs entirely in the browser** — no API calls.

**Logic:**
1. Trim whitespace
2. Capitalize first character
3. Add a period at the end if no punctuation exists

**Purpose:** Light formatting of raw speech transcripts (e.g. "i need a doctor" → "I need a doctor."). Previously used Azure OpenAI; now simplified to avoid any external dependency.

---

## External Dependencies (Backend Perspective)

| Service             | Type     | Auth       | Used For                 |
|---------------------|----------|------------|---------------------------|
| MyMemory API        | REST API | None       | Text translation          |
| Web Speech API      | Browser  | None       | Speech-to-text (Chrome)   |
| Speech Synthesis    | Browser  | None       | Text-to-speech playback   |

---

## Request/Response Examples

### MyMemory Translation

**Request:**
```http
GET /get?q=I+need+a+doctor&langpair=en|es
Host: api.mymemory.translated.net
```

**Response:**
```json
{
  "responseData": {
    "translatedText": "Necesito un médico"
  },
  "responseStatus": 200
}
```

---

## Error Handling

- **Speech recognition "network" error:** Occurs when the browser cannot reach Google's speech servers. The UI shows a message and suggests using manual text input.
- **Translation failure:** If MyMemory returns an error or the request fails, the UI shows "Translation failed".
- **Enhancement:** Runs locally; if it fails, the raw text is used instead.

---

## Deployment Notes

- The app is a static site (Vite build → `dist/`). Deploy to any static host (Vercel, Netlify, etc.).
- **HTTPS is required** for speech recognition in production (localhost is exempt).
- No environment variables or secrets are needed. All services used are either browser APIs or free public APIs.
