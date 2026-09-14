import { transcribeAudio, translateToEnglish, synthesizeSpeech } from '../services/sarvam.service.js';
import { retrieveLegalContext } from '../services/rag.service.js';
import { getLegalGuidance } from '../services/llm.service.js';
import { Session } from '../models/Session.js';

const ENGLISH_CODES = new Set(['en-IN', 'en-US', 'en']);
const MAX_QUERY_CHARS = 5000;
const MAX_TTS_CHARS = 2000;
const MAX_SESSION_ID_LENGTH = 128;
// BCP-47-ish: 2-3 letter lang + optional region, e.g. hi-IN, en
const LANGUAGE_REGEX = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateSessionId(sessionId) {
  return isNonEmptyString(sessionId) && sessionId.trim().length <= MAX_SESSION_ID_LENGTH;
}

function normalizeVoiceOutput(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.trim().toLowerCase() === 'true';
  return false;
}

function sanitizeLanguage(language, fallback = 'en-IN') {
  if (typeof language === 'string' && LANGUAGE_REGEX.test(language.trim())) {
    return language.trim();
  }
  return fallback;
}

async function processQuery(englishText, sessionId, language, voiceOutput, userId = null) {
  const { contextString, citations } = await retrieveLegalContext(englishText);
  const guidance = await getLegalGuidance(englishText, contextString);

  await Session.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: { sessionId, ...(userId ? { userId } : {}) },
      $push: {
        messages: {
          $each: [
            { role: 'user',      content: englishText, language },
            { role: 'assistant', content: guidance,    language: 'en-IN' },
          ],
          // Prevent unbounded session growth (MongoDB 16 MB doc limit)
          $slice: -200,
        },
      },
    },
    { upsert: true, new: true }
  );

  let audioBase64 = null;
  if (voiceOutput) {
    const ttsText = guidance.length > MAX_TTS_CHARS
      ? guidance.slice(0, MAX_TTS_CHARS)
      : guidance;
    const audioBuf = await synthesizeSpeech(ttsText, language);
    audioBase64 = audioBuf.toString('base64');
  }

  return { guidance, citations, audio: audioBase64 };
}

export async function textQueryController(req, res, next) {
  try {
    const { text, sessionId, language = 'en-IN', voiceOutput = false, state = '' } = req.body ?? {};
    if (!isNonEmptyString(text) || !validateSessionId(sessionId)) {
      return res.status(400).json({ error: 'text and sessionId are required' });
    }
    const cleanText = text.trim();
    if (cleanText.length > MAX_QUERY_CHARS) {
      return res.status(400).json({ error: `Query must be ${MAX_QUERY_CHARS} characters or fewer` });
    }
    const cleanSessionId = sessionId.trim();
    const cleanLanguage = sanitizeLanguage(language);
    // Optional jurisdiction hint from the frontend state selector
    const stateHint = typeof state === 'string' && state.trim() ? ` [Jurisdiction: ${state.trim().slice(0, 60)}]` : '';
    const queryWithState = stateHint ? `${cleanText}${stateHint}` : cleanText;

    const englishText = ENGLISH_CODES.has(cleanLanguage)
      ? queryWithState
      : await translateToEnglish(queryWithState, cleanLanguage);

    const result = await processQuery(englishText, cleanSessionId, cleanLanguage, normalizeVoiceOutput(voiceOutput), req.user?.sub ?? null);
    res.json({ originalText: cleanText, ...result });
  } catch (err) {
    next(err);
  }
}

export async function voiceQueryController(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Audio file is required' });
    const { sessionId, voiceOutput = 'false' } = req.body ?? {};
    if (!validateSessionId(sessionId)) return res.status(400).json({ error: 'sessionId is required' });

    const { transcript, language_code } = await transcribeAudio(req.file.buffer, req.file.mimetype);
    if (!isNonEmptyString(transcript)) {
      return res.status(422).json({ error: 'Could not transcribe any speech from the audio. Please try again.' });
    }
    const cleanTranscript = transcript.trim().slice(0, MAX_QUERY_CHARS);

    const detectedLanguage = sanitizeLanguage(language_code, 'en-IN');
    const englishText = ENGLISH_CODES.has(detectedLanguage)
      ? cleanTranscript
      : await translateToEnglish(cleanTranscript, detectedLanguage);

    const result = await processQuery(englishText, sessionId.trim(), detectedLanguage, normalizeVoiceOutput(voiceOutput), req.user?.sub ?? null);
    res.json({ transcript: cleanTranscript, detectedLanguage, originalText: englishText, ...result });
  } catch (err) {
    next(err);
  }
}

// Standalone TTS — used by the frontend "play" button on existing messages
export async function speakController(req, res, next) {
  try {
    const { text, language = 'hi-IN' } = req.body ?? {};
    if (!isNonEmptyString(text)) return res.status(400).json({ error: 'text is required' });
    const cleanText = text.trim().slice(0, MAX_TTS_CHARS);

    const audioBuf = await synthesizeSpeech(cleanText, sanitizeLanguage(language, 'hi-IN'));
    res.set('Content-Type', 'audio/wav');
    res.set('Content-Length', String(audioBuf.length));
    res.send(audioBuf);
  } catch (err) {
    next(err);
  }
}
