import { Routes } from '@angular/router';

export const leaveRoutes: Routes = [
    {
        path: 'overview',
        loadComponent: () => import('./leave-overview/leave-overview.component').then(m => m.LeaveOverviewComponent),
    },
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
    }
];
