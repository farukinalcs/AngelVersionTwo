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
        <!--
        <div *ngIf="value(); else noExit">
            {{ value() | date: 'dd-MM-yyyy HH:mm:ss' }}
        </div>
        <ng-template #noExit>
            <a class="btn btn-danger btn-sm p-0 px-3 w-100" (click)="handleClick()">
                <i class="fa-solid fa-trash"></i>
                {{"Sil" | translate}}
            </a>
        </ng-template>
        -->

        <a class="btn btn-danger btn-sm p-0 px-3 py-1 w-100" (click)="handleClick()">
            <i class="fa-solid fa-trash"></i>
            {{"Sil" | translate}}
        </a>
        
    `,
})

export class DeleteVisitor implements ICellRendererAngularComp {

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

    handleClick() {
        if (this.params.context?.handleDeleteButtonClick) {
            this.params.context.handleDeleteButtonClick(this.rowData);
        } else {
            console.warn('handleDeleteButtonClick fonksiyonu context içinde bulunamadı.');
        }
    }
}