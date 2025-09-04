import { Routes } from "@angular/router";
import { OthersComponent } from "./others.component";
import { MyTeamComponent } from "./my-team/my-team.component";
import { MyTaskListComponent } from "./my-task-list/my-task-list.component";
import { MobileLocationComponent } from "./mobile-location/mobile-location.component";

export const OthersRoutes: Routes = [
  {
    path: '',
    component: OthersComponent,
    // Üst seviye 'profile/others' zaten breadcrumb: 'Diğerleri' (profileRoutes'ta verdik)
    children: [
      { path: 'my-team',        component: MyTeamComponent,       data: { breadcrumb: 'Takımım' } },
      { path: 'my-task-list',   component: MyTaskListComponent,   data: { breadcrumb: 'Görev Listem' } },
      { path: 'mobile-location',component: MobileLocationComponent,data: { breadcrumb: 'Mobil Konum' } },
      // (opsiyonel) varsayılan açılış:
      // { path: '', redirectTo: 'my-team', pathMatch: 'full' },
    ]
  }
];
