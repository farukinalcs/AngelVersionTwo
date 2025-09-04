import { Routes } from '@angular/router';
import { NewProfileComponent } from './new-profile.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: NewProfileComponent,
    data: { breadcrumb: 'Profil' }, // ← üst seviye etiket
    children: [
      { path: '', redirectTo: 'widgets', pathMatch: 'full' },

      {
        path: 'widgets',
        loadComponent: () =>
          import('../new-profile/widgets/widgets.component').then(m => m.WidgetsComponent),
        data: { breadcrumb: 'Widgetlar' }, // ← bu seviye
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../new-profile/widgets/widgets.routes').then(m => m.widgetsRoutes),
            // alt seviye breadcrumb'lar ilgili .routes dosyasında tanımlanacak
          }
        ]
      },

      {
        path: 'definitions',
        loadComponent: () =>
          import('../new-profile/definitions/definitions.component').then(m => m.DefinitionsComponent),
        data: { breadcrumb: 'Tanımlar' },
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../new-profile/definitions/definitions.routes').then(m => m.definitionsRoutes),
          }
        ]
      },

      {
        path: 'operations',
        loadComponent: () =>
          import('../new-profile/operations/operations.component').then(m => m.OperationsComponent),
        data: { breadcrumb: 'İşlemler' },
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../new-profile/operations/operations.routes').then(m => m.OperationsRoutes),
          }
        ]
      },

      {
        path: 'others',
        loadComponent: () =>
          import('../new-profile/others/others.component').then(m => m.OthersComponent),
        data: { breadcrumb: 'Diğerleri' },
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../new-profile/others/others.routes').then(m => m.OthersRoutes)
          }
        ]
      },

      {
        path: 'requests',
        loadComponent: () =>
          import('../new-profile/requests/requests.component').then(m => m.RequestsComponent),
        data: { breadcrumb: 'Talepler' },
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../new-profile/requests/requests.routes').then(m => m.RequestsRoutes)
          }
        ]
      },

      { path: '**', redirectTo: 'widgets' },
    ],
  },
];
