import { Component, Input, TemplateRef } from '@angular/core';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

export interface ColumnDef<T = any> {
  key: string;
  header?: string;
  class?: string;
  headerClass?: string;
  widthPx?: number;
  template?: TemplateRef<any>;   // hücre templateleri
  searchable?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, NgTemplateOutlet],
  template: `
  <div class="table-responsive">
    <table class="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
      <thead>
        <tr class="roundend fs-9 fw-bold text-white border-bottom-0 text-uppercase bg-danger">
          <th *ngFor="let c of columns" [ngClass]="c.headerClass" [style.width.px]="c.widthPx" class="text-center">
            {{ c.header || '' }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let row of rows; trackBy: trackByIndex"
            [ngClass]="getRowClass(row)">
          <td *ngFor="let c of columns" [ngClass]="c.class || 'text-center'">
            <ng-container *ngIf="c.template; else defaultCell"
              [ngTemplateOutlet]="c.template"
              [ngTemplateOutletContext]="{
                $implicit: row,
                value: $any(row)[c.key],
                row: row,
                col: c
              }">
            </ng-container>

            <ng-template #defaultCell>
              {{ $any(row)[c.key] }}
            </ng-template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class AppDataTableComponent<T = any> {
  @Input() columns: ColumnDef<T>[] = [];
  @Input() rows: T[] = [];
  @Input() rowClassFn: ((row: T) => any) | null = null;

  getRowClass(row: T) {
    // null olabilir – güvenli tek noktadan çağır
    return this.rowClassFn ? this.rowClassFn(row) : null;
  }

  trackByIndex = (_: number, __: any) => _;
}
