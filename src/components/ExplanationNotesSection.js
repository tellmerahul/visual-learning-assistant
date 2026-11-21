const NOTES_KEY = 'vla_scratch_notes';

export function loadScratchNotes() {
  try {
    return localStorage.getItem(NOTES_KEY) || '';
  } catch {
    return '';
  }
}

export function saveScratchNotes(text) {
  try {
    localStorage.setItem(NOTES_KEY, text);
  } catch {
    /* ignore */
  }
}

export function clearScratchNotes() {
  try {
    localStorage.removeItem(NOTES_KEY);
  } catch {
    /* ignore */
  }
}

export function ExplanationNotesSection({
  hasSession,
  notes,
  onNotesChange,
  stepCount,
  followUpCount,
}) {
  return (
    <section className="vla-notes-panel flex flex-col min-h-[120px]" aria-label="Your notes">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#9ca89c]">Notes</p>
          <p className="text-xs text-[#b8c4b8]">Apne shabd — yahan likho, browser me save rahega</p>
        </div>
        {hasSession && (
          <div className="flex gap-2 text-[10px] text-[#8a968a]">
            <span>Steps: {stepCount}</span>
            <span>·</span>
            <span>Follow-ups: {followUpCount}</span>
          </div>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder={
          hasSession
            ? 'Important points, formulas, ya exam ke liye yaad rakhna…'
            : 'Analyze ke baad yahan apni notes likh sakte ho.'
        }
        className="vla-notes-input flex-1 w-full min-h-[100px] resize-y rounded-md border border-white/[0.08] bg-[#0a0a0a] mt-2 px-3 py-2.5 text-sm text-[#e2ebe2] placeholder:text-[#5c665c] focus:border-[#7dcea0]/40 focus:outline-none focus:ring-1 focus:ring-[#7dcea0]/25"
      />
    </section>
  );
}