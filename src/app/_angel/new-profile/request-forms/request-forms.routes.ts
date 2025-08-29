import { Routes } from "@angular/router";
import { RequestFormsComponent } from "./request-forms.component";
import { AdvanceComponent } from "./advance/advance.component";
import { AnnouncementComponent } from "./announcement/announcement.component";
import { AttendanceChangeComponent } from "./attendance-change/attendance-change.component";
import { AuthorityComponent } from "./authority/authority.component";
import { BulletinComponent } from "./bulletin/bulletin.component";
import { ExpenseComponent } from "./expense/expense.component";
import { LeaveComponent } from "./leave/leave.component";
import { OvertimeComponent } from "./overtime/overtime.component";
import { ShiftChangeComponent } from "./shift-change/shift-change.component";
import { VehicleComponent } from "./vehicle/vehicle.component";
import { VisitorComponent } from "./visitor/visitor.component";
import { InventoryComponent } from "./inventory/inventory.component";

export const RequestFormsRoutes: Routes = [
    {
        path: '',
        component: RequestFormsComponent,
        children: [
            { path: 'advance', component: AdvanceComponent },
            { path: 'announcement', component: AnnouncementComponent },
            { path: 'attendance-change', component: AttendanceChangeComponent },
            { path: 'authority', component: AuthorityComponent },
            { path: 'bulletin', component: BulletinComponent },
            { path: 'expense', component: ExpenseComponent },
            { path: 'leave', component: LeaveComponent },
            { path: 'overtime', component: OvertimeComponent },
            { path: 'shift-change', component: ShiftChangeComponent },
            { path: 'vehicle', component: VehicleComponent },
            { path: 'visitor', component: VisitorComponent },
            { path: 'inventory', component: InventoryComponent },
        ]
    }
];