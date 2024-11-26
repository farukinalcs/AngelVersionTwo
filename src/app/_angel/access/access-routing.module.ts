import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { AccessdashboardComponent } from './accessdashboard/accessdashboard.component';
import { TerminalComponent } from './terminal/terminal.component';
import { GecisgruplariComponent } from './gecisgruplari/gecisgruplari.component';
import { TanimlamalarComponent } from './tanimlamalar/tanimlamalar.component';
import { RaporlarComponent } from './raporlar/raporlar.component';
import { AccessDataWidgetComponent } from './access-data-widget/access-data-widget.component';
import { DevicesComponent } from './devices/devices.component';
import { AccessDefinitionsComponent } from './access-definitions/access-definitions.component';
import { OrganizationDefinitionsComponent } from './access-definitions/definitions/organization-definitions/organization-definitions.component';
import { FtpInfoComponent } from './access-definitions/definitions/ftp-info/ftp-info.component';
import { MailServiceComponent } from './access-definitions/definitions/mail-service/mail-service.component';
import { FingerprintComponent } from './access-definitions/definitions/fingerprint/fingerprint.component';
import { SecurityComponent } from './access-definitions/definitions/security/security.component';
import { MyPageComponent } from './access-definitions/definitions/my-page/my-page.component';
import { EventCodesComponent } from './access-definitions/definitions/event-codes/event-codes.component';
import { AuthorityRolesComponent } from './access-definitions/definitions/authority-roles/authority-roles.component';
import { DeviceGroupsComponent } from './access-definitions/definitions/device-groups/device-groups.component';
import { TimeZoneComponent } from './access-definitions/definitions/time-zone/time-zone.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: AccessDataWidgetComponent,
  },
  {
    path: 'terminal',
    component: DevicesComponent,
  },
  {
    path: 'gecis_gruplari',
    component: GecisgruplariComponent,
  },
  {
    path: 'tanimlamalar',
    component: AccessDefinitionsComponent,
    children: [
      { path: '', redirectTo: 'company', pathMatch: 'full' }, // İlk sekmeye yönlendirme
      { path: 'company', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_firma' } },
      { path: 'department', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_bolum' } },
      { path: 'position', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_pozisyon' } },
      { path: 'job', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_gorev' } },
      { path: 'sub-company', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_altfirma' } },
      { path: 'directorship', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_direktorluk' } },
      { path: 'collar', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_yaka' } },
      { path: 'device-groups', component: DeviceGroupsComponent },
      { path: 'time-zone', component: TimeZoneComponent },
      { path: 'fingerprint', component: FingerprintComponent },
      { path: 'doc-type', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_belgetipi' } },
      { path: 'time-attendance', component: OrganizationDefinitionsComponent, data: { crud: 'cbo_puantaj' } },
      { path: 'mail-service', component: MailServiceComponent },
      { path: 'ftp-info', component: FtpInfoComponent },
      { path: 'leave-reason', component: OrganizationDefinitionsComponent, data: { crud: 'sys_ayrilisnedeni' } },
      { path: 'security', component: SecurityComponent },
      { path: 'event-codes', component: EventCodesComponent},
      { path: 'authority-roles', component: AuthorityRolesComponent},
      { path: 'my-page', component: MyPageComponent}
      
    ]
  },
  {
    path: 'raporlar',
    component: RaporlarComponent,
  },
];


@NgModule({
  // declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ], exports: [RouterModule],
})
export class AccessRoutingModule { }
