import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {InlineSVGModule} from 'ng-inline-svg-2';
import {PurchaseToolbarComponent} from "./purchase-toolbar/purchase-toolbar.component";
import {ExploreMainDrawerComponent} from './explore-main-drawer/explore-main-drawer.component';
import {HelpDrawerComponent} from "./help-drawer/help-drawer.component";
import { TranslationModule } from 'src/app/modules/i18n';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AttendanceModule } from 'src/app/_angel/puantaj/attendance.module';

@NgModule({
  declarations: [
    ExploreMainDrawerComponent,
    HelpDrawerComponent,
    PurchaseToolbarComponent,
  ],
  imports: [CommonModule, InlineSVGModule, RouterModule, TranslationModule, NgbAccordionModule, FormsModule, AttendanceModule],
  exports: [
    ExploreMainDrawerComponent,
    HelpDrawerComponent,
    PurchaseToolbarComponent
  ],
})
export class EngagesModule {
}
