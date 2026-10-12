import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import {
  resolveLlmProvider,
  OPENAI_CHAT_MODEL,
  ANTHROPIC_CHAT_MODEL,
} from '../config/llm.config.js';

let anthropicClient = null;
let openaiClient = null;

function getAnthropicClient() {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: key, timeout: 90000, maxRetries: 2 });
  }
  return anthropicClient;
}

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: key, timeout: 90000, maxRetries: 2 });
  }
  return openaiClient;
}

const MAX_INPUT_CHARS = 12000;

function capInput(text) {
  const str = typeof text === 'string' ? text : String(text ?? '');
  return str.length > MAX_INPUT_CHARS ? str.slice(0, MAX_INPUT_CHARS) : str;
}

function emptyResponseError() {
  const err = new Error('Analysis model returned an empty response. Please try again.');
  err.status = 502;
  return err;
}

function extractAnthropicText(message) {
  const block = message?.content?.find((b) => b?.type === 'text' && typeof b.text === 'string');
  if (!block || !block.text.trim()) throw emptyResponseError();
  return block.text;
}

function assertLlmConfigured() {
  if (!resolveLlmProvider()) {
    const err = new Error('No LLM configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in Backend/.env');
    err.status = 503;
    throw err;
  }
}

/**
 * @param {{ system?: string, user: string, maxTokens: number, json?: boolean }} opts
 */
async function complete({ system, user, maxTokens, json = false }) {
  assertLlmConfigured();
  const provider = resolveLlmProvider();

  if (provider === 'openai') {
    const client = getOpenAIClient();
    if (!client) {
      const err = new Error('OPENAI_API_KEY is missing');
      err.status = 503;
      throw err;
    }
    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: user });

    const response = await client.chat.completions.create({
      model: OPENAI_CHAT_MODEL,
      max_tokens: maxTokens,
      messages,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) throw emptyResponseError();
    return text;
  }

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    const err = new Error('ANTHROPIC_API_KEY is missing');
    err.status = 503;
    throw err;
  }

  const message = await anthropic.messages.create({
    model: ANTHROPIC_CHAT_MODEL,
    max_tokens: maxTokens,
    ...(system ? { system } : {}),
    messages: [{ role: 'user', content: user }],
  });

  return extractAnthropicText(message);
}

const SYSTEM_PROMPT = `You are an expert Indian legal assistant (Saarthi / LegalSahayak). The user may ask anything — you always give a direct, helpful answer oriented to Indian law.

Rules:
1. Answer the user's question first. Do not refuse because retrieved documents are incomplete or off-topic.
2. Apply whichever Indian laws, constitutional articles, rules, and common procedures fit the situation (Central Acts, Constitution, criminal/civil procedure, consumer, labour, property, family, cyber, etc.).
3. Prefer the RETRIEVED LEGAL CONTEXT when it is relevant; add broader Indian legal principles and applicable statutes from your knowledge when needed.
4. Cite Act names and section/article numbers where you are confident. If you are unsure of an exact section, name the Act and describe the legal position without inventing a fake section number.
5. Explain reasoning step by step in plain language a non-lawyer can understand.
6. End with numbered procedural next steps (forums, complaints, police/court, timelines where known).

This is general legal information, not a substitute for a qualified advocate. Mention consulting a lawyer or DLSA for court matters or high-stakes decisions.`;

/**
 * Generate a legally grounded response with chain-of-thought reasoning.
 * @param {string} userQuery     English-language user query
 * @param {string} legalContext  Statute chunks retrieved from Pinecone
 * @returns {string}             LLM response text
 */
