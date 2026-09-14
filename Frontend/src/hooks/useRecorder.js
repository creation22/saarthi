import { useState, useRef, useCallback } from 'react';

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const pickMimeType = () => {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
    for (const t of ['audio/webm', 'audio/mp4', 'audio/ogg']) {
      try {
        if (MediaRecorder.isTypeSupported(t)) return t;
      } catch {
        /* ignore and try next */
      }
    }
    return '';
  };

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        const message = 'Voice recording is not supported in this browser.';
        setError(message);
        return message;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      return null;
    } catch (err) {
      const denied = err?.name === 'NotAllowedError' || err?.name === 'SecurityError';
      const missing = err?.name === 'NotFoundError' || err?.name === 'OverconstrainedError';
      const message = denied
        ? 'Microphone access denied. Please allow microphone permissions.'
        : missing
          ? 'No microphone found on this device.'
          : 'Could not start recording. Please try again.';
      setError(message);
      return message;
    }
  }, []);

  const stop = useCallback(() => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        // Nothing to stop — release any dangling tracks and resolve null
        try {
          recorder?.stream?.getTracks()?.forEach((t) => t.stop());
        } catch {
          /* ignore */
        }
        mediaRecorderRef.current = null;
        setRecording(false);
        return resolve(null);
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        // Stop all tracks to release the microphone
        try {
          recorder.stream.getTracks().forEach((t) => t.stop());
        } catch {
          /* ignore */
        }
        mediaRecorderRef.current = null;
        setRecording(false);
        resolve(blob);
      };
      recorder.onerror = () => {
        try {
          recorder.stream.getTracks().forEach((t) => t.stop());
        } catch {
          /* ignore */
        }
        mediaRecorderRef.current = null;
        setRecording(false);
        resolve(null);
      };
      try {
        recorder.stop();
      } catch {
        setRecording(false);
        resolve(null);
      }
    });
  }, []);

  return { recording, error, start, stop };
}
