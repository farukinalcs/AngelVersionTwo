import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, ColGroupDef, ColumnApi, GridApi, GridOptions, ICellRendererParams, IRowNode, IsRowSelectable, RowHeightParams, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { FilterChangedEvent, GridReadyEvent } from 'ag-grid-community';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { DeleteVisitor } from './delete-visitor/delete-visitor.component';


@Component({
  selector: 'app-banned-visitor',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule],
  templateUrl: './banned-visitor.component.html',
  styleUrl: './banned-visitor.component.scss'
})
export class BannedVisitorComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject();
  @Input() selectedTab: any = {};
  @Output() updateEmit = new EventEmitter<any>();
  @Output() selectedBanned = new EventEmitter<any>();
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
    context: {
      handleDeleteButtonClick: this.handleDeleteButtonClick.bind(this)
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh']) {
      if (this.selectedTab.type == '2') {
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
            colId: 'ID',
            headerName: this.translateService.instant('SID'),
            field: 'ID',
            headerTooltip: this.translateService.instant('Sicil_Id'),
            type: 'numericColumn',
            filter: false,
            hide: false
          },
          {
            colId: 'ad',
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
            cellClass: (params) => this.applyLinkClass(),
            hide: false,
            onCellDoubleClicked: (params) => this.clickedVisitor(params)
          },
          {
            colId: 'soyad',
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
            hide: false
          },
          {
            colId: 'KimlikNo',
            headerName: this.translateService.instant('Kimlik No'),
            field: 'KimlikNo',
            headerTooltip: this.translateService.instant('Kimlik No'),
            rowGroup: false,
            enableRowGroup: true,
            hide: false,
            filter: 'agTextColumnFilter',
          },
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
            colId: 'KimEkledi',
            headerName: this.translateService.instant('Kime Ekledi'),
            field: 'KimEkledi',
            headerTooltip: this.translateService.instant('Kime Ekledi'),
            rowGroup: false,
            enableRowGroup: true,
            hide: false,
            filter: false
          }
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
            headerName: this.translateService.instant('Kaydetme Tarihi'),
            field: 'giris',
            headerTooltip: this.translateService.instant('Kaydetme Tarihi'),
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
            }
          },
          {
            headerName: this.translateService.instant('Açıklama'),
            field: 'bilgi',
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
          },
          {
            colId: 'islemler',
            headerName: this.translateService.instant('İşlemler'),
            field: '',
            headerTooltip: this.translateService.instant('İşlemler'),            
            hide: false,
            filter: false,
            cellRendererSelector: (params: ICellRendererParams<any>) => {
              const deleteSystem = {
                component: DeleteVisitor,
                params: {
                  data: params.data,
                },
              };
              return deleteSystem
            },
          },
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
        mkodu: 'yek267',
        id: '0',
        ad: savedFilterModel?.Ad?.filter || '',
        soyad: savedFilterModel?.Soyad?.filter || '',
        kimlikno: savedFilterModel?.KimlikNo?.filter || '',
        kimekledi: savedFilterModel?.KimEkledi?.filter || '',
        aciklama: savedFilterModel?.bilgi?.filter || ''
      }
    ];

    console.log("Yasaklı Ziyaretçi Params: ", sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log("Yasaklı Ziyaretçi Listesi Geldi: ", data);


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

  handleDeleteButtonClick(data: any) {
    // "Sil" butonuna tıklanınca yapılacak işlemler burada olacak
    console.log('Sil butonuna tıklandı', data);
    // Burada gerekli işlemleri yapabilirsiniz

    var sp: any[] = [
      { mkodu: 'yek269', id: data.ID.toString() }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message == -1) {
        return;
      }

      console.log("Yasaklı ziyaretçi silindi :", data);
      this.getList();
    });
  }

  getActiveGrid() {
    return this.activeTheme === 'light' ? this.agGridLight : this.agGridDark;
  }

  
  autoSizeAllColumns() {
    if (this.columnApi) {
      const allColumnIds: string[] = ['ID', 'KimEkledi', 'giris', 'islemler', 'ad', 'soyad'];
      // this.columnApi.getColumns()?.forEach((column) => {
      //   allColumnIds.push(column.getId());
      // });
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
  
  clickedVisitor(params: any) {
    this.selectedBanned.emit(params.data);
    this.updateEmit.emit();
  }

  applyLinkClass() {
    return "text-primary link-style"
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
var savedFilterModel: any = null;
