import { useState } from 'react';
import { Send } from 'lucide-react';

export function ChatFollowUp({ dark, messages, disabled, onSend, className = '' }) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || disabled) return;
    setInput('');
    await onSend(q);
  };

  const border = dark ? 'border-white/[0.06]' : 'border-ink/8';
  const label = dark ? 'text-neutral-300' : 'text-ink';
  const userBubble = dark ? 'bg-white/10 text-neutral-200 ml-3' : 'bg-teal-light text-teal-dark ml-3';
  const aiBubble = dark
    ? 'bg-black/40 text-neutral-300 mr-3 border border-white/[0.06]'
    : 'bg-paper text-ink mr-3 border border-ink/8';
  const inputCls = dark
    ? 'border-white/10 bg-black/60 text-neutral-100 placeholder:text-neutral-600 focus:border-[#7dcea0] focus:ring-[#7dcea0]/30'
    : 'border-ink/15 bg-white text-ink placeholder:text-muted/70 focus:border-teal focus:ring-teal';
  const sendBtn = dark ? 'vla-btn-dark-primary !px-3' : 'vla-btn-primary !px-3';

  return (
    <div className={`border-t ${border} pt-3 ${className}`}>
      <p className={`text-xs font-medium mb-2 ${label}`}>Follow-up (same image)</p>
      {messages.length > 0 && (
        <ul className="max-h-24 overflow-y-auto mb-2 space-y-1.5 text-xs" style={{ scrollbarWidth: 'thin' }}>
          {messages.map((msg, i) => (
            <li key={`${msg.role}-${i}`} className={`rounded px-2 py-1.5 ${msg.role === 'user' ? userBubble : aiBubble}`}>
              {msg.content}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Ask a clarifying question"
          className={`flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 disabled:opacity-50 ${inputCls}`}
        />
        <button type="submit" disabled={disabled || !input.trim()} className={sendBtn} aria-label="Send">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}