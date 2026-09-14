import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const MAX_BODY_CHARS = 60000;

function coerceBody(body) {
  const str = typeof body === 'string' ? body : String(body ?? '');
  const trimmed = str.trim();
  if (!trimmed) {
    throw new Error('Generated document is empty');
  }
  return trimmed.length > MAX_BODY_CHARS ? trimmed.slice(0, MAX_BODY_CHARS) : trimmed;
}

/**
 * Generate a formatted PDF document.
 * @param {string} title  Document title
 * @param {string} body   Document body text
 * @returns {Promise<Buffer>}
 */
export function generatePDF(title, body) {
  const safeBody = coerceBody(body);
  const safeTitle = typeof title === 'string' ? title.slice(0, 200) : 'Document';
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 72, size: 'A4' });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Title
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(safeTitle, { align: 'center' });

    doc.moveDown(0.5);

    // Horizontal rule
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor('#cccccc')
      .stroke();

    doc.moveDown(0.5);

    // Body
    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#000000')
      .text(safeBody, { align: 'left', lineGap: 4 });

    doc.end();
  });
}

/**
 * Generate a formatted DOCX document.
 * @param {string} title  Document title
 * @param {string} body   Document body text
 * @returns {Promise<Buffer>}
 */
export async function generateDOCX(title, body) {
  const safeBody = coerceBody(body);
  const safeTitle = typeof title === 'string' ? title.slice(0, 200) : 'Document';
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: safeTitle,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          ...safeBody.split('\n').map(
            (line) =>
              new Paragraph({
                children: [new TextRun({ text: line, size: 22 })],
                spacing: { after: 120 },
              })
          ),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
