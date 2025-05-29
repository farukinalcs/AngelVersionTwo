export interface MenuItem {
    title: string; // menü öğesinin başlığı
    icon?: string; // menü öğesinin simgesi
    translate?: boolean; // menü öğesinin çevrileceğini belirtir
    routerLink?: string; // menü öğesinin yönlendirme bağlantısı
    children?: MenuItem[]; // alt menü öğeleri
    conditionPath?: string; // örn: "menuConfig.auth.asideMenu.profil.subMenu.gecislerim"
    roles?: string[]; // sadece bu roller görebilecek (İlerideki versiyonlarda kullanılabilir)
    permissionCode?: string; // API’den gelen `item.menu` ile eşleşir
    app?: string[]; // uygulama bazlı menü öğeleri
}

export const MENU: MenuItem[] = [
    {
        title: 'Profil',
        icon: 'fa-solid fa-user-tie text-danger',
        translate: true,
        permissionCode: 'a001',
        children: [
            { title: 'Genel_Bakış', routerLink: 'profile', translate: true, permissionCode: 'a001' },
            { title: 'Geçişlerim', routerLink: 'profile/gecislerim', translate: true, permissionCode: 'm926' },
            { title: 'Sürelerim', routerLink: 'profile/operations/durations', translate: true, permissionCode: 'm927' },
            { title: 'İzinlerim', routerLink: 'profile/izinlerim', translate: true, permissionCode: 'm928' },
            { title: 'Talep_Edilenler', routerLink: 'profile/talep_edilenler', translate: true, permissionCode: 'm917' },
            { title: 'Taleplerim', routerLink: 'profile/taleplerim', translate: true, permissionCode: 'm961' },
            { title: 'Ziyaretçi_Talepleri', routerLink: 'profile/ziyaretci_talepleri', translate: true },
            { title: 'Ziyaretçi_Taleplerim', routerLink: 'profile/ziyaretci_taleplerim', translate: true, permissionCode: 'm962' },
            { title: 'Mobil_Lokasyon', routerLink: 'profile/others/mobile-location', translate: true, permissionCode: 'm918' },
            { title: 'Task_Listem', routerLink: 'profile/others/my-task-list', translate: true, permissionCode: 'm34' },
            { title: 'Takımım', routerLink: 'profile/others/my-team', translate: true, permissionCode: 'm944' },
            { title: 'Eksik_Sürelerim', routerLink: 'profile/operations/missing-durations', translate: true },
            { title: 'Profil_Tanımlamalar', routerLink: 'profile/definitions', translate: true }
        ],
        app: ['1']
    },
    {
        title: 'ACCESS',
        icon: 'fa-solid fa-right-to-bracket text-danger',
        children: [
            { title: 'Genel Bakış', routerLink: 'access/dashboard' },
            { title: 'Sicil Liste', routerLink: 'access/registry-list' },
            { title: 'Terminal', routerLink: 'access/terminal' },
            { title: 'Geçiş Grupları', routerLink: 'access/gecis_gruplari' },
            { title: 'Tanımlamalar', routerLink: 'access/definitions' },
            { title: 'Raporlar', routerLink: 'access/raporlar' }
        ],
        app: ['1']
    },
    {
        title: 'PUANTAJ',
        icon: 'fa-solid fa-business-time text-danger',
        children: [
            { title: 'Genel Bakış', routerLink: 'attendance/dashboard' },
            { title: 'Sicil Liste', routerLink: 'attendance/registry-list' },
            { title: 'Pdks', routerLink: 'attendance/attendance-list' },
            { title: 'Pdks Pivot', routerLink: 'attendance/attendance-pivot' },
            { title: 'Tanımlamalar', routerLink: 'attendance/definitions' },
            { title: 'Raporlar', routerLink: 'attendance/reports' }
        ],
        app: ['1']
    },
    {
        title: 'Ziyaretçi',
        icon: 'fa-solid fa-users text-danger',
        children: [
            { title: 'Genel Bakış', routerLink: 'visitor/overview' },
            { title: 'Ziyaretçi Kartları', routerLink: 'visitor/cards' },
            { title: 'Ziyaretçiler', routerLink: 'visitor/visitors' },
            { title: 'Tanımlamalar', routerLink: 'visitor/definitions' },
            { title: 'Raporlar', routerLink: 'visitor/reports' }
        ],
        app: ['1']
    },
    {
        title: 'Yemekhane',
        icon: 'fa-solid fa-utensils text-danger',
        children: [
            { title: 'Genel Bakış', routerLink: 'yemekhane/dashboard' },
            { title: 'Tanımlamalar', routerLink: 'yemekhane/tanimlamalar' },
            { title: 'Raporlar', routerLink: 'yemekhane/raporlar' }
        ],
        app: ['1']
    },
    {
        title: 'Kantin',
        icon: 'fa-solid fa-credit-card text-danger',
        children: [
            { title: 'Genel Bakış', routerLink: 'kantin/dashboard' },
            { title: 'Tanımlamalar', routerLink: 'kantin/tanimlamalar' },
            { title: 'Krediler', routerLink: 'kantin/krediler' },
            { title: 'Raporlar', routerLink: 'kantin/raporlar' }
        ],
        app: ['1']
    },
    {
        title: 'Sistem',
        icon: 'fa-solid fa-gear text-danger',
        children: [
            { title: 'Sistem Yedek', routerLink: 'sistem/sistem_yedek' },
            { title: 'Veritabanı Güncelle', routerLink: 'sistem/veritabani_guncelle' },
            { title: 'Mail Servis', routerLink: 'sistem/mail_servis' }
        ],
        app: ['1']
    },
    {
        title: 'Güvenlik Tur',
        icon: 'fa-solid fa-walkie-talkie text-danger',
        children: [
            { title: 'Genel Bakış', routerLink: 'guvenlik/dashboard' },
            { title: 'Güvenlikçiler', routerLink: 'guvenlik/guvenlikciler' },
            { title: 'Tanımlamalar', routerLink: 'guvenlik/tanimlamalar' }
        ],
        app: ['1']
    },
    {
        title: 'Müşteri Hizmetleri',
        icon: 'fa-solid fa-phone-volume text-danger',
        children: [
            { title: 'Destek', routerLink: 'musteri_hizmetleri/destek' }
        ],
        app: ['1']
    },
    {
        title: 'Güvenlik Tur',
        icon: 'fa-solid fa-walkie-talkie text-danger',
        children: [
            { title: 'Genel Bakış', routerLink: 'patrol/dashboard' },
            { title: 'Güvenlikçiler', routerLink: 'patrol/guvenlikciler' },
            { title: 'Tanımlamalar', routerLink: 'patrol/tanimlamalar' },
            { title: 'Raporlar', routerLink: 'patrol/raporlar' }
        ],
        app: ['2']
    }
];

