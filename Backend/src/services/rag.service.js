import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

let vectorStore = null;

async function getVectorStore() {
  if (vectorStore) return vectorStore;

  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.Index(process.env.PINECONE_INDEX);

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-ada-002',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  return vectorStore;
}

// Map source filenames → human-readable act names + India Code / Indian Kanoon URLs
const SOURCE_META = {
  'ipc_1860.txt':                      { label: 'Indian Penal Code, 1860',              url: 'https://indiankanoon.org/search/?formInput=Indian+Penal+Code+1860' },
  'crpc_1973.txt':                     { label: 'CrPC, 1973',                           url: 'https://indiankanoon.org/search/?formInput=Code+of+Criminal+Procedure+1973' },
  'consumer_protection_act_2019.txt':  { label: 'Consumer Protection Act, 2019',        url: 'https://indiankanoon.org/search/?formInput=Consumer+Protection+Act+2019' },
  'domestic_violence_act_2005.txt':    { label: 'Protection of Women from DV Act, 2005', url: 'https://indiankanoon.org/search/?formInput=Protection+of+Women+from+Domestic+Violence+Act+2005' },
  'rti_act_2005.txt':                  { label: 'Right to Information Act, 2005',       url: 'https://indiankanoon.org/search/?formInput=Right+to+Information+Act+2005' },
  'labour_act.txt':                    { label: 'Industrial Disputes Act, 1947',        url: 'https://indiankanoon.org/search/?formInput=Industrial+Disputes+Act+1947' },
  'rent_control_act.txt':              { label: 'Rent Control Act',                     url: 'https://indiankanoon.org/search/?formInput=Rent+Control+Act' },
  'motor_vehicles_act_1988.txt':       { label: 'Motor Vehicles Act, 1988',             url: 'https://indiankanoon.org/search/?formInput=Motor+Vehicles+Act+1988' },
  'it_act_2000.txt':                   { label: 'Information Technology Act, 2000',     url: 'https://indiankanoon.org/search/?formInput=Information+Technology+Act+2000' },
};

function resolveSourceMeta(filename) {
  const key = filename?.toLowerCase();
  return SOURCE_META[key] ?? {
    label: filename ?? 'Legal Statute',
    url: `https://indiankanoon.org/search/?formInput=${encodeURIComponent((filename ?? '').replace(/[_\.]/g, ' '))}`,
  };
}

/**
 * Retrieve top-k statute chunks and return both formatted context string
 * and structured citations array for the frontend.
 *
 * @param {string} query  English-language legal query
 * @param {number} topK   Chunks to retrieve
 * @returns {{ contextString: string, citations: Array<{label, url, snippet}> }}
 */
export async function retrieveLegalContext(query, topK = 5) {
  const store = await getVectorStore();
  const results = await store.similaritySearch(query, topK);

  if (!results.length) {
    return {
      contextString: 'No relevant statutes found in the knowledge base.',
      citations: [],
    };
  }

  // Deduplicate sources (same act may appear in multiple chunks)
  const seenSources = new Set();
  const citations = [];

  results.forEach((r) => {
    const src = r.metadata?.source ?? 'unknown';
    if (!seenSources.has(src)) {
      seenSources.add(src);
      const meta = resolveSourceMeta(src);
      citations.push({
        label: meta.label,
        url: meta.url,
        snippet: r.pageContent.slice(0, 120).trim() + '…',
      });
    }
  });

  const contextString = results
    .map((r, i) => `[Source ${i + 1}: ${r.metadata?.source ?? 'unknown'}]\n${r.pageContent}`)
    .join('\n\n---\n\n');

  return { contextString, citations };
}
