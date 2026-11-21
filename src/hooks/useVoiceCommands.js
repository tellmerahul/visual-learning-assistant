import { useCallback, useEffect, useRef, useState } from 'react';
import { speakText } from '../services/speech';
import { parseStepsFromText } from '../utils/parseSteps';

export function useVoiceCommands({
  enabled,
  result,
  steps,
  currentStep,
  setSteps,
  setCurrentStep,
  onEnterStepMode,
}) {
  const resultRef = useRef(result);
  const stepsRef = useRef(steps);
  const currentStepRef = useRef(currentStep);
  const [supported] = useState(() => typeof window !== 'undefined' && 'webkitSpeechRecognition' in window);
  const [listening, setListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  const handleVoiceCommand = useCallback(
    (transcript) => {
      const command = transcript.toLowerCase();
      const activeResult = resultRef.current;
      setLastHeard(transcript);

      if (command.includes('explain') && activeResult) {
        speakText(`Let me explain that in detail: ${activeResult}`);
        return;
      }
      if (command.includes('repeat') && activeResult) {
        speakText(activeResult);
        return;
      }
      if (command.includes('steps') && activeResult) {
        const nextSteps = parseStepsFromText(activeResult);
        const list = nextSteps.length ? nextSteps : activeResult.split('\n').filter(Boolean);
        setSteps(list);
        setCurrentStep(0);
        if (onEnterStepMode) onEnterStepMode();
        speakText(list.length ? `Step 1: ${list[0]}` : activeResult);
        return;
      }
      if (command.includes('next')) {
        const list = stepsRef.current;
        const idx = currentStepRef.current;
        if (idx < list.length - 1) {
          const next = idx + 1;
          setCurrentStep(next);
          speakText(list[next]);
        }
        return;
      }
      if (command.includes('previous')) {
        const list = stepsRef.current;
        const idx = currentStepRef.current;
        if (idx > 0) {
          const prev = idx - 1;
          setCurrentStep(prev);
          speakText(list[prev]);
        }
      }
    },
    [onEnterStepMode, setCurrentStep, setSteps]
  );

  useEffect(() => {
    if (!enabled || !supported) {
      setListening(false);
      return undefined;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      handleVoiceCommand(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => {
      if (enabled) recognition.start();
    };

    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.stop();
      setListening(false);
    };
  }, [enabled, supported, handleVoiceCommand]);

  return { supported, listening, lastHeard };
}