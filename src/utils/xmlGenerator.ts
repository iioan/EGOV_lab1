import {ReduxPaymentState} from '@/lib/types/reduxState';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an XML document from Redux payment state
 * @param data - The Redux state containing all payment information
 * @param paymentId - The database ID of the saved payment
 * @returns XML string representation of the payment data
 */
export function generatePaymentXML(data: ReduxPaymentState, paymentId: number): string {
  const timestamp = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<payment id="${paymentId}" timestamp="${timestamp}">
  <studentIdentity>
    <cnp>${escapeXml(data.studentIdentity?.cnp || '')}</cnp>
    <nume>${escapeXml(data.studentIdentity?.nume || '')}</nume>
    <prenume>${escapeXml(data.studentIdentity?.prenume || '')}</prenume>
    <codStudent>${escapeXml(data.studentIdentity?.codStudent || '')}</codStudent>
    <emailInstitutional>${escapeXml(data.studentIdentity?.emailInstitutional || '')}</emailInstitutional>
    <telefon>${escapeXml(data.studentIdentity?.telefon || '')}</telefon>
  </studentIdentity>
  
  <academicData>
    <program>${escapeXml(data.academicData?.program || '')}</program>
    <specializare>${escapeXml(data.academicData?.specializare || '')}</specializare>
    <an>${escapeXml(data.academicData?.an || '')}</an>
    <forma>${escapeXml(data.academicData?.forma || '')}</forma>
  </academicData>
  
  <paymentDetails>
    <tipPlata>${escapeXml(data.paymentDetails?.tipPlata || '')}</tipPlata>
    <numeCurs>${escapeXml(data.paymentDetails?.numeCurs || '')}</numeCurs>
    <semestru>${escapeXml(data.paymentDetails?.semestru || '')}</semestru>
    <numarCredite>${escapeXml(data.paymentDetails?.numarCredite || '')}</numarCredite>
    <tarifCurs>${data.paymentDetails?.tarifCurs || 0}</tarifCurs>
  </paymentDetails>
  
  <scholarshipType>
    <type>${escapeXml(data.scholarshipType?.scholarshipType || '')}</type>
  </scholarshipType>
  
  <paymentTotal>
    <finalAmount>${data.paymentTotal?.finalAmount || 0}</finalAmount>
    <breakdown>
${(data.paymentTotal?.breakdown || []).map((item) =>
    `      <item>
        <label>${escapeXml(item.label || '')}</label>
        <value>${typeof item.value === 'number' ? item.value : escapeXml(String(item.value || ''))}</value>
      </item>`
  ).join('\n')}
    </breakdown>
  </paymentTotal>
</payment>`;
}