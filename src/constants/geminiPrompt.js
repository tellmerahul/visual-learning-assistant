import { SUBJECT_MODES, DEFAULT_SUBJECT_MODE } from './subjectModes';

export const IMAGE_ANALYSIS_PROMPT = `Analyze this image and identify what it primarily contains.

Reply in the following format:
Type: <question/person/object/other>
Explanation: <detailed explanation>

For Math/Science Questions:
- Show step-by-step solution
- Explain each step clearly
- Include final answer with verification

For Text/Language:
- Summarize main points
- Explain context and meaning
- Answer any questions posed

For Objects/People:
- Describe key features
- Explain purpose/function or identity
- Highlight important details`;

export const FOLLOW_UP_SYSTEM = `You are continuing to help the user about the same image they shared earlier.
Stay concise, accurate, and educational. If they ask to simplify, use shorter sentences.`;

export function buildAnalysisPrompt(subjectModeId = DEFAULT_SUBJECT_MODE, learnerContext = '') {
  const mode = SUBJECT_MODES[subjectModeId] || SUBJECT_MODES[DEFAULT_SUBJECT_MODE];
  const parts = [IMAGE_ANALYSIS_PROMPT];
  if (mode.extra) parts.push(`Subject mode (${mode.label}):\n${mode.extra}`);
  if (learnerContext) parts.push(learnerContext);
  return parts.join('\n\n');
}

export function buildFollowUpPrompt(question, learnerContext = '') {
  const parts = [FOLLOW_UP_SYSTEM];
  if (learnerContext) parts.push(learnerContext);
  parts.push(`User follow-up question:\n${question}`);
  return parts.join('\n\n');
}