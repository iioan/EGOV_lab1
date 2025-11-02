import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ScholarshipState} from '@/lib/types';

export type ScholarshipType = '' | 'Semestrial' | 'Anual';

const initialState: ScholarshipState = {
  scholarshipType: '',
  errors: {},
}
const scholarshipTypeSlice = createSlice({
  name: 'paymentDetails',
  initialState,
  reducers: {
    setScholarshipType: (state, action: PayloadAction<ScholarshipType>) => {
      state.scholarshipType = action.payload;
      state.errors.scholarshipType = state.scholarshipType ? undefined : 'Selectați regim plată.';
    },
    validatePayment: (state) => {
      state.errors.scholarshipType = state.scholarshipType ? undefined : 'Selectați regim plată.';
    },
    resetScholarshipType: () => initialState,
  },
});

export const {setScholarshipType, validatePayment, resetScholarshipType} = scholarshipTypeSlice.actions;
export default scholarshipTypeSlice.reducer;