import { Routes } from '@angular/router';
import { visitorRoutes } from '../_angel/visitor/visitor.routes';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      data: { layout: 'light-sidebar' },

  },
  {
    path: 'performance',
    loadChildren: () =>
      import('../_angel/performance/performance.module').then((m) => m.PerformanceModule),
      data: { layout: 'light-sidebar' },
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../_angel/new-profile/new-profile.routes').then(m => m.profileRoutes),
    data: { layout: 'light-sidebar' },
  },
  {
    path: 'access',
    loadChildren: () =>
      import('../_angel/access/access.module').then((m) => m.AccessModule),
      data: { layout: 'light-sidebar' },

  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('../_angel/attendance/attendance.module').then((m) => m.AttendanceModule),
      data: { layout: 'light-sidebar' },

  },
  {
    path:'patrol',
    loadChildren:() => 
    import('../_angel/patrol/patrol.module').then((m) => m.PatrolModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    data: { layout: 'light-sidebar' },
  },
  {
    path: 'visitor',
    children: visitorRoutes,
    data: { layout: 'light-sidebar' },
  },
  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
