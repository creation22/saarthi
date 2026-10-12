/**
 * Download the Constitution of India (merged plain text) into Backend/data/.
 * Central Acts: place .txt exports in Backend/data/ (see corpus.manifest.json + data/README.md).
 *
 * Usage: node scripts/fetch-corpus.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');
const MANIFEST = path.resolve(__dirname, 'corpus.manifest.json');

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'SaarthiCorpusFetcher/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchConstitution(cfg) {
  const parts = [];
  for (const file of cfg.files) {
    const url = `${cfg.baseUrl.replace(/\/$/, '')}/${file}`;
    process.stdout.write(`Fetching ${file}… `);
    const text = await fetchText(url);
    parts.push(`\n\n======== ${file.replace('.txt', '')} ========\n\n${text.trim()}`);
    console.log('ok');
  }

  const header = `# Constitution of India (merged for RAG)\n# Source: ${cfg.source}\n# Fetched: ${new Date().toISOString()}\n`;
  const merged = header + parts.join('\n');
  const outPath = path.join(DATA_DIR, cfg.output);
  await writeFile(outPath, merged, 'utf-8');
  console.log(`Wrote ${outPath} (${(merged.length / 1024).toFixed(1)} KB)`);
}

async function reportLocalActs(localActs) {
  const { readdir } = await import('fs/promises');
  const onDisk = new Set((await readdir(DATA_DIR)).filter((f) => f.endsWith('.txt')));
  const expected = localActs.expectedFiles ?? [];
  const missing = expected.filter((f) => !onDisk.has(f));
  const extra = [...onDisk].filter((f) => !expected.includes(f) && f !== 'constitution_of_india.txt');

  console.log('\nLocal act files:');
  console.log(`  Present (${expected.length - missing.length}/${expected.length} from manifest checklist)`);
  if (missing.length) {
    console.log('  Missing (download from India Code and save as .txt):');
    missing.forEach((f) => console.log(`    - ${f}`));
  }
  if (extra.length) {
    console.log('  Extra .txt (will be ingested):', extra.join(', '));
  }
  console.log(`\n${localActs.note}`);
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf-8'));

  if (manifest.constitution) {
    await fetchConstitution(manifest.constitution);
  }
  if (manifest.localActs) {
    await reportLocalActs(manifest.localActs);
  }

  console.log('\nNext: node scripts/ingest.js --fresh');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
