export function HelpTip({ children, tip, title }) {
  return (
    <span className="group/tip relative inline-flex" title={tip}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-52 -translate-x-1/2 rounded-md border border-ink/10 bg-white px-2.5 py-2 text-left text-xs text-muted opacity-0 shadow-md transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {title && <span className="block font-medium text-ink mb-0.5">{title}</span>}
        {tip}
      </span>
    </span>
  );
}

export function HelpLine({ text }) {
  return (
    <p className="text-xs text-muted leading-relaxed border-t border-ink/8 pt-3 mt-3">
      {text}
    </p>
  );
}