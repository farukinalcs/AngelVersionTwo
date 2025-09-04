import { Routes } from "@angular/router";
import { RequestsComponent } from "./requests.component";
import { MyRequestsComponent } from "./my-requests/my-requests.component";
import { PendingRequestsComponent } from "./pending-requests/pending-requests.component";
import { MyVisitorRequestsComponent } from "./my-visitor-requests/my-visitor-requests.component";
import { VisitorRequestsComponent } from "./visitor-requests/visitor-requests.component";

export const RequestsRoutes: Routes = [
  {
    path: '',
    component: RequestsComponent,
    // Üst seviye 'profile/requests' zaten breadcrumb: 'Talepler'
    children: [
      { path: 'my-requests',          component: MyRequestsComponent,          data: { breadcrumb: 'Taleplerim' } },
      { path: 'pending-requests',     component: PendingRequestsComponent,     data: { breadcrumb: 'Bekleyen Talepler' } },
      { path: 'my-visitor-requests',  component: MyVisitorRequestsComponent,   data: { breadcrumb: 'Ziyaretçi Taleplerim' } },
      { path: 'visitor-requests',     component: VisitorRequestsComponent,     data: { breadcrumb: 'Ziyaretçi Talepleri' } },
      // (opsiyonel) varsayılan açılış:
      // { path: '', redirectTo: 'my-requests', pathMatch: 'full' },
    ]
  }
];
