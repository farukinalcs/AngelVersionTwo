import { Routes } from "@angular/router";
import { DefinitionsComponent } from "./definitions.component";
import { AccessGroupComponent } from "./access-group/access-group.component";

export const definitionsRoutes: Routes = [
    {
        path: '',
        component: DefinitionsComponent,
        children: [
            { path: '', pathMatch: 'full', component: AccessGroupComponent }, // Direkt olarak GeneralComponent yüklensin
            { path: 'access-group', component: AccessGroupComponent }
        ],
    },
];