export async function getLegalGuidance(userQuery, legalContext) {
  const userPrompt = `RETRIEVED LEGAL CONTEXT (from knowledge base — use if relevant; do not limit your answer to this alone):
${capInput(legalContext)}

USER QUERY:
${capInput(userQuery)}

Respond in this structure:
### Direct Answer
(address what the user asked in clear terms)

### Applicable Law
(Indian Acts, Articles of the Constitution, rules — cite sections/articles where you can)

### Step-by-Step Reasoning
(how the law applies to their facts)

### Plain-Language Guidance
(practical meaning for the user)

### Procedural Next Steps
(numbered actions: where to go, what to file, typical timelines)`;

  return complete({ system: SYSTEM_PROMPT, user: userPrompt, maxTokens: 1800 });
}

/**
 * Analyse an uploaded legal document / contract and return structured JSON.
 * @param {string} extractedText   Raw text from the uploaded document
 * @param {string} filename        Original filename (used for context)
 * @returns {object}               Parsed analysis object
 */
export async function analyzeContract(extractedText, filename = '') {
  const capped = typeof extractedText === 'string' ? extractedText : String(extractedText ?? '');
  const text = capped.length > 14000
    ? capped.slice(0, 14000) + '\n\n[Document truncated — first 14 000 characters analysed]'
    : capped;
  const safeFilename = String(filename ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, 120);

  const prompt = `You are a senior Indian contract lawyer. Analyse the following legal document thoroughly and return ONLY valid JSON — no markdown, no preamble, no trailing text.

DOCUMENT FILENAME: ${safeFilename}

DOCUMENT TEXT:
${text}

Return this exact JSON structure:
{
  "documentType": "<type of document, e.g. Employment Agreement, Rent Agreement, NDA, Service Contract>",
  "summary": "<2-3 sentence plain-language executive summary>",
  "riskScore": <integer 1–10, 10 = extremely risky>,
  "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "redFlags": [
    {
      "title": "<short title>",
      "clause": "<verbatim excerpt or section reference>",
      "concern": "<why this is problematic under Indian law>",
      "severity": "<HIGH|MEDIUM|LOW>",
      "recommendation": "<what to negotiate or change>"
    }
  ],
  "greenFlags": [
    {
      "title": "<short title>",
      "clause": "<verbatim excerpt or section reference>",
      "protection": "<what right or interest this protects>"
    }
  ],
  "missingClauses": ["<clause that should be present but is absent>"],
  "keyTerms": [
    { "term": "<important defined term>", "definition": "<its meaning in plain language>" }
  ],
  "recommendations": ["<numbered action item for the party reviewing this document>"]
}

Rules:
- Be specific — quote actual clauses from the document wherever possible.
- Apply Indian Contract Act 1872, relevant sector laws, and standard drafting practices.
- redFlags must have at least 1 entry if any risk exists.
- If the document appears benign, riskScore should be 1–3 and redFlags can be empty.
- Return ONLY the JSON object. Nothing else.`;

  const raw = await complete({ user: prompt, maxTokens: 2500, json: resolveLlmProvider() === 'openai' });

  let jsonStr = raw.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```[\s\S]*$/, '').trim();
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(jsonStr.slice(start, end + 1));
    }
    throw new SyntaxError('Model response was not valid JSON');
  }
}

export async function draftLegalDocument(query, docType) {
  const docDescriptions = {
    fir: 'First Information Report (FIR)',
    consumer: 'Consumer Complaint Letter to the District Consumer Disputes Redressal Commission',
    notice: 'Legal Notice to the opposing party',
    rti: 'RTI Application to the Public Information Officer under the RTI Act, 2005',
    demand: 'Demand Notice to the employer for recovery of unpaid wages',
  };

  const cleanQuery = capInput(query);

  const prompt = `Draft a formal ${docDescriptions[docType] ?? 'legal document'} in English based on the following user description:

"${cleanQuery}"

Requirements:
- Use proper formal/legal language appropriate for ${docDescriptions[docType] ?? 'a legal document'}.
- Fill in placeholder fields with [FIELD_NAME] where exact details are missing.
- Include all standard sections a ${docDescriptions[docType] ?? 'a legal document'} must contain under Indian law.
- Return ONLY the document body text — no explanations, no preamble.`;

  return complete({ user: prompt, maxTokens: 1500 });
}
