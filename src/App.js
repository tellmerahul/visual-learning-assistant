import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Volume2, VolumeX } from 'lucide-react';
import { captureAndProcess, speakText } from './services/gemini';

const App = () => {
 const [isCapturing, setIsCapturing] = useState(false);
 const [isProcessing, setIsProcessing] = useState(false);
 const [isSpeaking, setIsSpeaking] = useState(false);
 const [result, setResult] = useState('');
 const [error, setError] = useState('');
 const [currentStep, setCurrentStep] = useState(0);
 const [steps, setSteps] = useState([]);
 
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
     await captureAndProcess(videoRef, canvasRef, setIsProcessing, setError, setResult);
     setIsSpeaking(true);
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

 return (
   <div className="flex flex-col items-center max-w-lg mx-auto p-4">
     <h1 className="text-2xl font-bold mb-4">Visual Learning Assistant</h1>
     <p className="text-gray-600 mb-6">
       Point your camera at any problem for instant help and explanation
     </p>
     
     <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
       <video
         ref={videoRef}
         autoPlay
         playsInline
         className="w-full h-full object-cover"
       />
     </div>

     <div className="flex gap-4 mb-4">
       <button
         onClick={isCapturing ? stopCamera : startCamera}
         className={`flex items-center gap-2 px-4 py-2 rounded ${
           isCapturing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
         } text-white`}
       >
         <Camera className="w-5 h-5" />
         {isCapturing ? 'Stop Camera' : 'Start Camera'}
       </button>

       {isCapturing && (
         <button
           onClick={handleQuery}
           disabled={isProcessing}
           className="flex items-center gap-2 px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
         >
           <Mic className="w-5 h-5" />
           {isProcessing ? 'Processing...' : 'Capture & Analyze'}
         </button>
       )}

       {result && (
         <button
           onClick={toggleSpeech}
           className={`flex items-center gap-2 px-4 py-2 rounded ${
             isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
           } text-white`}
         >
           {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
           {isSpeaking ? 'Stop Speaking' : 'Speak Result'}
         </button>
       )}
     </div>

     {isProcessing && (
       <div className="w-full p-4 mb-4 bg-blue-100 text-blue-700 rounded">
         Processing your request...
       </div>
     )}

     {error && (
       <div className="w-full p-4 mb-4 bg-red-100 text-red-700 rounded">
         {error}
       </div>
     )}

     {result && (
       <div className="w-full p-4 bg-green-100 text-green-700 rounded whitespace-pre-wrap">
         {result}
       </div>
     )}
   </div>
 );
};

export default App;