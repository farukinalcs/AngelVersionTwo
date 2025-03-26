import { Routes } from "@angular/router";
import { DefinitionsComponent } from "./definitions.component";
import { FileTypeComponent } from "./file-type/file-type.component";
import { FoodTypeComponent } from "./food-type/food-type.component";
import { MenuComponent } from "./menu/menu.component";

export const definitionsRoutes: Routes = [
  {
    path: '',
    component: DefinitionsComponent,
    children: [
      { path: 'file-type', component:  FileTypeComponent},
      { path: 'food-type', component: FoodTypeComponent },
      { path: 'menu', component:  MenuComponent},
      { path: '', pathMatch: 'full' },
    ],
  },
];