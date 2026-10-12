# Legal corpus for RAG (`retrieveLegalContext`)

## What you can realistically index

| Scope | Feasible? | Notes |
|--------|-----------|--------|
| **Constitution of India** | Yes | Run `node scripts/fetch-corpus.js` → `constitution_of_india.txt` |
| **~15–30 major Central Acts** | Yes | Export text from [India Code](https://www.indiacode.nic.in/) as `.txt` |
| **Every Central + State law** | Not in one shot | 1000+ acts, huge size, cost, and Pinecone/storage limits — add in phases |

Official source for acts: **India Code** (Ministry of Law). Community GitHub copies may be outdated; prefer government exports for production.

## File naming

Use filenames that match `SOURCE_META` in `src/services/rag.service.js` (e.g. `ipc_1860.txt`, `crpc_1973.txt`). Unknown names still ingest but show generic citation labels.

## Commands

```bash
cd Backend
node scripts/fetch-corpus.js    # Constitution only (auto-download)
# Add more *.txt files here in data/
node scripts/setup-pinecone.js    # once, if index missing
node scripts/ingest.js --fresh  # re-embed everything (clears old vectors first)
```

## Cost / size (rough)

- Constitution only: ~500–1500 chunks → small OpenAI embedding cost on ingest.
- Full IPC + CrPC + 20 acts: tens of thousands of chunks — check Pinecone plan and embedding budget before `--fresh`.
