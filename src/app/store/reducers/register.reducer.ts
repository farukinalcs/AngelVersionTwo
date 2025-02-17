// register.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { initialRegisterState } from '../models/register.state';
import { insertRegister, insertRegisterFailure, insertRegisterSuccess, loadRegisters, loadRegistersFailure, loadRegistersSuccess, updateRegister, updateRegisterFailure, updateRegisterSuccess } from '../actions/register.action';

export const registerReducer = createReducer(
    initialRegisterState,

    // Register listesini yüklerken
    on(loadRegisters, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadRegistersSuccess, (state, { registers }) => ({
        ...state,
        loading: false,
        registers: registers  // burada state'i güncelliyoruz
    })),
    on(loadRegistersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Tek bir register güncelleme işlemi
    on(updateRegister, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(updateRegisterSuccess, (state, { register }) => ({
        ...state,
        loading: false,
        registers: state.registers.map(item =>
            item.Id === register.Id ? { ...item, ...register } : item
        )
    })),
    on(updateRegisterFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),



    // Sicil ekleme işlemi başladı
    on(insertRegister, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    // Yeni sicil başarıyla eklendi
    on(insertRegisterSuccess, (state, { register }) => ({
        ...state,
        loading: false,
        registers: [...state.registers, register] 
    })),

    // Hata durumu
    on(insertRegisterFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);
