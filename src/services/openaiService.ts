export const enhanceTranscription = async (
  transcript: string
): Promise<string> => {
  let enhanced = transcript.trim();
  if (!enhanced) return enhanced;

  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);

  if (!/[.!?]$/.test(enhanced)) {
    enhanced += ".";
  }

  return enhanced;
};
