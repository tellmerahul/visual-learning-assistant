import { SUBJECT_MODES } from '../constants/subjectModes';

export function SubjectModePicker({ value, onChange, disabled }) {
  return (
    <fieldset className="w-full mb-4 border-0 p-0 m-0" disabled={disabled}>
      <legend className="text-xs font-medium text-muted mb-2">Subject</legend>
      <div className="flex flex-wrap gap-1.5">
        {Object.values(SUBJECT_MODES).map((mode) => (
          <button
            key={mode.id}
            type="button"
            title={mode.hint}
            disabled={disabled}
            onClick={() => onChange(mode.id)}
            className={`rounded-md px-2.5 py-1 text-sm border transition-colors ${
              value === mode.id
                ? 'border-teal bg-teal-light text-teal-dark font-medium'
                : 'border-transparent bg-paper text-ink hover:border-ink/15'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}