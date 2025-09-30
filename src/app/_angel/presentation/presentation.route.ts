import { Routes } from '@angular/router';

export const presentationRoute: Routes = [
  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/overview.component').then((m) => m.OverviewComponent),
    data: { breadcrumb: 'Genel Bakış' },
  },
    {
    path: 'definitions',
    loadChildren: () =>
      import('./definitons/definations.route').then((m) => m.definitionsRoutes),
    data: { breadcrumb: 'Tanımlar' },
  },
  {
    path: 'product-distribution',
    loadComponent: () =>
      import('./product-distribution/product-distribution.component').then(
        (m) => m.ProductDistributionComponent
      ),
    data: { breadcrumb: 'Ürün Dağıtımı' },
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
];
