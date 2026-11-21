export function ProcessingIndicator({ label = 'Analyzing' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="vla-dot h-1.5 w-1.5 rounded-full bg-[#7dcea0]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs vla-explain-muted tracking-wide">{label}</span>
    </div>
  );
}