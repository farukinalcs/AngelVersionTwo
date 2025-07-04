import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';

@Component({
    selector: 'app-image-tooltip-renderer',
    standalone: true,
    imports: [CommonModule, PopoverModule],
    template: `
    <div class="img-wrapper" style="display:flex; align-items:center; justify-content:center;">
      <img
        [src]="imageUrl"
        alt="Küçük Foto"
        width="23"
        height="23"
        style="border-radius: 4px; object-fit: cover; cursor: pointer;"
        (mouseenter)="popover.show($event)"
        (mouseleave)="popover.hide()"
      />

      <p-popover #popover [dismissable]="false" [showCloseIcon]="false" [style]="{ padding: '4px' }">
        <img
          [src]="imageUrl"
          alt="Büyük Foto"
          width="110"
          height="110"
          style="border-radius: 5px; object-fit: cover;"
        />
      </p-popover>
    </div>
  `
})
export class ImageTooltipRendererComponent implements ICellRendererAngularComp {
    imageUrl: string = '';
    @ViewChild('popover') popover!: any;

    agInit(params: any): void {
        if (params?.data?.Id) {
            this.imageUrl = `${params.context.imageBaseUrl}?sicilid=${params.data.Id}`;
        }
    }

    refresh(): boolean {
        return false;
    }
}
