import { analyzeImage } from './gemini';
import { speakText } from './speech';
import { DEFAULT_SUBJECT_MODE } from '../constants/subjectModes';

export function captureFrameFromVideo(videoEl, canvasEl) {
  if (!videoEl) {
    throw new Error('Video element is not available');
  }

  const canvas = canvasEl || document.createElement('canvas');
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoEl, 0, 0);

  return canvas.toDataURL('image/jpeg');
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.readAsDataURL(file);
  });
}

export async function analyzeFromDataUrl(
  imageData,
  subjectMode = DEFAULT_SUBJECT_MODE,
  { speak = true, learnerContext = '' } = {}
) {
  const analysis = await analyzeImage(imageData, subjectMode, learnerContext);
  if (speak) speakText(analysis.result);
  return analysis;
}