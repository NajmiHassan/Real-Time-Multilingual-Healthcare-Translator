import { useState } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";

const MainComponent = () => {
  const {
    text,
    enhancedText,
    translatedText,
    isListening,
    error,
    startListening,
    stopListening,
    hasRecognitionSupport,
    speakText,
    translate,
    setManualText,
    updateSourceLang,
  } = useSpeechRecognition();

  const [inputLanguage, setInputLanguage] = useState("en-US");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [manualInput, setManualInput] = useState("");

  const handleStartListening = () => {
    startListening(inputLanguage);
  };

  const handleLanguageChange = (lang: string) => {
    setInputLanguage(lang);
    updateSourceLang(lang);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    updateSourceLang(inputLanguage);
    setManualText(manualInput.trim());
    setManualInput("");
  };

  const handleTranslate = () => {
    translate(targetLanguage);
  };

  const canTranslate = !!(enhancedText || text);

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-600 to-blue-700 p-4 text-white">
      <h1 className="text-4xl text-center mb-8">Real-Time Healthcare Translator</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-8">
        <div className="mb-4 lg:mb-0 lg:w-1/2">
          <label htmlFor="inputLanguage" className="block mb-2">
            Input Language:
          </label>
          <select
            id="inputLanguage"
            value={inputLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="en-US">English</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="zh-CN">Chinese</option>
          </select>
          <label htmlFor="targetLanguage" className="block mt-4 mb-2">
            Target Language:
          </label>
          <select
            id="targetLanguage"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2 lg:w-1/2">
          {hasRecognitionSupport && (
            <>
              <button
                onClick={handleStartListening}
                disabled={isListening}
                className="p-2 rounded bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
              >
                Start Listening
              </button>
              <button
                onClick={stopListening}
                disabled={!isListening}
                className="p-2 rounded bg-red-500 hover:bg-red-600 disabled:bg-gray-400"
              >
                Stop Listening
              </button>
            </>
          )}

          <div className="flex space-x-2">
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleManualSubmit();
                }
              }}
              placeholder="Or type text here..."
              className="flex-1 p-2 rounded bg-white text-black resize-none"
              rows={2}
            />
            <button
              onClick={handleManualSubmit}
              disabled={!manualInput.trim()}
              className="px-4 rounded bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400"
            >
              Submit
            </button>
          </div>

          <button
            onClick={handleTranslate}
            disabled={!canTranslate}
            className="p-2 rounded bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400"
          >
            Translate
          </button>
          <button
            onClick={() => speakText(translatedText, targetLanguage)}
            disabled={!translatedText}
            className="p-2 rounded bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
          >
            Speak Translated Text
          </button>
        </div>
      </div>

      {isListening && <p className="mb-4">Listening...</p>}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded">
          <p className="text-red-200">
            Error: {error}
            {error === "network" && (
              <span className="block text-sm mt-1">
                Speech recognition requires a network connection. You can type
                text manually instead.
              </span>
            )}
          </p>
        </div>
      )}
      {text && (
        <div className="mb-4">
          <h3 className="text-lg font-bold">Original Transcript:</h3>
          <p className="p-2 bg-white text-black rounded">{text}</p>
        </div>
      )}
      {enhancedText && (
        <div className="mb-4">
          <h3 className="text-lg font-bold">Enhanced Transcript:</h3>
          <p className="p-2 bg-white text-black rounded">{enhancedText}</p>
        </div>
      )}
      {translatedText && (
        <div className="mb-4">
          <h3 className="text-lg font-bold">Translated Text:</h3>
          <p className="p-2 bg-white text-black rounded">{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default MainComponent;
