import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Volume2, VolumeX } from 'lucide-react';
import { captureAndProcess, speakText } from './services/gemini';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Bot Avatar Component
const BotAvatar = () => (
  <motion.div
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 120 }}
    className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 shadow-lg mb-2 border-4 border-white"
  >
    <span className="text-4xl">🤖</span>
  </motion.div>
);

// Animated Processing Indicator
const ProcessingIndicator = () => (
  <motion.div
    className="flex items-center gap-2 w-full p-4 mb-4 bg-blue-100 text-blue-700 rounded justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <span>Processing your request</span>
    <motion.span
      className="flex gap-1 ml-2"
      aria-label="loading"
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="block w-2 h-2 bg-blue-500 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
        />
      ))}
    </motion.span>
  </motion.div>
);

// Animated Result Bubble
const ResultBubble = ({ result }) => (
  <motion.div
    className="w-full p-4 bg-green-100 text-green-700 rounded-xl shadow-md whitespace-pre-wrap mt-2"
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 30, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 120 }}
  >
    {result}
  </motion.div>
);

// Typewriter effect for description
const Typewriter = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(t => t + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
};

const highlightType = (desc, type) => {
  if (!type || !desc) return desc;
  const regex = new RegExp(type, 'gi');
  return desc.split(regex).reduce((acc, part, idx, arr) => {
    acc.push(part);
    if (idx < arr.length - 1) {
      acc.push(<span key={idx} className="font-bold text-blue-600">{type}</span>);
    }
    return acc;
  }, []);
};

