import { Routes } from "@angular/router";
import { DefinitionsComponent } from "./definitions.component";
import { GeneralComponent } from "./general/general.component";
import { AssetComponent } from "./asset/asset.component";
import { ConsumablesComponent } from "./consumables/consumables.component";
import { SpecialAssignmentComponent } from "./special-assignment/special-assignment.component";

export const definitionsRoutes: Routes = [
    {
      path: '',
      component: DefinitionsComponent,
      children: [
        { path: '', pathMatch: 'full', component: GeneralComponent }, // Direkt olarak GeneralComponent yüklensin
        { path: 'general', component: GeneralComponent },
        { path: 'asset', component: AssetComponent },
        { path: 'consumables', component: ConsumablesComponent },
        { path: 'assignment', component: SpecialAssignmentComponent },
      ],
    },
];
  
  