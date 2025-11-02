export interface PaymentEntity {
  // Student Identity fields
  cnp: string;
  nume: string;
  prenume: string;
  codStudent: string;
  emailInstitutional: string;
  telefon: string;

  // Academic Data fields
  program: string;
  specializare: string;
  an: string;
  forma: string;

  // Payment Details fields
  tipPlata: string;
  numeCurs: string;
  semestru: string;
  numarCredite: string;
  tarifCurs: number;

  // Scholarship Type fields
  scholarshipType: string;

  // Payment Total fields
  finalAmount: number;

  // Metadata
  createdAt?: string;
}

export function mapReduxStateToPaymentEntity(reduxState: any): PaymentEntity {
  return {
    // Student Identity
    cnp: reduxState.studentIdentity?.cnp || '',
    nume: reduxState.studentIdentity?.nume || '',
    prenume: reduxState.studentIdentity?.prenume || '',
    codStudent: reduxState.studentIdentity?.codStudent || '',
    emailInstitutional: reduxState.studentIdentity?.emailInstitutional || '',
    telefon: reduxState.studentIdentity?.telefon || '',

    // Academic Data
    program: reduxState.academicData?.program || '',
    specializare: reduxState.academicData?.specializare || '',
    an: reduxState.academicData?.an || '',
    forma: reduxState.academicData?.forma || '',

    // Payment Details
    tipPlata: reduxState.paymentDetails?.tipPlata || '',
    numeCurs: reduxState.paymentDetails?.numeCurs || '',
    semestru: reduxState.paymentDetails?.semestru || '',
    numarCredite: reduxState.paymentDetails?.numarCredite || '',
    tarifCurs: reduxState.paymentDetails?.tarifCurs || 0,

    // Scholarship Type
    scholarshipType: reduxState.scholarshipType?.scholarshipType || '',

    // Payment Total
    finalAmount: reduxState.paymentTotal?.finalAmount || 0,

    // Metadata
    createdAt: new Date().toISOString(),
  };
}