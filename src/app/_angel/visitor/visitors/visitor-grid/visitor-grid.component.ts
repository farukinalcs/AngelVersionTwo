import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, ColGroupDef, ColumnApi, GridApi, GridOptions, ICellRendererParams, IRowNode, IsRowSelectable, RowHeightParams, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { ExitDateRenderer } from './exit-date-renderer/exit-date-renderer.component';
import { FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, GridReadyEvent } from 'ag-grid-community';
import { OrganizationColumnFilterComponent } from 'src/app/_angel/attendance/organization-column-filter/organization-column-filter.component';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
  selector: 'app-visitor-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule],
  templateUrl: './visitor-grid.component.html',
  styleUrl: './visitor-grid.component.scss'
})
export class VisitorGridComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() selectedTab: any = {};
  @ViewChild('agGridLight', { static: false }) agGridLight: AgGridAngular;
  @ViewChild('agGridDark', { static: false }) agGridDark: AgGridAngular;
  gridHeight = '80vh';
  gridStyle: any = {
    height: this.gridHeight,
    flex: '1 1 auto',
  };
  public defaultColDef: ColDef = {
    minWidth: 70,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
    editable: false,
    menuTabs: ['filterMenuTab'],
  };
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public isRowSelectable: IsRowSelectable = (params: IRowNode<any>) => {
    return !!params.data && params.data.year >= 2012;
  };
  public rowData: any[] = [];
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
  public statusBar: { statusPanels: StatusPanelDef[]; } = {
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agTotalRowCountComponent', align: 'center' },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  };
  gridOptions: GridOptions = {
    context: {
      handleExitButtonClick: this.handleExitButtonClick.bind(this)
    }
  };
  public columnDefs: (ColDef | ColGroupDef)[];
  loading: boolean = false;
  filterFromModal: boolean = false;
  savedFilterModel: any;

  activeTheme: 'light' | 'dark' = 'light'; // Varsayılan tema
  gridApi!: GridApi;
  columnApi!: ColumnApi;
  isDarkMode = false; // Varsayılan olarak light mode
  
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private themeModeService: ThemeModeService
  ) { }

  ngOnInit(): void {
    this.columnDefs = [
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
      //Kişi Bilgileri
      {
        headerName: this.translateService.instant('Kişi_Bilgileri'),
        marryChildren: true,
        headerClass: 'person-group',
        groupId: 'PersonInfoGroup',
        hide: false,
        children: [
          {
            headerName: this.translateService.instant('SID'),
            field: 'Id',
            headerTooltip: this.translateService.instant('Sicil_Id'),
            type: 'numericColumn',
            filter: false,
            hide: false,
            minWidth: 40
          },
          {
            headerName: this.translateService.instant('Ad'),
            field: 'Ad',
            headerTooltip: this.translateService.instant('Ad'),
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['reset', 'apply'],
              textMatcher: ({ filterOption, value, filterText }: {
                filterOption: string;
                value: string;
                filterText: string;
              }) => {
                return true;
              },
            },
            // cellClass: (params) => this.applyLinkClass(),
            hide: false,
            // onCellDoubleClicked: (params) => this.clickedRegistry(params)
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Soyad'),
            field: 'Soyad',
            headerTooltip: this.translateService.instant('Soyad'),
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['reset', 'apply'],
              textMatcher: ({ filterOption, value, filterText }: {
                filterOption: string;
                value: string;
                filterText: string;
              }) => {
                return true;
              },
            },
            hide: false,
            minWidth: 60
          }
        ],
      },

      //Ziyaret Bilgileri
      {
        headerName: this.translateService.instant('Ziyaret_Bilgileri'),
        headerClass: 'organization-group',
        marryChildren: true,
        groupId: 'organizationGroup',
        hide: false,
        children: [
          {
            colId: 'Firma',
            headerName: this.translateService.instant('Firma'),
            field: 'Firma',
            headerTooltip: this.translateService.instant('Firma_Adı'),
            rowGroup: false,
            enableRowGroup: true,
            hide: false,
            filter: 'agTextColumnFilter',
            minWidth: 60
          },
          {
            colId: 'Kimlikno',
            headerName: this.translateService.instant('Kimlik No'),
            field: 'Kimlikno',
            headerTooltip: this.translateService.instant('Kimlik No'),
            rowGroup: false,
            enableRowGroup: true,
            hide: false,
            filter: 'agTextColumnFilter',
            minWidth: 60
          },
          {
            colId: 'cbo_ziyaretnedeni',
            headerName: this.translateService.instant('Ziyaret Nedeni'),
            field: 'ZiyaretNedeni',
            headerTooltip: this.translateService.instant('Ziyaret Nedeni'),
            rowGroup: false,
            enableRowGroup: true,
            hide: false,
            filter: OrganizationColumnFilterComponent,
            minWidth: 60
          },
          {
            colId: 'Sicilid1adsoyad',
            headerName: this.translateService.instant('Kime Geldi'),
            field: 'Sicilid1adsoyad',
            headerTooltip: this.translateService.instant('Kime Geldi'),
            rowGroup: false,
            enableRowGroup: true,
            hide: false,
            filter: 'agTextColumnFilter',
            minWidth: 60
          },
          {
            colId: 'sicilid3adsoyad',
            headerName: this.translateService.instant('Personel'),
            field: 'sicilid3adsoyad',
            headerTooltip: this.translateService.instant('Personel'),
            rowGroup: false,
            enableRowGroup: true,
            hide: false,
            filter: 'agTextColumnFilter',
            minWidth: 60
          },

        ],
      },

      // Diğer Bilgileri
      {
        headerName: this.translateService.instant('Diğer_Bilgiler'),
        marryChildren: true,
        headerClass: 'other-group',
        groupId: 'otherGroup',
        hide: false,
        children: [
          {
            headerName: this.translateService.instant('Kart'),
            field: 'kart',
            headerTooltip: this.translateService.instant('Kart'),
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['reset', 'apply'],
              textMatcher: ({ filterOption, value, filterText }: {
                filterOption: string;
                value: string;
                filterText: string;
              }) => {
                return true;
              },
            },
            hide: false,
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Son Geçiş Noktası'),
            field: 'songecisnoktasi',
            headerTooltip: this.translateService.instant('Son Geçiş Noktası'),
            filter: false,
            hide: false,
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Plaka'),
            field: 'Plaka',
            headerTooltip: this.translateService.instant('Plaka'),
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['reset', 'apply'],
              textMatcher: ({ filterOption, value, filterText }: {
                filterOption: string;
                value: string;
                filterText: string;
              }) => {
                return true;
              },
            },
            hide: false,
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Giriş Tarihi'),
            field: 'Giris',
            headerTooltip: this.translateService.instant('Giriş Tarihi'),
            filter: false,
            hide: false,
            valueFormatter: (params) => {
              if (params.value) {
                  const date = new Date(params.value);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  const seconds = String(date.getSeconds()).padStart(2, '0');
                  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
              }
              return '';
            },
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Çıkış Tarihi'),
            field: 'Cikis',
            headerTooltip: this.translateService.instant('Çıkış Tarihi'),
            filter: false,
            hide: false,
            cellRendererSelector: (params: ICellRendererParams<any>) => {
              const exitSystem = {
                component: ExitDateRenderer,
                params: {
                  data: params.data,
                },
              };
              return exitSystem
            },
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Yinele'),
            field: 'cikis',
            headerTooltip: this.translateService.instant('Yinele'),
            filter: false,
            hide: false,
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Kaydeden'),
            field: 'kaydeden',
            headerTooltip: this.translateService.instant('Kaydeden'),
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['reset', 'apply'],
              textMatcher: ({ filterOption, value, filterText }: {
                filterOption: string;
                value: string;
                filterText: string;
              }) => {
                return true;
              },
            },
            hide: false,
            minWidth: 60
          },
          {
            headerName: this.translateService.instant('Açıklama'),
            field: 'Bilgi',
            headerTooltip: this.translateService.instant('Açıklama'),
            filter: 'agTextColumnFilter',
            filterParams: {
              buttons: ['reset', 'apply'],
              textMatcher: ({ filterOption, value, filterText }: {
                filterOption: string;
                value: string;
                filterText: string;
              }) => {
                return true;
              },
            },
            hide: false,
            minWidth: 60
          },
        ],
      },
    ];

    this.getTheme(); // Tema moduna subscribe olunup dinlemeye başlanıyor
    this.getList();
  }


  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  getList() {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0]; // "YYYY-MM-DD" formatında döndürür
    };
    
    // savedFilterModel'in gerçekten dolu olup olmadığını kontrol eden fonksiyon
    const isObjectEmpty = (obj: any) => obj && Object.keys(obj).length === 0;

    this.rowData = [];
    this.loading = true;
    // this.loadingEvent.emit(true);

    var sp: any[] = [
      {
        mkodu: 'yek262',
        ziyarettipi: savedFilterModel?.cbo_ziyaretnedeni?.toString() || '0',
        ziyaretbaslik: savedFilterModel?.Ad?.filter || '',
        ziyaretplaka: savedFilterModel?.Plaka?.filter || '',
        ziyaretsoyad: savedFilterModel?.Soyad?.filter || '',
        kime: savedFilterModel?.Sicilid1adsoyad?.filter || '',
        personel: savedFilterModel?.sicilid3adsoyad?.filter || '',
        bilgi: savedFilterModel?.Bilgi?.filter || '',
        firma: savedFilterModel?.Firma?.filter || '',
        tarih: formatDate(today),
        tarihbit: !savedFilterModel || isObjectEmpty(savedFilterModel) ? formatDate(today) : formatDate(oneYearAgo),
        kimlik: savedFilterModel?.Kimlikno?.filter || '',
        kaydeden: savedFilterModel?.kaydeden?.filter || ''
      }
    ];

    console.log("Ziyaretçi Params: ", sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log("Ziyaretçi Listesi Geldi: ", data);


      this.rowData = [...this.rowData, ...data];
      this.rowData.forEach((row: any) => {
        row.rowHeight = 30;
      });

      this.loading = false;
      // this.loadingEvent.emit(false); 
    }, (error: any) => {
      console.log("Ziyaretçi Listesi Hatası: ", error);
      this.loading = false;
    });
  }

  onSelectionChanged() {
    const grid = this.getActiveGrid();
    if (grid) {
      const selectedRows = grid.api.getSelectedRows();
      console.log('Seçilenler:', selectedRows);
    }
  }
  
  getRowHeight(params: RowHeightParams): number | undefined | null {
    return params?.data?.rowHeight;
  }

  handleExitButtonClick(data: any) {
    // Çıkış Ver butonuna tıklanınca yapılacak işlemler burada olacak
    console.log('Çıkış Ver butonuna tıklandı', data);
    // Burada gerekli işlemleri yapabilirsiniz
    var sp: any[] = [
      { mkodu: 'yek271', id: data.Id.toString() }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message == -1) {
        return;
      }

      console.log("Ziyaretçi Çıkışı Verildi :", data);
      this.getList();
    });
  }

  getActiveGrid() {
    return this.activeTheme === 'light' ? this.agGridLight : this.agGridDark;
  }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   this.columnApi = params.columnApi;
  
  //   // Tüm kolonları içeriğe göre otomatik ayarla
  //   setTimeout(() => {
  //     this.autoSizeAllColumns();
  //   }, 100);
  // }
  
  autoSizeAllColumns() {
    if (this.columnApi) {
      const allColumnIds: string[] = [];
      this.columnApi.getColumns()?.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      this.columnApi.autoSizeColumns(allColumnIds, false); // False: İçeriğe göre en küçük hale getir
    }
  }
  
  
  
  // autoSizeAllColumns() {
  //   const grid = this.getActiveGrid();
  //   if (grid) {
  //     const allColumnIds: string[] = [];
  //     grid.columnApi.getColumns()?.forEach((column: any) => {
  //       allColumnIds.push(column.getId());
  //     });
  //     grid.columnApi.autoSizeColumns(allColumnIds, false);
  //   }
  // }

  onGridReadyLight(params: GridReadyEvent) {
    if (this.activeTheme === 'light') {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // Tüm kolonları içeriğe göre otomatik ayarla
      setTimeout(() => {
        this.autoSizeAllColumns();
      }, 100);
    }
  }
  
  onGridReadyDark(params: GridReadyEvent) {
    if (this.activeTheme === 'dark') {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;

      // Tüm kolonları içeriğe göre otomatik ayarla
      setTimeout(() => {
        this.autoSizeAllColumns();
      }, 100);
    }
  }

  setActiveGridApis() {
    const grid = this.activeTheme === 'light' ? this.agGridLight : this.agGridDark;
    if (grid) {
      this.gridApi = grid.api;
      this.columnApi = grid.columnApi;
    }
  }
  
  changeTheme(theme: 'light' | 'dark') {
    this.activeTheme = theme;
    setTimeout(() => this.setActiveGridApis(), 0);  // Grid render olduktan sonra al
  }

  onFilterChanged(e: FilterChangedEvent) {
    if (this.activeTheme === 'light') {
      savedFilterModel = this.gridApi.getFilterModel();
      console.log('SavedFilterModel: ', savedFilterModel);

      this.savedFilterModel = savedFilterModel;
      this.getList();
    }
  }


  getTheme() {
    this.themeModeService.mode.pipe(takeUntil(this.ngUnsubscribe)).subscribe((mode: any) => {
      this.changeTheme(mode);
    });
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
var savedFilterModel: any = null;
