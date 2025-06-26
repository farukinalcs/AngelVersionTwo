import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { RaporlarComponent } from './raporlar/raporlar.component';
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
import { LedPanelsComponent } from './access-definitions/definitions/led-panels/led-panels.component';
import { PrintersComponent } from './access-definitions/definitions/printers/printers.component';
import { AccessDashboardComponent } from './access-dashboard/access-dashboard.component';
import { AccessRegistryListComponent } from './access-registry-list/access-registry-list.component';
import { AccessGroupsComponent } from './access-groups/access-groups.component';
import { OnboardingComponent } from './access-definitions/definitions/onboarding/onboarding.component';
import { NecessaryDocsComponent } from './access-definitions/definitions/necessary-docs/necessary-docs.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: AccessDashboardComponent,
  },
  {
    path: 'registry-list',
    component: AccessRegistryListComponent,
  },
  {
    path: 'terminal',
    component: DevicesComponent,
  },
  {
    path: 'access-groups',
    loadComponent: () => import('./access-groups/access-groups.component').then(m => m.AccessGroupsComponent),
  },
  {
    path: 'registry-groups',
    loadComponent: () => import('./registry-groups/registry-groups.component').then(m => m.RegistryGroupsComponent),
  },
  {
    path: 'definitions',
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
      { path: 'printers', component: PrintersComponent},
      { path: 'led-panels', component: LedPanelsComponent},
      { path: 'authority-roles', component: AuthorityRolesComponent},
      { path: 'my-page', component: MyPageComponent},
      { path: 'onboarding', component: OnboardingComponent},
      { path: 'necessary-docs', component: NecessaryDocsComponent}
      
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
