const STEP_LINE =
  /^\s*(?:\d+[).]:]|step\s+\d+|[•\-*]\s+|\(\d+\)\s*)/i;

export function parseStepsFromText(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const stepLines = lines.filter((line) => STEP_LINE.test(line));

  if (stepLines.length >= 2) return stepLines;

  const numberedBlocks = text.match(/(?:^|\n)\s*\d+[).]]\s*.+/g);
  if (numberedBlocks && numberedBlocks.length >= 2) {
    return numberedBlocks.map((s) => s.trim());
  }

  return [];
}