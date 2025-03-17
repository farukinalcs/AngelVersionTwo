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
            {{ value() | date: 'dd-MM-yyyy HH:mm:ss' }}
        </div>
        <ng-template #noExit>
            <a class="btn btn-danger btn-sm p-0 px-3 py-1 w-100" (click)="handleExit()">
                <i class="fa-solid fa-door-open"></i>
                {{"Çıkış Ver" | translate}}
            </a>
        </ng-template>
    `,
})
export class ExitDateRenderer implements ICellRendererAngularComp {

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

    handleExit() {
        if (this.params.context?.handleExitButtonClick) {
            this.params.context.handleExitButtonClick(this.rowData);
        } else {
            console.warn('handleExitButtonClick fonksiyonu context içinde bulunamadı.');
        }
    }
}
