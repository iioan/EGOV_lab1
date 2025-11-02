export interface ReduxPaymentState {
  studentIdentity?: {
    cnp?: string;
    nume?: string;
    prenume?: string;
    codStudent?: string;
    emailInstitutional?: string;
    telefon?: string;
  };
  academicData?: {
    program?: string;
    specializare?: string;
    an?: string;
    forma?: string;
  };
  paymentDetails?: {
    tipPlata?: string;
    numeCurs?: string;
    semestru?: string;
    numarCredite?: string;
    tarifCurs?: number;
  };
  scholarshipType?: {
    scholarshipType?: string;
  };
  paymentTotal?: {
    finalAmount?: number;
    breakdown?: Array<{
      label: string;
      value: string | number;
    }>;
  };
}