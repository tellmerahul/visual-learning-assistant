export const GEMINI_KEY_USER_MESSAGE =
  'Gemini API key is not set. Copy .env.example to .env, add REACT_APP_GEMINI_API_KEY=your_key, then restart the app. Get a key: aistudio.google.com/apikey';

export function isGeminiProxyEnabled() {
  return process.env.REACT_APP_USE_GEMINI_PROXY === 'true';
}

export function getApiBase() {
  const base = process.env.REACT_APP_API_BASE || '';
  return base.replace(/\/$/, '');
}

export function getGeminiApiKey() {
  if (isGeminiProxyEnabled()) return null;

  const key = process.env.REACT_APP_GEMINI_API_KEY;
  if (!key) {
    throw new Error(GEMINI_KEY_USER_MESSAGE);
  }
  return key;
}