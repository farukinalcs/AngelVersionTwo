import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RequestsService {

    menuItems = [
        { id: 'izinNavItem1', key: 'izin', icon: 'fa-umbrella-beach', label: 'İzin', route: 'shared-requests/leave', type: 'leave' },
        { id: 'fazlamesaiNavItem1', key: 'fazlamesai', icon: 'fa-business-time', label: 'Fazla_Mesai', route: 'shared-requests/overtime', type: 'overtime' },
        { id: 'yetkiNavItem', key: 'sureliyetki', icon: 'fa-door-open', label: 'Yetki', route: 'shared-requests/authority', type: 'authority' },
        { id: 'avansNavItem', key: 'avans', icon: 'fa-sack-dollar', label: 'Avans', route: 'shared-requests/advance', type: 'advance' },
        { id: 'expenseNavItem', key: 'expense', icon: 'fa-receipt', label: 'Masraf', route: 'expense-requests', type: 'expense-requests' }
    ];
    selectedTab: any;

    requests: any[] = [];

    constructor() { }


}
