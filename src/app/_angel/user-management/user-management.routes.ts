import { Routes } from "@angular/router";

export const userManagementRoutes: Routes = [
    {
        path: 'definitions',
        loadChildren: () => import('./definitions/definitions.routes').then(m => m.definitionsRoutes )
    },
];