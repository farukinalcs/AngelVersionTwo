import { Routes } from '@angular/router';
import { DefinitionsComponent } from './definitions.component';
import { GeneralComponent } from './general/general.component';
import { FoodMenuComponent } from './food-menu/food-menu.component';
import { FoodTypeComponent } from './food-type/food-type.component';
import { FoodLocationComponent } from './food-location/food-location.component';
import { FoodSettingsComponent } from './food-settings/food-settings.component';

export const definitionsRoutes: Routes = [
  {
    path: '',
    component: DefinitionsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FoodSettingsComponent,
        data: { breadcrumb: 'Genel Tanımlar' },
      }, // Direkt olarak GeneralComponent yüklensin
      {
        path: 'general',
        component: GeneralComponent,
        data: { breadcrumb: 'Saat Tanımları' },
      },
            {
        path: 'settings',
        component: FoodSettingsComponent,
        data: { breadcrumb: 'Genel Tanımlar' },
      },
      {
        path: 'food-menu',
        component: FoodMenuComponent,
        data: { breadcrumb: 'Yemek Menüsü' },
      },
      {
        path: 'food-type',
        component: FoodTypeComponent,
        data: { breadcrumb: 'Yemek Tipi' },
      },
            {
        path: 'food-location',
        component: FoodLocationComponent,
        data: { breadcrumb: 'Lokasyon' },
      },
    //   {
    //     path: 'assignment',
    //     component: SpecialAssignmentComponent,
    //     data: { breadcrumb: 'Sicil Özel' },
    //   },
    ],
  },
];
