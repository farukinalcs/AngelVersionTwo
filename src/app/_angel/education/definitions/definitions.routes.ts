import { Routes } from "@angular/router";
import { DefinitionsComponent } from "./definitions.component";
import { EducationAssignmentComponent } from "./education-assignment/education-assignment.component";
import { EducationCategoryComponent } from "./education-category/education-category.component";
import { EducationCreateComponent } from "./education-create/education-create.component";
import { GeneralComponent } from "./general/general.component";

export const definitionsRoutes: Routes = [
  {
    path: '',
    component: DefinitionsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: GeneralComponent,
        data: { breadcrumb: 'Genel' },
      }, // Direkt olarak GeneralComponent yüklensin
      {
        path: 'general',
        component: GeneralComponent,
        data: { breadcrumb: 'Genel' },
      },
      {
        path: 'education-category',
        component: EducationCategoryComponent,
        data: { breadcrumb: 'Kategori Yönetimi' },
      },
      {
        path: 'education-create',
        component: EducationCreateComponent,
        data: { breadcrumb: 'Eğitim Oluşturma' },
      },
      {
        path: 'education-assignment',
        component: EducationAssignmentComponent,
        data: { breadcrumb: 'Eğitim Atama' },
      },
    ],
  },
];