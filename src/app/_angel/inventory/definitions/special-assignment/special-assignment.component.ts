import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import {
  PickList,
  PickListModule,
  PickListMoveAllToSourceEvent,
  PickListMoveAllToTargetEvent,
  PickListMoveToSourceEvent,
  PickListMoveToTargetEvent,
} from 'primeng/picklist';
import { SelectModule } from 'primeng/select';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

interface Terminal {
  id: number | string;
  ad: string;
  type?: string;
}
@Component({
  selector: 'app-special-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    SelectModule,
    CustomPipeModule,
    IconFieldModule,
    PickListModule,
    InputTextModule,
    FloatLabel,
  ],
  templateUrl: './special-assignment.component.html',
  styleUrl: './special-assignment.component.scss',
})
export class SpecialAssignmentComponent {
  form: FormGroup;
  assetInventoryList: any[] = [];
  specialAssignmentList: any[] = [];
  crud: any;
  selectedRegistryGroupId: any;
  tabList = [
    {
      id: 1,
      label: this.translateService.instant('Varsayılan Ekipman'),
      source: 'cbo_ziyaretnedeni',
    },
  ];
  cardTitle: any;
  registryGroups: any[] = [];
  private ngUnsubscribe = new Subject();
  @ViewChild('pl') pl!: PickList;

  // Sağ tarafta “Eklenebilir”, solda “Gruptaki” gibi düşünebilirsin:
  available: any[] = [];
  selected: any[] = [];

  // Tek arama kutusuyla iki listeyi de filtreleyelim
  globalFilter = '';
  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAssetList();
    this.getSpecialList();
    this.getRegistryGroups();
    this.crud = this.tabList[0];

    if (this.crud) {
      this.cardTitle =
        this.crud.label + ' ' + this.translateService.instant('Tanım');
    } else {
      console.warn('CRUD verisi bulunamadı.');
    }

    const ctrl = this.form.get('registryGroup');
    ctrl?.setValue(String(ctrl?.value ?? '1'), { emitEvent: false });
    ctrl?.valueChanges
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe((val) => {
        const selectedId = typeof val === 'object' ? val?.id : val;

        this.selectedRegistryGroupId = selectedId;

        this.getSpecialList();
      });
  }
  createForm() {
    this.form = this.fb.group({
      registryGroup: [''],
    });
  }
  getRegistryGroups(groupId?: any): void {
    var sp: any[] = [
      {
        mkodu: 'yek326',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        const data = res[0].x;
        const message = res[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.registryGroups = [...data];
      });
  }

  getAssetList() {
    var sp: any[] = [
      {
        mkodu: 'yek385',
        id: '0',
        tip: '1',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          console.log('organizasyon listesi geldi: ', data);

          this.assetInventoryList = [...data];
          this.reconcileLists();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  getSpecialList(sicilgrup?: any) {
    var sp: any[] = [
      {
        mkodu: 'yek389',
        sicilgrup: String(this.selectedRegistryGroupId),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          console.log('Sicil Ekli listesi geldi: ', data);

          this.specialAssignmentList = [...data];
          this.reconcileLists();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  saveSpecialList() {
    const selectedGroup = this.form.get('registryGroup')?.value;
    var req: any[] = [
      {
        mkodu: 'yek385',
        sicilId: selectedGroup.id,
        spList: this.specialAssignmentList,
      },
    ];
  }

  private reconcileLists(): void {
    if (!this.assetInventoryList) this.assetInventoryList = [];
    if (!this.specialAssignmentList) this.specialAssignmentList = [];
    const specialAssetIds = new Set(
      this.specialAssignmentList
        .map((x) => (x.zimmetid ?? x.assetId ?? x.cihazid ?? x.id)?.toString())
        .filter(Boolean)
    );

    this.available = this.assetInventoryList.filter(
      (a) => !specialAssetIds.has((a.id ?? a.assetId ?? a.cihazid)?.toString())
    );
  }

  handleMoveToTarget(e: PickListMoveToTargetEvent) {
    //çıkar
    const movedIds = e.items?.map((x: any) => x.zimmetid) ?? [];
    let sp: any[] = [];

    movedIds.forEach((id) => {
      sp.push({
        mkodu: 'yek390',
        sicilgrup: String(this.selectedRegistryGroupId),
        zimmetid: String(id),
      });
    });
    this.delete(sp);
  }

  handleMoveToSource(e: PickListMoveToSourceEvent) {
    // ekle
    const movedIds = e.items?.map((x: any) => x.id) ?? [];

    let sp: any[] = [];

    movedIds.forEach((id) => {
      sp.push({
        mkodu: 'yek388',
        sicilgrup: String(this.selectedRegistryGroupId),
        zimmetid: String(id),
      });
    });

    if (this.selectedRegistryGroupId == null) {
      this.toastrService.error('Sicil Grubu Seçiniz');
      this.specialAssignmentList = [];
      this.getAssetList();
      return;
    } else {
      this.add(sp);
    }
  }

  handleMoveAllToTarget(e: PickListMoveAllToTargetEvent) {
    //hepsini çıkar
    const movedIds = e.items?.map((x: any) => x.zimmetid) ?? [];

    let sp: any[] = [];

    movedIds.forEach((id) => {
      sp.push({
        mkodu: 'yek390',
        sicilgrup: String(this.selectedRegistryGroupId),
        zimmetid: String(id),
      });
    });

    this.delete(sp);
  }

  handleMoveAllToSource(e: PickListMoveAllToSourceEvent) {
    //hepsini ekle
    const movedIds = e.items?.map((x: any) => x.id) ?? [];
    let sp: any[] = [];

    movedIds.forEach((id) => {
      sp.push({
        mkodu: 'yek388',
        sicilgrup: String(this.selectedRegistryGroupId),
        zimmetid: String(id),
      });
    });

    if (this.selectedRegistryGroupId == null) {
      this.toastrService.error('Sicil Grubu Seçiniz');
      this.specialAssignmentList = [];
      this.getAssetList();
      return;
    } else {
      this.add(sp);
    }
  }

  add(sp: any) {
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          this.toastrService.success(
            this.crud.label + ' ' + this.translateService.instant('Eklendi'),
            this.translateService.instant('Başarılı')
          );

          this.getSpecialList();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  delete(sp: any) {
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          this.toastrService.success(
            this.crud.label + ' ' + this.translateService.instant('Silindi'),
            this.translateService.instant('Başarılı')
          );

          this.getSpecialList();
          this.getAssetList();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }
}
