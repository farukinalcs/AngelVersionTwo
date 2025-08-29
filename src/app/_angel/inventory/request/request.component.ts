import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { TranslationModule } from 'src/app/modules/i18n';
import { AccessRoutingModule } from '../../access/access-routing.module';
import { DataNotFoundComponent } from '../../shared/data-not-found/data-not-found.component';
import { ProfileService } from '../../profile/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    CommonModule,
    AccessRoutingModule,
    ReactiveFormsModule,
    CarouselModule,
    ButtonModule,
    DropdownModule,
    CustomPipeModule,
    MatTabsModule,
    MatTooltipModule,
    SelectModule,
    InputIconModule,
    FloatLabelModule,
    IconFieldModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    DataNotFoundComponent,
    InlineSVGModule,
    TranslationModule,
    TooltipModule
  ],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
})
export class RequestComponent implements OnInit {
  private profileService = inject(ProfileService);
  private toastrService = inject(ToastrService);
  private translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  //SIGNALS
  private _inventoryListForZimmet = signal<any[]>([]);
  private _inventoryListForSarf   = signal<any[]>([]);
  private _loading                = signal<boolean>(true);
  private _header                 = signal<string>('');
  private _display                = signal<boolean>(false);
  private _desc                   = signal<any>('');
  private _seriaNo                = signal<any>('');
  private _itemSetForDialog       = signal<any>(null);
  private _type                   = signal<any>(null);
  private _zimmetId               = signal<any>(null);
  private _durum                  = signal<any>(null);

  private _imageUrl = '/api/avatar';
  get imageUrl(): string { return this._imageUrl; }

  get InventoryListForZimmet(): any[] { return this._inventoryListForZimmet(); }
  set InventoryListForZimmet(v: any[]) { this._inventoryListForZimmet.set(v ?? []); }

  get InventoryListForSarf(): any[] { return this._inventoryListForSarf(); }
  set InventoryListForSarf(v: any[]) { this._inventoryListForSarf.set(v ?? []); }

  get loading(): boolean { return this._loading(); }
  set loading(v: boolean) { this._loading.set(!!v); }

  get header(): string { return this._header(); }
  set header(v: string) { this._header.set(v ?? ''); }

  get display(): boolean { return this._display(); }
  set display(v: boolean) { this._display.set(!!v); }

  get desc(): any { return this._desc(); }
  set desc(v: any) { this._desc.set(v); }

  get seriaNo(): any { return this._seriaNo(); }
  set seriaNo(v: any) { this._seriaNo.set(v); }

  get itemSetForDialog(): any { return this._itemSetForDialog(); }
  set itemSetForDialog(v: any) { this._itemSetForDialog.set(v); }

  get type(): any { return this._type(); }
  set type(v: any) { this._type.set(v); }

  get zimmetId(): any { return this._zimmetId(); }
  set zimmetId(v: any) { this._zimmetId.set(v); }

  get durum(): any { return this._durum(); }
  set durum(v: any) { this._durum.set(v); }


  ngOnInit(): void {
    this.getSarf();
    this.getZimmet();
  }


  getZimmet(): void {
    const sp: any[] = [{ mkodu: 'yek394', tip: '1' }];

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

          this.InventoryListForZimmet = [...data];
          this.loading = false;
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

  getSarf(): void {
    const sp: any[] = [{ mkodu: 'yek394', tip: '2' }];

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

          this.InventoryListForSarf = [...data];
          this.loading = false;
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

  openDialog(actionType: any, item?: any) {

    this.type = item?.tip;
    this.itemSetForDialog = item ?? null;
    this.zimmetId = item?.id ?? null;
    this.durum = actionType;

    this.header = actionType === 'i' ? 'Onayla' : 'İptal';
    this.display = true;
  }

  closeAction() {
    this.display = false;
    this.desc = '';
    this.seriaNo = '';
    this.type = '';
    this.itemSetForDialog = null;
    this.header = '';
  }

  addAndCancel(): void {

    const sp: any[] = [];
    const isInsert = this.durum === 'i';

    sp.push({
      mkodu: 'yek396',
      aciklama: this.desc,
      serino: this.seriaNo,
      id: String(this.zimmetId ?? ''),
      tip: isInsert ? '1' : '-1',
    });

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x;
          const message = response?.[0]?.z;

          if (message?.islemsonuc == -1) {
            return;
          }

          // Başarılı
          this.toastrService.success(
            this.translateService.instant('İşlem Başarılı')
          );

          this.getSarf();
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
}
