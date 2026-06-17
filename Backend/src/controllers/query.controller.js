import { transcribeAudio, translateToEnglish, synthesizeSpeech } from '../services/sarvam.service.js';
import { retrieveLegalContext } from '../services/rag.service.js';
import { getLegalGuidance } from '../services/llm.service.js';
import { Session } from '../models/Session.js';

const ENGLISH_CODES = new Set(['en-IN', 'en-US', 'en']);

async function processQuery(englishText, sessionId, language, voiceOutput) {
  const { contextString, citations } = await retrieveLegalContext(englishText);
  const guidance = await getLegalGuidance(englishText, contextString);

  await Session.findOneAndUpdate(
    { sessionId },
    {
      $push: {
        messages: {
          $each: [
            { role: 'user',      content: englishText, language },
            { role: 'assistant', content: guidance,    language: 'en-IN' },
          ],
        },
      },
    },
    { upsert: true, new: true }
  );

  let audioBase64 = null;
  if (voiceOutput) {
    const audioBuf = await synthesizeSpeech(guidance, language);
    audioBase64 = audioBuf.toString('base64');
  }

  return { guidance, citations, audio: audioBase64 };
}

export async function textQueryController(req, res, next) {
  try {
    const { text, sessionId, language = 'en-IN', voiceOutput = false } = req.body;
    if (!text || !sessionId) {
      return res.status(400).json({ error: 'text and sessionId are required' });
    }

    const englishText = ENGLISH_CODES.has(language)
      ? text
      : await translateToEnglish(text, language);

    const result = await processQuery(englishText, sessionId, language, voiceOutput);
    res.json({ originalText: text, ...result });
  } catch (err) {
    next(err);
  }
}

export async function voiceQueryController(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Audio file is required' });
    const { sessionId, voiceOutput = 'false' } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

    const { transcript, language_code } = await transcribeAudio(req.file.buffer, req.file.mimetype);

    const englishText = ENGLISH_CODES.has(language_code)
      ? transcript
      : await translateToEnglish(transcript, language_code);

    const result = await processQuery(englishText, sessionId, language_code, voiceOutput === 'true');
    res.json({ transcript, detectedLanguage: language_code, originalText: englishText, ...result });
  } catch (err) {
    next(err);
  }
}

// Standalone TTS — used by the frontend "play" button on existing messages
export async function speakController(req, res, next) {
  try {
    const { text, language = 'hi-IN' } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    const audioBuf = await synthesizeSpeech(text, language);
    res.set('Content-Type', 'audio/wav');
    res.send(audioBuf);
  } catch (err) {
    next(err);
  }
}
