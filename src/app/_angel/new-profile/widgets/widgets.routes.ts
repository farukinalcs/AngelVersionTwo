import { Routes } from '@angular/router';
import { WidgetsComponent } from './widgets.component';
import { BirthdayComponent } from './birthday/birthday.component';
import { SeniorEmployeesComponent } from './senior-employees/senior-employees.component';
import { SurveyComponent } from './survey/survey.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { MealMenuComponent } from './meal-menu/meal-menu.component';
import { NewJoinersComponent } from './new-joiners/new-joiners.component';
import { MyFilesComponent } from './my-files/my-files.component';

export const widgetsRoutes: Routes = [
  {
    path: '',
    component: WidgetsComponent,
    children: [
      { path: 'birthday', component: BirthdayComponent },
      { path: 'senior-employees', component: SeniorEmployeesComponent },
      { path: 'survey', component: SurveyComponent },
      { path: 'bulletin', component: BulletinComponent },
      { path: 'announcements', component: AnnouncementsComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'suggestions', component: SuggestionsComponent },
      { path: 'meal-menu', component: MealMenuComponent },
      { path: 'my-files', component: MyFilesComponent },
      { path: 'new-joiners', component: NewJoinersComponent },
      // { path: '', pathMatch: 'full' },
    ],
  },
];
