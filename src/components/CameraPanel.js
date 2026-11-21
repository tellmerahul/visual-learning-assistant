import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ImageUp, RefreshCw, Volume2, VolumeX, Check, X } from 'lucide-react';
import { SubjectModePicker } from './SubjectModePicker';
import { VoiceCommandBar } from './VoiceCommandBar';
import { HelpLine, HelpTip } from './HelpTip';

export function CameraPanel({
  videoRef,
  canvasRef,
  previewUrl,
  isCapturing,
  isProcessing,
  detectedType,
  hasResult,
  isSpeaking,
  subjectMode,
  voiceSupported,
  voiceEnabled,
  voiceListening,
  lastVoiceHeard,
  onSubjectModeChange,
  onToggleVoice,
  onToggleCamera,
  onSnapPreview,
  onConfirmPreview,
  onDiscardPreview,
  onUpload,
  onToggleSpeech,
}) {
  const typeBadge =
    detectedType && `${detectedType.charAt(0).toUpperCase()}${detectedType.slice(1)}`;

  const showVideo = isCapturing && !previewUrl;
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!previewUrl) return undefined;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 180);
    return () => clearTimeout(t);
  }, [previewUrl]);

  return (
    <section className="vla-panel-interactive vla-reveal vla-reveal-delay-2 p-5 md:p-6 w-full">
      <h2 className="text-sm font-semibold text-ink">Input</h2>
      <p className="text-xs text-muted mt-0.5 mb-4">Live camera or image file</p>

      <SubjectModePicker value={subjectMode} onChange={onSubjectModeChange} disabled={isProcessing} />
      <VoiceCommandBar
        supported={voiceSupported}
        enabled={voiceEnabled}
        listening={voiceListening}
        lastHeard={lastVoiceHeard}
        onToggle={onToggleVoice}
      />

      <div className="relative w-full aspect-video rounded-md overflow-hidden mb-4 border border-ink/12 bg-ink/[0.03]">
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.img
              key="preview"
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
          ) : (
            <motion.div
              key="live"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${showVideo ? '' : 'hidden'}`} />
            </motion.div>
          )}
        </AnimatePresence>
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        <AnimatePresence>
          {flash && (
            <motion.div
              className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
          )}
        </AnimatePresence>

        {!isCapturing && !previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm px-4 text-center">
            No source yet
          </div>
        )}
        <AnimatePresence>
          {typeBadge && !isProcessing && !previewUrl && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 left-2 rounded bg-white/95 border border-ink/10 px-2 py-0.5 text-xs font-medium text-ink"
            >
              {typeBadge}
            </motion.span>
          )}
        </AnimatePresence>
        {previewUrl && (
          <span className="absolute top-2 right-2 rounded bg-ink text-white text-xs px-2 py-0.5">Preview</span>
        )}
        {isProcessing && (
          <motion.div
            className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-xs font-medium text-ink bg-white/90 px-2 py-1 rounded border border-ink/10">
              Sending…
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <HelpTip title="Camera" tip="Rear camera on phones. Stop releases the lens.">
          <button
            type="button"
            onClick={onToggleCamera}
            disabled={Boolean(previewUrl)}
            className={`vla-btn-primary transition-transform ${isCapturing ? '!bg-ink hover:!bg-ink/90' : ''}`}
          >
            <Camera className="w-4 h-4" />
            {isCapturing ? 'Stop' : 'Camera'}
          </button>
        </HelpTip>

        <HelpTip title="Upload" tip="Same flow: preview, then analyze.">
          <label className="vla-btn-secondary cursor-pointer">
            <ImageUp className="w-4 h-4" />
            Upload
            <input type="file" accept="image/*" className="sr-only" onChange={onUpload} disabled={isProcessing} />
          </label>
        </HelpTip>

        {isCapturing && !previewUrl && (
          <HelpTip title="Capture" tip="Freeze one frame before sending to the model.">
            <button type="button" onClick={onSnapPreview} disabled={isProcessing} className="vla-btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Capture
            </button>
          </HelpTip>
        )}

        {previewUrl && (
          <>
            <button type="button" onClick={onDiscardPreview} disabled={isProcessing} className="vla-btn-secondary">
              <X className="w-4 h-4" />
              Discard
            </button>
            <HelpTip title="Analyze" tip="Uses your subject mode. Results appear in Explanation.">
              <button type="button" onClick={onConfirmPreview} disabled={isProcessing} className="vla-btn-primary">
                <Check className="w-4 h-4" />
                {isProcessing ? 'Working…' : 'Analyze'}
              </button>
            </HelpTip>
          </>
        )}

        {hasResult && (
          <button type="button" onClick={onToggleSpeech} className="vla-btn-secondary">
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSpeaking ? 'Stop speech' : 'Read aloud'}
          </button>
        )}
      </div>

      <HelpLine text="Hover primary buttons for short hints. Subject chips use tooltips on hover." />
    </section>
  );
}