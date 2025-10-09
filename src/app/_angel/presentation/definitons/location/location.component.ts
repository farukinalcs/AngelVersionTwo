import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, map, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { AG_GRID_LOCALE_TR } from '@ag-grid-community/locale';
import {
  ColDef,
  ColGroupDef,
  GridApi,
  ColumnApi,
  SideBarDef,
  StatusPanelDef,
  RowHeightParams,
  GridOptions,
} from 'ag-grid-enterprise';
import {
  FilterChangedEvent,
  FilterModifiedEvent,
  FilterOpenedEvent,
  GridReadyEvent,
} from 'ag-grid-community';

import { Store } from '@ngrx/store';
import {
  loadRegistersFailure,
  loadRegistersSuccess,
} from 'src/app/store/actions/register.action';
import { Register } from 'src/app/store/models/register.state';
import { selectAllRegisters } from 'src/app/store/selectors/register.selector';

import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { AttendanceService } from 'src/app/_angel/attendance/attendance.service';
import { RegistryFilterComponent } from 'src/app/_angel/shared/registry-list/registry-filter/registry-filter.component';
import { OrganizationColumnFilterComponent } from 'src/app/_angel/attendance/organization-column-filter/organization-column-filter.component';
import { ConfirmationService } from 'src/app/core/permission/services/core/services/confirmation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    AgGridModule,
    RegistryFilterComponent,
  ],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private profileService: ProfileService,
    private themeModeService: ThemeModeService,
    private attendanceService: AttendanceService,
    private ref: ChangeDetectorRef,
    private registerStore: Store,
    private confirmationService: ConfirmationService
  ) {}

  tabList = [
        { name: 'Lokasyon Atanmışlar', type: '0' },
    { name: 'Atanmamışlar', type: '1' },

  ];
  selectedTab = this.tabList[0];

  locations: any[] = [];
  selectedLocation: number | null = 1;


  activeTheme: 'light' | 'dark' = 'light';


  @ViewChild('agGrid', { static: false }) agGrid!: AgGridAngular;
  gridApi!: GridApi;
  columnApi!: ColumnApi;

  gridHeight = '80vh';
  gridStyle: any = { height: this.gridHeight, flex: '1 1 auto' };

  public defaultColDef: ColDef = {
    minWidth: 70,
    filter: false,
    floatingFilter: true,
    sortable: true,
    resizable: true,
    editable: false,
    menuTabs: [],
  };
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      'filters',
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
    ],
  };
  public rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' = 'always';
  public statusBar: { statusPanels: StatusPanelDef[] } = {
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agTotalRowCountComponent', align: 'center' },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '#',
      colId: 'checkbox',
      pinned: 'left',
      minWidth: 30,
      maxWidth: 30,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      filter: false,
      checkboxSelection: true,
      hide: false,
    },


    {
      headerName: 'Kişi Bilgileri',
      marryChildren: true,
      groupId: 'PersonInfoGroup',
      headerClass: 'person-group',
      hide: false,
      children: [
        {
          headerName: 'SID',
          field: 'Id',
          type: 'numericColumn',
          filter: false,
          hide: false,
        },
        {
          headerName: 'Sicil No',
          field: 'sicilno',
          filter: 'agTextColumnFilter',
          hide: false,
        },
        {
          headerName: 'Ad',
          field: 'ad',
          filter: 'agTextColumnFilter',
          hide: false,
        },
        {
          headerName: 'Soyad',
          field: 'soyad',
          filter: 'agTextColumnFilter',
          hide: false,
        },
        {
          headerName: 'Personel No',
          field: 'personelno',
          type: 'numericColumn',
          filter: false,
          hide: false,
        },
      ],
    },

    {
      headerName: 'Organizasyon Bilgileri',
      headerClass: 'organization-group',
      marryChildren: true,
      groupId: 'organizationGroup',
      hide: false,
      children: [
        {
          colId: 'cbo_firma',
          headerName: 'Firma',
          field: 'firmaad',
          headerTooltip: 'Firma Adı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_altfirma',
          headerName: 'Alt Firma',
          field: 'altfirmaad',
          headerTooltip: 'Alt Firma Adı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_yaka',
          headerName: 'Yaka',
          field: 'yakaad',
          headerTooltip: 'Yaka Adı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_bolum',
          headerName: 'Bölüm',
          field: 'bolumad',
          headerTooltip: 'Bölüm Adı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_gorev',
          headerName: 'Görev',
          field: 'gorevad',
          headerTooltip: 'Görev Adı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_pozisyon',
          headerName: 'Pozisyon',
          field: 'pozisyonad',
          headerTooltip: 'Pozisyon Adı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_direktorluk',
          headerName: 'Direktörlük',
          field: 'direktorlukad',
          headerTooltip: 'Direktörlük Adı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
      ],
    },

    {
      headerName: 'Diğer Bilgiler',
      headerClass: 'other-group',
      marryChildren: true,
      groupId: 'otherGroup',
      hide: false,
      children: [
        {
          colId: 'cbo_mesaiperiyodlari',
          headerName: 'Mesai Periyodu',
          field: 'mesaiperiyoduad',
          headerTooltip: 'Mesai Periyodu',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'sys_userdef',
          headerName: 'Kimlik Tanımı',
          field: 'userdefad',
          headerTooltip: 'Kimlik Tanımı',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'Yetki',
          headerName: 'Geçiş Yetkileri',
          field: 'yetkistrad',
          headerTooltip: 'Geçiş Yetkileri',
          rowGroup: false,
          enableRowGroup: true,
          hide: false,
          filter: OrganizationColumnFilterComponent,
        },
        {
          headerName: 'Kart No',
          field: 'cardID',
          headerTooltip: 'Kart No',
          filter: 'agTextColumnFilter',
          hide: false,
        },
        {
          headerName: 'Kantin Kredi',
          field: 'credit',
          headerTooltip: 'Kantin Kredi',
          filter: false,
          hide: false,
          valueFormatter: (p) => (p.value ? `${p.value} TL` : '0 TL'),
        },
        {
          headerName: 'İndirim Oranı',
          field: 'indirimorani',
          headerTooltip: 'İndirim Oranı',
          filter: false,
          hide: false,
          valueFormatter: (p) => (p.value ? `%${p.value}` : '%0'),
        },
      ],
    },
  ];

  rowData$ = this.registerStore.select(selectAllRegisters);

  displayFilterModal = false;
  filterFromModal = false;
  filterValueFromModal: { formValues: any } = { formValues: null };
  requestTime: any;
  loading = false;

  gridOptions: GridOptions = {
    localeText: AG_GRID_LOCALE_TR,
  };

  ngOnInit(): void {
    this.getTheme();
    this.getLocationList();
    this.getRegistryList(); 
  }

  ngAfterViewInit(): void {}

  getTheme() {
    this.themeModeService.mode
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((mode: any) => {
        this.changeTheme(mode);
      });
  }
  changeTheme(theme: 'light' | 'dark') {
    this.activeTheme = theme;
  }

  private get activeFlag(): '0' | '1' {
    return this.selectedTab.type === '1' ? '0' : '1';
  }

  changeTabMenu(menu: any) {
    this.selectedTab = menu;
    this.getRegistryList();
  }

  refreshByControls() {
    this.getRegistryList();
  }

  getLocationList() {
    const sp: any[] = [{ mkodu: 'yek041', kaynak: 'lokasyon', id: '0' }];
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          if (response?.[0]?.z?.islemsonuc === -1) return;
          this.locations = data; // [{id, ad}]
        },
        error: (err) => console.error(err),
      });
  }

  getRegistryList() {
    this.loading = true;

    const baseParamsFromGrid = !this.filterFromModal
      ? {
          ad: savedFilterModel?.ad?.filter || '',
          soyad: savedFilterModel?.soyad?.filter || '',
          sicilno: savedFilterModel?.sicilno?.filter || '',
          personelno: savedFilterModel?.personelno?.filter || '',
          firma: savedFilterModel?.cbo_firma?.toString() || '0',
          bolum: savedFilterModel?.cbo_bolum?.toString() || '0',
          pozisyon: savedFilterModel?.cbo_pozisyon?.toString() || '0',
          gorev: savedFilterModel?.cbo_gorev?.toString() || '0',
          altfirma: savedFilterModel?.cbo_altfirma?.toString() || '0',
          yaka: savedFilterModel?.yaka?.toString() || '0',
          direktorluk: savedFilterModel?.cbo_direktorluk?.toString() || '0',
          mesaiperiyodu:
            savedFilterModel?.cbo_mesaiperiyodlari?.toString() || '0',
        }
      : {
          ad: this.filterValueFromModal.formValues?.name || '',
          soyad: this.filterValueFromModal.formValues?.surname || '',
          sicilno:
            this.filterValueFromModal.formValues?.registrationNumber || '',
          personelno: savedFilterModel?.personelno?.filter || '',
          firma: this.filterValueFromModal.formValues?.company || '0',
          bolum: this.filterValueFromModal.formValues?.department || '0',
          pozisyon: this.filterValueFromModal.formValues?.position || '0',
          gorev: this.filterValueFromModal.formValues?.job || '0',
          altfirma: this.filterValueFromModal.formValues?.subcompany || '0',
          yaka: this.filterValueFromModal.formValues?.collar || '0',
          direktorluk:
            this.filterValueFromModal.formValues?.directorship || '0',
          mesaiperiyodu:
            savedFilterModel?.cbo_mesaiperiyodlari?.toString() || '0',
        };

    const sp: any[] = [
      {
        mkodu: 'yek439',
        id: '0',
        ...baseParamsFromGrid,
        aktif: this.activeFlag, 
        lokasyon: (this.selectedLocation ?? '0').toString(),
      },
    ];

    console.log('Sicil Params (yek439): ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          const data = response?.[0]?.x ?? [];
          const message = response?.[0]?.z;
          if (message?.islemsonuc === -1) {
            this.loading = false;
            return;
          }
          console.log(data);

          this.requestTime = data?.[0]?.zaman?.replace?.('T', ' ');
        
          this.registerStore.dispatch(
            loadRegistersSuccess({ registers: data })
          );
          this.loading = false;
          this.ref.detectChanges();
        },
        error: (error: any) => {
          this.registerStore.dispatch(loadRegistersFailure({ error }));
          this.loading = false;
        },
      });
  }


  onGridReadyLight(params: GridReadyEvent) {
    if (this.activeTheme === 'light') {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      setTimeout(() => {
        this.autoSizeAllColumns();
      }, 100);
    }
  }
  get isAssigned(): boolean {
    return this.selectedTab?.type === '0';
  }
  get isUnassigned(): boolean {
    return this.selectedTab?.type === '1';
  }
  getContextMenuItems(params: any) {
    return [
      'copy',
      'copyWithHeaders',
      'paste',
      'separator',
      {
        name: 'Export',
        icon: '<span class="ag-icon ag-icon-save" unselectable="on" role="presentation"></span>',
        subMenu: [
          {
            name: 'CSV Export',
            action: () => {
              params.context.component.helper.exportData(
                params.context.component,
                { exportMode: 'csv' }
              );
            },
          },
          {
            name: 'Excel Export (.xlsx)',
            action: () => {
              console.log(
                'params.context this.gridApi',
                params.context.component.gridApi
              );
              params.context.component.helper.exportData(
                params.context.component,
                { exportMode: 'xlsx' }
              );
            },
          },
          {
            name: 'Excel Export (.xml)',
            action: () => {
              params.context.component.helper.exportData(
                params.context.component,
                { exportMode: 'xlsx.xml' }
              );
            },
          },
        ],
      },
    ];
  }
  getRowHeight(params: RowHeightParams): number | undefined | null {
    return params?.data?.rowHeight;
  }
  onGridReadyDark(params: GridReadyEvent) {
    if (this.activeTheme === 'dark') {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      setTimeout(() => {
        this.autoSizeAllColumns();
      }, 100);
    }
  }
  autoSizeAllColumns() {
    if (!this.columnApi) return;
    const ids = (this.columnApi.getAllDisplayedColumns() || []).map((c) =>
      c.getColId()
    );
    if (ids.length) this.columnApi.autoSizeColumns(ids, false);
  }

  onFilterChanged(e: FilterChangedEvent) {
    if (this.gridApi) {
      savedFilterModel = this.gridApi.getFilterModel();
      this.getRegistryList();
    }
  }

  onSelectionChangedLight() {
    const selectedRows = this.gridApi?.getSelectedRows?.() || [];
    this.attendanceService.setSelectedItems(selectedRows);
  }
  onRowClicked(ev: any) {
    console.log('row clicked', ev?.data);
  }

  // 🔸 Filtre Kartı (modal)
  openFilterModal() {
    this.displayFilterModal = true;
  }
  onHideFilterModal() {
    this.displayFilterModal = false;
  }
  setFilterFormFromModal(value: { formValues: any }) {
    this.filterValueFromModal = value;
    this.filterFromModal = true;
    this.onHideFilterModal();
    this.getRegistryList();
  }

  clearFilters() {
    this.gridApi?.setFilterModel?.(null);
    this.filterFromModal = false;
    this.filterValueFromModal = { formValues: null };
    this.getRegistryList();
  }

  // Actions
  addItem() {
    const selected = this.gridApi?.getSelectedRows?.() ?? [];
    if (!selected.length) {
      this.confirmationService.error(
        'Lütfen eklemek için en az bir satır seçin.'
      );
      return;
    }
    if (!this.selectedLocation) {
      this.confirmationService.error('Lütfen lokasyon seçiniz.');
      return;
    }

    const count = selected.length;
    const ids = selected.map((r) => this.getRowId(r));
    const label =
      count === 1
        ? selected[0]?.ad ?? selected[0]?.sicilno ?? `ID: ${ids[0]}`
        : `${count} kayıt`;

    this.confirmationService
      .confirmAction(`${label} eklensin mi?`)
      .then((result: any) => {
        if (result.isConfirmed) {
          const sp: any[] = ids.map((id) => ({
            mkodu: 'yek437',
            modul: 'dagitim',
            lokasyonid: String(this.selectedLocation),
            sicilid: id,
          }));
          console.log('ADD SP ->', sp);

          this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
              next: (response: any) => {
                const ok = Array.isArray(response)
                  ? response.every((r: any) => r?.z?.islemsonuc !== -1)
                  : response?.[0]?.z?.islemsonuc !== -1;

                if (!ok) {
                  this.confirmationService.error(
                    'Ekleme işleminde hata oluştu.'
                  );
                  return;
                }

                this.confirmationService.success(
                  count === 1 ? 'Kayıt eklendi' : `${count} kayıt eklendi`
                );
                this.getRegistryList();
              },
              error: () =>
                this.confirmationService.error(
                  'Ekleme sırasında bir hata oluştu.'
                ),
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.confirmationService.error('İşlem yapmaktan vazgeçildi!');
        }
      });
  }
  private getRowId(row: any): string {
    return String(row?.id ?? row?.Id ?? row?.ID);
  }

  private getLokasyonSicilId(row: any): string | null {
    const v =
      row?.lokasyonsicilid ??
      row?.lokasyonSicilId ??
      row?.LokasyonSicilId ??
      row?.LokasyonSicilID ??
      null;
    return v != null ? String(v) : null;
  }

  deleteSelected() {
    const selected = this.gridApi?.getSelectedRows?.() ?? [];
    if (!selected.length) {
      this.confirmationService.error(
        'Lütfen silmek için en az bir satır seçin.'
      );
      return;
    }

    const ids = Array.from(
      new Set(
        selected
          .map((r) => this.getLokasyonSicilId(r))
          .filter((x): x is string => !!x)
      )
    );

    if (!ids.length) {
      this.confirmationService.error(
        'Seçilen satırlarda lokasyonsicilid bulunamadı.'
      );
      return;
    }

    const label =
      ids.length === 1
        ? selected[0]?.ad ??
          selected[0]?.sicilno ??
          `LokasyonSicilId: ${ids[0]}`
        : `${ids.length} kayıt`;

    this.confirmationService.confirmDelete(label).then((result: any) => {
      if (result.isConfirmed) {
        const sp: any[] = ids.map((lokasyonsicilid) => ({
          mkodu: 'yek436',
          lokasyonsicilid,
        }));
        console.log('DELETE SP ->', sp);

        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (response: any) => {
              const ok = Array.isArray(response)
                ? response.every((r: any) => r?.z?.islemsonuc !== -1)
                : response?.[0]?.z?.islemsonuc !== -1;

              if (!ok) {
                this.confirmationService.error('Silme işleminde hata oluştu.');
                return;
              }

              this.confirmationService.success(
                ids.length === 1
                  ? 'Kayıt kaldırıldı'
                  : `${ids.length} kayıt kaldırıldı`
              );
              this.getRegistryList();
            },
            error: () =>
              this.confirmationService.error(
                'Silme sırasında bir hata oluştu.'
              ),
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.confirmationService.error('İşlem yapmaktan vazgeçildi!');
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

var savedFilterModel: any = null;
