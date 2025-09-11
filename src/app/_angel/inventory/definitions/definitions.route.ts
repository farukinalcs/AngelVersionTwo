import { Routes } from '@angular/router';
import { DefinitionsComponent } from './definitions.component';
import { GeneralComponent } from './general/general.component';
import { AssetComponent } from './asset/asset.component';
import { ConsumablesComponent } from './consumables/consumables.component';
import { SpecialAssignmentComponent } from './special-assignment/special-assignment.component';

export const definitionsRoutes: Routes = [
  {
    path: '',
    component: DefinitionsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: GeneralComponent,
        data: { breadcrumb: 'Genel' },
      }, // Direkt olarak GeneralComponent yüklensin
      {
        path: 'general',
        component: GeneralComponent,
        data: { breadcrumb: 'Genel' },
      },
      {
        path: 'asset',
        component: AssetComponent,
        data: { breadcrumb: 'Ekipman' },
      },
      {
        path: 'consumables',
        component: ConsumablesComponent,
        data: { breadcrumb: 'Sarf Malzeme' },
      },
      {
        path: 'assignment',
        component: SpecialAssignmentComponent,
        data: { breadcrumb: 'Sicil Özel' },
      },
    ],
  },
];
