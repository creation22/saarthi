import { useEffect, useRef, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import ReasoningTrace from './ReasoningTrace.jsx';
import { speakText, submitFeedback } from '../services/api.js';
import { useSession } from '../hooks/useSession.js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BookOpenIcon, SpeakerIcon, SpeakerLoadingIcon, SpeakerPlayingIcon,
  ThumbUpIcon, ThumbDownIcon, ScalesIcon, ExternalLinkIcon,
} from './ui/icons.jsx';

/* ─── Source Citations ────────────────────────────────────────── */
function Citations({ citations }) {
  if (!citations?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {citations.map((c, i) => (
        <motion.a
          key={i} href={c.url} target="_blank" rel="noopener noreferrer" title={c.snippet}
          whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono-dm text-[10px] tracking-wide transition-colors"
          style={{
            border: '1px solid var(--color-glass-border)',
            color: 'var(--color-gold)',
            background: 'var(--color-glass-bg)',
          }}
        >
          <BookOpenIcon size={11} color="var(--color-gold)" />
          {c.label}
          <ExternalLinkIcon size={9} color="var(--color-gold)" style={{ opacity: 0.6 }} />
        </motion.a>
      ))}
    </div>
  );
}

/* ─── Voice playback ──────────────────────────────────────────── */
function PlayButton({ text, language }) {
  const [state, setState] = useState('idle');
  const audioRef = useRef(null);
  const urlRef = useRef(null);

  // Stop playback + free the object URL on unmount
  useEffect(() => () => {
    try { audioRef.current?.pause(); } catch { /* ignore */ }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const handle = useCallback(async () => {
    if (state !== 'idle') return;
    if (!text || !text.trim()) { toast.error('Nothing to play.'); return; }
    setState('loading');
    try {
      // Cap the spoken text — TTS APIs bill per character and reject novels
      const clipped = text.length > 2000 ? text.slice(0, 2000) : text;
      const { data } = await speakText(clipped, language || 'hi-IN');
      const url = URL.createObjectURL(new Blob([data], { type: 'audio/wav' }));
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      setState('playing');
      audio.onended = () => { setState('idle'); URL.revokeObjectURL(url); urlRef.current = null; };
      audio.onerror = () => { setState('idle'); toast.error('Audio playback failed.'); URL.revokeObjectURL(url); urlRef.current = null; };
      await audio.play();
    } catch { setState('idle'); toast.error('Could not fetch audio.'); }
  }, [text, language, state]);

  const icons = {
    idle:    <SpeakerIcon size={12} color="var(--color-text-mid)" />,
    loading: <SpeakerLoadingIcon size={12} color="var(--color-text-mid)" />,
    playing: <SpeakerPlayingIcon size={12} color="var(--color-saffron)" />,
  };
  const labels = { idle: 'Listen', loading: 'Loading…', playing: 'Playing…' };

  return (
    <motion.button
      onClick={handle} disabled={state !== 'idle'}
      whileHover={state === 'idle' ? { scale: 1.02 } : {}}
      whileTap={state === 'idle' ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono-dm text-[10px] tracking-wide transition-colors disabled:opacity-40"
      style={{
        border: `1px solid ${state === 'playing' ? 'var(--color-saffron)' : 'var(--color-glass-border)'}`,
        color: state === 'playing' ? 'var(--color-saffron)' : 'var(--color-text-mid)',
        background: 'var(--color-glass-bg)',
      }}
    >
      {icons[state]}
      {labels[state]}
    </motion.button>
  );
}

/* ─── Feedback ────────────────────────────────────────────────── */
function FeedbackButtons({ sessionId, messageIndex, guidance }) {
  const [voted, setVoted] = useState(null);
  const vote = async r => {
    if (voted) return;
    setVoted(r);
    try {
      await submitFeedback(sessionId, messageIndex, guidance, r);
      toast.success(r === 'up' ? 'Thanks for the feedback!' : "We'll improve on this.");
    } catch { setVoted(null); }
  };

  if (voted) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1.5 font-mono-dm text-[10px] tracking-wide"
        style={{ color: voted === 'up' ? 'var(--color-gold)' : 'var(--color-text-soft)' }}
      >
        {voted === 'up'
          ? <><ThumbUpIcon size={11} color="var(--color-gold)" /> Marked helpful</>
          : <><ThumbDownIcon size={11} color="var(--color-text-soft)" /> Noted — will improve</>}
      </motion.span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="font-mono-dm text-[10px] tracking-wide mr-0.5" style={{ color: 'var(--color-text-faint)' }}>Helpful?</span>
      {[
        { r: 'up',   Icon: ThumbUpIcon,   label: 'helpful' },
        { r: 'down', Icon: ThumbDownIcon, label: 'not helpful' },
      ].map(({ r, Icon, label }) => (
        <motion.button key={r} onClick={() => vote(r)} title={label}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
          style={{ border: '1px solid var(--color-glass-border)', background: 'var(--color-glass-bg)', color: 'var(--color-text-mid)' }}
        >
          <Icon size={12} color="currentColor" />
        </motion.button>
      ))}
    </div>
  );
}

/* ─── User bubble ─────────────────────────────────────────────── */
function UserBubble({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: 16 }} animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className="flex justify-end"
    >
      <div className="max-w-[72%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm shadow-sm"
           style={{ background: 'var(--color-saffron)', color: '#fff' }}>
        <p style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.55 }}>{message.content}</p>
        {message.language && message.language !== 'en-IN' && (
          <p className="mt-1 font-mono-dm text-[10px] opacity-60">{message.language}</p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Assistant bubble ────────────────────────────────────────── */
function AssistantBubble({ message, messageIndex, language }) {
  const { sessionId } = useSession();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: -16 }} animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] space-y-2">
        {/* Main card */}
        <div className="rounded-2xl rounded-tl-sm border px-5 py-4"
             style={{
               borderColor: 'var(--color-glass-border)',
               background: 'var(--color-ivory)',
               boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
             }}>
          {/* Header row */}
          <div className="mb-3 flex items-center gap-2.5">
            {/* Brand avatar */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full"
                 style={{ background: 'rgba(224,120,72,0.12)', border: '1px solid rgba(224,120,72,0.25)' }}>
              <svg width="13" height="13" viewBox="0 0 18 22" fill="none" stroke="var(--color-saffron)" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <line x1="9" y1="1" x2="9" y2="21" />
                <line x1="2" y1="6" x2="16" y2="6" />
                <line x1="2" y1="6" x2="2" y2="13" />
                <line x1="16" y1="6" x2="16" y2="13" />
                <path d="M0,13 Q2,16 4,13" /><path d="M0,13 Q2,10 4,13" />
                <path d="M14,13 Q16,16 18,13" /><path d="M14,13 Q16,10 18,13" />
                <line x1="6" y1="21" x2="12" y2="21" />
              </svg>
            </div>
            <span className="font-mono-dm text-[10px] tracking-widest uppercase"
                  style={{ color: 'var(--color-gold)' }}>Legal Assistant</span>
          </div>

          {/* Response */}
          <div className="chat-prose prose prose-sm max-w-none text-sm"
               style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-sans)' }}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Citations */}
          <Citations citations={message.citations} />

          {/* Action bar */}
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3"
               style={{ borderColor: 'var(--color-glass-border-2)' }}>
            <PlayButton text={message.content} language={language} />
            <FeedbackButtons sessionId={sessionId} messageIndex={messageIndex} guidance={message.content} />
          </div>
        </div>

        {/* Reasoning trace */}
        <ReasoningTrace guidance={message.content} />
      </div>
    </motion.div>
  );
}

