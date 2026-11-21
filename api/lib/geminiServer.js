const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL_ID = 'gemini-1.5-flash';

const IMAGE_ANALYSIS_PROMPT = `Analyze this image and identify what it primarily contains.

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

const MODE_EXTRA = {
  auto: '',
  math: 'Focus on mathematics. Show numbered steps, justify each step, and give a final answer with a quick check.',
  science: 'Focus on science. Name concepts, laws, or units; explain diagrams; show calculations when present.',
  language: 'Focus on language and text. Summarize, explain vocabulary, grammar, and answer comprehension questions.',
  object: 'Focus on objects, people, or scenes. Describe what you see, purpose, and notable details clearly.',
};

function buildAnalysisPrompt(subjectMode = 'auto', learnerContext = '') {
  const extra = MODE_EXTRA[subjectMode] || '';
  const parts = [IMAGE_ANALYSIS_PROMPT];
  if (extra) parts.push(`Subject mode:\n${extra}`);
  if (learnerContext) parts.push(learnerContext);
  return parts.join('\n\n');
}

function parseAnalysisResponse(responseText) {
  const typeMatch = responseText.match(/Type:\s*(.*)/i);
  const explanationMatch = responseText.match(/Explanation:\s*([\s\S]*)/i);
  const type = typeMatch ? typeMatch[1].trim().split(/\n|\r/)[0] : 'Unknown';
  const explanation = explanationMatch ? explanationMatch[1].trim() : responseText;
  return { type, result: explanation };
}

function getModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Server missing GEMINI_API_KEY');
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: MODEL_ID });
}

async function analyzeImage(imageData, subjectMode, learnerContext = '') {
  const model = getModel();
  const base64Data = imageData.split(',')[1];
  const result = await model.generateContent({
    contents: [
      {
        parts: [
          { text: buildAnalysisPrompt(subjectMode, learnerContext) },
          { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
        ],
      },
    ],
  });
  return parseAnalysisResponse((await result.response).text());
}

async function followUpChat(imageData, messages, question, subjectMode, learnerContext = '') {
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

  (messages || []).forEach((msg) => {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  });

  const followParts = [];
  if (learnerContext) followParts.push(learnerContext);
  followParts.push(`User follow-up question:\n${question}`);
  contents.push({
    role: 'user',
    parts: [{ text: followParts.join('\n\n') }],
  });

  const result = await model.generateContent({ contents });
  return (await result.response).text();
}

module.exports = { analyzeImage, followUpChat, parseAnalysisResponse };