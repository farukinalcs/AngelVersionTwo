import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent),
  },
    {
    path: 'request',
    loadComponent: () => import('./request/request.component').then(m => m.RequestComponent),
  },
    {
    path: 'definitions',
    loadChildren: () =>
      import('./definitions/definitions.route').then(m => m.definitionsRoutes),
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  }
];
