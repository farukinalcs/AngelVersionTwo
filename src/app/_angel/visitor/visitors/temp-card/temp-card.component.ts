import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, ColGroupDef, ColumnApi, GridApi, GridOptions, ICellRendererParams, IRowNode, IsRowSelectable, RowHeightParams, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FilterChangedEvent, GridReadyEvent } from 'ag-grid-community';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ExitDateRenderer } from '../visitor-grid/exit-date-renderer/exit-date-renderer.component';
import { AG_GRID_LOCALE_TR } from '@ag-grid-community/locale';

@Component({
  selector: 'app-temp-card',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule],
  templateUrl: './temp-card.component.html',
  styleUrl: './temp-card.component.scss'
})
export class TempCardComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject();
  @Input() selectedTab: any = {};
  @Input() refresh: boolean;
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
    localeText:  AG_GRID_LOCALE_TR, // Türkçe dil desteği
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
    private themeModeService: ThemeModeService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh']) {
      if (this.selectedTab.type == '3') {
        this.getList();        
      }
    }
  }

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
            colId: 'SicilId',
            headerName: this.translateService.instant('SID'),
            field: 'SicilId',
            headerTooltip: this.translateService.instant('Sicil_Id'),
            type: 'numericColumn',
            filter: false,
            hide: false
          },
          {
            headerName: this.translateService.instant('Ad_Soyad'),
            field: 'Sicilidadsoyad',
            headerTooltip: this.translateService.instant('Ad_Soyad'),
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
            // onCellDoubleClicked: (params) => this.clickedVisitor(params)
          },
          
        ],
      },

      //Ziyaret Bilgileri
      {
        headerName: this.translateService.instant('Kaydeden_Bilgileri'),
        headerClass: 'organization-group',
        marryChildren: true,
        groupId: 'organizationGroup',
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
            hide: false
          }
        ],
      },
    ];

    this.getTheme(); // Tema moduna subscribe olunup dinlemeye başlanıyor
    // this.getList();
  }


  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  getList() {
    this.rowData = [];
    this.loading = true;
    // this.loadingEvent.emit(true);

    var sp: any[] = [
      {
        mkodu: 'yek272',
        ad: savedFilterModel?.Ad?.filter || '',
        soyad: savedFilterModel?.Soyad?.filter || '',
        bilgi: savedFilterModel?.bilgi?.filter || '',
        kaydeden: savedFilterModel?.kaydeden?.filter || ''
      }
    ];

    console.log("Geçici Kart Params: ", sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log("Geçici Kart Listesi Geldi: ", data);


      this.rowData = [...this.rowData, ...data];
      this.rowData.forEach((row: any) => {
        row.rowHeight = 30;
      });

      this.loading = false;
      this.ref.detectChanges();
      // this.loadingEvent.emit(false); 
    }, (error: any) => {
      console.log("Geçici Kart Hatası: ", error);
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
      { mkodu: 'yek274', id: data.Id.toString() }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message == -1) {
        return;
      }

      console.log("Geçici Karta Çıkışı Verildi :", data);
      this.getList();
    });
  }

  getActiveGrid() {
    return this.activeTheme === 'light' ? this.agGridLight : this.agGridDark;
  }

  
  autoSizeAllColumns() {
    if (this.columnApi) {
      const allColumnIds: string[] = ['SicilId', 'Sicilidadsoyad', 'Giris', 'Cikis'];
      this.columnApi.getColumns()?.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      this.columnApi.autoSizeColumns(allColumnIds, false); // False: İçeriğe göre en küçük hale getir
    }
  }
  


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