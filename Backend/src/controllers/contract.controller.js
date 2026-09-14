import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { analyzeContract } from '../services/llm.service.js';

const SUPPORTED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'text/plain': 'txt',
};

const EXTENSION_TO_TYPE = {
  '.pdf': 'pdf',
  '.docx': 'docx',
  '.txt': 'txt',
};

function sanitizeFilename(name) {
  // Strip path components + prompt-injection newlines before echoing into prompts/responses
  return String(name ?? '')
    .split(/[\\/]/).pop()
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, 120);
}

async function extractText(buffer, mimeType) {
  const type = SUPPORTED_TYPES[mimeType];

  if (type === 'pdf') {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
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
    const filename = sanitizeFilename(originalname) || 'document';

    const mimeType = SUPPORTED_TYPES[mimetype];
    if (!mimeType) {
      return res.status(415).json({
        error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT document.',
      });
    }

    // Don't trust the client-supplied MIME type alone — cross-check the extension.
    // Legacy .doc (application/msword) is a binary format mammoth can't parse.
    const ext = filename.toLowerCase().slice(filename.toLowerCase().lastIndexOf('.'));
    if (mimeType === 'doc' || (ext && !EXTENSION_TO_TYPE[ext] && ext !== '.doc')) {
      return res.status(415).json({
        error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT document.',
      });
    }
    if (ext === '.doc') {
      return res.status(415).json({
        error: 'Legacy .doc files are not supported. Please save the document as .docx or .pdf and retry.',
      });
    }
    if (ext && EXTENSION_TO_TYPE[ext] && EXTENSION_TO_TYPE[ext] !== mimeType) {
      return res.status(415).json({
        error: 'File extension does not match its type. Please upload a valid PDF, DOCX, or TXT document.',
      });
    }

    const extractedText = await extractText(buffer, mimetype);

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(422).json({
        error: 'Could not extract readable text from the document. Please ensure it is not a scanned image.',
      });
    }

    const analysis = await analyzeContract(extractedText, filename);

    res.json({
      filename,
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
