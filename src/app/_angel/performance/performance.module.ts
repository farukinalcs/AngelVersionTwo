import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { PerformanceRoutingModule } from './performance-routing.module';
import { PerformanceDashboardComponent } from './performance-dashboard/performance-dashboard.component';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SharedModule } from '../shared/shared.module';
import { PerformanceformStepsComponent } from './performanceform-steps/performanceform-steps.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PerformanceDefinitionsComponent } from './performance-definitions/performance-definitions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { PerformanceQuestionCategoryComponent } from './performance-question-category/performance-question-category.component';
import { ScaleComponent } from './scale/scale.component';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SliderModule } from 'primeng/slider';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    PerformanceDashboardComponent,
    PerformanceformStepsComponent,
    PerformanceDefinitionsComponent,
    PerformanceQuestionCategoryComponent,
    ScaleComponent],

  imports: [
    CommonModule,
    PerformanceRoutingModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    CardModule,
    SharedModule,
    StepsModule,
    InputIconModule,
    IconFieldModule,
    IftaLabelModule,
    SliderModule,
    SelectModule,
    DropdownModule,
    MatTabsModule
  ]
})
export class PerformanceModule { }
