import { Routes } from '@angular/router';
import { MyRequestsPage } from './my-requests.page';

export const MY_REQUESTS_ROUTES: Routes = [
    {
        path: '',
        component: MyRequestsPage,
        children: [
            {
                path: 'pending',
                loadComponent: () =>
                    import('./pending/pending.component').then(
                        (m) => m.PendingComponent
                    ),
            },
            {
                path: 'approved',
                loadComponent: () =>
                    import('./approved/approved.component').then(
                        (m) => m.ApprovedComponent
                    ),
            },
            {
                path: 'rejected',
                loadComponent: () =>
                    import('./rejected/rejected.component').then(
                        (m) => m.RejectedComponent
                    ),
            },
            {
                path: '',
                redirectTo: 'pending',
                pathMatch: 'full',
            },
        ],
    },
];
