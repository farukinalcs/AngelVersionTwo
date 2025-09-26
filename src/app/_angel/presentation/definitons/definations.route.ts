import { Routes } from "@angular/router";
import { ProductComponent } from "./product/product.component";
import { GeneralComponent } from "./general/general.component";
import { DefinitonsComponent } from "./definitons.component";

export const definitionsRoutes: Routes = [
  {
    path: '',
    component: DefinitonsComponent,
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
        path: 'product',
        component: ProductComponent,
        data: { breadcrumb: 'Ürün' },
      },
    ],
  },
];
