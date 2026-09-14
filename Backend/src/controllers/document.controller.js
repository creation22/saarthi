import { draftLegalDocument } from '../services/llm.service.js';
import { generatePDF, generateDOCX } from '../services/document.service.js';

const DOC_TITLES = {
  fir: 'First Information Report (Draft)',
  consumer: 'Consumer Complaint Letter',
  notice: 'Legal Notice',
  rti: 'RTI Application',
  demand: 'Demand Notice (Wages)',
};

const VALID_FORMATS = new Set(['pdf', 'docx']);
const MAX_QUERY_CHARS = 6000;

function buildQueryString(query, formData) {
  if (typeof query === 'string' && query.trim()) {
    return query.trim().slice(0, MAX_QUERY_CHARS);
  }
  if (formData && typeof formData === 'object') {
    const parts = Object.entries(formData)
      .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
      .map(([k, v]) => `${k}: ${v === true ? 'Yes' : String(v)}`);
    if (parts.length) {
      return parts.join('\n').slice(0, MAX_QUERY_CHARS);
    }
  }
  return '';
}

export async function generateDocumentController(req, res, next) {
  try {
    const { query, docType, format = 'pdf', formData } = req.body ?? {};

    if (typeof docType !== 'string' || !DOC_TITLES[docType]) {
      return res.status(400).json({ error: 'docType must be one of: fir, consumer, notice, rti, demand' });
    }
    if (typeof format !== 'string' || !VALID_FORMATS.has(format)) {
      return res.status(400).json({ error: "format must be 'pdf' or 'docx'" });
    }

    const queryStr = buildQueryString(query, formData);
    if (!queryStr) {
      return res.status(400).json({ error: 'query or formData is required to draft the document' });
    }

    const title = DOC_TITLES[docType];
    const body = await draftLegalDocument(queryStr, docType);

    if (format === 'docx') {
      const buffer = await generateDOCX(title, body);
      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.set('Content-Disposition', `attachment; filename="${docType}.docx"`);
      return res.send(buffer);
    }

    const buffer = await generatePDF(title, body);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="${docType}.pdf"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
