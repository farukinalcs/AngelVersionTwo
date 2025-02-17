import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RegisterState } from "../models/register.state";

export const selectRegisterState = createFeatureSelector<RegisterState>('registers');

export const selectAllRegisters = createSelector(
  selectRegisterState,
  (state) => state.registers
);