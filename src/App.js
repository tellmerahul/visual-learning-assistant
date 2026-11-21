import { useCallback, useRef, useState } from 'react';
import { GridBackground } from './components/GridBackground';
import { Hero } from './components/Hero';
import { CameraPanel } from './components/CameraPanel';
import { DescriptionPanel } from './components/DescriptionPanel';
import { StudentGuideSection } from './components/StudentGuideSection';
import { useCamera } from './hooks/useCamera';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useVoiceCommands } from './hooks/useVoiceCommands';
import { DEFAULT_SUBJECT_MODE } from './constants/subjectModes';
import { analyzeFromDataUrl, captureFrameFromVideo, readFileAsDataUrl } from './services/capture';
import { sendFollowUp } from './services/gemini';
import { speakText, stopSpeech } from './services/speech';
import { formatUserError } from './utils/formatError';
import { parseStepsFromText } from './utils/parseSteps';

function App() {
  const canvasRef = useRef(null);
  const imageDataRef = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState('');
  const [processError, setProcessError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [detectedType, setDetectedType] = useState('');
  const [hasSession, setHasSession] = useState(false);
  const [subjectMode, setSubjectMode] = useState(DEFAULT_SUBJECT_MODE);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatBusy, setChatBusy] = useState(false);

  const { videoRef, isCapturing, error: cameraError, setError: setCameraError, startCamera, stopCamera } =
    useCamera();
  const { isSpeaking, setIsSpeaking, toggleSpeech } = useSpeechSynthesis();

  const { supported: voiceSupported, listening: voiceListening, lastHeard } = useVoiceCommands({
    enabled: voiceEnabled && hasSession,
    result,
    steps,
    currentStep,
    setSteps,
    setCurrentStep,
    onEnterStepMode: () => {},
  });

  const displayError = processError || cameraError;

  const applyAnalysis = useCallback(
    (analysis, imageData) => {
      imageDataRef.current = imageData;
      setResult(analysis.result);
      setDetectedType(analysis.type);
      setHasSession(true);
      setChatMessages([]);
      const parsed = parseStepsFromText(analysis.result);
      setSteps(parsed);
      setCurrentStep(0);
      setIsSpeaking(true);
      setPreviewUrl(null);
    },
    [setIsSpeaking]
  );

  const runAnalysis = useCallback(
    async (imageData) => {
      setIsProcessing(true);
      setProcessError('');
      setCameraError('');
      stopSpeech();

      try {
        const analysis = await analyzeFromDataUrl(imageData, subjectMode, { speak: true });
        applyAnalysis(analysis, imageData);
      } catch (err) {
        setProcessError(formatUserError(err));
      } finally {
        setIsProcessing(false);
      }
    },
    [applyAnalysis, setCameraError, subjectMode]
  );

  const handleToggleCamera = () => {
    if (isCapturing) stopCamera();
    else startCamera();
  };

  const handleSnapPreview = () => {
    try {
      const dataUrl = captureFrameFromVideo(videoRef.current, canvasRef.current);
      setPreviewUrl(dataUrl);
    } catch (err) {
      setProcessError(formatUserError(err));
    }
  };

  const handleConfirmPreview = () => {
    if (!previewUrl) return;
    runAnalysis(previewUrl);
  };

  const handleDiscardPreview = () => setPreviewUrl(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPreviewUrl(dataUrl);
    } catch (err) {
      setProcessError(formatUserError(err));
    }
  };

  const handleFollowUp = async (question) => {
    const imageData = imageDataRef.current;
    if (!imageData) return;

    setChatBusy(true);
    setProcessError('');
    const userMsg = { role: 'user', content: question };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const reply = await sendFollowUp(imageData, chatMessages, question, subjectMode);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setResult((prev) => `${prev}\n\n— Follow-up —\n${reply}`);
      speakText(reply);
      setIsSpeaking(true);
    } catch (err) {
      setProcessError(formatUserError(err));
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setChatBusy(false);
    }
  };

  const handleReset = () => {
    setHasSession(false);
    setResult('');
    setDetectedType('');
    setProcessError('');
    setSteps([]);
    setCurrentStep(0);
    setChatMessages([]);
    setPreviewUrl(null);
    imageDataRef.current = null;
    stopSpeech();
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <GridBackground />
      <Hero compact={hasSession} />

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-5 px-4 pb-10 md:px-6 lg:grid-cols-2 lg:items-start lg:gap-6">
        <DescriptionPanel
          detectedType={detectedType}
          hasSession={hasSession}
          isProcessing={isProcessing}
          result={result}
          error={displayError}
          steps={steps}
          currentStep={currentStep}
          onStepChange={(idx) => {
            setCurrentStep(idx);
            if (steps[idx]) speakText(steps[idx]);
          }}
          onStepsUpdate={(list, idx) => {
            setSteps(list);
            setCurrentStep(idx);
          }}
          chatMessages={chatMessages}
          chatDisabled={chatBusy || isProcessing || !hasSession}
          onFollowUp={handleFollowUp}
          onReset={handleReset}
        />

        <CameraPanel
          videoRef={videoRef}
          canvasRef={canvasRef}
          previewUrl={previewUrl}
          isCapturing={isCapturing}
          isProcessing={isProcessing}
          detectedType={detectedType}
          hasResult={Boolean(result)}
          isSpeaking={isSpeaking}
          subjectMode={subjectMode}
          voiceSupported={voiceSupported}
          voiceEnabled={voiceEnabled}
          voiceListening={voiceListening}
          lastVoiceHeard={lastHeard}
          onSubjectModeChange={setSubjectMode}
          onToggleVoice={() => setVoiceEnabled((v) => !v)}
          onToggleCamera={handleToggleCamera}
          onSnapPreview={handleSnapPreview}
          onConfirmPreview={handleConfirmPreview}
          onDiscardPreview={handleDiscardPreview}
          onUpload={handleUpload}
          onToggleSpeech={() => toggleSpeech(result)}
        />
      </main>

      <StudentGuideSection />
    </div>
  );
}

export default App;