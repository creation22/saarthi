import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { OPENAI_EMBEDDING_MODEL } from '../config/llm.config.js';

let vectorStore = null;

async function getVectorStore() {
  if (vectorStore) return vectorStore;

  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.Index(process.env.PINECONE_INDEX);

  const embeddings = new OpenAIEmbeddings({
    model: OPENAI_EMBEDDING_MODEL,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  return vectorStore;
}

// Map source filenames → human-readable act names + India Code / Indian Kanoon URLs
const SOURCE_META = {
  'constitution_of_india.txt':         { label: 'Constitution of India',                url: 'https://www.indiacode.nic.in/handle/123456789/1362' },
  'ipc_1860.txt':                      { label: 'Indian Penal Code, 1860',              url: 'https://indiankanoon.org/search/?formInput=Indian+Penal+Code+1860' },
  'bharatiya_nyaya_sanhita_2023.txt':  { label: 'Bharatiya Nyaya Sanhita, 2023',       url: 'https://www.indiacode.nic.in/' },
  'transfer_of_property_act_1882.txt': { label: 'Transfer of Property Act, 1882',       url: 'https://indiankanoon.org/search/?formInput=Transfer+of+Property+Act+1882' },
  'posh_act_2013.txt':                 { label: 'POSH Act, 2013',                       url: 'https://indiankanoon.org/search/?formInput=Sexual+Harassment+Workplace+2013' },
  'rera_2016.txt':                     { label: 'RERA, 2016',                           url: 'https://indiankanoon.org/search/?formInput=RERA+2016' },
  'payment_of_wages_act_1936.txt':     { label: 'Payment of Wages Act, 1936',           url: 'https://indiankanoon.org/search/?formInput=Payment+of+Wages+Act+1936' },
  'code_on_wages_2019.txt':            { label: 'Code on Wages, 2019',                  url: 'https://www.indiacode.nic.in/' },
  'maternity_benefit_act_1961.txt':    { label: 'Maternity Benefit Act, 1961',          url: 'https://indiankanoon.org/search/?formInput=Maternity+Benefit+Act+1961' },
  'legal_services_authorities_act_1987.txt': { label: 'Legal Services Authorities Act, 1987', url: 'https://indiankanoon.org/search/?formInput=Legal+Services+Authorities+Act+1987' },
  'arbitration_act_1996.txt':          { label: 'Arbitration and Conciliation Act, 1996', url: 'https://indiankanoon.org/search/?formInput=Arbitration+Act+1996' },
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
  let store;
  try {
    store = await getVectorStore();
  } catch (err) {
    console.error('Vector store unavailable:', err.message);
    const e = new Error('Legal knowledge base is temporarily unavailable. Please try again later.');
    e.status = 503;
    throw e;
  }

  const k = Number.isInteger(topK) && topK > 0 ? Math.min(topK, 10) : 5;
  let results;
  try {
    results = await store.similaritySearch(query, k);
  } catch (err) {
    console.error('Similarity search failed:', err.message);
    const e = new Error('Legal knowledge base is temporarily unavailable. Please try again later.');
    e.status = 503;
    throw e;
  }

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
      const snippet = typeof r.pageContent === 'string' && r.pageContent.length
        ? r.pageContent.slice(0, 120).trim() + '…'
        : meta.label;
      citations.push({
        label: meta.label,
        url: meta.url,
        snippet,
      });
    }
  });

  const contextString = results
    .map((r, i) => `[Source ${i + 1}: ${r.metadata?.source ?? 'unknown'}]\n${typeof r.pageContent === 'string' ? r.pageContent : ''}`)
    .join('\n\n---\n\n');

  return { contextString, citations };
}
