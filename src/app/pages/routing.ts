import { Routes } from '@angular/router';
import { visitorRoutes } from '../_angel/visitor/visitor.routes';
import { onboardingGuard } from '../_helpers/guards/onboarding.guard';
import { overtimeRoutes } from '../_angel/overtime/overtime.routes';
import { leaveRoutes } from '../_angel/leave/leave.routes';
import { shiftRoutes } from '../_angel/shift/shift.routes';
import { userManagementRoutes } from '../_angel/user-management/user-management.routes';
import { inventoryRoutes } from '../_angel/inventory/inventory.routes';

const Routing: Routes = [
  {
    path: 'performance',
    loadChildren: () => import('../_angel/performance/performance.module').then(m => m.PerformanceModule),
    data: { layout: 'light-sidebar', breadcrumb: 'Performans' }
  },
  {
    path: 'profile',
    loadChildren: () => import('../_angel/new-profile/new-profile.routes').then(m => m.profileRoutes),
    data: { layout: 'light-sidebar', breadcrumb: 'Profil' }
  },
  {
    path: 'access',
    loadChildren: () => import('../_angel/access/access.module').then(m => m.AccessModule),
    data: { layout: 'light-sidebar', breadcrumb: 'Erişim' }
  },
  {
    path: 'attendance',
    loadChildren: () => import('../_angel/attendance/attendance.module').then(m => m.AttendanceModule),
    data: { layout: 'light-sidebar', breadcrumb: 'Yoklama' }
  },
  {
    path: 'leave',
    children: leaveRoutes,
    data: { layout: 'light-sidebar', breadcrumb: 'İzin' }
  },
  {
    path: 'overtime',
    children: overtimeRoutes,
    data: { layout: 'light-sidebar', breadcrumb: 'Fazla Mesai' }
  },
  {
    path: 'shift',
    children: shiftRoutes,
    data: { layout: 'light-sidebar', breadcrumb: 'Vardiya' }
  },
  {
    path: 'patrol',
    loadChildren: () => import('../_angel/patrol/patrol.module').then(m => m.PatrolModule),
    data: { layout: 'light-sidebar', breadcrumb: 'Devriye' }
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then(m => m.ChatModule),
    data: { layout: 'light-sidebar', breadcrumb: 'Sohbet' }
  },
  {
    path: 'visitor',
    children: visitorRoutes,
    data: { layout: 'light-sidebar', breadcrumb: 'Ziyaretçi' }
  },
  {
    path: 'inventory',
    children: inventoryRoutes,
    data: { layout: 'light-sidebar', breadcrumb: 'Envanter' }
  },
  {
    path: 'user-management',
    children: userManagementRoutes,
    data: { layout: 'light-sidebar', breadcrumb: 'Kullanıcı Yönetimi' }
  },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' }
];

export { Routing };
