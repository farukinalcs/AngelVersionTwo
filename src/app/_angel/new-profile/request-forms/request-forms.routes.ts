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
    data: { breadcrumb: 'Talep Formları' }, // üst seviye etiket
    children: [
      { path: 'advance',           component: AdvanceComponent,           data: { breadcrumb: 'Avans Talebi' } },
      { path: 'announcement',      component: AnnouncementComponent,      data: { breadcrumb: 'Duyuru' } },
      { path: 'attendance-change', component: AttendanceChangeComponent,  data: { breadcrumb: 'Yoklama Değişikliği' } },
      { path: 'authority',         component: AuthorityComponent,         data: { breadcrumb: 'Yetki Talebi' } },
      { path: 'bulletin',          component: BulletinComponent,          data: { breadcrumb: 'Bülten' } },
      { path: 'expense',           component: ExpenseComponent,           data: { breadcrumb: 'Masraf Talebi' } },
      { path: 'leave',             component: LeaveComponent,             data: { breadcrumb: 'İzin Talebi' } },
      { path: 'overtime',          component: OvertimeComponent,          data: { breadcrumb: 'Fazla Mesai Talebi' } },
      { path: 'shift-change',      component: ShiftChangeComponent,       data: { breadcrumb: 'Vardiya Değişikliği' } },
      { path: 'vehicle',           component: VehicleComponent,           data: { breadcrumb: 'Araç Talebi' } },
      { path: 'visitor',           component: VisitorComponent,           data: { breadcrumb: 'Ziyaretçi Talebi' } },
      { path: 'inventory',         component: InventoryComponent,         data: { breadcrumb: 'Envanter Talebi' } },

      // (opsiyonel) varsayılan sayfa:
      // { path: '', redirectTo: 'advance', pathMatch: 'full' },
    ]
  }
];
