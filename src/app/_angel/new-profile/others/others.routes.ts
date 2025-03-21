import { Routes } from "@angular/router";
import { OthersComponent } from "./others.component";
import { MyTeamComponent } from "./my-team/my-team.component";
import { MyTaskListComponent } from "./my-task-list/my-task-list.component";
import { MobileLocationComponent } from "./mobile-location/mobile-location.component";

export const OthersRoutes: Routes = [
    {
        path: '',
        component: OthersComponent,
        children: [
            { path: 'my-team', component: MyTeamComponent },
            { path: 'my-task-list', component: MyTaskListComponent },
            { path: 'mobile-location', component: MobileLocationComponent }
        ]
    }
]