import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {StudentIdentityState} from '@/lib/types';

const initialState: StudentIdentityState = {
  cnp: '',
  nume: '',
  prenume: '',
  codStudent: '',
  emailInstitutional: '',
  telefon: '',
  errors: {}
};

const isValidCNP = (v: string) =>
  /^\d{13}$/.test(v); // 13 digits
const isValidCodStudent = (v: string) =>
  /^[A-Z]{2}-\d{2}-\d+$/.test(v);
const isValidInstitutionalEmail = (v: string) => {
  // simple email + domain constraint
  const m = v.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i);
  if (!m) return false;
  const lower = v.toLowerCase();
  return lower.endsWith('@univ.ro') || lower.endsWith('@student.univ.ro');
};

type Field =
  | 'cnp'
  | 'nume'
  | 'prenume'
  | 'codStudent'
  | 'emailInstitutional'
  | 'telefon';

const studentIdentitySlice = createSlice({
  name: 'studentIdentity',
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ field: Field; value: string }>) => {
      let {field, value} = action.payload;
      // Normalize certain fields
      if (field === 'codStudent') value = value.toUpperCase();
      if (field === 'cnp') value = value.replace(/\D/g, ''); // keep digits only
      state[field] = value;

      // live-validate only the constrained ones
      if (field === 'cnp') {
        state.errors.cnp = isValidCNP(value) ? undefined : 'CNP trebuie să conțină 13 cifre.';
      }
      if (field === 'codStudent') {
        state.errors.codStudent = value.length === 0
          ? 'Cod student invalid.' // required
          : (isValidCodStudent(value) ? undefined : 'Cod student invalid.');
      }
      if (field === 'emailInstitutional') {
        state.errors.emailInstitutional = value.length === 0
          ? 'Email instituțional invalid.' // required
          : (isValidInstitutionalEmail(value) ? undefined : 'Email instituțional invalid.');
      }
    },
    validateAll: (state) => {
      state.errors.cnp = isValidCNP(state.cnp) ? undefined : 'CNP trebuie să conțină 13 cifre.';
      state.errors.codStudent =
        state.codStudent && isValidCodStudent(state.codStudent) ? undefined : 'Cod student invalid.';
      state.errors.emailInstitutional =
        state.emailInstitutional && isValidInstitutionalEmail(state.emailInstitutional)
          ? undefined
          : 'Email instituțional invalid.';
    },
    resetIdentity: () => initialState,
  },
});

export const {setField, validateAll, resetIdentity} = studentIdentitySlice.actions;
export default studentIdentitySlice.reducer;