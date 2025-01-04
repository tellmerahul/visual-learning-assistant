import { GoogleGenerativeAI } from '@google/generative-ai';

console.log("API Key from env:", process.env.REACT_APP_GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

export async function analyzeImage(imageData) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const base64Data = imageData.split(',')[1];
      
      const prompt = `Analyze this image:
      For Math: 
      - Show step-by-step solution
      - Explain each step clearly
      - Include final answer with verification
      
      For Science:
      - Define key concepts
      - Explain underlying principles
      - Provide detailed solution
      
      For Text/Language:
      - Summarize main points
      - Explain context and meaning
      - Answer any questions posed
      
      For Objects:
      - Describe key features
      - Explain purpose/function
      - Highlight important details`;
  
      const result = await model.generateContent({
        contents: [{
          parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64Data }}]
        }]
      });
  
      return (await result.response).text();
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    }
  }
export const captureAndProcess = async (videoRef, canvasRef, setIsProcessing, setError, setResult) => {
  if (!videoRef.current) return;

  setIsProcessing(true);
  setError('');
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  try {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const video = videoRef.current;
    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;

    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const imageData = canvasRef.current.toDataURL('image/jpeg');
    
    const analysisResult = await analyzeImage(imageData);
    setResult(analysisResult);
    
    // Speak the result
    speakText(analysisResult);

  } catch (err) {
    setError('Processing error: ' + err.message);
  } finally {
    setIsProcessing(false);
  }
};

export async function testGemini() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = "Write a short poem about coding.";

  try {
    const result = await model.generateContent({
      contents: [{
        parts: [
          { text: prompt }
        ]
      }]
    });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error testing Gemini:", error);
    throw error;
  }
}