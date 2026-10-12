/** Chat: OpenAI gpt-4o-mini is the default cheap option when OPENAI_API_KEY is set. */
export const OPENAI_CHAT_MODEL =
  process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';

/** Keep ada-002 unless you re-run `node scripts/ingest.js` after changing embeddings. */
export const OPENAI_EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL?.trim() || 'text-embedding-ada-002';

export const ANTHROPIC_CHAT_MODEL =
  process.env.ANTHROPIC_CHAT_MODEL?.trim() || 'claude-haiku-4-5';

export function resolveLlmProvider() {
  const forced = process.env.LLM_PROVIDER?.trim().toLowerCase();
  if (forced === 'openai' || forced === 'anthropic') return forced;
  if (process.env.OPENAI_API_KEY?.trim()) return 'openai';
  if (process.env.ANTHROPIC_API_KEY?.trim()) return 'anthropic';
  return null;
}
