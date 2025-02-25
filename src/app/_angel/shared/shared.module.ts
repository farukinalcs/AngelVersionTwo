import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenDivComponent } from './full-screen-div/full-screen-div.component';
import { SicilListeComponent } from './sicil-liste/sicil-liste.component';
import { SicilComponent } from './sicil/sicil.component';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';
import { FormStepperComponent } from './form-stepper/form-stepper.component';
import { DetailSearchComponent } from './detail-search/detail-search.component';
import { RequestProcessComponent } from './request-process/request-process.component';
import { RequestMenuComponent } from './request-menu/request-menu.component';
import { AnnualCalendarComponent } from './annual-calendar/annual-calendar.component';

// PrimeNG modules
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from 'src/app/modules/i18n';
import { AgGridModule } from 'ag-grid-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { DashboardCardDetailComponent } from './dashboard-card/dashboard-card-detail/dashboard-card-detail.component';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { RegistryListComponent } from './registry-list/registry-list.component';
import { RegistryCardComponent } from './registry-list/registry-card/registry-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PersonalInfoComponent } from './registry-list/registry-card/personal-info/personal-info.component';
import { ContactInfoComponent } from './registry-list/registry-card/contact-info/contact-info.component';
import { OrganizationInfoComponent } from './registry-list/registry-card/organization-info/organization-info.component';
import { DropdownModule } from 'primeng/dropdown';
import { CustomInfoComponent } from './registry-list/registry-card/custom-info/custom-info.component';
import { ShiftInfoComponent } from './registry-list/registry-card/shift-info/shift-info.component';
import { AccessInfoComponent } from './registry-list/registry-card/access-info/access-info.component';
import { AccessGroupComponent } from './registry-list/registry-card/access-group/access-group.component';
import { RegisterAuthorizedAreasComponent } from './registry-list/registry-card/register-authorized-areas/register-authorized-areas.component';
import { SplitsComponent } from './registry-list/registry-card/splits/splits.component';
import { CarouselModule } from 'primeng/carousel';
import { TooltipModule } from 'primeng/tooltip';
import { RegisterHistoryComponent } from './registry-list/registry-card/register-history/register-history.component';
import { WorkingPeriodsComponent } from './registry-list/registry-card/working-periods/working-periods.component';
import { FilesComponent } from './registry-list/registry-card/files/files.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ApplicationUseComponent } from './registry-list/registry-card/application-use/application-use.component';
import { RegistryFilterComponent } from './registry-list/registry-filter/registry-filter.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BulkRegistryChangeComponent } from './registry-list/bulk-registry-change/bulk-registry-change.component';
import { BoldReportComponent } from './bold-report/bold-report.component';




// Bold Reports
import '../../../globals';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';
// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';
// ------------



@NgModule({
  declarations: [
    FullScreenDivComponent,
    SicilListeComponent,
    SicilComponent,
    DialogContainerComponent,
    DataNotFoundComponent,
    FormStepperComponent,
    DetailSearchComponent,
    RequestProcessComponent,
    RequestMenuComponent,
    AnnualCalendarComponent,
    DashboardCardComponent,
    DashboardCardDetailComponent,
    RegistryListComponent,
    RegistryCardComponent,
    PersonalInfoComponent,
    ContactInfoComponent,
    OrganizationInfoComponent,
    CustomInfoComponent,
    ShiftInfoComponent,
    AccessInfoComponent,
    AccessGroupComponent,
    RegisterAuthorizedAreasComponent,
    SplitsComponent,
    RegisterHistoryComponent,
    WorkingPeriodsComponent,
    FilesComponent,
    ApplicationUseComponent,
    RegistryFilterComponent,
    BulkRegistryChangeComponent,
    BoldReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AccordionModule,
    CardModule,
    TimelineModule,
    ButtonModule,
    InputTextModule,
    TranslationModule,
    AgGridModule,
    MatProgressSpinnerModule,
    CustomPipeModule,
    MatTabsModule,
    DropdownModule,
    CarouselModule,
    TooltipModule,
    ProgressBarModule,
    NgbProgressbarModule,
    InlineSVGModule,
    MatExpansionModule,
    BoldReportViewerModule // Bold Reports
  ],
  exports: [
    FullScreenDivComponent,
    SicilListeComponent,
    SicilComponent,
    DialogContainerComponent,
    DataNotFoundComponent,
    FormStepperComponent,
    DetailSearchComponent,
    RequestProcessComponent,
    RequestMenuComponent,
    AnnualCalendarComponent,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    AccordionModule,
    CardModule,
    TimelineModule,
    ButtonModule,
    InputTextModule,
    DashboardCardComponent,
    RegistryListComponent,
    RegistryCardComponent
  ]
})
export class SharedModule { }
