import { useState, useEffect } from 'react';

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useSession() {
  const [sessionId, setSessionId] = useState(() => {
    const stored = sessionStorage.getItem('legalapp_session_id');
    return stored || generateSessionId();
  });

  useEffect(() => {
    sessionStorage.setItem('legalapp_session_id', sessionId);
  }, [sessionId]);

  const resetSession = () => {
    const newId = generateSessionId();
    setSessionId(newId);
    sessionStorage.setItem('legalapp_session_id', newId);
  };

  return { sessionId, resetSession };
}
