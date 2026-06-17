import axios from 'axios';
import FormData from 'form-data';

const BASE = 'https://api.sarvam.ai';

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
  const form = new FormData();
  form.append('file', audioBuffer, { filename: 'audio.wav', contentType: mimeType });
  form.append('model', 'saarika:v2');
  form.append('language_code', 'unknown'); // auto-detect

  const { data } = await axios.post(`${BASE}/speech-to-text`, form, {
    headers: headers(form.getHeaders()),
  });

  return { transcript: data.transcript, language_code: data.language_code };
}

/**
 * Translate any Indian language text to English via Sarvam Mayura model.
 * @param {string} text
 * @param {string} sourceLang  BCP-47 code e.g. 'hi-IN', 'ta-IN'
 * @returns {string} translated text
 */
export async function translateToEnglish(text, sourceLang) {
  const { data } = await axios.post(
    `${BASE}/translate`,
    {
      input: text,
      source_language_code: sourceLang,
      target_language_code: 'en-IN',
      model: 'mayura:v1',
      enable_preprocessing: true,
    },
    { headers: headers({ 'Content-Type': 'application/json' }) }
  );
  return data.translated_text;
}

/**
 * Text-to-Speech via Sarvam Bulbul model.
 * @param {string} text
 * @param {string} targetLang  BCP-47 code, defaults to 'hi-IN'
 * @returns {Buffer} PCM / WAV audio bytes
 */
export async function synthesizeSpeech(text, targetLang = 'hi-IN') {
  const { data } = await axios.post(
    `${BASE}/text-to-speech`,
    { inputs: [text], target_language_code: targetLang, model: 'bulbul:v1' },
    {
      headers: headers({ 'Content-Type': 'application/json' }),
      responseType: 'arraybuffer',
    }
  );
  return Buffer.from(data);
}
