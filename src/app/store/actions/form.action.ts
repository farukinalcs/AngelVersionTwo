import { createAction, props } from '@ngrx/store';

export const updateForm = createAction('[Form] Update Form',props<{ formName: string; formData: any }>());

export const resetForm = createAction('[Form] Reset Form');

export const resetAllForms = createAction('[Form] Reset All Forms');