import { Routes } from "@angular/router";
import { RequestsComponent } from "./requests.component";
import { MyRequestsComponent } from "./my-requests/my-requests.component";
import { PendingRequestsComponent } from "./pending-requests/pending-requests.component";
import { MyVisitorRequestsComponent } from "./my-visitor-requests/my-visitor-requests.component";
import { VisitorRequestsComponent } from "./visitor-requests/visitor-requests.component";

export const RequestsRoutes: Routes = [
    {
        path: '',
        component: RequestsComponent,
        children: [
            { path: 'my-requests', component: MyRequestsComponent },
            { path: 'pending-requests', component: PendingRequestsComponent },
            { path: 'my-visitor-requests', component: MyVisitorRequestsComponent },
            { path: 'visitor-requests', component: VisitorRequestsComponent }
        ]
    }
];