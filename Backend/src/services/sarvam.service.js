import axios from 'axios';
import FormData from 'form-data';

const BASE = 'https://api.sarvam.ai';
const REQUEST_TIMEOUT_MS = 60000;
const MAX_TTS_CHARS = 2000;

function headers(extra = {}) {
  return { 'api-subscription-key': process.env.SARVAM_API_KEY, ...extra };
}

/**
 * Speech-to-Text via Sarvam Saarika model.
 * @param {Buffer} audioBuffer  Raw audio bytes
 * @param {string} mimeType     e.g. 'audio/wav'
 * @returns {{ transcript: string, language_code: string }}
 */
export async function transcribeAudio(audioBuffer, mimeType = 'audio/wav') {
  if (!Buffer.isBuffer(audioBuffer) || audioBuffer.length === 0) {
    const err = new Error('Invalid audio data');
    err.status = 400;
    throw err;
  }
  const form = new FormData();
  form.append('file', audioBuffer, { filename: 'audio.wav', contentType: mimeType });
  form.append('model', 'saarika:v2');
  form.append('language_code', 'unknown'); // auto-detect

  const { data } = await axios.post(`${BASE}/speech-to-text`, form, {
    headers: headers(form.getHeaders()),
    timeout: REQUEST_TIMEOUT_MS,
  });

  if (typeof data?.transcript !== 'string' || !data.transcript.trim()) {
    const err = new Error('Speech recognition returned no transcript. Please try again.');
    err.status = 502;
    throw err;
  }

  return { transcript: data.transcript, language_code: data.language_code || 'en-IN' };
}

/**
 * Translate any Indian language text to English via Sarvam Mayura model.
 * @param {string} text
 * @param {string} sourceLang  BCP-47 code e.g. 'hi-IN', 'ta-IN'
 * @returns {string} translated text
 */
export async function translateToEnglish(text, sourceLang) {
  if (typeof text !== 'string' || !text.trim()) {
    const err = new Error('Nothing to translate');
    err.status = 400;
    throw err;
  }
  const { data } = await axios.post(
    `${BASE}/translate`,
    {
      input: text,
      source_language_code: sourceLang,
      target_language_code: 'en-IN',
      model: 'mayura:v1',
      enable_preprocessing: true,
    },
    { headers: headers({ 'Content-Type': 'application/json' }), timeout: REQUEST_TIMEOUT_MS }
  );
  if (typeof data?.translated_text !== 'string' || !data.translated_text.trim()) {
    const err = new Error('Translation service returned an empty response. Please try again.');
    err.status = 502;
    throw err;
  }
  return data.translated_text;
}

/**
 * Text-to-Speech via Sarvam Bulbul model.
 * @param {string} text
 * @param {string} targetLang  BCP-47 code, defaults to 'hi-IN'
 * @returns {Buffer} PCM / WAV audio bytes
 */
export async function synthesizeSpeech(text, targetLang = 'hi-IN') {
  if (typeof text !== 'string' || !text.trim()) {
    const err = new Error('Nothing to synthesize');
    err.status = 400;
    throw err;
  }
  const clipped = text.length > MAX_TTS_CHARS ? text.slice(0, MAX_TTS_CHARS) : text;
  const { data } = await axios.post(
    `${BASE}/text-to-speech`,
    { inputs: [clipped], target_language_code: targetLang, model: 'bulbul:v1' },
    {
      headers: headers({ 'Content-Type': 'application/json' }),
      responseType: 'arraybuffer',
      timeout: REQUEST_TIMEOUT_MS,
    }
  );
  if (!data || data.byteLength === 0) {
    const err = new Error('Speech synthesis returned no audio. Please try again.');
    err.status = 502;
    throw err;
  }
  return Buffer.from(data);
}
