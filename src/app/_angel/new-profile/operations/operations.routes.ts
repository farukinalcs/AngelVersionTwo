import { Routes } from "@angular/router";
import { DurationsComponent } from "./durations/durations.component";
import { OperationsComponent } from "./operations.component";
import { LeavesComponent } from "./leaves/leaves.component";
import { PassagesComponent } from "./passages/passages.component";
import { MissingDurationsComponent } from "./missing-durations/missing-durations.component";

export const OperationsRoutes: Routes = [
  {
    path: '',
    component: OperationsComponent,
    // Üst seviye 'profile/operations' zaten breadcrumb: 'İşlemler' (profileRoutes'ta verdik)
    children: [
      { path: 'durations',          component: DurationsComponent,        data: { breadcrumb: 'Süreler' } },
      { path: 'leaves',             component: LeavesComponent,           data: { breadcrumb: 'İzinler' } },
      { path: 'passages',           component: PassagesComponent,         data: { breadcrumb: 'Geçişler' } },
      { path: 'missing-durations',  component: MissingDurationsComponent, data: { breadcrumb: 'Eksik Süreler' } },
      // (opsiyonel) varsayılan:
      // { path: '', redirectTo: 'durations', pathMatch: 'full' },
    ],
  },
];
