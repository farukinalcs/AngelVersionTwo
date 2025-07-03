import { Routes } from '@angular/router';

export const overtimeRoutes: Routes = [
    {
        path: 'overview',
        loadComponent: () => import('./overtime-overview/overtime-overview.component').then(m => m.OvertimeOverviewComponent),
    },
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
    }
];
