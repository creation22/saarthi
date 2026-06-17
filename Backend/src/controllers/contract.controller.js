import { createRequire } from 'module';
import mammoth from 'mammoth';
import { analyzeContract } from '../services/llm.service.js';

// pdf-parse has a CJS-only entry that auto-runs tests on module load;
// use the raw lib file to avoid that bug in ESM context.
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const SUPPORTED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'docx',
  'text/plain': 'txt',
};

async function extractText(buffer, mimeType) {
  const type = SUPPORTED_TYPES[mimeType];

  if (type === 'pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (type === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (type === 'txt') {
    return buffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

export async function analyzeContractController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Send a PDF, DOCX, or TXT file.' });
    }

    const { mimetype, buffer, originalname } = req.file;

    if (!SUPPORTED_TYPES[mimetype]) {
      return res.status(415).json({
        error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT document.',
      });
    }

    const extractedText = await extractText(buffer, mimetype);

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(422).json({
        error: 'Could not extract readable text from the document. Please ensure it is not a scanned image.',
      });
    }

    const analysis = await analyzeContract(extractedText, originalname);

    res.json({
      filename: originalname,
      charCount: extractedText.length,
      analysis,
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: 'Analysis model returned invalid data. Please try again.' });
    }
    next(err);
  }
}
