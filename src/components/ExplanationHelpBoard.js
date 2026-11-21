const TIPS_IDLE = [
  'Analyze an image from Input — the answer appears in this panel.',
  'Pick a subject mode before you send (Math, Science, etc.).',
  'Use Capture, then confirm the preview, so the frame is correct.',
];

const TIPS_ACTIVE = [
  'Find steps splits numbered lines; use arrows or voice: next / previous.',
  'Enable Voice on Input, then say explain, repeat, or steps.',
  'Follow-up at the bottom asks about the same image — no new capture.',
  'Copy or Share saves the text; Reset clears this session.',
];

export function ExplanationHelpBoard({ hasSession }) {
  const tips = hasSession ? TIPS_ACTIVE : TIPS_IDLE;

  return (
    <aside className="vla-chalkboard" aria-label="Explanation help">
      <p className="vla-chalkboard-title">Help</p>
      <ul className="vla-chalkboard-list">
        {tips.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </aside>
  );
}