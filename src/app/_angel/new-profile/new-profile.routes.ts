import { Routes } from '@angular/router';
import { NewProfileComponent } from './new-profile.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: NewProfileComponent, 
    children: [
      { path: '', redirectTo: 'widgets', pathMatch: 'full' },
      {
        path: 'widgets',
        loadComponent: () =>
          import('../new-profile/widgets/widgets.component').then(m => m.WidgetsComponent),
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../new-profile/widgets/widgets.routes').then(m => m.widgetsRoutes),
          }
        ]
      },
      {
        path: 'definitions',
        loadComponent: () =>
          import('../new-profile/definitions/definitions.component').then(m => m.DefinitionsComponent),
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
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../new-profile/requests/requests.routes').then(m => m.RequestsRoutes)
          }
        ]
      },
      // {
      //   path: 'request-forms',
      //   loadComponent: () => 
      //     import('../new-profile/request-forms/request-forms.component').then(m => m.RequestFormsComponent),
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () => 
      //         import('../new-profile/request-forms/request-forms.routes').then(m => m.RequestFormsRoutes)
      //     }
      //   ]
      // },
      { path: '**', redirectTo: 'widgets' }, // Hatalı yönlendirmeyi engellemek için
    ],
  },
];
