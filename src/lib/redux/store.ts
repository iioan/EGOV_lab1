import {configureStore} from '@reduxjs/toolkit';
import studentIdentityReducer from "@/lib/redux/features/studentIdentitySlice";
import academicDataReducer from "@/lib/redux/features/academicDataSlice";
import paymentDetailsReducer from '@/lib/redux/features/paymentDetailsSlice';
import scholarshipTypeReducer from '@/lib/redux/features/scholarshipTypeSlice';
import paymentTotalReducer from "@/lib/redux/features/paymentTotalSlice";

export const store = configureStore({
  reducer: {
    studentIdentity: studentIdentityReducer,
    academicData: academicDataReducer,
    paymentDetails: paymentDetailsReducer,
    scholarshipType: scholarshipTypeReducer,
    paymentTotal: paymentTotalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;