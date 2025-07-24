import { Routes } from '@angular/router';
import { MyRequestsPage } from './my-requests.page';
import { PendingComponent } from './pending/pending.component';

export const MY_REQUESTS_ROUTES: Routes = [
    {
        path: '',
        component: MyRequestsPage,
        children: [
            {
                path: 'pending',
                component: PendingComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./pending/pending.routes').then(m => m.PENDING_ROUTES)
                    }
                ]
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