const App = () => {
 const [isCapturing, setIsCapturing] = useState(false);
 const [isProcessing, setIsProcessing] = useState(false);
 const [isSpeaking, setIsSpeaking] = useState(false);
 const [result, setResult] = useState('');
 const [error, setError] = useState('');
 const [currentStep, setCurrentStep] = useState(0);
 const [steps, setSteps] = useState([]);
 const [detectedType, setDetectedType] = useState('');
 const [isSplitView, setIsSplitView] = useState(false);
 const descPanelRef = useRef(null);
 
 const videoRef = useRef(null);
 const canvasRef = useRef(null);
 const recognitionRef = useRef(null);

 const handleExplanation = () => {
   if (result) speakText("Let me explain that in detail: " + result);
 };

 const repeatLastResult = () => {
   if (result) speakText(result);
 };

 const showSteps = () => {
   const steps = result.split('\n');
   setSteps(steps);
   speakText("Here are the steps: " + steps.join('. '));
 };

 const nextStep = () => {
   if (currentStep < steps.length - 1) {
     setCurrentStep(prev => prev + 1);
     speakText(steps[currentStep + 1]);
   }
 };

 const previousStep = () => {
   if (currentStep > 0) {
     setCurrentStep(prev => prev - 1);
     speakText(steps[currentStep - 1]);
   }
 };

 const voiceCommands = {
   'explain': handleExplanation,
   'repeat': repeatLastResult,
   'steps': showSteps,
   'next': nextStep,
   'previous': previousStep
 };

 const handleVoiceCommand = (transcript) => {
   const command = transcript.toLowerCase();
   for (let key in voiceCommands) {
     if (command.includes(key)) {
       voiceCommands[key]();
       return;
     }
   }
 };

 useEffect(() => {
   if ('webkitSpeechRecognition' in window) {
     const recognition = new window.webkitSpeechRecognition();
     recognition.continuous = true;
     recognition.onresult = (event) => {
       const transcript = event.results[event.results.length - 1][0].transcript;
       handleVoiceCommand(transcript);
     };
     recognitionRef.current = recognition;
   }
 }, []);

 useEffect(() => {
   const handleSpeechEnd = () => setIsSpeaking(false);
   speechSynthesis.addEventListener('end', handleSpeechEnd);
   return () => speechSynthesis.removeEventListener('end', handleSpeechEnd);
 }, []);

 const startCamera = async () => {
   try {
     const stream = await navigator.mediaDevices.getUserMedia({
       video: { facingMode: 'environment' }
     });
     if (videoRef.current) {
       videoRef.current.srcObject = stream;
       setIsCapturing(true);
     }
   } catch (err) {
     setError('Camera access error: ' + err.message);
   }
 };

 const stopCamera = () => {
   if (videoRef.current?.srcObject) {
     videoRef.current.srcObject.getTracks().forEach(track => track.stop());
     setIsCapturing(false);
   }
 };

 const handleQuery = async () => {
   setIsProcessing(true);
   try {
     await captureAndProcess(videoRef, canvasRef, setIsProcessing, setError, setResult, setDetectedType);
     setIsSpeaking(true);
     setIsSplitView(true);
   } catch (err) {
     setError('Processing error: ' + err.message);
   }
   setIsProcessing(false);
 };

 const toggleSpeech = () => {
   if (isSpeaking) {
     window.speechSynthesis.cancel();
     setIsSpeaking(false);
   } else if (result) {
     speakText(result);
     setIsSpeaking(true);
   }
 };

 // Auto-scroll description panel to bottom when result changes
 useEffect(() => {
   if (descPanelRef.current) {
     descPanelRef.current.scrollTop = descPanelRef.current.scrollHeight;
   }
 }, [result]);

 const handleBackToCenter = () => {
   setIsSplitView(false);
   setResult('');
   setDetectedType('');
 };

 return (
   <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50">
     {/* Left Panel: Description */}
     <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-black">
       <div className="w-full max-w-lg rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col h-[520px] backdrop-blur-md bg-white/20 bg-clip-padding" style={{background: 'rgba(30,30,30,0.25)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255,255,255,0.18)'}}>
         <div className="flex items-center justify-between mb-2">
           <h2 className="text-xl font-bold text-blue-200 flex items-center gap-2">
             <span>Description</span>
             <span className="text-base text-blue-300">{detectedType && `(${detectedType.charAt(0).toUpperCase() + detectedType.slice(1)})`}</span>
           </h2>
           {isSplitView && (
             <button
               onClick={handleBackToCenter}
               className="text-xs px-3 py-1 rounded-full bg-blue-900/60 text-blue-100 font-semibold shadow hover:bg-blue-800/80 transition-colors"
             >
               Back to Center
             </button>
           )}
         </div>
         <div
           ref={descPanelRef}
           className="flex-1 overflow-y-auto pr-2 text-blue-50 whitespace-pre-line mb-4"
           style={{ scrollbarWidth: 'thin' }}
         >
           {isProcessing ? (
             <div className="flex items-center gap-2 text-blue-500 font-semibold mt-8 justify-center">
               <span>Analyzing</span>
               <span className="flex gap-1">
                 <span className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                 <span className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                 <span className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
               </span>
             </div>
           ) : (
             <AnimatePresence>
               {result && !isProcessing && (
                 <motion.div
                   key="desc-content"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 20 }}
                   transition={{ type: 'spring', stiffness: 120 }}
                   className="text-base leading-relaxed text-blue-50"
                 >
                   <Typewriter text={typeof result === 'string' ? result : ''} />
                 </motion.div>
               )}
             </AnimatePresence>
           )}
         </div>
         {error && (
           <motion.div
             className="w-full p-4 mt-4 bg-red-900/80 text-red-200 rounded-xl shadow"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
           >
             {error}
           </motion.div>
         )}
       </div>
     </div>
     {/* Right Panel: Video & Bot & Controls */}
     <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#fbc2eb]">
       <div className="w-full max-w-lg bg-white/90 rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col items-center">
         <BotAvatar />
         <h1 className="text-3xl font-extrabold mb-2 text-blue-700 tracking-tight drop-shadow">Visual Learning Assistant</h1>
         <p className="text-gray-500 mb-6 text-center">
           Point your camera at any problem for instant help and explanation
         </p>
         <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 border-2 border-blue-200 shadow">
           <video
             ref={videoRef}
             autoPlay
             playsInline
             className="w-full h-full object-cover"
           />
           {detectedType && !isProcessing && (
             <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="absolute top-3 left-3 bg-white/90 text-blue-700 font-bold px-4 py-1 rounded-full shadow border border-blue-300 text-sm z-10 backdrop-blur"
             >
               {detectedType.charAt(0).toUpperCase() + detectedType.slice(1)}
             </motion.div>
           )}
         </div>
         {/* Controls below video */}
         <div className="flex flex-wrap gap-4 mb-4 justify-center w-full">
           <motion.button
             whileTap={{ scale: 0.95 }}
             whileHover={{ scale: 1.05 }}
             onClick={isCapturing ? stopCamera : startCamera}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow transition-colors duration-200 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
               isCapturing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
             } text-white`}
           >
             <Camera className="w-5 h-5" />
             {isCapturing ? 'Stop Camera' : 'Start Camera'}
           </motion.button>
           {isCapturing && (
             <motion.button
               whileTap={{ scale: 0.95 }}
               whileHover={{ scale: 1.05 }}
               onClick={handleQuery}
               disabled={isProcessing}
               className="flex items-center gap-2 px-4 py-2 rounded-xl shadow bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
             >
               <Mic className="w-5 h-5" />
               {isProcessing ? 'Processing...' : 'Capture & Analyze'}
             </motion.button>
           )}
           {result && (
             <motion.button
               whileTap={{ scale: 0.95 }}
               whileHover={{ scale: 1.05 }}
               onClick={toggleSpeech}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                 isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
               } text-white`}
             >
               {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
               {isSpeaking ? 'Stop Speaking' : 'Speak Result'}
             </motion.button>
           )}
         </div>
       </div>
     </div>
   </div>
 );
};

export default App;