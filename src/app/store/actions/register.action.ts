// register.actions.ts
import { createAction, props } from '@ngrx/store';
import { Register } from '../models/register.state';

// Sicil listesini yüklemek için
export const loadRegisters = createAction('[Register] Load Registers');
export const loadRegistersSuccess = createAction(
  '[Register] Load Registers Success',
  props<{ registers: Register[] }>()
);
export const loadRegistersFailure = createAction(
  '[Register] Load Registers Failure',
  props<{ error: any }>()
);

// Tek bir sicili güncellemek için
export const updateRegister = createAction(
  '[Register] Update Register',
  props<{ register: Register }>()
);
export const updateRegisterSuccess = createAction(
  '[Register] Update Register Success',
  props<{ register: Register }>()
);
export const updateRegisterFailure = createAction(
  '[Register] Update Register Failure',
  props<{ error: any }>()
);


// Sicil Eklemek için
export const insertRegister = createAction(
  '[Register] Insert Register',
  props<{ register: Register }>()
);
export const insertRegisterSuccess = createAction(
  '[Register] Insert Register Success',
  props<{ register: Register }>()
);
export const insertRegisterFailure = createAction(
  '[Register] Insert Register Failure',
  props<{ error: any }>()
);


