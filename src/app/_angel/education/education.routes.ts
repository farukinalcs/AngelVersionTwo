import { Routes } from '@angular/router';

export const educationRoutes: Routes = [
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent),
    data: { breadcrumb: 'Genel Bakış' }  
  },
  {
    path: 'definitions',
    loadChildren: () =>
      import('./definitions/definitions.routes').then(m => m.definitionsRoutes),
    data: { breadcrumb: 'Tanımlamalar' }     
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  }
];
