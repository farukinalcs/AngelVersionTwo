import { Routes } from '@angular/router';
import { WidgetsComponent } from './widgets.component';
import { BirthdayComponent } from './birthday/birthday.component';
import { SeniorEmployeesComponent } from './senior-employees/senior-employees.component';
import { SurveyComponent } from './survey/survey.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { MealMenuComponent } from './meal-menu/meal-menu.component';
import { NewJoinersComponent } from './new-joiners/new-joiners.component';
import { MyFilesComponent } from './my-files/my-files.component';
import { DepartureComponent } from './departure/departure.component';
import { MyInventoryComponent } from './my-inventory/my-inventory.component';

export const widgetsRoutes: Routes = [
  {
    path: '',
    component: WidgetsComponent,
    children: [
      { path: 'birthday',         component: BirthdayComponent,        data: { breadcrumb: 'Doğum Günleri' } },
      { path: 'senior-employees', component: SeniorEmployeesComponent, data: { breadcrumb: 'Kıdemliler' } },
      { path: 'survey',           component: SurveyComponent,          data: { breadcrumb: 'Anket' } },
      { path: 'bulletin',         component: BulletinComponent,        data: { breadcrumb: 'Bülten' } },
      { path: 'announcements',    component: AnnouncementsComponent,   data: { breadcrumb: 'Duyurular' } },
      { path: 'inventory',        component: MyInventoryComponent,     data: { breadcrumb: 'Envanterim' } },
      { path: 'suggestions',      component: SuggestionsComponent,     data: { breadcrumb: 'Öneriler' } },
      { path: 'meal-menu',        component: MealMenuComponent,        data: { breadcrumb: 'Yemek Menüsü' } },
      { path: 'my-files',         component: MyFilesComponent,         data: { breadcrumb: 'Dosyalarım' } },
      { path: 'new-joiners',      component: NewJoinersComponent,      data: { breadcrumb: 'Yeni Katılanlar' } },
      { path: 'departure',        component: DepartureComponent,       data: { breadcrumb: 'Ayrılanlar' } },
      // İstersen varsayılan açılış:
      // { path: '', redirectTo: 'birthday', pathMatch: 'full' },
    ],
  },
];
