/**
 * Create the Pinecone index if it does not exist (serverless, 1536-dim for OpenAI embeddings).
 * Usage: node scripts/setup-pinecone.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { Pinecone } from '@pinecone-database/pinecone';

const INDEX = process.env.PINECONE_INDEX || 'legal-corpus';
const DIMENSION = 1536;
const CLOUD = process.env.PINECONE_CLOUD || 'aws';
const REGION = process.env.PINECONE_REGION || 'us-east-1';

async function waitUntilReady(pc, name, maxWaitMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const desc = await pc.describeIndex(name);
    if (desc.status?.ready) return desc;
    console.log('Waiting for index to be ready…');
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Index "${name}" not ready after ${maxWaitMs}ms`);
}

async function main() {
  if (!process.env.PINECONE_API_KEY) {
    console.error('PINECONE_API_KEY is missing from .env');
    process.exit(1);
  }

  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const existing = await pc.listIndexes();
  const names = (existing.indexes ?? []).map((i) => i.name);

  if (names.includes(INDEX)) {
    console.log(`Index "${INDEX}" already exists.`);
    const stats = await pc.Index(INDEX).describeIndexStats();
    console.log('Vector count:', stats.totalRecordCount ?? stats.namespaces ?? stats);
    return;
  }

  console.log(`Creating index "${INDEX}" (${DIMENSION} dims, cosine, ${CLOUD}/${REGION})…`);
  await pc.createIndex({
    name: INDEX,
    dimension: DIMENSION,
    metric: 'cosine',
    spec: { serverless: { cloud: CLOUD, region: REGION } },
  });

  await waitUntilReady(pc, INDEX);
  console.log(`Index "${INDEX}" is ready. Run: node scripts/ingest.js`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
