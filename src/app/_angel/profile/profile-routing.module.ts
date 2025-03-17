import { NgModule } from '@angular/core';
import { ProfiledashboardComponent } from './profiledashboard/profiledashboard.component';
import { Routes,RouterModule } from '@angular/router';
import { GecislerimComponent } from './islemler/gecislerim/gecislerim.component';
import { IzinlerimComponent } from './islemler/izinlerim/izinlerim.component';
import { SurelerimComponent } from './islemler/surelerim/surelerim.component';
import { TalepedilenlerComponent } from './talepler/talepedilenler/talepedilenler.component';
import { TaleplerimComponent } from './talepler/taleplerim/taleplerim.component';
import { ZiyaretcitaleplerimComponent } from './talepler/ziyaretcitaleplerim/ziyaretcitaleplerim.component';
import { MobillokasyonComponent } from './talepler/mobillokasyon/mobillokasyon.component';
import { TasklistemComponent } from './talepler/tasklistem/tasklistem.component';
import { TakimimComponent } from './talepler/takimim/takimim.component';
import { EksikSurelerimComponent } from './islemler/eksik-surelerim/eksik-surelerim.component';
import { ProfileDataWidgetComponent } from './profile-data-widget/profile-data-widget.component';
import { VisitorRequestsComponent } from './talepler/visitor-requests/visitor-requests.component';
import { ProfileDefinitionsComponent } from './profile-definitions/profile-definitions.component';

const routes: Routes = [
  {
    path: '',
    component: ProfiledashboardComponent,
    children: [
      {
        path: 'dashboard',
        component : ProfileDataWidgetComponent
      },
      {
        path: 'gecislerim',
        component: GecislerimComponent,
      },
      {
        path: 'izinlerim',
        component: IzinlerimComponent,
      },
      {
        path: 'surelerim',
        component: SurelerimComponent,
      },
      {
        path: 'talep_edilenler',
        component: TalepedilenlerComponent,
      },
      {
        path: 'taleplerim',
        component: TaleplerimComponent,
      },
      {
        path: 'ziyaretci_talepleri',
        component: VisitorRequestsComponent,
      },
      {
        path: 'ziyaretci_taleplerim',
        component: ZiyaretcitaleplerimComponent,
      },
      {
        path: 'mobil_lokasyon',
        component: MobillokasyonComponent,
      },
      {
        path: 'task_listem',
        component: TasklistemComponent,
      },
      {
        path: 'takimim',
        component: TakimimComponent,
      },
      {
        path: 'eksik_surelerim',
        component: EksikSurelerimComponent,
      },
      {
        path: 'profil_tanimlamalar',
        component: ProfileDefinitionsComponent,
      },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  // declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ], exports: [RouterModule],
})
export class ProfileRoutingModule { }