/* ─── Typing indicator ────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="rounded-2xl rounded-tl-sm border px-5 py-4 shadow-sm"
           style={{ borderColor: 'var(--color-glass-border)', background: 'var(--color-ivory)' }}>
        <div className="dot-loader flex gap-1.5"><span /><span /><span /></div>
      </div>
    </motion.div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 py-20 text-center">
      {/* Animated scales icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{ color: 'var(--color-text-faint)' }}
      >
        <ScalesIcon size={52} color="currentColor" animated />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-text-mid)' }}>
          Ask any legal question
        </p>
        <p className="mt-1 font-mono-dm text-xs tracking-wide" style={{ color: 'var(--color-text-faint)' }}>
          in your language — by text or voice
        </p>
      </motion.div>

      <motion.a
        href="/rights"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -1 }}
        className="mt-1 rounded-full px-4 py-2 font-mono-dm text-xs tracking-wide transition-colors"
        style={{
          border: '1px solid var(--color-glass-border)',
          color: 'var(--color-text-soft)',
          background: 'var(--color-glass-bg)',
        }}
      >
        Browse Know Your Rights →
      </motion.a>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export default function ChatWindow({ messages, loading, language }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  if (!messages.length && !loading) return <EmptyState />;

  let assistantIdx = -1;
  return (
    <div className="flex flex-col gap-4 px-4 py-5 md:px-6">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => {
          if (msg.role === 'assistant') assistantIdx++;
          return msg.role === 'user'
            ? <UserBubble key={i} message={msg} />
            : <AssistantBubble key={i} message={msg} messageIndex={assistantIdx} language={language} />;
        })}
      </AnimatePresence>
      {loading && <TypingIndicator key="typing" />}
      <div ref={bottomRef} />
    </div>
  );
}
