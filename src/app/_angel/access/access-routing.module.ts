import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
    data: { breadcrumb: 'Kontrol Paneli' }
  },
  {
    path: 'registry-list',
    component: AccessRegistryListComponent,
    data: { breadcrumb: 'Sicil Listesi' }
  },
  {
    path: 'terminal',
    component: DevicesComponent,
    data: { breadcrumb: 'Terminaller' }
  },
  {
    path: 'access-groups',
    loadComponent: () => import('./access-groups/access-groups.component').then(m => m.AccessGroupsComponent),
    data: { breadcrumb: 'Erişim Grupları' }
  },
  {
    path: 'registry-groups',
    loadComponent: () => import('./registry-groups/registry-groups.component').then(m => m.RegistryGroupsComponent),
    data: { breadcrumb: 'Sicil Grupları' }
  },
  {
    path: 'definitions',
    component: AccessDefinitionsComponent,
    data: { breadcrumb: 'Tanımlar' },
    children: [
      { path: '', redirectTo: 'company', pathMatch: 'full' }, // ilk sekmeye yönlendirme
      { path: 'company',        component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Firma',        crud: 'cbo_firma' } },
      { path: 'department',     component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Bölüm',        crud: 'cbo_bolum' } },
      { path: 'position',       component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Pozisyon',     crud: 'cbo_pozisyon' } },
      { path: 'job',            component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Görev',        crud: 'cbo_gorev' } },
      { path: 'sub-company',    component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Alt Firma',    crud: 'cbo_altfirma' } },
      { path: 'directorship',   component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Direktörlük',  crud: 'cbo_direktorluk' } },
      { path: 'collar',         component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Yaka',         crud: 'cbo_yaka' } },
      { path: 'device-groups',  component: DeviceGroupsComponent,           data: { breadcrumb: 'Cihaz Grupları' } },
      { path: 'time-zone',      component: TimeZoneComponent,               data: { breadcrumb: 'Zaman Dilimi' } },
      { path: 'fingerprint',    component: FingerprintComponent,            data: { breadcrumb: 'Parmak İzi' } },
      { path: 'doc-type',       component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Belge Tipi',   crud: 'cbo_belgetipi' } },
      { path: 'time-attendance',component: OrganizationDefinitionsComponent, data: { breadcrumb: 'Puantaj',      crud: 'cbo_puantaj' } },
      { path: 'mail-service',   component: MailServiceComponent,            data: { breadcrumb: 'Mail Servisi' } },
      { path: 'ftp-info',       component: FtpInfoComponent,                data: { breadcrumb: 'FTP Bilgisi' } },
      { path: 'leave-reason',   component: OrganizationDefinitionsComponent, data: { breadcrumb: 'İzin Nedeni',  crud: 'sys_ayrilisnedeni' } },
      { path: 'security',       component: SecurityComponent,               data: { breadcrumb: 'Güvenlik' } },
      { path: 'event-codes',    component: EventCodesComponent,             data: { breadcrumb: 'Olay Kodları' } },
      { path: 'printers',       component: PrintersComponent,               data: { breadcrumb: 'Yazıcılar' } },
      { path: 'led-panels',     component: LedPanelsComponent,              data: { breadcrumb: 'LED Paneller' } },
      { path: 'authority-roles',component: AuthorityRolesComponent,         data: { breadcrumb: 'Yetki Rolleri' } },
      { path: 'my-page',        component: MyPageComponent,                 data: { breadcrumb: 'Benim Sayfam' } },
      { path: 'onboarding',     component: OnboardingComponent,             data: { breadcrumb: 'Onboarding' } },
      { path: 'necessary-docs', component: NecessaryDocsComponent,          data: { breadcrumb: 'Gerekli Belgeler' } }
    ]
  },
  {
    path: 'raporlar',
    component: RaporlarComponent,
    data: { breadcrumb: 'Raporlar' }
  },
  {
    path: 'temp-card',
    loadComponent: () => import('./access-temp-card/access-temp-card.component').then(m => m.AccessTempCardComponent),
    data: { breadcrumb: 'Geçici Kart' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRoutingModule {}
