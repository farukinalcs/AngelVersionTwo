import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent),
    data: { breadcrumb: 'Genel Bakış' }  
  },
  {
    path: 'request',
    loadComponent: () => import('./request/request.component').then(m => m.RequestComponent),
    data: { breadcrumb: 'Talepler' }    
  },
  {
    path: 'definitions',
    loadChildren: () =>
      import('./definitions/definitions.route').then(m => m.definitionsRoutes),
    data: { breadcrumb: 'Tanımlamalar' }     
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  }
];
