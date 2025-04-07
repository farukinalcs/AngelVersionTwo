import { Routes } from "@angular/router";
import { DurationsComponent } from "./durations/durations.component";
import { OperationsComponent } from "./operations.component";
import { LeavesComponent } from "./leaves/leaves.component";
import { PassagesComponent } from "./passages/passages.component";
import { MissingDurationsComponent } from "./missing-durations/missing-durations.component";

export const OperationsRoutes: Routes = [
    {
        path: '',
        component: OperationsComponent,
        children: [
            { path: 'durations', component: DurationsComponent },
            { path: 'leaves', component: LeavesComponent },
            { path: 'passages', component: PassagesComponent },
            { path: 'missing-durations', component: MissingDurationsComponent },
            // { path: '', pathMatch: 'full' },
        ],
    },
]