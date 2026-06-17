import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert Indian legal assistant. You ONLY provide guidance based on the legal provisions retrieved and supplied to you. You must:

1. Cite the specific Act name and Section number for every legal point you make.
2. Explain your reasoning step by step — this is your chain-of-thought.
3. Use plain, jargon-free language that a non-lawyer can understand.
4. Conclude with clear, numbered procedural next steps the user should take.
5. If the retrieved context does not cover the query, say so explicitly and advise the user to consult a qualified lawyer.

Never fabricate statutes or case citations.`;

/**
 * Generate a legally grounded response with chain-of-thought reasoning.
 * @param {string} userQuery     English-language user query
 * @param {string} legalContext  Statute chunks retrieved from Pinecone
 * @returns {string}             LLM response text
 */
export async function getLegalGuidance(userQuery, legalContext) {
  const userPrompt = `RETRIEVED LEGAL CONTEXT:
${legalContext}

USER QUERY:
${userQuery}

Please provide:
### Applicable Law
(cite the exact Act and Section)

### Step-by-Step Reasoning
(chain-of-thought connecting the query to the law)

### Plain-Language Guidance
(what this means for the user)

### Procedural Next Steps
(numbered actions the user should take)`;

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1800,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  return message.content[0].text;
}

/**
 * Extract structured fields from a user query for document generation.
 * @param {string} query    User's free-text description
 * @param {string} docType  'fir' | 'consumer' | 'notice'
 * @returns {string}        Drafted document body
 */
/**
 * Analyse an uploaded legal document / contract and return structured JSON.
 * @param {string} extractedText   Raw text from the uploaded document
 * @param {string} filename        Original filename (used for context)
 * @returns {object}               Parsed analysis object
 */
export async function analyzeContract(extractedText, filename = '') {
  // Cap at ~14 000 chars to avoid token overflow while keeping depth
  const text = extractedText.length > 14000
    ? extractedText.slice(0, 14000) + '\n\n[Document truncated — first 14 000 characters analysed]'
    : extractedText;

  const prompt = `You are a senior Indian contract lawyer. Analyse the following legal document thoroughly and return ONLY valid JSON — no markdown, no preamble, no trailing text.

DOCUMENT FILENAME: ${filename}

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

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();

  // Strip accidental markdown fences if model wraps output
  const jsonStr = raw.startsWith('```')
    ? raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    : raw;

  return JSON.parse(jsonStr);
}

export async function draftLegalDocument(query, docType) {
  const docDescriptions = {
    fir: 'First Information Report (FIR)',
    consumer: 'Consumer Complaint Letter to the District Consumer Disputes Redressal Commission',
    notice: 'Legal Notice to the opposing party',
  };

  const prompt = `Draft a formal ${docDescriptions[docType] ?? 'legal document'} in English based on the following user description:

"${query}"

Requirements:
- Use proper formal/legal language appropriate for ${docDescriptions[docType]}.
- Fill in placeholder fields with [FIELD_NAME] where exact details are missing.
- Include all standard sections a ${docDescriptions[docType]} must contain under Indian law.
- Return ONLY the document body text — no explanations, no preamble.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].text;
}
