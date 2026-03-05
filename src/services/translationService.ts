import axios from "axios";

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
        },
      }
    );

    if (response.data.responseStatus === 200) {
      return response.data.responseData.translatedText;
    }

    throw new Error(response.data.responseDetails || "Translation failed");
  } catch (error) {
    console.error("Translation API error:", error);
    throw new Error("Failed to translate text");
  }
};
