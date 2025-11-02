// Shared types for the application
import {FormaInvatamant, Program} from "@/lib/redux/features/academicDataSlice";
import {TipPlata} from "@/lib/redux/features/paymentDetailsSlice";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StudentIdentityState {
  cnp: string;
  nume: string;
  prenume: string;
  codStudent: string;
  emailInstitutional: string;
  telefon: string;
  errors: {
    cnp?: string;
    codStudent?: string;
    emailInstitutional?: string;
  };
}

export interface AcademicState {
  program: Program;
  specializare: string;
  an: string; // keep as string to bind Select easily: "1", "2", …
  forma: FormaInvatamant;
  errors: {
    program?: string;
    specializare?: string;
    an?: string;
    forma?: string;
  };
}

export interface PaymentState {
  tipPlata: TipPlata;
  errors: { tipPlata?: string };
};

export interface ScholarshipState {
  scholarshipType: string;
  errors: {
    hasScholarship?: string;
    scholarshipType?: string;
  };
}
