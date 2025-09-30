export interface MenuItem {
  title: string;
  icon?: string;
  translate?: boolean;
  routerLink?: string;
  children?: MenuItem[];
  conditionPath?: string;
  roles?: string[];
  permissionCode?: string;
  app?: string[];
}

export const MENU: MenuItem[] = [
    {
      title: 'İnsan Kaynakları',
      icon: 'fa-solid fa-people-group text-danger',
      children: [
        {
          title: 'Profil',
          icon: 'fa-solid fa-user-tie text-danger',
          permissionCode: 'a001',
          children: [
            { title: 'Genel_Bakış', routerLink: 'profile/widgets', translate: true, permissionCode: 'a001' },
            { title: 'Geçişlerim', routerLink: 'profile/operations/passages', translate: true, permissionCode: 'm926' },
            { title: 'Sürelerim', routerLink: 'profile/operations/durations', translate: true, permissionCode: 'm927' },
            { title: 'İzinlerim', routerLink: 'profile/operations/leaves', translate: true, permissionCode: 'm928' },
            { title: 'Talep_Edilenler', routerLink: 'profile/requests/pending-requests', translate: true, permissionCode: 'm917' },
            { title: 'Taleplerim', routerLink: 'profile/requests/my-requests', translate: true, permissionCode: 'm961' },
            { title: 'Ziyaretçi_Talepleri', routerLink: 'profile/requests/visitor-requests', translate: true },
            { title: 'Ziyaretçi_Taleplerim', routerLink: 'profile/requests/my-visitor-requests', translate: true, permissionCode: 'm962' },
            { title: 'Takımım', routerLink: 'profile/others/my-team', translate: true, permissionCode: 'm944' },
            { title: 'Eksik_Sürelerim', routerLink: 'profile/operations/missing-durations', translate: true },
            { title: 'Profil_Tanımlamalar', routerLink: 'profile/definitions', translate: true }
          ],
          app: ['1','2','3']
        },
        {
          title: 'Access',
          icon: 'fa-solid fa-right-to-bracket text-danger',
          children: [
            { title: 'Genel Bakış', routerLink: 'access/dashboard' },
            { title: 'Sicil Liste', routerLink: 'access/registry-list' },
            { title: 'Geçici Kartlar', routerLink: 'access/temp-card' },
            { title: 'Terminal', routerLink: 'access/terminal' },
            { title: 'Geçiş Grupları', routerLink: 'access/access-groups' },
            { title: 'Sicil Grupları', routerLink: 'access/registry-groups' },
            { title: 'Tanımlamalar', routerLink: 'access/definitions' },
            { title: 'Raporlar', routerLink: 'access/raporlar' }
          ],
          app: ['1']
        },
        {
          title: 'Puantaj',
          icon: 'fa-solid fa-calendar-days text-danger',
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
          title: 'İzin',
          icon: 'fa-solid fa-umbrella-beach text-danger',
          children: [
            { title: 'Genel Bakış', routerLink: 'leave/overview' }
          ],
          app: ['1']
        },
        {
          title: 'Fazla Mesai',
          icon: 'fa-solid fa-business-time text-danger',
          children: [
            { title: 'Genel Bakış', routerLink: 'overtime/overview' }
          ],
          app: ['1']
        },
        {
          title: 'Vardiya',
          icon: 'fa-solid fa-calendar-check text-danger',
          children: [
            { title: 'Genel Bakış', routerLink: 'shift/overview' }
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
            { title: 'Geçici Kartlar', routerLink: 'visitor/temp-card'},
            { title: 'Tanımlamalar', routerLink: 'visitor/definitions' },
            { title: 'Raporlar', routerLink: 'visitor/reports' }
          ],
          app: ['1', '5']
        },
        {
          title: 'Yemekhane',
          icon: 'fa-solid fa-utensils text-danger',
          children: [
            { title: 'Genel Bakış', routerLink: 'refectory/overview' },
            { title: 'Tanımlamalar', routerLink: 'refectory/definitions' },
            { title: 'Raporlar', routerLink: 'refectory/reports' }
          ],
          app: ['1', '6']
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
          title: 'Bildirim',
          icon: 'fa-solid fa-gear text-danger',
          children: [
            { title: 'SMS Servis', routerLink: 'sistem/sistem_yedek' },
            { title: 'Mail Servis', routerLink: 'sistem/mail_servis' }
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
            { title: 'Cihazlar ve Harita', routerLink: '/patrol/content/device-map' },
            { title: 'Turlar', routerLink: '/patrol/content/tours' }
          ],
          app: ['2']
        },
        {
          title: 'Performans Yönetimi',
          icon: 'fa-solid fa-paste text-danger',
          children: [
            { title: 'Genel Bakış', routerLink: 'performance/dashboard' },
            { title: 'Tanımlamalar', routerLink: 'performance/tanimlamalar' }
          ],
          app: ['3']
        },
        {
          title: 'Kullanıcı Yetki Yönetimi',
          icon: 'fa-solid fa-key text-danger',
          children: [
            { title: 'Sicil Listesi', routerLink: 'user-management/user-list' },
            { title: 'Tanımlamalar', routerLink: 'user-management/definitions' }
          ],
          app: ['1']
        },
        {
          title: 'Envanter Yönetimi',
          icon: 'fa-solid fa-boxes-stacked text-danger',
          children: [
            { title: 'Genel Bakış', routerLink: 'inventory/overview' },
            { title:'Tanımlamalar', routerLink:'inventory/definitions'},
            { title:'Talepler', routerLink:'inventory/request'}
          ],
          app: ['1']
        }
      ]
    }
  ];
  
