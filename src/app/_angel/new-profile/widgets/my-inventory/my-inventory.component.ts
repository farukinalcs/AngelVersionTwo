import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { InventoryComponent } from '../../request-forms/inventory/inventory.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

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
    FormsModule,
    TableModule,
  ],
  templateUrl: './my-inventory.component.html',
  styleUrl: './my-inventory.component.scss',
})
export class MyInventoryComponent implements OnInit {
  pageSize = 5;
  currentPage = 0;
  zimmetList: any;
  sarfList: any;
  private profileService = inject(ProfileService);
  private toastrService = inject(ToastrService);
  private translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private _header = signal<string>('');
  private _displayMyInventory = signal<boolean>(false);
  private _display = signal<boolean>(false);
  private _desc = signal<any>('');
  private _displayInventoryForm = signal<boolean>(false);
  private _inventoryList = signal<any[]>([]);
  private _itemSetForDialog = signal<any>(null);
  private _loading = signal<boolean>(true);
  get InventoryList(): any[] {
    return this._inventoryList();
  }
  set InventoryList(v: any[]) {
    this._inventoryList.set(v ?? []);
  }
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
  get loading(): boolean {
    return this._loading();
  }
  set loading(v: boolean) {
    this._loading.set(!!v);
  }

  get header(): string {
    return this._header();
  }
  set header(v: string) {
    this._header.set(v ?? '');
  }
  get display(): boolean {
    return this._display();
  }
  set display(v: boolean) {
    this._display.set(!!v);
  }
  get itemSetForDialog(): any {
    return this._itemSetForDialog();
  }
  set itemSetForDialog(v: any) {
    this._itemSetForDialog.set(v);
  }
  get desc(): any {
    return this._desc();
  }
  set desc(v: any) {
    this._desc.set(v);
  }
  ngOnInit(): void {
    this.getZimmet();
  }

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

  get totalPages() {
    return Math.ceil(this.InventoryList.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  getZimmet(): void {
    const sp: any[] = [{ mkodu: 'yek397' }];

    this.loading = true;

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;

          if (message?.islemsonuc == -1) {
            this.loading = false;
            return;
          }

          this.InventoryList = [...data];
          this.zimmetList = this.InventoryList.filter(x => x.tip === 1);
          this.sarfList   = this.InventoryList.filter(x => x.tip === 2);
          this.loading = false;
          console.log('zimmet bilgileri', this.InventoryList);
        },
        error: () => {
          this.loading = false;
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        },
      });
  }

  accceptAndCancel(): void {
    const sp: any[] = [];
    var itemTip: number;
    if (this.header == 'Onayla') {
      itemTip = 1;
    } else {
      itemTip = -1;
    }
    sp.push({
      mkodu: 'yek398',
      tip: String(itemTip),
      id: String(this.itemSetForDialog.id),
      aciklama: this.desc,
    });
    console.log(sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x;
          const message = response?.[0]?.z;

          if (message?.islemsonuc == -1) {
            this.toastrService.error(
              this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
              this.translateService.instant('Hata')
            );
            this.display = false;
            return;
          }

          // Başarılı
          this.toastrService.success(
            this.translateService.instant('İşlem Başarılı')
          );

          this.getZimmet();
          this.closeAction();
        },
        error: () => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        },
      });
  }

  openDialog(actionType: any, item?: any) {
    this.header = actionType === 'e' ? 'Onayla' : 'İptal';
    this.display = true;
    this.itemSetForDialog = item ?? null;
  }

  closeAction() {
    this.display = false;
    this.header = '';
    this.desc = '';
    this.itemSetForDialog = [];
  }
}
