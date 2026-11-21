const USE_CASES = [
  {
    title: 'Math & numerical problems',
    body:
      'Photograph a printed or notebook question. Use subject mode Math for step-by-step work. Walk through Steps, or ask in Follow-up: “Explain step 2 in simpler words.”',
    tip: 'Good for algebra, word problems, and worked examples in textbooks.',
  },
  {
    title: 'Science & diagrams',
    body:
      'Point at a labeled diagram, graph, or lab setup. Science mode names parts, units, and relationships. Save key lines in Notes for revision.',
    tip: 'Works well on physics circuit sketches, biology figures, and chemistry setups.',
  },
  {
    title: 'Language & reading',
    body:
      'Upload a paragraph, poem, or comprehension passage. Language mode summarizes meaning and vocabulary. Use Read aloud when you want to hear phrasing.',
    tip: 'Helpful for ESL, essay prompts, and “what does this paragraph mean?”',
  },
  {
    title: 'Last-minute revision',
    body:
      'Capture one tricky question from a past paper, get an explanation, copy it, and paste into your own Notes with your class name or chapter.',
    tip: 'Reset starts a new question without closing the app.',
  },
];

const WORKFLOW = [
  { step: 'Choose subject', detail: 'Match Math, Science, or Language before Analyze so the answer fits the subject.' },
  { step: 'Capture clearly', detail: 'Steady frame, good light, confirm preview so text is readable.' },
  { step: 'Read on Blackboard', detail: 'Main answer lives there; typewriter runs once, then you can Copy or Share.' },
  { step: 'Own the learning', detail: 'Notes are yours—write formulas, mnemonics, or “remember for test” in your words.' },
];

export function StudentGuideSection() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-6 border-t border-ink/10 pt-10"
      aria-labelledby="student-guide-heading"
    >
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted mb-2">For students</p>
        <h2 id="student-guide-heading" className="vla-title text-2xl md:text-3xl text-ink">
          What this tool is for
        </h2>
        <p className="mt-2 text-sm md:text-base text-muted leading-relaxed">
          Visual Learning Assistant turns a photo of homework, a textbook, or a diagram into a written explanation you
          can read, hear, question, and save. It supports self-study—it does not replace your teacher, textbook, or
          doing the work yourself.
        </p>
      </header>

      <div className="vla-panel w-full p-5 md:p-6 mb-8">
        <h3 className="text-sm font-semibold text-ink mb-3">How students can use each part</h3>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-teal uppercase tracking-wide">Explanation (blackboard)</dt>
            <dd className="text-sm text-muted mt-1">
              AI answer with detected topic. Use Steps to break long solutions; Follow-up for “simpler” or “why?”
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-teal uppercase tracking-wide">Help & Notes</dt>
            <dd className="text-sm text-muted mt-1">
              Help reminds app controls; Notes store your summary—only on this device, for exam cram or class prep.
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-teal uppercase tracking-wide">Camera panel</dt>
            <dd className="text-sm text-muted mt-1">
              Camera for live pages; Upload for screenshots. Always confirm preview before Analyze.
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-teal uppercase tracking-wide">Voice</dt>
            <dd className="text-sm text-muted mt-1">
              After a result: enable Voice and say explain, repeat, steps, next, or previous (Chrome/Edge).
            </dd>
          </div>
        </dl>
      </div>

      <h3 className="text-sm font-semibold text-ink mb-4">Common use cases</h3>
      <ul className="grid gap-4 sm:grid-cols-2">
        {USE_CASES.map((item) => (
          <li key={item.title} className="vla-panel p-4 md:p-5 list-none">
            <h4 className="text-sm font-semibold text-ink">{item.title}</h4>
            <p className="text-sm text-muted mt-2 leading-relaxed">{item.body}</p>
            <p className="text-xs text-ink/70 mt-3 pt-3 border-t border-ink/8">
              <span className="font-medium text-ink">Tip:</span> {item.tip}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="text-sm font-semibold text-ink mt-10 mb-4">Suggested workflow</h3>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW.map((row, i) => (
          <li key={row.step} className="vla-panel p-4 list-none">
            <span className="vla-kbd mr-2">{i + 1}</span>
            <span className="text-sm font-medium text-ink">{row.step}</span>
            <p className="text-xs text-muted mt-2 leading-relaxed">{row.detail}</p>
          </li>
        ))}
      </ol>

      <p className="text-xs text-muted mt-8 max-w-2xl">
        Use responsibly: check answers against your class material, cite sources when required, and follow your
        school&apos;s policy on AI tools.
      </p>
    </section>
  );
}