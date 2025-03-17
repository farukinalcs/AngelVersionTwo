import { Routes } from '@angular/router';

export const visitorRoutes: Routes = [
  {
    path: 'overview',
    loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent),
  },
  {
    path: 'cards',
    loadComponent: () => import('./cards/cards.component').then(m => m.CardsComponent),
  },
  {
    path: 'visitors',
    loadComponent: () => import('./visitors/visitors.component').then(m => m.VisitorsComponent),
  },
  {
    path: 'definitions',
    loadComponent: () => import('./definitions/definitions.component').then(m => m.DefinitionsComponent),
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent),
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  }
];
