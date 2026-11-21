import { Mic, MicOff } from 'lucide-react';

const COMMANDS = ['explain', 'repeat', 'steps', 'next', 'previous'];

export function VoiceCommandBar({ supported, enabled, listening, lastHeard, onToggle }) {
  return (
    <div className="mb-4 rounded-md bg-paper border border-ink/8 px-3 py-2.5 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-ink">Voice</span>
        {supported ? (
          <button
            type="button"
            onClick={onToggle}
            className={`vla-btn-secondary !py-1 !px-2 text-xs ${enabled ? '!border-teal !text-teal' : ''}`}
          >
            {enabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            {enabled ? (listening ? 'Listening' : 'On') : 'Off'}
          </button>
        ) : (
          <span className="text-xs text-muted">Chrome or Edge</span>
        )}
      </div>
      <p className="text-xs text-muted mt-1.5">After a result: {COMMANDS.join(', ')}</p>
      {lastHeard && enabled && (
        <p className="text-xs text-ink/50 mt-1 truncate">Last: {lastHeard}</p>
      )}
    </div>
  );
}