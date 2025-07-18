import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestMenuComponent } from './request-menu/request-menu.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    declarations: [
        RequestMenuComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule
    ],
    exports: []
})
export class SharedModule { }
