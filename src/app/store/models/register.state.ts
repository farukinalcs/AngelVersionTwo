// register.model.ts
export interface Register {
    Id: number,
    ad: string,
    soyad: string,
    userId: string,
    adsoyad: string,
    sicilno: string,
    personelno: string,
    ceptelefon: string,
    firmaad: string,
    bolumad: string,
    pozisyonad: string,
    altfirmaad: string,
    direktorlukad: string,
    gorevad: string,
    yakaad: string,
    puantajad: string,
    kangrubuad: string,
    giristarih: string,
    cikistarih: null | string,
    fotoImage: string,
    mesaiperiyodu: number,
    mesaiperiyoduad: string,
    cardID: string,
    cardID26: string,
    facilitycode: string,
    userdef: number,
    enddate: null | string,
    credit: number,
    indirimorani: number,
    userdefad: string,
    yetkistr: string,
    yetkistrad: null | string,
    lYetki: number,
    lKademe: number,
    rowHeight: number
}



// register-list.state.ts
export interface RegisterState {
    registers: Register[];
    loading: boolean;
    error: any;
}

export const initialRegisterState: RegisterState = {
    registers: [],
    loading: false,
    error: null,
};
