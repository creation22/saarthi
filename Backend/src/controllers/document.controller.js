import { draftLegalDocument } from '../services/llm.service.js';
import { generatePDF, generateDOCX } from '../services/document.service.js';

const DOC_TITLES = {
  fir: 'First Information Report (Draft)',
  consumer: 'Consumer Complaint Letter',
  notice: 'Legal Notice',
};

export async function generateDocumentController(req, res, next) {
  try {
    const { query, docType, format = 'pdf' } = req.body;

    if (!query || !docType) {
      return res.status(400).json({ error: 'query and docType are required' });
    }
    if (!DOC_TITLES[docType]) {
      return res.status(400).json({ error: 'docType must be one of: fir, consumer, notice' });
    }

    const title = DOC_TITLES[docType];
    const body = await draftLegalDocument(query, docType);

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
