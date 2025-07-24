import { Routes } from '@angular/router';

export const PENDING_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: 'shared-requests/:type', // Dinamik parametre!
                loadComponent: () =>
                    import('./shared-requests/shared-requests.component').then(m => m.SharedRequestsComponent)
            },
            {
                path: 'expense-requests',
                loadComponent: () =>
                    import('./expense-requests/expense-requests.component').then(m => m.ExpenseRequestsComponent)
            },
            {
                path: '',
                redirectTo: 'shared-requests/leave', // varsayılan sayfa
                pathMatch: 'full'
            }
        ]
    }
];

