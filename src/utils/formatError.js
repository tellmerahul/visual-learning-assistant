import { GEMINI_KEY_USER_MESSAGE } from '../config/env';

export function formatUserError(err) {
  if (!err) return 'Something went wrong. Please try again.';

  const message = err.message || String(err);
  const lower = message.toLowerCase();

  if (!navigator.onLine || lower.includes('failed to fetch') || lower.includes('network')) {
    return 'You appear to be offline. Check your connection and try again.';
  }
  if (
    lower.includes('gemini api key is not set') ||
    lower.includes('missing react_app_gemini') ||
    lower.includes('server missing gemini_api_key') ||
    (lower.includes('api key') && lower.includes('gemini'))
  ) {
    return GEMINI_KEY_USER_MESSAGE;
  }
  if (lower.includes('429') || lower.includes('quota') || lower.includes('rate')) {
    return 'Too many requests. Wait a moment before trying again.';
  }
  if (lower.includes('503') || lower.includes('unavailable')) {
    return 'The AI service is temporarily unavailable. Try again shortly.';
  }

  return message.startsWith('Processing error:') ? message : `Processing error: ${message}`;
}