export const SUBJECT_MODES = {
  auto: {
    id: 'auto',
    label: 'Auto',
    hint: 'Detect topic automatically',
    extra: '',
  },
  math: {
    id: 'math',
    label: 'Math',
    hint: 'Step-by-step solutions',
    extra:
      'Focus on mathematics. Show numbered steps, justify each step, and give a final answer with a quick check.',
  },
  science: {
    id: 'science',
    label: 'Science',
    hint: 'Concepts, diagrams, formulas',
    extra:
      'Focus on science. Name concepts, laws, or units; explain diagrams; show calculations when present.',
  },
  language: {
    id: 'language',
    label: 'Language',
    hint: 'Reading & writing help',
    extra:
      'Focus on language and text. Summarize, explain vocabulary, grammar, and answer comprehension questions.',
  },
  object: {
    id: 'object',
    label: 'Objects',
    hint: 'Identify items & scenes',
    extra:
      'Focus on objects, people, or scenes. Describe what you see, purpose, and notable details clearly.',
  },
};

export const DEFAULT_SUBJECT_MODE = 'auto';