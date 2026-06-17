/**
 * One-time script: chunk all .txt files in ../data/, embed them,
 * and upsert into the Pinecone index.
 *
 * Usage:
 *   cd Backend
 *   node scripts/ingest.js
 *
 * Prerequisites:
 *   - PINECONE_API_KEY, PINECONE_INDEX, OPENAI_API_KEY must be set in .env
 *   - Pinecone index must exist with dimension=1536, metric=cosine
 *   - Place legal corpus .txt files in Backend/data/
 */

import dotenv from 'dotenv';
dotenv.config();

import { RecursiveCharacterTextSplitter } from '@langchain/core/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');

async function loadDocuments() {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.txt'));
  if (!files.length) {
    console.error(`No .txt files found in ${DATA_DIR}`);
    process.exit(1);
  }

  const docs = [];
  for (const file of files) {
    const content = await readFile(path.join(DATA_DIR, file), 'utf-8');
    docs.push({ pageContent: content, metadata: { source: file } });
  }
  console.log(`Loaded ${docs.length} documents`);
  return docs;
}

async function main() {
  const rawDocs = await loadDocuments();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  const chunks = await splitter.splitDocuments(rawDocs);
  console.log(`Split into ${chunks.length} chunks`);

  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.Index(process.env.PINECONE_INDEX);

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-ada-002',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  console.log('Upserting into Pinecone...');
  await PineconeStore.fromDocuments(chunks, embeddings, { pineconeIndex: index });
  console.log(`Done — ${chunks.length} chunks upserted into "${process.env.PINECONE_INDEX}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
