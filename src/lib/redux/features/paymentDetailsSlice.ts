import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TipPlata = '' | 'Plată taxă școlarizare' | 'Plată refacere curs';

type PaymentState = {
  tipPlata: TipPlata;

  numeCurs: string;
  semestru: '' | '1' | '2';
  numarCredite: string;  // păstrăm ca string pentru binding; validăm numeric
  tarifCurs: number;

  errors: {
    tipPlata?: string;
    numeCurs?: string;
    semestru?: string;
    numarCredite?: string;
  };
};

const initialState: PaymentState = {
  tipPlata: '',
  numeCurs: '',
  semestru: '',
  numarCredite: '',
  tarifCurs: 0,
  errors: {},
};

const getCreditRate = (program: string, specializare: string): number => {
  if (program === 'Licență') {
    return 120; // fallback
  }
  if (program === 'Master') {
    return 150; // fallback
  }
  // Doctorat:
  return 200;
};

const parseIntSafe = (v: string) => {
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
};

const paymentDetailsSlice = createSlice({
  name: 'paymentDetails',
  initialState,
  reducers: {
    setTipPlata: (state, action: PayloadAction<TipPlata>) => {
      state.tipPlata = action.payload;
      state.errors.tipPlata = state.tipPlata ? undefined : 'Selectați tipul plății.';
    },

    setPaymentField: (
      state,
      action: PayloadAction<{
        field: 'numeCurs' | 'semestru' | 'numarCredite';
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value as any;

      // live validation
      if (field === 'numeCurs') {
        state.errors.numeCurs = value.trim().length ? undefined : 'Completați numele cursului.';
      }
      if (field === 'semestru') {
        state.errors.semestru = value ? undefined : 'Selectați semestrul.';
      }
      if (field === 'numarCredite') {
        const n = parseIntSafe(value);
        state.errors.numarCredite = n > 0 ? undefined : 'Introduceți numărul de credite.';
      }
    },

    recomputeTarif: (
      state,
      action: PayloadAction<{ program: string; specializare: string }>
    ) => {
      const rate = getCreditRate(action.payload.program, action.payload.specializare);
      const credits = parseIntSafe(state.numarCredite);
      state.tarifCurs = rate * credits;
    },

    validatePayment: (state) => {
      state.errors.tipPlata = state.tipPlata ? undefined : 'Selectați tipul plății.';
      state.errors.numeCurs = state.numeCurs.trim().length ? undefined : 'Completați numele cursului.';
      state.errors.semestru = state.semestru ? undefined : 'Selectați semestrul.';
      state.errors.numarCredite = parseIntSafe(state.numarCredite) > 0
        ? undefined
        : 'Introduceți numărul de credite.';
    },

    resetPayment: () => initialState,
  },
});

export const {
  setTipPlata,
  setPaymentField,
  recomputeTarif,
  validatePayment,
  resetPayment,
} = paymentDetailsSlice.actions;

export default paymentDetailsSlice.reducer;