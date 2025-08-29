import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { InventoryComponent } from '../../request-forms/inventory/inventory.component';

@Component({
  selector: 'app-my-inventory',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    DialogModule,
    CarouselModule,
    InventoryComponent,
  ],
  templateUrl: './my-inventory.component.html',
  styleUrl: './my-inventory.component.scss',
})
export class MyInventoryComponent {
  private _displayMyInventory = signal<boolean>(false);
  private _displayInventoryForm = signal<boolean>(false);
  private _items = signal<any[]>([
    { anaBaslik: 'İK', altBaslik: 'Bilgisayar', aldim: '1' },
    { anaBaslik: 'IT', altBaslik: 'Monitör', aldim: '0' },
    { anaBaslik: 'Teknik', altBaslik: 'Pil', aldim: '-1' },
  ]);
  private _test = signal<any[]>([
    {
      ad: 'soy',
      soyad: 'ad',
      desc: 'adam',
    },
    {
      ad: 'soy',
      soyad: 'ad',
      desc: 'adam',
    },
    {
      ad: 'soy',
      soyad: 'ad',
      desc: 'adam',
    },
  ]);

  get displayMyInventory(): boolean {
    return this._displayMyInventory();
  }
  set displayMyInventory(v: boolean) {
    this._displayMyInventory.set(!!v);
  }

  get displayInventoryForm(): boolean {
    return this._displayInventoryForm();
  }
  set displayInventoryForm(v: boolean) {
    this._displayInventoryForm.set(!!v);
  }

  get items(): any[] {
    return this._items();
  }
  set items(v: any[]) {
    this._items.set(v ?? []);
  }

  ngOnInit(): void {}

  showMyInventory() {
    this.displayMyInventory = true;
  }

  displayInventory(event?: boolean) {
    if (typeof event === 'boolean') {
      this.displayInventoryForm = event;
    } else {
      this.displayInventoryForm = !this.displayInventoryForm;
    }
  }
}
