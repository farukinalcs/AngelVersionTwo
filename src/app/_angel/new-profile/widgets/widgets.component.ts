import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SurveyComponent } from './survey/survey.component';
import { BirthdayComponent } from './birthday/birthday.component';
import { NewJoinersComponent } from './new-joiners/new-joiners.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { MyFilesComponent } from './my-files/my-files.component';
import { MealMenuComponent } from './meal-menu/meal-menu.component';
import { SeniorEmployeesComponent } from './senior-employees/senior-employees.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SurveyInHouseComponent } from '../survey-in-house/survey-in-house.component';
import { DepartureComponent } from './departure/departure.component';

@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BirthdayComponent,
    NewJoinersComponent,
    BulletinComponent,
    MyFilesComponent,
    MealMenuComponent,
    SeniorEmployeesComponent,
    AnnouncementsComponent,
    SuggestionsComponent,
    SurveyComponent,
    InventoryComponent,
    SurveyInHouseComponent,
    DepartureComponent
  ],
  templateUrl: './widgets.component.html',
  styleUrl: './widgets.component.scss'
})
export class WidgetsComponent implements OnInit {

  isRefresh : boolean = false;
  constructor(
  ) { }

  ngOnInit(): void {
  }
}
