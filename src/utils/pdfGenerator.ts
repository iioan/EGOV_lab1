import { ReduxPaymentState } from '@/lib/types/reduxState';
import { jsPDF } from 'jspdf';

/**
 * Removes Romanian diacritics from text for better PDF rendering
 */
function removeDiacritics(text: string): string {
  const diacriticsMap: Record<string, string> = {
    'ă': 'a', 'Ă': 'A',
    'â': 'a', 'Â': 'A',
    'î': 'i', 'Î': 'I',
    'ș': 's', 'Ș': 'S',
    'ț': 't', 'Ț': 'T',
  };

  return text.replace(/[ăĂâÂîÎșȘțȚ]/g, (match) => diacriticsMap[match] || match);
}

/**
 * Generates a payment order PDF from Redux payment state
 * @param data - The Redux state containing all payment information
 * @param paymentId - The database ID of the saved payment
 * @param fontBase64 - Base64 encoded DejaVu Sans font (unused but kept for compatibility)
 * @returns PDF blob
 */
export function generatePaymentOrderPDF(
  data: ReduxPaymentState,
  paymentId: number,
  fontBase64: string
): Blob {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Helper to add a line separator
  const addLine = () => {
    yPos += 3;
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 5;
  };

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDIN DE PLATA', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Payment ID and Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nr. inregistrare: ${paymentId}`, 15, yPos);
  doc.text(`Data: ${new Date().toLocaleDateString('ro-RO')}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 10;

  addLine();

  // BENEFICIARY SECTION
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BENEFICIAR', 15, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Universitatea Politehnica Bucuresti', 15, yPos);
  yPos += 5;
  doc.text('Splaiul Independentei nr. 313, Sector 6, Bucuresti', 15, yPos);
  yPos += 5;
  doc.text('CUI: 4433423', 15, yPos);
  yPos += 5;
  doc.text('Cont IBAN: RO49AAAA1B31007593840000', 15, yPos);
  yPos += 5;
  doc.text('Banca: BCR - Sucursala Unirea', 15, yPos);
  yPos += 8;

  addLine();

  // STUDENT IDENTITY SECTION
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE STUDENT', 15, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (data.studentIdentity?.nume) {
    doc.text(`Nume: ${removeDiacritics(data.studentIdentity.nume)}`, 15, yPos);
    yPos += 5;
  }
  if (data.studentIdentity?.prenume) {
    doc.text(`Prenume: ${removeDiacritics(data.studentIdentity.prenume)}`, 15, yPos);
    yPos += 5;
  }
  if (data.studentIdentity?.cnp) {
    doc.text(`CNP: ${data.studentIdentity.cnp}`, 15, yPos);
    yPos += 5;
  }
  if (data.studentIdentity?.codStudent) {
    doc.text(`Cod Student: ${data.studentIdentity.codStudent}`, 15, yPos);
    yPos += 5;
  }
  if (data.studentIdentity?.emailInstitutional) {
    doc.text(`Email: ${data.studentIdentity.emailInstitutional}`, 15, yPos);
    yPos += 5;
  }
  if (data.studentIdentity?.telefon) {
    doc.text(`Telefon: ${data.studentIdentity.telefon}`, 15, yPos);
    yPos += 5;
  }
  yPos += 3;

  addLine();

  // ACADEMIC DATA SECTION
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE ACADEMICE', 15, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (data.academicData?.program) {
    doc.text(`Program de studii: ${removeDiacritics(data.academicData.program)}`, 15, yPos);
    yPos += 5;
  }
  if (data.academicData?.specializare) {
    doc.text(`Specializare: ${removeDiacritics(data.academicData.specializare)}`, 15, yPos);
    yPos += 5;
  }
  if (data.academicData?.an) {
    doc.text(`An de studiu: ${data.academicData.an}`, 15, yPos);
    yPos += 5;
  }
  if (data.academicData?.forma) {
    doc.text(`Forma de invatamant: ${removeDiacritics(data.academicData.forma)}`, 15, yPos);
    yPos += 5;
  }
  yPos += 3;

  addLine();

  // PAYMENT DETAILS SECTION
  const forma = data.academicData?.forma;
  const tipPlata = data.paymentDetails?.tipPlata;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALII PLATA', 15, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Show tipPlata only for "Taxă"
  if (forma === 'Taxă' && tipPlata) {
    doc.text(`Tip plata: ${removeDiacritics(tipPlata)}`, 15, yPos);
    yPos += 5;
  }

  // Show course details only if relevant
  const showCourseDetails =
    forma === 'Buget' ||
    (forma === 'Taxă' && tipPlata === 'Plată refacere curs');

  if (showCourseDetails) {
    if (data.paymentDetails?.numeCurs) {
      doc.text(`Nume curs: ${removeDiacritics(data.paymentDetails.numeCurs)}`, 15, yPos);
      yPos += 5;
    }
    if (data.paymentDetails?.semestru) {
      doc.text(`Semestru: ${data.paymentDetails.semestru}`, 15, yPos);
      yPos += 5;
    }
    if (data.paymentDetails?.numarCredite) {
      doc.text(`Numar credite: ${data.paymentDetails.numarCredite}`, 15, yPos);
      yPos += 5;
    }
    if (data.paymentDetails?.tarifCurs) {
      doc.text(`Tarif curs: ${data.paymentDetails.tarifCurs} RON`, 15, yPos);
      yPos += 5;
    }
  }

  // Show scholarship type only for "Taxă" and "Plată taxă școlarizare"
  if (forma === 'Taxă' && tipPlata === 'Plată taxă școlarizare' && data.scholarshipType?.scholarshipType) {
    doc.text(`Regim plata: ${removeDiacritics(data.scholarshipType.scholarshipType)}`, 15, yPos);
    yPos += 5;
  }

  yPos += 3;
  addLine();

  // PAYMENT BREAKDOWN SECTION
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALII SUMA', 15, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  if (data.paymentTotal?.breakdown && data.paymentTotal.breakdown.length > 0) {
    data.paymentTotal.breakdown.forEach((item) => {
      const label = removeDiacritics(item.label);
      const value = typeof item.value === 'number'
        ? `${item.value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RON`
        : removeDiacritics(String(item.value));

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
  doc.text('TOTAL DE PLATA:', 15, yPos);
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
  doc.setFont('helvetica', 'normal');
  doc.text('Acest document a fost generat automat.', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text('Pentru orice intrebari, va rugam sa contactati secretariatul facultatii.', pageWidth / 2, yPos, { align: 'center' });

  // Generate blob
  return doc.output('blob');
}
