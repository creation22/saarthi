import { useState } from 'react';
import { useRecorder } from '../hooks/useRecorder.js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { MicIcon, StopIcon, SendIcon, SpinnerIcon } from './ui/icons.jsx';

export default function QueryInput({ onSubmitText, onSubmitVoice, loading }) {
  const [text, setText] = useState('');
  const { recording, error: recErr, start, stop } = useRecorder();

  const handleSubmit = e => {
    e.preventDefault();
    const t = text.trim();
    if (!t || loading) return;
    onSubmitText(t);
    setText('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
  };

  const handleMic = async () => {
    if (recording) {
      const blob = await stop();
      if (blob) onSubmitVoice(blob);
    } else {
      if (recErr) { toast.error(recErr); return; }
      await start();
    }
  };

  const canSend = text.trim() && !loading && !recording;

  return (
    <form onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-2xl border px-4 py-3 transition-all focus-within:shadow-sm"
          style={{
            borderColor: recording ? 'var(--color-saffron)' : 'var(--color-glass-border)',
            background: 'var(--color-ivory)',
            boxShadow: recording ? '0 0 0 3px rgba(224,120,72,0.1)' : undefined,
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={loading || recording}
        placeholder="Type your legal question, or tap the mic to speak…"
        className="flex-1 resize-none bg-transparent text-sm focus:outline-none disabled:opacity-60"
        style={{
          fontFamily: 'var(--font-sans)',
          color: 'var(--color-ink)',
          lineHeight: '1.5',
          maxHeight: '96px',
          overflowY: 'auto',
        }}
        onInput={e => {
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
        }}
      />

      {/* Mic button */}
      <motion.button
        type="button"
        onClick={handleMic}
        disabled={loading}
        title={recording ? 'Stop recording' : 'Voice input'}
        whileHover={!loading ? { scale: 1.07 } : {}}
        whileTap={!loading ? { scale: 0.93 } : {}}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-40"
        style={{
          background: recording ? 'var(--color-saffron)' : 'var(--color-glass-bg)',
          border: `1px solid ${recording ? 'var(--color-saffron)' : 'var(--color-glass-border)'}`,
          color: recording ? '#fff' : 'var(--color-text-mid)',
        }}
      >
        {/* Pulse ring while recording */}
        <AnimatePresence>
          {recording && (
            <motion.span
              key="ring"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-xl"
              style={{ background: 'var(--color-saffron)' }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          {recording
            ? <motion.span key="stop" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
                <StopIcon size={15} color="currentColor" />
              </motion.span>
            : <motion.span key="mic" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MicIcon size={15} color="currentColor" />
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Send button */}
      <motion.button
        type="submit"
        disabled={!canSend}
        whileHover={canSend ? { scale: 1.04 } : {}}
        whileTap={canSend ? { scale: 0.95 } : {}}
        className="flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-medium text-white transition-opacity disabled:opacity-35"
        style={{ background: 'var(--color-saffron)', fontFamily: 'var(--font-sans)' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {loading
            ? <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SpinnerIcon size={13} color="#fff" />
              </motion.span>
            : <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex items-center gap-1.5">
                Send <SendIcon size={12} color="#fff" />
              </motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </form>
  );
}
