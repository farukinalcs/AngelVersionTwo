import { Routes } from '@angular/router';

export const shiftRoutes: Routes = [
    {
        path: 'overview',
        loadComponent: () => import('./shift-overview/shift-overview.component').then(m => m.ShiftOverviewComponent),
    },
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
    }
];
