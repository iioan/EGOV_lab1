import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AcademicState} from '@/lib/types';

export type Program = 'Licență' | 'Master' | 'Doctorat' | '';
export type FormaInvatamant = 'Buget' | 'Taxă' | '';

const initialState: AcademicState = {
  program: '',
  specializare: '',
  an: '',
  forma: '',
  errors: {},
};

const yearsForProgram = (p: Program): string[] => {
  switch (p) {
    case 'Licență':
      return ['1', '2', '3', '4'];
    case 'Master':
      return ['1', '2'];
    case 'Doctorat':
      return ['1', '2', '3'];
    default:
      return [];
  }
};

const academicDataSlice = createSlice({
  name: 'academicData',
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof Omit<AcademicState, 'errors'>; value: string }>
    ) => {
      const {field} = action.payload;
      let {value} = action.payload;

      if (field === 'program') {
        state.program = value as Program;
        // reset year if it doesn't fit the new program
        const allowed = yearsForProgram(state.program);
        if (!allowed.includes(state.an)) state.an = '';
      } else if (field === 'forma') {
        state.forma = value as FormaInvatamant;
      } else if (field === 'specializare') {
        state.specializare = value;
      } else if (field === 'an') {
        state.an = value;
      }

      // live validation
      state.errors.program = state.program ? undefined : 'Selectați programul de studii.';
      state.errors.specializare =
        state.specializare.trim().length >= 2 ? undefined : 'Completați specializarea.';
      state.errors.an = state.an ? undefined : 'Selectați anul de studiu.';
      state.errors.forma = state.forma ? undefined : 'Selectați forma de învățământ.';
    },
    validateAll: (state) => {
      state.errors.program = state.program ? undefined : 'Selectați programul de studii.';
      state.errors.specializare =
        state.specializare.trim().length >= 2 ? undefined : 'Completați specializarea.';
      state.errors.an = state.an ? undefined : 'Selectați anul de studiu.';
      state.errors.forma = state.forma ? undefined : 'Selectați forma de învățământ.';
    },
    resetAcademic: () => initialState,
  },
});

export const {setField, validateAll, resetAcademic} = academicDataSlice.actions;
export default academicDataSlice.reducer;

// Re-export helper for UI
export {yearsForProgram};