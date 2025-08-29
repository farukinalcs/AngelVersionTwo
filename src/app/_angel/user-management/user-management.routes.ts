import { Routes } from "@angular/router";

export const userManagementRoutes: Routes = [
    {
        path: 'definitions',
        loadChildren: () => import('./definitions/definitions.routes').then(m => m.definitionsRoutes )
    },
    {
        path: 'user-list',
        loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent)
    }
];