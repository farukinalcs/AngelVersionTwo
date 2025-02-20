import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GecisgruplariComponent } from './gecisgruplari/gecisgruplari.component';
import { RaporlarComponent } from './raporlar/raporlar.component';
import { AccessRoutingModule } from './access-routing.module';
import { GridsterModule } from 'angular-gridster2';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { InlineSVGModule } from 'ng-inline-svg-2';
import 'ag-grid-enterprise'
import { DevicesComponent } from './devices/devices.component';
import { CustomizedCellComponent } from './customized-cell/customized-cell.component';
import { DialogNewDeviceComponent } from './devices/dialog-new-device/dialog-new-device.component';
import { TranslationModule } from 'src/app/modules/i18n';
import { DropdownModule } from 'primeng/dropdown';
import { AgmCoreModule } from '@agm/core';
import { AccessDefinitionsComponent } from './access-definitions/access-definitions.component';
import { OrganizationDefinitionsComponent } from './access-definitions/definitions/organization-definitions/organization-definitions.component';
import { FingerprintComponent } from './access-definitions/definitions/fingerprint/fingerprint.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FtpInfoComponent } from './access-definitions/definitions/ftp-info/ftp-info.component';
import { MailServiceComponent } from './access-definitions/definitions/mail-service/mail-service.component';
import { SecurityComponent } from './access-definitions/definitions/security/security.component';
import { MyPageComponent } from './access-definitions/definitions/my-page/my-page.component';
import { EventCodesComponent } from './access-definitions/definitions/event-codes/event-codes.component';
import { AuthorityRolesComponent } from './access-definitions/definitions/authority-roles/authority-roles.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DeviceGroupsComponent } from './access-definitions/definitions/device-groups/device-groups.component';
import { TimeZoneComponent } from './access-definitions/definitions/time-zone/time-zone.component';
import { LedPanelsComponent } from './access-definitions/definitions/led-panels/led-panels.component';
import { PrintersComponent } from './access-definitions/definitions/printers/printers.component';
import { AccessDashboardComponent } from './access-dashboard/access-dashboard.component';
import { DialogUpdateDeviceComponent } from './devices/dialog-update-device/dialog-update-device.component';
import { AccessRegistryListComponent } from './access-registry-list/access-registry-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    DevicesComponent,
    GecisgruplariComponent,
    RaporlarComponent,
    CustomizedCellComponent,
    DialogNewDeviceComponent,
    AccessDefinitionsComponent,
    OrganizationDefinitionsComponent,
    FingerprintComponent,
    FtpInfoComponent,
    MailServiceComponent,
    SecurityComponent,
    MyPageComponent,
    EventCodesComponent,
    AuthorityRolesComponent,
    DeviceGroupsComponent,
    TimeZoneComponent,
    LedPanelsComponent,
    PrintersComponent,
    AccessDashboardComponent,
    DialogUpdateDeviceComponent,
    AccessRegistryListComponent

  ],

  imports: [
    CommonModule,
    AccessRoutingModule,
    GridsterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    NgApexchartsModule,
    MatDialogModule,
    MatListModule,
    ReactiveFormsModule,
    CarouselModule,
    ButtonModule,
    NgbCarouselModule,
    NgbModule,
    ScrollPanelModule,
    SidebarModule,
    OverlayPanelModule,
		MultiSelectModule,
    MatChipsModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSelectModule,
    SharedModule,
    AgGridModule,
    InlineSVGModule.forRoot(),
    DropdownModule,
    TranslationModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAdALF-5HPnZFuvYRXmGY8qkv21TGD25ak',
    // }),
    CustomPipeModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    TooltipModule
  ]

})
export class AccessModule { }
