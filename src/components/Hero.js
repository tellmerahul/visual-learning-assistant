const STEPS = [
  { n: '1', label: 'Camera or file', hint: 'Start live video or pick a photo.' },
  { n: '2', label: 'Confirm frame', hint: 'Check the preview before sending.' },
  { n: '3', label: 'Read & ask', hint: 'Steps, voice, and follow-up on the same image.' },
];

export function Hero({ compact }) {
  return (
    <header
      className={`mx-auto w-full max-w-6xl px-4 md:px-6 transition-[padding] duration-300 ease-out ${
        compact ? 'pt-6 pb-3' : 'pt-8 pb-5 md:pt-10 md:pb-6'
      }`}
    >
      <div className="border-b border-ink/10 pb-6">
        <p className="vla-reveal text-xs font-medium uppercase tracking-[0.12em] text-muted mb-2">
          Study from what you see
        </p>
        <h1 className="vla-reveal vla-reveal-delay-1 vla-title text-3xl md:text-4xl text-ink">
          Visual Learning Assistant
        </h1>
        <p className="vla-reveal vla-reveal-delay-2 mt-2 max-w-lg text-sm md:text-base text-muted">
          Capture a problem or upload a screenshot. You get a typed explanation, optional narration, and short follow-up
          questions.
        </p>

        <ol
          className={`mt-6 flex flex-col gap-2 sm:flex-row sm:gap-0 sm:divide-x sm:divide-ink/10 transition-opacity duration-300 ${
            compact ? 'opacity-80' : 'opacity-100'
          }`}
        >
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className={`vla-reveal group sm:flex-1 sm:px-4 first:sm:pl-0 last:sm:pr-0 py-1 sm:py-0`}
              style={{ animationDelay: `${0.15 + i * 0.05}s` }}
            >
              <span className="flex items-baseline gap-2">
                <span className="vla-kbd transition-colors duration-200 group-hover:border-teal/40">{step.n}</span>
                <span className="text-sm font-medium text-ink group-hover:text-teal transition-colors duration-200">
                  {step.label}
                </span>
              </span>
              <p className="mt-1 text-xs text-muted overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 sm:pl-7">
                {step.hint}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}