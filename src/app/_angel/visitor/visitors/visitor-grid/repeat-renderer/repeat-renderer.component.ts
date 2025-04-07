import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
    standalone: true,
    imports: [CommonModule, DatePipe, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div *ngIf="value(); else noExit">
            <a class="btn btn-secondary fw-bolder btn-sm p-0 px-3 py-1 w-100" (click)="handleRepeat()">
                <i class="fa-solid fa-repeat"></i>
                {{"Yinele" | translate}}
            </a>
        </div>
        <ng-template #noExit>
            
        </ng-template>
    `,
})
export class RepeatRenderer implements ICellRendererAngularComp {

    value = signal<Date | null>(null);
    rowData: any;
    params!: ICellRendererParams; // context'e ulaşmak için params saklıyoruz

    agInit(params: ICellRendererParams): void {
        this.params = params;  // params'ı sakla
        this.rowData = params.data;
        this.value.set(params.data.Cikis ? new Date(params.data.Cikis) : null);
    }

    refresh(params: ICellRendererParams): boolean {
        this.params = params;
        this.rowData = params.data;
        this.value.set(params.data.Cikis ? new Date(params.data.Cikis) : null);
        return true;
    }

    handleRepeat() {
        if (this.params.context?.handleRepeatButtonClick) {
            this.params.context.handleRepeatButtonClick(this.rowData);
        } else {
            console.warn('handleRepeatButtonClick fonksiyonu context içinde bulunamadı.');
        }
    }
}
