export class AuthMenuModel {
    auth: {
        asideMenu: {
            profil: {
                main: boolean;
                subMenu: {
                    gecislerim: boolean;
                    surelerim: boolean;
                    izinlerim: boolean;
                    talepEdilenler: boolean;
                    taleplerim: boolean;
                    ziyaretciTaleplerim: boolean;
                    mobilLokasyon: boolean;
                    taskListem: boolean;
                    takimim: boolean;
                }
            },
            access: {
                main: boolean;
            },
            puantaj: {
                main: boolean;
            },
            ziyaretci: {
                main: boolean;
            },
            yemekhane: {
                main: boolean;
            },
            kantin: {
                main: boolean;
            },
            sistem: {
                main: boolean;
            },
            musteriHizmetleri: {
                main: boolean;
            }
        }
        pages : {
            profil : {
                tabMenu : {
                    gecislerim: boolean;
                    surelerim: boolean;
                    izinlerim: boolean;
                    talepEdilenler: boolean;
                    taleplerim: boolean;
                    ziyaretciTaleplerim: boolean;
                    mobilLokasyon: boolean;
                    taskListem: boolean;
                    takimim: boolean;
                },
                talepOlustur : {
                    yetkiTalebi: boolean;
                    izinTalebi: boolean;
                    fmTalebi: boolean;
                    ziyaretciTalebi: boolean;
                    aracTalebi: boolean;
                    avansTalebi: boolean;
                }
            }
        }
    }
}