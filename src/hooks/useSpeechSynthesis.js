import { useCallback, useEffect, useState } from 'react';
import { speakText, stopSpeech } from '../services/speech';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
    const handleEnd = () => setIsSpeaking(false);
    window.speechSynthesis.addEventListener('end', handleEnd);
    return () => window.speechSynthesis.removeEventListener('end', handleEnd);
  }, []);

  const toggleSpeech = useCallback(
    (text) => {
      if (isSpeaking) {
        stopSpeech();
        setIsSpeaking(false);
      } else if (text) {
        speakText(text);
        setIsSpeaking(true);
      }
    },
    [isSpeaking]
  );

  return { isSpeaking, setIsSpeaking, toggleSpeech };
}