

import { SidebarMenu } from './sidebar-menu-model';

export let sidebar: SidebarMenu[] = [
    {
        title: 'Profil',
        rootLink: 'profile/dashboard',
        icon: 'fa-solid fa-user-tie text-danger',
        auth: true,
        subMenu: [
            {
                title: 'Genel_Bakış',
                rootLink: 'profile/dashboard',
                auth: true,
            },
            {
                title: 'Geçişlerim',
                rootLink: 'profile/gecislerim',
                auth: true,
            },
            {
                title: 'Sürelerim',
                rootLink: 'profile/surelerim',
                auth: true,
            },
            {
                title: 'İzinlerim',
                rootLink: 'profile/izinlerim',
                auth: true,
            },
            {
                title: 'Talep_Edilenler',
                rootLink: 'profile/talep_edilenler',
                auth: true,
            },
            {
                title: 'Taleplerim',
                rootLink: 'profile/taleplerim',
                auth: true,
            },
            {
                title: 'Ziyatçi_Taleplerim',
                rootLink: 'profile/ziyaretci_talepleri',
                auth: true,
            },
            {
                title: 'Mobil_Lokasyon',
                rootLink: 'profile/mobil_lokasyon',
                auth: true,
            },
            {
                title: 'Task_Listem',
                rootLink: 'profile/task_listem',
                auth: true,
            },
            {
                title: 'Takımım',
                rootLink: 'profile/takimim',
                auth: true,
            },
            {
                title: 'Eksik_Sürelerim',
                rootLink: 'profile/eksik_surelerim',
                auth: true,
            },
            {
                title: 'Profil_Tanımlamalar',
                rootLink: 'profile/profil_tanimlamalar',
                auth: true,
            },
        ]
    },
    {
        title: 'Access',
        rootLink: 'access/dashboard',
        icon: 'fa-solid fa-right-to-bracket text-danger',
        auth: true,
        subMenu: [
            {
                title: 'Genel_Bakış',
                rootLink: 'access/dashboard',
                auth: true,
            },
            {
                title: 'Sicil_Listesi',
                rootLink: 'access/registry-list',
                auth: true,
            },
            {
                title: 'Terminal',
                rootLink: 'access/terminal',
                auth: true,
            },
            {
                title: 'Geçiş_Grupları',
                rootLink: 'access/access-groups',
                auth: true,
            },
            {
                title: 'Tanımlamalar',
                rootLink: 'access/definitions',
                auth: true,
            },
            {
                title: 'Raporlar',
                rootLink: 'access/reports',
                auth: true,
            }
        ]
    },
    {
        title: 'Puantaj',
        rootLink: 'attendance/dashboard',
        icon: 'fa-solid fa-business-time text-danger',
        auth: true,
        subMenu: [
            {
                title: 'Genel_Bakış',
                rootLink: 'attendance/dashboard',
                auth: true,
            },
            {
                title: 'Sicil_Listesi',
                rootLink: 'attendance/registry-list',
                auth: true,
            },
            {
                title: 'PDKS',
                rootLink: 'attendance/attendance-list',
                auth: true,
            },
            {
                title: 'PDKS_Pivot',
                rootLink: 'attendance/attendance-pivot',
                auth: true,
            },
            {
                title: 'Tanımlamalar',
                rootLink: 'attendance/definitions',
                auth: true,
            },
            {
                title: 'Raporlar',
                rootLink: 'attendance/reports',
                auth: true,
            }
        ]
    },
    {
        title: 'Ziyaretçi',
        rootLink: 'visitor/overview',
        icon: 'fa-solid fa-users text-danger',
        auth: true,
        subMenu: [
            {
                title: 'Genel_Bakış',
                rootLink: 'visitor/overview',
                auth: true,
            },
            {
                title: 'Ziyaretçi_Kartları',
                rootLink: 'visitor/cards',
                auth: true,
            },
            {
                title: 'Ziyaretçi_Listesi',
                rootLink: 'visitor/visitors',
                auth: true,
            },
            {
                title: 'Tanımlamalar',
                rootLink: 'visitor/definitions',
                auth: true,
            },
            {
                title: 'Raporlar',
                rootLink: 'visitor/reports',
                auth: true,
            }
        ]
    }
];
