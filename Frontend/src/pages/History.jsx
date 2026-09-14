import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useSession } from '../hooks/useSession.js';
import { getSessionHistory } from '../services/api.js';

export default function History() {
  const { sessionId: currentSessionId } = useSession();
  const [searchParams] = useSearchParams();
  // Matter pages link here with ?session=<id> — honour it, else current session
  const sessionId = searchParams.get('session') || currentSessionId;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSessionHistory(sessionId)
      .then(({ data }) => setMessages(data.messages || []))
      .catch(() => setError('No history found for this session.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <div style={{ background: 'var(--color-ivory)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)' }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <span style={{ color: 'var(--color-gold)' }}>⚖</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-ink)' }}>
                Legal<span style={{ color: 'var(--color-saffron)' }}>Sahayak</span>
              </span>
            </Link>
            <span className="font-mono-dm text-xs" style={{ color: 'var(--color-border)' }}>|</span>
            <span className="font-mono-dm text-xs tracking-widest uppercase" style={{ color: 'var(--color-ink-muted)' }}>
              Session History
            </span>
          </div>
          <Link to="/chat"
                className="rounded-full px-5 py-2 font-mono-dm text-xs tracking-wide text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-saffron)' }}>
            Back to Chat
          </Link>
        </div>
      </header>

      {/* Session ID strip */}
      <div className="border-b px-5 py-3" style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory-deep)' }}>
        <p className="mx-auto max-w-3xl font-mono-dm text-[10px] tracking-wide" style={{ color: 'var(--color-ink-muted)', opacity: 0.6 }}>
          Session: {sessionId}
        </p>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-10">
        {loading && (
          <div className="flex items-center justify-center py-24 gap-2">
            <div className="dot-loader flex gap-1.5"><span /><span /><span /></div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border px-6 py-10 text-center"
               style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory-deep)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-ink-muted)' }}>
              {error}
            </p>
            <Link to="/chat"
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono-dm text-xs tracking-wide text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-saffron)' }}>
              Start a new chat
            </Link>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="rounded-2xl border px-6 py-16 text-center"
               style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory-deep)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-ink-muted)' }}>
              No messages yet.
            </p>
          </div>
        )}

        {!loading && !error && messages.length > 0 && (
          <>
            <p className="mb-6 font-mono-dm text-xs tracking-wide" style={{ color: 'var(--color-ink-muted)' }}>
              {messages.length} message{messages.length !== 1 ? 's' : ''} in this session
            </p>
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div key={i}
                     className={`rounded-2xl border px-5 py-4 text-sm ${msg.role === 'user' ? 'ml-auto max-w-[75%]' : 'max-w-full'}`}
                     style={{
                       borderColor: msg.role === 'user' ? 'var(--color-saffron)' : 'var(--color-border)',
                       background: msg.role === 'user' ? 'var(--color-saffron)' : 'var(--color-ivory)',
                       color: msg.role === 'user' ? '#fff' : 'var(--color-ink)',
                     }}>
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-mono-dm text-[10px] tracking-widest uppercase"
                              style={{ color: 'var(--color-gold)' }}>
                          ⚖ Legal Assistant
                        </span>
                      </div>
                      <div className="chat-prose prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </>
                  )}
                  <p className="mt-2 font-mono-dm text-[10px]"
                     style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.55)' : 'var(--color-ink-muted)', opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t px-5 py-8 text-center font-mono-dm text-xs"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink-muted)', opacity: 0.6 }}>
        Legal Sahayak · Session history is stored locally and on your device only.
      </footer>
    </div>
  );
}
