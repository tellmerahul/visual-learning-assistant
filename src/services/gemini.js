import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiBase, getGeminiApiKey, isGeminiProxyEnabled } from '../config/env';
import { buildAnalysisPrompt, buildFollowUpPrompt } from '../constants/geminiPrompt';
import { DEFAULT_SUBJECT_MODE } from '../constants/subjectModes';

const MODEL_ID = 'gemini-1.5-flash';
const MIN_REQUEST_GAP_MS = 2000;
let lastRequestAt = 0;

function getModel() {
  const key = getGeminiApiKey();
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: MODEL_ID });
}

export function parseAnalysisResponse(responseText) {
  const typeMatch = responseText.match(/Type:\s*(.*)/i);
  const explanationMatch = responseText.match(/Explanation:\s*([\s\S]*)/i);
  const type = typeMatch ? typeMatch[1].trim().split(/\n|\r/)[0] : 'Unknown';
  const explanation = explanationMatch ? explanationMatch[1].trim() : responseText;
  return { type, result: explanation };
}

async function throttleRequests() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_REQUEST_GAP_MS) {
    await new Promise((r) => setTimeout(r, MIN_REQUEST_GAP_MS - elapsed));
  }
  lastRequestAt = Date.now();
}

async function postJson(path, body) {
  const base = getApiBase();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

async function analyzeViaProxy(imageData, subjectMode, learnerContext) {
  const data = await postJson('/api/analyze', { imageData, subjectMode, learnerContext });
  return { type: data.type, result: data.result };
}

async function followUpViaProxy(imageData, messages, question, subjectMode, learnerContext) {
  const data = await postJson('/api/chat', {
    imageData,
    messages,
    question,
    subjectMode,
    learnerContext,
  });
  return data.text;
}

async function analyzeViaClient(imageData, subjectMode, learnerContext) {
  const model = getModel();
  const base64Data = imageData.split(',')[1];
  const prompt = buildAnalysisPrompt(subjectMode, learnerContext);

  const result = await model.generateContent({
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
        ],
      },
    ],
  });

  const responseText = (await result.response).text();
  return parseAnalysisResponse(responseText);
}

async function followUpViaClient(imageData, messages, question, subjectMode, learnerContext) {
  const model = getModel();
  const base64Data = imageData.split(',')[1];
  const initialPrompt = buildAnalysisPrompt(subjectMode, learnerContext);

  const contents = [
    {
      role: 'user',
      parts: [
        { text: initialPrompt },
        { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
      ],
    },
  ];

  messages.forEach((msg) => {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  });

  contents.push({
    role: 'user',
    parts: [{ text: buildFollowUpPrompt(question, learnerContext) }],
  });

  const result = await model.generateContent({ contents });
  return (await result.response).text();
}

export async function analyzeImage(imageData, subjectMode = DEFAULT_SUBJECT_MODE, learnerContext = '') {
  await throttleRequests();
  if (isGeminiProxyEnabled()) {
    return analyzeViaProxy(imageData, subjectMode, learnerContext);
  }
  return analyzeViaClient(imageData, subjectMode, learnerContext);
}

export async function sendFollowUp(
  imageData,
  messages,
  question,
  subjectMode = DEFAULT_SUBJECT_MODE,
  learnerContext = ''
) {
  await throttleRequests();
  if (isGeminiProxyEnabled()) {
    return followUpViaProxy(imageData, messages, question, subjectMode, learnerContext);
  }
  return followUpViaClient(imageData, messages, question, subjectMode, learnerContext);
}