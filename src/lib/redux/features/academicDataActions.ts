import { AppDispatch } from '@/lib/redux/store';
import { setField } from '@/lib/redux/features/academicDataSlice';
import { resetPaymentDetails } from '@/lib/redux/features/paymentDetailsSlice';
import { resetScholarshipType } from '@/lib/redux/features/scholarshipTypeSlice';

export const setFormaAndReset = (value: string) => (dispatch: AppDispatch) => {
  // First, update the forma field
  dispatch(setField({ field: 'forma', value }));

  // Then reset the dependent slices
  dispatch(resetPaymentDetails());
  dispatch(resetScholarshipType());
};