import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { AccessdashboardComponent } from './accessdashboard/accessdashboard.component';
import { TerminalComponent } from './terminal/terminal.component';
import { GecisgruplariComponent } from './gecisgruplari/gecisgruplari.component';
import { TanimlamalarComponent } from './tanimlamalar/tanimlamalar.component';
import { RaporlarComponent } from './raporlar/raporlar.component';
import { AccessDataWidgetComponent } from './access-data-widget/access-data-widget.component';


const routes: Routes = [
  {
    path: '',
    component: AccessdashboardComponent,
    // children: [
    //   {
    //     path: 'sicil_liste',
    //     component: SicillisteComponent,
    //   },
    //   {
    //     path: 'terminal',
    //     component: TerminalComponent,
    //   },
    //   {
    //     path: 'gecis_gruplari',
    //     component: GecisgruplariComponent,
    //   },
    //   {
    //     path: 'tanimlamalar',
    //     component: TanimlamalarComponent,
    //   },
    //   {
    //     path: 'raporlar',
    //     component: RaporlarComponent,
    //   },
    //   { path: '', redirectTo: '', pathMatch: 'full' },
    //   { path: '**', redirectTo: '', pathMatch: 'full' },
    // ],
  },
  {
    path: 'terminal',
    component: TerminalComponent,
  },
  {
    path: 'gecis_gruplari',
    component: GecisgruplariComponent,
  },
  {
    path: 'tanimlamalar',
    component: TanimlamalarComponent,
  },
  {
    path: 'raporlar',
    component: RaporlarComponent,
  },
];


@NgModule({
  // declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ], exports: [RouterModule],
})
export class AccessRoutingModule { }
