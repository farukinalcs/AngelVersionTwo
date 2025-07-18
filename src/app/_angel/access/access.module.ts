import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessRoutingModule } from './access-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CustomizedCellComponent } from './customized-cell/customized-cell.component';
import { TranslationModule } from 'src/app/modules/i18n';
import { DropdownModule } from 'primeng/dropdown';
import { AccessDefinitionsComponent } from './access-definitions/access-definitions.component';
import { OrganizationDefinitionsComponent } from './access-definitions/definitions/organization-definitions/organization-definitions.component';
import { FingerprintComponent } from './access-definitions/definitions/fingerprint/fingerprint.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { AccessOverviewContentComponent } from './access-dashboard/overview-content/access-overview-content.component';
import { FormStepperComponent } from '../shared/form-stepper/form-stepper.component';
import { DashboardCardComponent } from '../shared/dashboard-card/dashboard-card.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
    declarations: [
        CustomizedCellComponent,
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

    ],
    imports: [
        CommonModule,
        AccessRoutingModule,
        ReactiveFormsModule,
        CarouselModule,
        ButtonModule,
        InlineSVGModule.forRoot(),
        DropdownModule,
        TranslationModule,
        CustomPipeModule,
        MatTabsModule,
        MatTooltipModule,
        TooltipModule,
        SelectModule,
        AccessOverviewContentComponent,
        InputIconModule,
        FloatLabelModule,
        IconFieldModule,
        FormStepperComponent,
        DashboardCardComponent,
        FormsModule,
        DialogModule,
        InputTextModule

    ]

})
export class AccessModule { }
