import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessdashboardComponent } from './accessdashboard/accessdashboard.component';
import { RouterModule } from '@angular/router';
import { TerminalComponent } from './terminal/terminal.component';
import { GecisgruplariComponent } from './gecisgruplari/gecisgruplari.component';
import { TanimlamalarComponent } from './tanimlamalar/tanimlamalar.component';
import { RaporlarComponent } from './raporlar/raporlar.component';
import { AccessDataWidgetComponent } from './access-data-widget/access-data-widget.component';
import { AccessRoutingModule } from './access-routing.module';
import { GridsterModule } from 'angular-gridster2';
import { ParentWidgetComponent } from './access-data-widget/parent-widget/parent-widget.component';
import { Widget1001Component } from './access-data-widget/widget1001/widget1001.component';
import { Widget1002Component } from './access-data-widget/widget1002/widget1002.component';
import { Widget1003Component } from './access-data-widget/widget1003/widget1003.component';
import { Widget1004Component } from './access-data-widget/widget1004/widget1004.component';
import { Widget1005Component } from './access-data-widget/widget1005/widget1005.component';
import { Widget1006Component } from './access-data-widget/widget1006/widget1006.component';
import { ParentWidget2Component } from './access-data-widget/parent-widget2/parent-widget2.component';
import { Widget2001Component } from './access-data-widget/widget2001/widget2001.component';
import { Widget2002Component } from './access-data-widget/widget2002/widget2002.component';
import { Widget2003Component } from './access-data-widget/widget2003/widget2003.component';
import { Widget2004Component } from './access-data-widget/widget2004/widget2004.component';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogWidget1001Component } from './access-data-widget/widget1001/dialog-widget1001/dialog-widget1001.component';
import { FullScreenDivComponent } from '../shared/full-screen-div/full-screen-div.component';
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

@NgModule({
  declarations: [
    AccessdashboardComponent,
    TerminalComponent,
    GecisgruplariComponent,
    TanimlamalarComponent,
    RaporlarComponent,
    AccessDataWidgetComponent,
    ParentWidgetComponent,
    Widget1001Component,
    Widget1002Component,
    Widget1003Component,
    Widget1004Component,
    Widget1005Component,
    Widget1006Component,
    ParentWidget2Component,
    Widget2001Component,
    Widget2002Component,
    Widget2003Component,
    Widget2004Component,
    DialogWidget1001Component,
    FullScreenDivComponent
  ],
  imports: [
    CommonModule,
    AccessRoutingModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccessdashboardComponent,
      },
    ]),
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
    MatSelectModule


  ]
})
export class AccessModule { }
