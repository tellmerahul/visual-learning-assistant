import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Share2, RotateCcw } from 'lucide-react';
import { Typewriter } from './Typewriter';
import { StepNavigator } from './StepNavigator';
import { ChatFollowUp } from './ChatFollowUp';
import { ProcessingIndicator } from './ProcessingIndicator';
import { ExplanationHelpBoard } from './ExplanationHelpBoard';
import {
  ExplanationNotesSection,
  loadScratchNotes,
  saveScratchNotes,
  clearScratchNotes,
} from './ExplanationNotesSection';
import { copyText, shareText } from '../utils/share';
import { parseStepsFromText } from '../utils/parseSteps';

export function DescriptionPanel({
  detectedType,
  hasSession,
  isProcessing,
  result,
  error,
  steps,
  currentStep,
  onStepChange,
  onStepsUpdate,
  chatMessages,
  chatDisabled,
  onFollowUp,
  onReset,
}) {
  const descPanelRef = useRef(null);
  const [copyOk, setCopyOk] = useState(false);
  const [glow, setGlow] = useState(false);
  const [notes, setNotes] = useState(() => loadScratchNotes());

  const handleNotesChange = (text) => {
    setNotes(text);
    saveScratchNotes(text);
  };

  useEffect(() => {
    if (descPanelRef.current) {
      descPanelRef.current.scrollTop = descPanelRef.current.scrollHeight;
    }
  }, [result, chatMessages]);

  useEffect(() => {
    if (!hasSession || isProcessing) return;
    setGlow(true);
    const t = setTimeout(() => setGlow(false), 600);
    return () => clearTimeout(t);
  }, [hasSession, isProcessing, detectedType]);

  const typeLabel =
    detectedType && `${detectedType.charAt(0).toUpperCase()}${detectedType.slice(1)}`;

  const handleCopy = async () => {
    const ok = await copyText(result);
    setCopyOk(ok);
    setTimeout(() => setCopyOk(false), 2000);
  };

  const handleShare = async () => {
    await shareText('Visual Learning Assistant', result);
  };

  const enableSteps = () => {
    const parsed = parseStepsFromText(result);
    const list = parsed.length ? parsed : result.split('\n').filter(Boolean);
    onStepsUpdate(list, 0);
  };

  const handleReset = () => {
    clearScratchNotes();
    setNotes('');
    onReset();
  };

  const followUpCount = chatMessages.filter((m) => m.role === 'user').length;

  return (
    <section
      className={`vla-explain vla-reveal flex flex-col p-5 md:p-6 w-full min-h-[520px] max-h-[90vh] ${glow ? 'vla-explain-live' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3 border-b border-white/[0.06] pb-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest vla-explain-muted mb-1">Output</p>
          <h2 className="text-base font-semibold text-white font-serif">Explanation</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={typeLabel || 'empty'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs vla-explain-muted mt-1"
            >
              {typeLabel ? (
                <>
                  Type: <span className="vla-explain-accent">{typeLabel}</span>
                </>
              ) : (
                'No analysis yet'
              )}
            </motion.p>
          </AnimatePresence>
        </div>
        {hasSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-end gap-1"
          >
            {result && (
              <>
                <button type="button" onClick={handleCopy} className="vla-btn-dark">
                  <Copy className="w-3 h-3" />
                  {copyOk ? 'Copied' : 'Copy'}
                </button>
                <button type="button" onClick={handleShare} className="vla-btn-dark">
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              </>
            )}
            <button type="button" onClick={handleReset} className="vla-btn-dark">
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </motion.div>
        )}
      </div>

      <StepNavigator
        dark
        result={result}
        steps={steps}
        currentStep={currentStep}
        onChangeStep={onStepChange}
        onEnableSteps={enableSteps}
      />

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] vla-explain-muted mb-1.5">Blackboard</p>
          <div
            ref={descPanelRef}
            aria-label="Explanation blackboard"
            className={`vla-explain-body shrink-0 overflow-y-auto text-sm leading-relaxed p-4 min-h-[140px] max-h-[min(280px,38vh)] ${
              isProcessing ? 'vla-explain-body-processing' : ''
            }`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
          >
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProcessingIndicator />
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {chatMessages.length === 0 ? (
                    <Typewriter text={result} />
                  ) : (
                    <span className="text-neutral-100">{result}</span>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="vla-explain-muted text-center py-10 text-sm"
                >
                  Result streams here after you analyze.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ExplanationHelpBoard hasSession={hasSession} />

        <ExplanationNotesSection
          hasSession={hasSession}
          notes={notes}
          onNotesChange={handleNotesChange}
          stepCount={steps.length}
          followUpCount={followUpCount}
        />
      </div>

      {hasSession && <ChatFollowUp dark messages={chatMessages} disabled={chatDisabled} onSend={onFollowUp} className="mt-3 shrink-0" />}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-300 bg-red-950/50 border border-red-900/50 rounded-md px-3 py-2 mt-2 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}