import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { speakText } from '../services/speech';

export function StepNavigator({ dark, steps, currentStep, onChangeStep, onEnableSteps, result }) {
  if (!result) return null;

  const hasSteps = steps.length > 0;

  const handleShowSteps = () => {
    onEnableSteps();
    if (steps.length) speakText(steps[currentStep] || steps[0]);
  };

  const box = dark
    ? 'border-white/[0.06] bg-white/[0.03]'
    : 'border-ink/8 bg-paper';
  const label = dark ? 'text-neutral-300' : 'text-ink';
  const text = dark ? 'text-neutral-100' : 'text-ink';
  const muted = dark ? 'text-neutral-500' : 'text-muted';
  const link = dark ? 'text-[#7dcea0] hover:underline' : 'text-teal hover:underline';
  const navBtn = dark ? 'vla-btn-dark !py-1' : 'vla-btn-secondary !py-1';

  return (
    <div className={`w-full mb-3 rounded-md border px-3 py-2.5 ${box}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-xs font-medium ${label}`}>Steps</span>
        {!hasSteps && (
          <button type="button" onClick={handleShowSteps} className={`text-xs ${link}`}>
            Find steps
          </button>
        )}
      </div>
      {hasSteps ? (
        <>
          <div className="min-h-[2rem] mb-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, x: dark ? 8 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dark ? -8 : 8 }}
                transition={{ duration: 0.2 }}
                className={`text-sm ${text}`}
              >
                {steps[currentStep]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              disabled={currentStep <= 0}
              onClick={() => onChangeStep(currentStep - 1)}
              className={`${navBtn} disabled:opacity-30`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={muted}>
              {currentStep + 1} / {steps.length}
            </span>
            <button
              type="button"
              disabled={currentStep >= steps.length - 1}
              onClick={() => onChangeStep(currentStep + 1)}
              className={`${navBtn} disabled:opacity-30`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <p className={`text-xs ${muted}`}>Numbered lines in the answer can be split here.</p>
      )}
    </div>
  );
}