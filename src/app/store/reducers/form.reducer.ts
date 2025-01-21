import { createReducer, on } from '@ngrx/store';
import { resetAllForms, resetForm, updateForm } from '../actions/form.action';
import { initialFormState } from '../models/form.state';

export const formReducer = createReducer(
  initialFormState,
  on(updateForm, (state, { formName, formData }) => ({
    ...state,
    [formName]: formData,
  })),
  on(resetForm, (state) => ({
    ...state,
    personalInfo: null,
  })),
  on(resetAllForms, () => ({
    ...initialFormState // Burada initialFormState kullanılıyor
  }))
);
