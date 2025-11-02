import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PaymentState} from "@/lib/types";

export type TipPlata = '' | 'Plată taxă școlarizare' | 'Plată refacere curs';

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
  if (program === 'Doctorat') {
    return 200; // fallback
  }
  return 0;
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
      const {field, value} = action.payload;
      state[field] = value as any;

      // live validation
      if (field === 'numeCurs') {
        state.errors.numeCurs = value.trim().length ? undefined : 'Completați numele cursului.';
      }
      if (field === 'semestru') {
        state.errors.semestru = value ? undefined : 'Selectați semestrul.';
      }
      if (field === 'numarCredite') {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
          state.errors.numarCredite = 'Introduceți un număr valid.';
          return;
        }
        if (numericValue > 15) {
          state.errors.numarCredite = 'Numărul maxim de credite este 15.';
          state.numarCredite = '15';
          return;
        }
        state.errors.numarCredite = '';
        state.numarCredite = numericValue.toString();
        return;
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