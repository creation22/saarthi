import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
});

// Attach Bearer token to every request when the user is logged in
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ls_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 means the stored token is expired/revoked — drop it so later
// requests fall back to anonymous instead of failing in a loop.
// (Callers still surface their own error toast on the failed request.)
api.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('ls_token');
    }
    return Promise.reject(error);
  }
);

/**
 * Send a text legal query.
 * @param {string} text
 * @param {string} sessionId
 * @param {string} language   BCP-47 code e.g. 'hi-IN'
 * @param {boolean} voiceOutput  Whether to receive TTS audio in response
 */
export function sendTextQuery(text, sessionId, language = 'en-IN', voiceOutput = false, state = '') {
  return api.post('/query/text', { text, sessionId, language, voiceOutput, state });
}

/**
 * Generate a legal document from structured form data.
 * @param {object} formData  Structured fields from the wizard
 * @param {string} docType   'fir' | 'consumer' | 'notice' | 'rti' | 'demand'
 * @param {'pdf'|'docx'} format
 */
export function generateDocumentFromForm(formData, docType, format = 'pdf') {
  return api.post('/document/generate', { formData, docType, format }, { responseType: 'blob' });
}

/**
 * Send a voice query as an audio Blob.
 * @param {Blob} audioBlob
 * @param {string} sessionId
 * @param {boolean} voiceOutput
 */
export function sendVoiceQuery(audioBlob, sessionId, voiceOutput = false) {
  const form = new FormData();
  form.append('audio', audioBlob, 'recording.webm');
  form.append('sessionId', sessionId);
  form.append('voiceOutput', String(voiceOutput));
  return api.post('/query/voice', form);
}

/**
 * Generate and download a legal document.
 * @param {string} query
 * @param {'fir'|'consumer'|'notice'} docType
 * @param {'pdf'|'docx'} format
 */
export function generateDocument(query, docType, format = 'pdf') {
  return api.post('/document/generate', { query, docType, format }, { responseType: 'blob' });
}

/**
 * Fetch session history by sessionId.
 * @param {string} sessionId
 */
export function getSessionHistory(sessionId) {
  return api.get(`/session/${sessionId}`);
}

/**
 * Convert text to speech via Sarvam Bulbul.
 * Returns an ArrayBuffer containing WAV audio.
 * @param {string} text
 * @param {string} language  BCP-47 code
 */
export function speakText(text, language = 'hi-IN') {
  return api.post('/query/speak', { text, language }, { responseType: 'arraybuffer' });
}

/**
 * Upload a contract/document file for AI analysis.
 * @param {File} file   PDF, DOCX, or TXT file
 * @returns {Promise}   Axios response with { filename, charCount, analysis }
 */
export function analyzeContractFile(file) {
  const form = new FormData();
  form.append('document', file);
  return api.post('/contract/analyze', form, { timeout: 120000 });
}

/**
 * Submit thumbs-up / thumbs-down feedback on an assistant answer.
 * @param {string} sessionId
 * @param {number} messageIndex
 * @param {string} guidance      Snapshot of the answer text
 * @param {'up'|'down'} rating
 */
export function submitFeedback(sessionId, messageIndex, guidance, rating) {
  return api.post('/feedback', { sessionId, messageIndex, guidance, rating });
}

/* ── Case Tracker ──────────────────────────────────────────────── */
export function trackCase(cnrNumber)    { return api.post('/tracker', { cnrNumber }); }
export function getTrackedCases()       { return api.get('/tracker'); }
export function getCaseDetail(cnr)      { return api.get(`/tracker/${cnr}`); }
export function refreshCase(cnr)        { return api.post(`/tracker/${cnr}/refresh`); }
export function untrackCase(cnr)        { return api.delete(`/tracker/${cnr}`); }

/* ── Matters ───────────────────────────────────────────────────── */
export function getMatters()                         { return api.get('/matters'); }
export function createMatter(data)                   { return api.post('/matters', data); }
export function getMatter(id)                        { return api.get(`/matters/${id}`); }
export function updateMatter(id, data)               { return api.patch(`/matters/${id}`, data); }
export function deleteMatter(id)                     { return api.delete(`/matters/${id}`); }
export function linkSessionToMatter(id, sessionId)   { return api.post(`/matters/${id}/sessions`, { sessionId }); }
export function linkCaseToMatter(id, cnrNumber)      { return api.post(`/matters/${id}/cases`, { cnrNumber }); }
export function generateMatterDoc(id, data)          { return api.post(`/matters/${id}/documents`, data, { responseType: 'blob' }); }

/* ── Lawyers / DLSA directory ──────────────────────────────────── */
export function searchLawyers(params = {})  { return api.get('/lawyers', { params }); }
export function getLawyerStates()           { return api.get('/lawyers/states'); }
export function getLawyerDistricts(state)   { return api.get('/lawyers/districts', { params: { state } }); }

