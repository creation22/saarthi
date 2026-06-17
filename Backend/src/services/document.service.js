import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * Generate a formatted PDF document.
 * @param {string} title  Document title
 * @param {string} body   Document body text
 * @returns {Promise<Buffer>}
 */
export function generatePDF(title, body) {
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
      .text(title, { align: 'center' });

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
      .text(body, { align: 'left', lineGap: 4 });

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
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          ...body.split('\n').map(
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
