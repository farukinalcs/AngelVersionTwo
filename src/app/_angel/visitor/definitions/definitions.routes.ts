import { Routes } from "@angular/router";
import { DefinitionsComponent } from "./definitions.component";
import { GeneralComponent } from "./general/general.component";
import { FormFieldsComponent } from "./form-fields/form-fields.component";
import { VisitReasonComponent } from "./visit-reason/visit-reason.component";
import { CustomCodeComponent } from "./custom-code/custom-code.component";
import { CustomCodeAssignmentComponent } from "./custom-code-assignment/custom-code-assignment.component";

export const definitionsRoutes: Routes = [
    {
      path: '',
      component: DefinitionsComponent,
      children: [
        { path: '', pathMatch: 'full', component: GeneralComponent }, // Direkt olarak GeneralComponent yüklensin
        { path: 'general', component: GeneralComponent },
        { path: 'form-fields', component: FormFieldsComponent },
        { path: 'visit-reason', component: VisitReasonComponent },
        { path: 'custom-code', component: CustomCodeComponent },
        { path: 'custom-code-assignment', component: CustomCodeAssignmentComponent },
      ],
    },
];
  
  