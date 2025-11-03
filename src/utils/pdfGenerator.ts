import { ReduxPaymentState } from '@/lib/types/reduxState';
import { jsPDF } from 'jspdf';

/**
 * Generates a payment order PDF from Redux payment state
 * @param data - The Redux state containing all payment information
 * @param paymentId - The database ID of the saved payment
 * @param fontBase64 - Base64 encoded DejaVu Sans font
 * @returns PDF blob
 */
export function generatePaymentOrderPDF(
  data: ReduxPaymentState,
  paymentId: number,
  fontBase64: string
): Blob {
  const doc = new jsPDF();

  // Add custom font for Romanian diacritics support
  doc.addFileToVFS('DejaVuSans.ttf', fontBase64);
  doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
  doc.addFileToVFS('DejaVuSans-Bold.ttf', fontBase64); // Using same font for bold
  doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Helper to add text with automatic line wrapping
  const addText = (text: string, x: number, size: number = 10, isBold: boolean = false) => {
    doc.setFontSize(size);
    doc.setFont('DejaVuSans', isBold ? 'bold' : 'normal');
    doc.text(text, x, yPos);
    yPos += size * 0.5;
  };

  // Helper to add a line
  const addLine = () => {
    yPos += 3;
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 5;
  };

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDIN DE PLATĂ', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Payment ID and Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nr. înregistrare: ${paymentId}`, 15, yPos);
  doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 10;

  addLine();

  // BENEFICIARY SECTION
  addText('BENEFICIAR', 15, 12, true);
  yPos += 2;
  addText('Universitatea Politehnica București', 15, 10);
  addText('Splaiul Independenței nr. 313, Sector 6, București', 15, 9);
  addText('CUI: 4433423', 15, 9);
  addText('Cont IBAN: RO49AAAA1B31007593840000', 15, 9);
  addText('Banca: BCR - Sucursala Unirea', 15, 9);
  yPos += 3;

  addLine();

  // STUDENT IDENTITY SECTION
  addText('DATE STUDENT', 15, 12, true);
  yPos += 2;

  if (data.studentIdentity?.nume) {
    addText(`Nume: ${data.studentIdentity.nume}`, 15, 10);
  }
  if (data.studentIdentity?.prenume) {
    addText(`Prenume: ${data.studentIdentity.prenume}`, 15, 10);
  }
  if (data.studentIdentity?.cnp) {
    addText(`CNP: ${data.studentIdentity.cnp}`, 15, 10);
  }
  if (data.studentIdentity?.codStudent) {
    addText(`Cod Student: ${data.studentIdentity.codStudent}`, 15, 10);
  }
  if (data.studentIdentity?.emailInstitutional) {
    addText(`Email: ${data.studentIdentity.emailInstitutional}`, 15, 10);
  }
  if (data.studentIdentity?.telefon) {
    addText(`Telefon: ${data.studentIdentity.telefon}`, 15, 10);
  }
  yPos += 3;

  addLine();

  // ACADEMIC DATA SECTION
  addText('DATE ACADEMICE', 15, 12, true);
  yPos += 2;

  if (data.academicData?.program) {
    addText(`Program de studii: ${data.academicData.program}`, 15, 10);
  }
  if (data.academicData?.specializare) {
    addText(`Specializare: ${data.academicData.specializare}`, 15, 10);
  }
  if (data.academicData?.an) {
    addText(`An de studiu: ${data.academicData.an}`, 15, 10);
  }
  if (data.academicData?.forma) {
    addText(`Forma de învățământ: ${data.academicData.forma}`, 15, 10);
  }
  yPos += 3;

  addLine();

  // PAYMENT DETAILS SECTION
  const forma = data.academicData?.forma;
  const tipPlata = data.paymentDetails?.tipPlata;

  addText('DETALII PLATĂ', 15, 12, true);
  yPos += 2;

  // Show tipPlata only for "Taxă"
  if (forma === 'Taxă' && tipPlata) {
    addText(`Tip plată: ${tipPlata}`, 15, 10);
  }

  // Show course details only if relevant
  const showCourseDetails =
    forma === 'Buget' ||
    (forma === 'Taxă' && tipPlata === 'Plată refacere curs');

  if (showCourseDetails) {
    if (data.paymentDetails?.numeCurs) {
      addText(`Nume curs: ${data.paymentDetails.numeCurs}`, 15, 10);
    }
    if (data.paymentDetails?.semestru) {
      addText(`Semestru: ${data.paymentDetails.semestru}`, 15, 10);
    }
    if (data.paymentDetails?.numarCredite) {
      addText(`Număr credite: ${data.paymentDetails.numarCredite}`, 15, 10);
    }
    if (data.paymentDetails?.tarifCurs) {
      addText(`Tarif curs: ${data.paymentDetails.tarifCurs} RON`, 15, 10);
    }
  }

  // Show scholarship type only for "Taxă" and "Plată taxă școlarizare"
  if (forma === 'Taxă' && tipPlata === 'Plată taxă școlarizare' && data.scholarshipType?.scholarshipType) {
    addText(`Regim plată: ${data.scholarshipType.scholarshipType}`, 15, 10);
  }

  yPos += 3;
  addLine();

  // PAYMENT BREAKDOWN SECTION
  addText('DETALII SUMĂ', 15, 12, true);
  yPos += 2;

  if (data.paymentTotal?.breakdown && data.paymentTotal.breakdown.length > 0) {
    data.paymentTotal.breakdown.forEach((item) => {
      const label = item.label;
      const value = typeof item.value === 'number'
        ? `${item.value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`
        : item.value;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(label, 15, yPos);
      doc.text(String(value), pageWidth - 15, yPos, { align: 'right' });
      yPos += 5;
    });
  }

  yPos += 3;
  addLine();

  // TOTAL AMOUNT
  const finalAmount = data.paymentTotal?.finalAmount || 0;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL DE PLATĂ:', 15, yPos);
  doc.text(
    `${finalAmount.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`,
    pageWidth - 15,
    yPos,
    { align: 'right' }
  );
  yPos += 10;

  addLine();

  // FOOTER
  yPos += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Acest document a fost generat automat.', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('Pentru orice întrebări, vă rugăm să contactați secretariatul facultății.', pageWidth / 2, yPos, { align: 'center' });

  // Generate blob
  return doc.output('blob');
}