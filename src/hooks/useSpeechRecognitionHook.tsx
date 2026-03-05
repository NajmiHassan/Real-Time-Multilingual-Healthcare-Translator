import { useEffect, useState } from "react";
import { translateText } from "../services/translationService";
import { enhanceTranscription } from "../services/openaiService";

let recognition: any = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
}

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceLang, setSourceLang] = useState("en");

  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error: ", event);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      console.log("onresult event: ", event);
      if (event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript: ", transcript);
        setText(transcript);
        try {
          const enhanced = await enhanceTranscription(transcript);
          setEnhancedText(enhanced);
        } catch (enhanceError) {
          console.error("Enhancement error: ", enhanceError);
          setError("Enhancement failed");
        }
      }
      recognition.stop();
      setIsListening(false);
    };
  }, []);

  const startListening = (inputLanguage: string) => {
    console.log("Starting to listen...");
    setText("");
    setEnhancedText("");
    setTranslatedText("");
    setError(null);
    setSourceLang(inputLanguage.split("-")[0]);
    recognition.lang = inputLanguage;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    console.log("Stopping listening...");
    setIsListening(false);
    recognition.stop();
  };

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  const setManualText = async (manualInput: string) => {
    setText(manualInput);
    setError(null);
    try {
      const enhanced = await enhanceTranscription(manualInput);
      setEnhancedText(enhanced);
    } catch {
      setEnhancedText(manualInput);
    }
  };

  const updateSourceLang = (inputLanguage: string) => {
    setSourceLang(inputLanguage.split("-")[0]);
  };

  const translate = async (targetLanguage: string) => {
    const textToTranslate = enhancedText || text;
    if (!textToTranslate) return;
    console.log(
      "Translating text:",
      textToTranslate,
      "from:",
      sourceLang,
      "to:",
      targetLanguage
    );
    try {
      const translated = await translateText(
        textToTranslate,
        sourceLang,
        targetLanguage
      );
      console.log("Translated text:", translated);
      setTranslatedText(translated);
    } catch (translationError) {
      console.error("Translation error: ", translationError);
      setError("Translation failed");
    }
  };

  return {
    text,
    enhancedText,
    translatedText,
    isListening,
    error,
    startListening,
    hasRecognitionSupport: !!recognition,
    stopListening,
    speakText,
    translate,
    setManualText,
    updateSourceLang,
  };
};

export default useSpeechRecognition;
