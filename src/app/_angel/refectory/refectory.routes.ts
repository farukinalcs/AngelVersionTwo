import { Routes } from '@angular/router';

export const refectoryRoutes: Routes = [
  {
    path: 'definitions',
    loadChildren: () =>
      import('./definitions/definitions.route').then(m => m.definitionsRoutes),
    data: { breadcrumb: 'Tanımlamalar' }     
  },
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent),
    data: { breadcrumb: 'Genel Bakış' }  
  },
    {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent),
    data: { breadcrumb: 'Raporlar' }  
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  }
];
