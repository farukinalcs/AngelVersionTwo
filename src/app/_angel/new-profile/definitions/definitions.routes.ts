import { Routes } from "@angular/router";
import { DefinitionsComponent } from "./definitions.component";
import { FileTypeComponent } from "./file-type/file-type.component";
import { FoodTypeComponent } from "./food-type/food-type.component";
import { MenuComponent } from "./menu/menu.component";

export const definitionsRoutes: Routes = [
  {
    path: '',
    component: DefinitionsComponent,
    // Üst seviye 'profile/definitions' zaten breadcrumb: 'Tanımlar'
    children: [
      { path: 'file-type', component: FileTypeComponent, data: { breadcrumb: 'Dosya Tipleri' } },
      { path: 'food-type', component: FoodTypeComponent, data: { breadcrumb: 'Yemek Türleri' } },
      { path: 'menu',      component: MenuComponent,     data: { breadcrumb: 'Menü' } },
      // { path: '', redirectTo: 'file-type', pathMatch: 'full' },
    ],
  },
];
