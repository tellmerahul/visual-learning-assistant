import { useEffect, useState } from 'react';

export function Typewriter({ text, speedMs = 12, showCaret = true }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return undefined;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i += 1;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, speedMs]);

  return (
    <span className="text-neutral-100">
      {displayed}
      {showCaret && !done && <span className="vla-caret" aria-hidden />}
    </span>
  );
}