import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { PerformanceRoutingModule } from './performance-routing.module';
import { PerformanceDashboardComponent } from './performance-dashboard/performance-dashboard.component';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
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
import { CompetenceQuestionsComponent } from './competence-questions/competence-questions.component';
import { DraftComponent } from './draft/draft.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [
    PerformanceDashboardComponent,
    PerformanceDefinitionsComponent,
    PerformanceQuestionCategoryComponent,
    ScaleComponent,
    CompetenceQuestionsComponent,
    DraftComponent],

  imports: [
    CommonModule,
    PerformanceRoutingModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    CardModule,
    StepsModule,
    InputIconModule,
    IconFieldModule,
    IftaLabelModule,
    SliderModule,
    SelectModule,
    DropdownModule,
    MatTabsModule,
    TableModule,
    InputTextModule,
    ChipModule,
    CheckboxModule,
    DatePickerModule,
    AccordionModule,
    DialogModule,
    StepperModule,
    CarouselModule
  ]
})
export class PerformanceModule { }
