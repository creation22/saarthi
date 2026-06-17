# Saarthi

**Free, multilingual legal AI for every Indian.**  
Ask legal questions by voice or text in 12 Indian languages. Get statute-grounded answers, generate legal documents, and analyze contracts — instantly, no sign-up required.

---

## What It Does

### Legal Q&A (Chat)
- Ask any legal question by **voice or text** in Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi, Odia, English, or Hinglish
- Automatic language detection — speak naturally, no need to select a language first
- Answers are **grounded in actual statute text** retrieved via semantic search across 22+ Indian Acts (no hallucination)
- Every response cites the exact **Act name and Section number** used
- Step-by-step **chain-of-thought reasoning** shown alongside the answer
- **Text-to-speech playback** of responses in your language
- **Thumbs up/down feedback** on individual answers
- Full **session history** — review past queries any time

### Document Generator (`/documents`)
Generate ready-to-use legal documents as **PDF or DOCX**:

| Document | Governing Law |
|---|---|
| FIR Draft | CrPC / BNSS 2023 |
| Consumer Complaint | Consumer Protection Act 2019 |
| Legal Notice | CPC / General |
| RTI Application | Right to Information Act 2005 |
| Demand Notice (Wages) | Payment of Wages Act 1936 / Code on Wages 2019 |

Multi-step form wizard — fill in your details, download the finished document.

### Contract Analyzer (`/analyze`)
Upload a contract (PDF, DOCX, or TXT, up to 10 MB) and get a structured breakdown:
- **Risk score** (1–10) with level — LOW / MEDIUM / HIGH / CRITICAL
- **Red flags** — each with severity, clause reference, and recommendation
- **Green flags** — protective clauses already in your favor
- **Missing clauses** — standard protections absent from the document
- **Key terms** defined in plain language
- **Actionable recommendations**

### Know Your Rights (`/rights`)
Curated, browsable guides across 9 topic areas:
Tenant Rights · Consumer Rights · Workplace Rights · Women's Rights · Right to Information · Criminal Law Basics · Property Rights · Cyber & Digital Rights · Labour & Wages

---

## Tech Stack

### Frontend
- **React 19** + React Router 7 + Vite
- **Tailwind CSS** for layout, **Framer Motion** for animations
- **react-markdown** for rendering structured AI responses

### Backend
- **Node.js / Express 5** (ES modules)
- **MongoDB + Mongoose** — session history and feedback storage
- **Multer** — file uploads for voice queries and contract analysis
- **PDFKit + docx** — document generation

### AI & Language Services
| Service | Used For |
|---|---|
| **Claude Opus 4.6** (Anthropic) | Legal guidance, document drafting, contract analysis |
| **Sarvam Saarika v2** | Speech-to-text with auto Indian language detection |
| **Sarvam Mayura v1** | Translation from any Indian language → English |
| **Sarvam Bulbul v1** | Text-to-speech in 12 Indian languages |
| **OpenAI text-embedding-ada-002** | Semantic embeddings for statute retrieval |
| **Pinecone** | Vector database — stores and searches 22+ Indian statutes |
| **LangChain** | RAG pipeline connecting embeddings → Pinecone → Claude |

### How a Query Works
```
User voice/text (any language)
  → Sarvam STT + auto-detect language
  → Sarvam translation → English
  → OpenAI embeddings → Pinecone search (top-5 statute chunks)
  → Claude Opus 4.6 reasons with statute context
  → Guidance + citations returned
  → Sarvam TTS → audio playback (optional)
  → Stored in MongoDB session
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/query/text` | Text legal query |
| POST | `/api/query/voice` | Voice query (audio file upload) |
| POST | `/api/query/speak` | Convert text to speech |
| POST | `/api/document/generate` | Generate legal document (PDF/DOCX) |
| POST | `/api/contract/analyze` | Analyze uploaded contract |
| GET | `/api/session/:id` | Retrieve session history |
| DELETE | `/api/session/:id` | Delete a session |
| POST | `/api/feedback` | Submit thumbs up/down on an answer |
| GET | `/api/health` | Server health check |

---

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- API keys: Anthropic, OpenAI, Pinecone, Sarvam AI

### Backend
```bash
cd Backend
cp .env.example .env   # fill in your keys
npm install
npm run dev            # starts on http://localhost:5000
```

**`.env` variables:**
```
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
PINECONE_API_KEY=...
PINECONE_INDEX=legal-corpus
SARVAM_API_KEY=...
```

### Frontend
```bash
cd Frontend
cp .env.example .env   # set VITE_API_URL
npm install
npm run dev            # starts on http://localhost:5173
```

**`.env` variables:**
```
VITE_API_URL=http://localhost:5000/api
```

---

## Indian Acts Indexed

IPC 1860 · CrPC 1973 · Bharatiya Nyaya Sanhita 2023 · Consumer Protection Act 2019 · RTI Act 2005 · Transfer of Property Act 1882 · Domestic Violence Act 2005 · POSH Act 2013 · IT Act 2000 · RERA 2016 · Industrial Disputes Act 1947 · Payment of Wages Act 1936 · Code on Wages 2019 · Maternity Benefit Act 1961 · Labour Codes 2020 · Legal Services Authorities Act 1987 · Arbitration Act 1996 · Motor Vehicles Act 1988 · and more

---

## Disclaimer

LegalSahayak provides **general legal information only**. It is not a substitute for advice from a qualified advocate. For court proceedings or consequential legal decisions, consult a licensed lawyer or your nearest District Legal Services Authority (DLSA).
