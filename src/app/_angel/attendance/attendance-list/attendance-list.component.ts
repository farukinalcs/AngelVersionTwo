import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest, delay, filter, map, Subject, take, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import {
  ColDef,
  ColGroupDef,
  IDateFilterParams,
  IMultiFilterParams,
  IRowNode,
  IsRowSelectable,
  RowHeightParams,
  SideBarDef,
  StatusPanelDef,
  ValueFormatterParams,
  ColumnApi,
} from 'ag-grid-enterprise';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AttendanceService } from '../attendance.service';
import {
  FilterChangedEvent,
  FilterModifiedEvent,
  FilterOpenedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { OrganizationColumnFilterComponent } from '../organization-column-filter/organization-column-filter.component';
import { ToastrService } from 'ngx-toastr';
import { AG_GRID_LOCALE_TR } from '@ag-grid-community/locale';
import { CommonModule } from '@angular/common';
import { AnnualCalendarComponent } from '../../shared/annual-calendar/annual-calendar.component';
import { LeaveComponent } from '../../new-profile/request-forms/leave/leave.component';
import { ShiftChangeComponent } from '../../new-profile/request-forms/shift-change/shift-change.component';
import { OvertimeComponent } from '../../new-profile/request-forms/overtime/overtime.component';
import { AttendanceChangeComponent } from '../../new-profile/request-forms/attendance-change/attendance-change.component';
import { AttendanceListFilterComponent } from '../attendance-list-filter/attendance-list-filter.component';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { InOutComponent } from '../../shared/in-out/in-out.component';
import { ConfirmationService } from 'src/app/core/permission/services/core/services/confirmation.service';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [
    CommonModule,
    AnnualCalendarComponent,
    LeaveComponent,
    ShiftChangeComponent,
    OvertimeComponent,
    AttendanceChangeComponent,
    AttendanceListFilterComponent,
    AgGridModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ProgressBarModule,
    InOutComponent,
  ],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss'],
})
export class AttendanceListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private ngUnsubscribe = new Subject();
  silinsin: any = 0;
  rowClass = 'text-dark';
  selectedTab = '0';
  tabList = [
    { name: 'Genel', type: '0' },
    { name: 'Fazla Mesai', type: '1' },
    { name: 'RT Fazla Mesai', type: '7' },
    { name: 'Eksik Mesai', type: '2' },
    { name: 'Hatalı Geçiş', type: '3' },
    { name: 'Geç Gelenler', type: '4' },
    { name: 'Erken Çıkanlar', type: '5' },
    { name: 'İzinliler', type: '6' },
  ];

  selectedRange = '1';
  rangeList = [
    { name: 'Aylık', range: '30' },
    { name: 'Haftalık', range: '7' },
    { name: 'Günlük', range: '1' },
    // { name: 'Özel', range: '-1' },
  ];

  // private gridApi!: GridApi<any>;

  gridHeight = '80vh';
  gridStyle: any = {
    height: this.gridHeight,
    flex: '1 1 auto',
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
      headerName: this.translateService.instant('Fotoğraf'),
      field: 'imagePath',
      editable: false,
      pinned: 'left',
      minWidth: 60,
      maxWidth: 60,
      filter: false,
      sortable: false,
      headerTooltip: this.translateService.instant('Fotoğraf'),
      cellStyle: {},
      cellRenderer: (params: any) => this.getImageGrid(params),
      cellRendererParams: { exampleParameter: 'red' },
      hide: false,
    },

    //Kişi Bilgileri
    {
      headerName: 'Kişi Bilgileri',
      marryChildren: true,
      headerClass: 'person-group',
      groupId: 'PersonInfoGroup',
      // headerGroupComponent: CustomHeaderGroup,
      hide: false,
      children: [
        {
          headerName: this.translateService.instant('SID'),
          field: 'sicilid',
          headerTooltip: this.translateService.instant('Sicil_Id'),
          type: 'numericColumn',
          filter: false,
          // filter: 'agNumberColumnFilter',
          // filterParams: {
          //   buttons: ['reset', 'apply']
          // },
          cellClass: (params) => this.applyWeekendClass(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('Sicil_No'),
          field: 'sicilno',
          headerTooltip: this.translateService.instant('Sicil_No'),
          filter: 'agTextColumnFilter',
          filterParams: {
            // buttons: ['reset', 'apply'],
            textMatcher: ({
              filterOption,
              value,
              filterText,
            }: {
              filterOption: string;
              value: string;
              filterText: string;
            }) => {
              return true;
            },
            debounceMs: 3000,
          },
          cellClass: (params) => this.applyWeekendClass(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('Ad'),
          field: 'ad',
          headerTooltip: this.translateService.instant('Ad'),
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            textMatcher: ({
              filterOption,
              value,
              filterText,
            }: {
              filterOption: string;
              value: string;
              filterText: string;
            }) => {
              return true;
            },
          },
          cellClass: (params) => this.applyWeekendClass(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('Soyad'),
          field: 'soyad',
          headerTooltip: this.translateService.instant('Soyad'),
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            textMatcher: ({
              filterOption,
              value,
              filterText,
            }: {
              filterOption: string;
              value: string;
              filterText: string;
            }) => {
              return true;
            },
            // textMatcher: ({ filterOption, value, filterText }: { filterOption: string, value: string, filterText: string }) => {
            // if (filterText == null) {
            //   return false;
            // }
            // switch (filterOption) {
            //   case 'contains':
            //     return value.indexOf(filterText) >= 0;
            //   case 'notContains':
            //     return value.indexOf(filterText) < 0;
            //   case 'equals':
            //     return value === filterText;
            //   case 'notEqual':
            //     return value != filterText;
            //   case 'startsWith':
            //     return value.indexOf(filterText) === 0;
            //   case 'endsWith':
            //     const index = value.lastIndexOf(filterText);
            //     return (
            //       index >= 0 && index === value.length - filterText.length
            //     );
            //   default:
            //     // should never happen
            //     console.warn('invalid filter type ' + filterOption);
            //     return false;
            // }
            // },
          },
          cellClass: (params) => this.applyWeekendClass(params),
          hide: false,
        },

        // {
        //   headerName: this.translateService.instant('Personel_No'),
        //   field: 'personelno',
        //   headerTooltip: this.translateService.instant('Personel_No'),
        //   type: 'numericColumn',
        // },
      ],
    },

    // { headerName:'Giriş Tarihi', field: 'giristarih', type: ['dateColumn', 'nonEditableColumn']},

    //Organizasyon Bilgileri
    {
      headerName: 'Organizasyon Bilgileri',
      headerClass: 'organization-group',
      marryChildren: true,
      groupId: 'organizationGroup',
      hide: true,
      // headerGroupComponent: CustomHeaderGroup,
      children: [
        // {
        //   headerName: this.translateService.instant('Firma'),
        //   field: 'firmaad',
        //   headerTooltip: this.translateService.instant('Firma_Adı'),
        //   rowGroup: false,
        //   enableRowGroup: true,
        //   hide: true,
        //   filter: 'agSetColumnFilter',
        //   filterParams: {
        //     values: this.getOrganizationInfo('cbo_firma')
        //   } as ISetFilterParams,
        // },

        {
          colId: 'cbo_firma',
          headerName: this.translateService.instant('Firma'),
          field: 'firmaad',
          headerTooltip: this.translateService.instant('Firma_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: OrganizationColumnFilterComponent,
        },

        {
          colId: 'cbo_altfirma',
          headerName: this.translateService.instant('Alt_Firma'),
          field: 'altfirmaad',
          headerTooltip: this.translateService.instant('Alt_Firma_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_yaka',
          headerName: this.translateService.instant('Yaka'),
          field: 'yakaad',
          headerTooltip: this.translateService.instant('Yaka_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_bolum',
          headerName: this.translateService.instant('Bölüm'),
          field: 'bolumad',
          headerTooltip: this.translateService.instant('Bölüm_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_gorev',
          headerName: this.translateService.instant('Görev'),
          field: 'gorevad',
          headerTooltip: this.translateService.instant('Görev_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_pozisyon',
          headerName: this.translateService.instant('Pozisyon'),
          field: 'pozisyonad',
          headerTooltip: this.translateService.instant('Pozisyon_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: OrganizationColumnFilterComponent,
        },
        {
          colId: 'cbo_direktorluk',
          headerName: this.translateService.instant('Direktörlük'),
          field: 'direktorlukad',
          headerTooltip: this.translateService.instant('Direktörlük_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: OrganizationColumnFilterComponent,
        },
      ],
    },

    // Puantaj Bilgileri
    {
      headerName: 'Mesai ve Puantaj Bilgileri',
      marryChildren: true,
      headerClass: 'timeAttendance-group',
      groupId: 'timeAttendanceGroup',
      // headerGroupComponent: CustomHeaderGroup,
      hide: false,
      children: [
        {
          headerName: this.translateService.instant('Mesai_Tarihi'),
          field: 'mesaitarih',
          headerTooltip: this.translateService.instant('Mesai_Tarihi'),
          filter: false,
          filterParams: filterParams,
          cellClass: (params) => this.applyWeekendClass(params),
          sort: 'asc',
          hide: false,
          onCellClicked: (params) => this.showAnnualCalendar(params),
        },
        {
          headerName: this.translateService.instant('Giriş'),
          field: 'ggiris',
          headerTooltip: this.translateService.instant('Giriş'),
          filter: false,
          valueFormatter: (params) => this.parseEntryExit(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
          onCellClicked: (params) => this.showInOutModal(params, 55),
        },
        {
          headerName: this.translateService.instant('Çıkış'),
          field: 'gcikis',
          headerTooltip: this.translateService.instant('Çıkış'),
          filter: false,
          valueFormatter: (params) => this.parseEntryExit(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
          onCellClicked: (params) => this.showInOutModal(params, 56),
        },
        {
          headerName: this.translateService.instant('Mesai_Açıklama'),
          field: 'mesaiaciklama',
          headerTooltip: this.translateService.instant('Mesai_Açıklama'),
          // filter: 'agMultiColumnFilter',
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            textMatcher: ({
              filterOption,
              value,
              filterText,
            }: {
              filterOption: string;
              value: string;
              filterText: string;
            }) => {
              return true;
            },
            // filters: [
            //   {
            //     filter: 'agTextColumnFilter',
            //     filterParams: {
            //       defaultOption: 'startsWith',
            //     } as ITextFilterParams,
            //   },
            //   {
            //     filter: 'agSetColumnFilter',
            //   },
            // ],
          } as IMultiFilterParams,
          cellClass: (params) => this.applyWeekendClass(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('MS'),
          field: 'mesaisuresi',
          headerTooltip: this.translateService.instant('Mesai_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.applyWeekendClass(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('NM'),
          field: 'normalmesai',
          headerTooltip: this.translateService.instant('Normal_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('AS'),
          field: 'arasure',
          headerTooltip: this.translateService.instant('Ara_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('FM'),
          field: 'fazlamesai',
          headerTooltip: this.translateService.instant('Fazla_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('OFM'),
          field: 'onaylananfazlamesai',
          headerTooltip: this.translateService.instant('Onaylanan_Fazla_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('FAS'),
          field: 'farasure',
          headerTooltip: this.translateService.instant(
            'Fazla_Mesai_Ara_Süresi'
          ),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('RTFM'),
          field: 'resmitatilmesai',
          headerTooltip: this.translateService.instant(
            'Resmi_Tatil_Fazla_Mesai'
          ),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('RTOFM'),
          field: 'rtonaylananfazlamesai',
          headerTooltip: this.translateService.instant(
            'Resmi_Tatil_Onaylanan_Fazla_Mesai'
          ),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('EM'),
          field: 'eksikmesai',
          headerTooltip: this.translateService.instant('Eksik_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('RM'),
          field: 'resmitatilsuresi',
          headerTooltip: this.translateService.instant('Resmi_Tatil_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('GV'),
          field: 'gecevardiya',
          headerTooltip: this.translateService.instant('Gece_Vardiyası'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('GZ'),
          field: 'gecezammi',
          headerTooltip: this.translateService.instant('Gece_Zammı'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('IZS'),
          field: 'izinsuresi',
          headerTooltip: this.translateService.instant('Saatlik_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('YIZS'),
          field: 'yillikizinsuresi',
          headerTooltip: this.translateService.instant('Yıllık_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('SGKIZS'),
          field: 'sgkizinsuresi',
          headerTooltip: this.translateService.instant('SGK_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('UCZIZS'),
          field: 'ucretsizizinsuresi',
          headerTooltip: this.translateService.instant('Ücretsiz_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('RM_Açıklama'),
          field: 'resmitatilaciklama',
          headerTooltip: this.translateService.instant('Resmi_Tatil_Açıklama'),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
        {
          headerName: this.translateService.instant('İzin_Açıklama'),
          field: 'izinaciklama',
          headerTooltip: this.translateService.instant('İzin_Açıklama'),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
        },
      ],
    },
  ];

  public defaultColDef: ColDef = {
    // flex: 1,
    minWidth: 70,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
    editable: false,
    menuTabs: [],
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

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = {
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
      { statusPanel: 'agTotalRowCountComponent', align: 'center' },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  };
  // gridApi: any;
  // gridOptionsLight = {};
  // gridOptionsDark = {};

  loading: boolean = false;
  value: number = 0;

  items = [
    {
      tooltipOptions: {
        tooltipLabel: 'Mesailer',
      },
      icon: 'pi pi-clock',
    },
    {
      tooltipOptions: {
        tooltipLabel: 'İzinler',
      },
      icon: 'pi pi-image',
    },
    {
      tooltipOptions: {
        tooltipLabel: 'Geçişler',
      },
      icon: 'pi pi-sign-in',
    },
    {
      tooltipOptions: {
        tooltipLabel: 'FM Sıra',
      },
      icon: 'pi pi-hourglass',
    },
  ];
  attendanceInfo: any[] = [];
  attendanceList: any[] = [];
  formGroup: FormGroup;
  currentDate = new Date(Date.now());
  isCancel: boolean = false;
  companyFilterList: any;
  jobFilterList: any;
  directorshipFilterList: any;
  subsidiaryFilterList: any;
  collarFilterList: any;
  departmentFilterList: any;
  positionFilterList: any;

  displayFilterModal: boolean = false;
  filterFromModal: boolean = false;
  filterValueFromModal: { formValues: any };

  cancelRequest: Subject<void> = new Subject<void>();
  isOpen: boolean = false;
  savedFilterModel: any;
  displayVacationForm: boolean = false;
  displayAnnualCalendar: boolean = false;
  displayInOut: boolean = false;
  personInfoForAnnualCalendar: any;
  personInfoForInOut: any;
  terminalSelect: any;
  displayOvertimeForm: boolean = false;
  displayShiftForm: boolean = false;
  displayAttendanceForm: boolean = false;
  imageUrl: string;
  rangeDates: Date[] = [];

  // ---------
  activeTheme: 'light' | 'dark' = 'light'; // Varsayılan tema
  gridApi!: GridApi;
  columnApi!: ColumnApi;
  gridOptions: GridOptions = {
    localeText: AG_GRID_LOCALE_TR, // Türkçe dil desteği
  };
  // ----------

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private translateService: TranslateService,
    private attendanceService: AttendanceService,
    private themeModeService: ThemeModeService,
    private ref: ChangeDetectorRef,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService
  ) {
    this.imageUrl = this.profileService.getImageUrl();
  }

  ngAfterViewInit(): void {
    this.setGridSetting();
  }

  ngOnInit(): void {
    this.createForm();
    this.setInitialDates();
    this.subscribeToDateRangeChanges();
    this.subscribeToDateChanges();
    // ----------
    this.getTheme(); // Tema moduna subscribe ol
    // ----------
  }

  // ----------
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

  autoSizeAllColumns() {
    if (this.columnApi) {
      const allColumnIds: string[] = [
        'sicilid',
        'sicilno',
        'ad',
        'soyad',
        'mesaitarih',
        'ggiris',
        'gcikis',
        'izinaciklama',
      ];
      this.columnApi.getColumns()?.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      this.columnApi.autoSizeColumns(allColumnIds, false); // False: İçeriğe göre en küçük hale getir
    }
  }

  onFilterChanged(e: FilterChangedEvent) {
    if (this.gridApi) {
      savedFilterModel = this.gridApi.getFilterModel();
      console.log('SavedFilterModel: ', savedFilterModel);

      this.savedFilterModel = savedFilterModel;
      this.getAttendanceInfo();
    }
  }

  onSelectionChanged() {
    // Seçim değiştiğinde çağrılır
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      console.log('Seçilenler:', selectedRows);
      this.attendanceService.setSelectedItems(selectedRows);
    }
  }
  // ----------

  onFilterOpened(e: FilterOpenedEvent) {
    // filter açıldığında çağrılır
  }

  onFilterModified(e: FilterModifiedEvent) {
    // filter değiştiğinde çağrılır
  }

  createForm() {
    const today = new Date();

    this.formGroup = this.formBuilder.group({
      dateRange: ['1'], // Günlük
      rangeDates: [[today, today]],
    });

    this.rangeDates = [today, today];
  }

  setInitialDates() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatı

    this.formGroup.patchValue({
      startDate: today,
      endDate: today,
    });
  }

  subscribeToDateChanges() {
    const rangeDates$ = this.formGroup.get('rangeDates')?.valueChanges;

    if (rangeDates$) {
      rangeDates$
        .pipe(
          filter(
            (range: Date[]) =>
              Array.isArray(range) &&
              range.length === 2 &&
              !!range[0] &&
              !!range[1]
          )
        )
        .subscribe((range: Date[]) => {
          let [start, end] = range;

          // Tarih sırası yanlışsa düzelt
          if (start.getTime() > end.getTime()) {
            this.formGroup
              .get('rangeDates')
              ?.setValue([start, start], { emitEvent: false });
          }

          // if (this.formGroup.get('dateRange')?.value === '-1') {
          this.getAttendanceInfo();
          // }
        });
    }
  }

  subscribeToDateRangeChanges() {
    this.formGroup.get('dateRange')?.valueChanges.subscribe((range) => {
      const today = new Date();

      if (range == '1') {
        this.rangeDates = [today, today];
      } else if (range == '7') {
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        startOfWeek.setDate(startOfWeek.getDate() + diff);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.rangeDates = [startOfWeek, endOfWeek];
      } else if (range == '30') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        this.rangeDates = [startOfMonth, endOfMonth];
      }

      this.formGroup.get('rangeDates')?.setValue(this.rangeDates);
      // if (range != '-1') this.getAttendanceInfo();
    });
  }

  previousDate() {
    const range = this.formGroup.get('dateRange')?.value;
    let [startDate, endDate] = this.rangeDates;

    if (range === '1') {
      startDate.setDate(startDate.getDate() - 1);
      endDate = new Date(startDate);
    } else if (range === '7') {
      startDate.setDate(startDate.getDate() - 7);
      const day = startDate.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      startDate.setDate(startDate.getDate() + diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (range === '30') {
      startDate.setMonth(startDate.getMonth() - 1, 1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    }

    this.rangeDates = [startDate, endDate];
    this.formGroup.get('rangeDates')?.setValue(this.rangeDates);
    // this.getAttendanceInfo();
  }

  nextDate() {
    const range = this.formGroup.get('dateRange')?.value;
    let [startDate, endDate] = this.rangeDates;

    if (range === '1') {
      startDate.setDate(startDate.getDate() + 1);
      endDate = new Date(startDate);
    } else if (range === '7') {
      startDate.setDate(startDate.getDate() + 7);
      const day = startDate.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      startDate.setDate(startDate.getDate() + diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (range === '30') {
      startDate.setMonth(startDate.getMonth() + 1, 1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    }

    this.rangeDates = [startDate, endDate];
    this.formGroup.get('rangeDates')?.setValue(this.rangeDates);
    // this.getAttendanceInfo();
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

  getImageGrid(params: any, imageSize = '10') {
    if (params?.data?.sicilid == undefined) {
      return '';
    }

    return (
      `
    <div class="bg-hover-light d-flex justify-content-center mt-1">
      <img style="width: 23px; height: 23px; border-radius: 5px;" src="${this.imageUrl}?sicilid=` +
      params.data.sicilid +
      `">
    </div>`
    );
  }

  getRowHeight(params: RowHeightParams): number | undefined | null {
    return params?.data?.rowHeight;
  }

  getAttendanceInfo() {
    this.rowData = [];
    this.value = 1;
    this.loading = true;

    // İptal edilen önceki istekler için mevcut cancelRequest subject'ini tamamla ve yenisini oluştur.
    this.cancelRequest.next();
    this.cancelRequest.complete();
    this.cancelRequest = new Subject<void>();

    let [startDate, endDate] = this.formGroup.get('rangeDates')?.value || [
      new Date(),
      new Date(),
    ];

    const formattedStart = this.formatDate(startDate);
    const formattedEnd = this.formatDate(endDate);

    var sp: any[] = !this.filterFromModal
      ? [
          {
            mkodu: 'yek102',
            tip: this.selectedTab,
            tarih: formattedStart,
            tarihbit: formattedEnd,
            ad: savedFilterModel?.ad?.filter || '',
            soyad: savedFilterModel?.soyad?.filter || '',
            sicilno: savedFilterModel?.sicilno?.filter || '',
            firma: savedFilterModel?.cbo_firma?.toString() || '0',
            bolum: savedFilterModel?.cbo_bolum?.toString() || '0',
            pozisyon: savedFilterModel?.cbo_pozisyon?.toString() || '0',
            gorev: savedFilterModel?.cbo_gorev?.toString() || '0',
            altfirma: savedFilterModel?.cbo_altfirma?.toString() || '0',
            yaka: savedFilterModel?.cbo_yaka?.toString() || '0',
            direktorluk: savedFilterModel?.cbo_direktorluk?.toString() || '0',
            okod1: '',
            okod2: '',
            okod3: '',
            okod4: '',
            okod5: '',
            okod6: '',
            okod7: '',
            aciklama: savedFilterModel?.mesaiaciklama?.filter || '',
          },
        ]
      : [
          {
            mkodu: 'yek102',
            tip: this.selectedTab,
            tarih: formattedStart, //Burası düzenlenecek
            tarihbit: formattedEnd, //Burası düzenlenecek
            ad: this.filterValueFromModal.formValues.name,
            soyad: this.filterValueFromModal.formValues.surname,
            sicilno: this.filterValueFromModal.formValues.registrationNumber,
            firma: this.filterValueFromModal.formValues.company,
            bolum: this.filterValueFromModal.formValues.department,
            pozisyon: this.filterValueFromModal.formValues.position,
            gorev: this.filterValueFromModal.formValues.job,
            altfirma: this.filterValueFromModal.formValues.subcompany,
            yaka: this.filterValueFromModal.formValues.collar,
            direktorluk: this.filterValueFromModal.formValues.directorship,
            okod1: this.filterValueFromModal.formValues.code1,
            okod2: this.filterValueFromModal.formValues.code2,
            okod3: this.filterValueFromModal.formValues.code3,
            okod4: this.filterValueFromModal.formValues.code4,
            okod5: this.filterValueFromModal.formValues.code5,
            okod6: this.filterValueFromModal.formValues.code6,
            okod7: this.filterValueFromModal.formValues.code7,
            aciklama: savedFilterModel?.mesaiaciklama.filter || '',
          },
        ];

    console.log('PDKS Guid Parametreler:', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          this.value = 100;
          this.loading = false;
          return;
        }
        console.log('PDKS Guid: ', data);
        this.attendanceInfo = data;

        if (this.attendanceInfo[0]?.maxpartnumber > 0) {
          this.fetchAttendanceData(1, this.attendanceInfo[0]?.maxpartnumber);
        } else {
          this.value = 100;
          this.loading = false;
          this.ref.detectChanges();
          return;
        }
      });
  }

  fetchAttendanceData(currentPartNumber: number, maxPartNumber: number) {
    if (currentPartNumber > maxPartNumber) {
      this.value = 100;
      this.loading = false;
      this.ref.detectChanges();
      return;
    }

    this.getAttendanceData(currentPartNumber).then(() => {
      this.value += Math.round((1 / maxPartNumber) * 100);
      this.fetchAttendanceData(currentPartNumber + 1, maxPartNumber);
    });
  }

  getAttendanceData(partNumber: any): Promise<void> {
    return new Promise((resolve, reject) => {
      var sp: any[] = [
        {
          mkodu: 'yek103',
          tip: this.selectedTab,
          requestguid: this.attendanceInfo[0].requestguid,
          part_number: partNumber.toString(),
        },
      ];

      console.log('PDKS :', sp);

      this.profileService
        .requestMethod(sp, { noloading: 'true' })
        .pipe(
          takeUntil(this.cancelRequest), // İptal sinyalini dinler
          takeUntil(this.ngUnsubscribe),
          delay(500)
        )
        .subscribe(
          (response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
              reject();
              return;
            }
            console.log('PDKS Listesi: ', data);

            this.rowData = [...this.rowData, ...data];
            console.log(this.rowData);

            this.rowData.forEach((row: any) => {
              row.rowHeight = 30;
            });

            // this.gridOptionsLight = {
            //   localeTextFunc: (key: string, defaultValue: string) => {
            //     const data = this.translateService.instant(key);
            //     return data === key ? defaultValue : data;
            //   },
            // };

            // this.gridOptionsDark = {
            //   localeTextFunc: (key: string, defaultValue: string) => {
            //     const data = this.translateService.instant(key);
            //     return data === key ? defaultValue : data;
            //   },
            // };

            if (
              this.value >= 100 ||
              this.attendanceInfo[0].maxpartnumber == partNumber
            ) {
              this.value = 100;
              this.loading = false;
            }

            // Tüm kolonları içeriğe göre otomatik ayarla
            setTimeout(() => {
              this.autoSizeAllColumns();
            }, 100);

            this.ref.detectChanges();
            resolve();
          },
          (error) => {
            if (this.isCancel) {
              console.log('Request canceled');
            }
            reject(error);
          }
        );
    });
  }

  changeTabMenu(menu: any) {
    this.selectedTab = menu;
    this.getAttendanceInfo();
  }

  convertFromMinuteToHour(params: ValueFormatterParams) {
    const minutes = params.value;
    if (isNaN(minutes) || minutes === null || minutes === undefined) {
      return '00:00';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  parseEntryExit(params: ValueFormatterParams) {
    if (!params.value) {
      return '__:__';
    }

    const date = new Date(params.value);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  timeClassChange(params: any) {
    // Giriş
    if (params.column.colId == 'ggiris') {
      // if (params.value) {
      //   return 'cell-time-active'
      // }

      if (params.data.ellegiris > 1) {
        if (params.data.geckalma > 0) {
          return 'cell-lateness-manuel-entry';
        } else {
          return 'cell-time-active-manuel-entry';
        }
      } else {
        if (params.data.geckalma > 0) {
          return 'cell-lateness';
        } else {
          return 'cell-time-active';
        }
      }
    }

    // Çıkış
    if (params.column.colId == 'gcikis') {
      // if (params.value) {
      //   return 'cell-time-active'
      // }

      if (params.data.ellegiris > 1) {
        if (params.data.erkencikma > 0) {
          return 'cell-lateness-manuel-entry';
        } else {
          return 'cell-time-active-manuel-entry';
        }
      } else {
        if (params.data.erkencikma > 0) {
          return 'cell-lateness';
        } else {
          return 'cell-time-active';
        }
      }
    }

    // NM
    if (params.column.colId == 'normalmesai') {
      if (params.data.mesaibas == params.data.mesaibit) {
        return 'cell-weekend';
      }

      if (
        params.data.izinaciklama !== '' &&
        params.data.izinaciklama !== undefined &&
        params.data.izinaciklama !== '#__#'
      ) {
        return 'cell-green';
      } else if (
        params.data.eksikmesai !== '00:00' &&
        params.data.eksikmesai !== '0' &&
        params.data.eksikmesai !== '' &&
        params.data.eksikmesai !== undefined &&
        params.data.eksikmesai > 0
      ) {
        return 'cell-time-passive';
      } else if (params.data.resmitatilsuresi) {
        return '';
      }

      if (params.value == 0 || params.value == null) {
        return 'cell-time-passive';
      }
    }

    //FM
    if (params.column.colId == 'fazlamesai') {
      if (params.data.mesaibas == params.data.mesaibit) {
        return 'cell-weekend';
      }

      if (
        params.data.onaylananfazlamesai !== '00:00' &&
        params.data.onaylananfazlamesai !== '0'
      ) {
        return 'cell-green';
      } else {
        if (params.value !== '00:00' && params.value !== '0') {
          return 'cell-time-passive';
        } else {
          return '';
        }
      }
    }

    // RM
    if (params.column.colId == 'resmitatilsuresi') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      } else {
        return 'cell-warning';
      }
    }

    // RM Açıklama
    if (params.column.colId == 'resmitatilaciklama') {
      if (params.value) {
        return 'cell-warning';
      }
    }

    // OFM
    if (params.column.colId == 'onaylananfazlamesai') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }

      if (
        params.value !== '00:00' &&
        params.value !== '0' &&
        params.value !== '' &&
        params.value !== undefined
      ) {
        return 'cell-blue';
      }
    }

    // RTFM
    if (params.column.colId == 'resmitatilmesai') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }

      if (params.value !== '00:00' && params.value !== '0') {
        return 'cell-warning';
      } else {
        if (params.value !== '00:00' && params.value !== '0') {
          return 'cell-time-passive';
        } else {
          return '';
        }
      }
    }

    // RTOFM
    if (params.column.colId == 'rtonaylananfazlamesai') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }

      if (
        params.value !== '00:00' &&
        params.value !== '0' &&
        params.value !== '' &&
        params.value !== undefined
      ) {
        return 'cell-blue';
      }
    }

    // EM
    if (params.column.colId == 'eksikmesai') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      } else {
        return 'cell-time-passive';
      }
    }

    // GV
    if (params.column.colId == 'gecevardiya') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }
    }

    // GZ
    if (params.column.colId == 'gecezammi') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }
    }

    // IZS
    if (params.column.colId == 'izinsuresi') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }

      if (
        params.value !== '00:00' &&
        params.value !== '0' &&
        params.value !== '' &&
        params.value !== undefined
      ) {
        return 'cell-green';
      }
    }

    // YIZS
    if (params.column.colId == 'yillikizinsuresi') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }

      if (
        params.value !== '00:00' &&
        params.value !== '0' &&
        params.value !== '' &&
        params.value !== undefined
      ) {
        return 'cell-green';
      }
    }

    // SGKIZS
    if (params.column.colId == 'sgkizinsuresi') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }

      if (
        params.value !== '00:00' &&
        params.value !== '0' &&
        params.value !== '' &&
        params.value !== undefined
      ) {
        return 'cell-green';
      }
    }

    // UCZIZS
    if (params.column.colId == 'ucretsizizinsuresi') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }

      if (
        params.value !== '00:00' &&
        params.value !== '0' &&
        params.value !== '' &&
        params.value !== undefined
      ) {
        return 'cell-green';
      }
    }

    // FAS
    if (params.column.colId == 'farasure') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      } else {
        return 'text-danger';
      }
    }

    // AS
    if (params.column.colId == 'arasure') {
      if (params.value == 0 || params.value == null) {
        return 'cell-time-zero';
      }
    }

    // İzin Açıklama
    if (params.column.colId == 'izinaciklama') {
      if (
        params.data.izinaciklama !== '' &&
        params.data.izinaciklama !== undefined &&
        params.data.izinaciklama !== '#__#'
      ) {
        return 'cell-green';
      }
    }
  }

  applyWeekendClass(params: any) {
    if (params?.data?.mesaibas == params?.data?.mesaibit) {
      return 'cell-weekend';
    }
  }

  cancelAttendanceRequest() {
    this.isCancel = true;
    this.cancelRequest.next(); // İptal sinyalini gönder
    this.cancelRequest.complete();
    this.value = 100; // Loading bar'ını %100 yap
    this.loading = false;
    this.ref.detectChanges(); // UI'ı güncelle
  }

  showFilterModal() {
    this.displayFilterModal = true;
  }

  onHideFilterModal() {
    this.displayFilterModal = false;
  }

  clearFilters() {
    this.gridApi.setFilterModel(null);
  }

  setFilterFormFromModal(value: { formValues: any }) {
    console.log('Filtre Geldii. :', value);
    this.filterValueFromModal = value;
    this.filterFromModal = true;

    this.getAttendanceInfo();
  }

  openDatePicker() {
    let dateRangeValue = this.formGroup.get('dateRange')?.value;

    if (dateRangeValue != '-1') {
      this.formGroup.get('dateRange')?.setValue('-1');
    }

    console.log('Datepicker Açıldı!!');
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  onColumnResized(event: any) {
    if (event.finished && event.column) {
      console.log(
        'Column resized:',
        event.column.getId(),
        'New width:',
        event.column.getActualWidth(),
        '   asdasd: ',
        this.columnApi.getAllGridColumns()
      );
      this.sendColumnStateToApi();
    }
  }

  onColumnVisible(event: any) {
    this.sendColumnStateToApi();
  }

  setGridSetting() {
    var sp: any[] = [
      {
        mkodu: 'yek105',
        ad: 'pdks_0_gridSettings',
      },
    ];

    this.profileService
      .requestMethod(sp, { noloading: 'true' })
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((response) => this.parseValue(response[0].x[0]?.deger))
      )
      .subscribe((response: any) => {
        console.log('Grid Settings: ', response);
        this.setColumnWidths(response);
      });
  }

  private parseValue(
    value: string
  ): { col: string; width: string; visible: string }[] {
    return value?.split('|').map((item) => {
      const parts = item.split('#');
      return {
        col: parts[0],
        width: parts[1],
        visible: parts[2],
      };
    });
  }

  setColumnWidths(widths: { col: string; width: string; visible: string }[]) {
    const updateColumnWidths = (colDef: any) => {
      const widthInfo = widths?.find((w) => w.col === colDef.field);
      if (widthInfo) {
        colDef.width = parseInt(widthInfo.width, 10);
        // colDef.hide = widthInfo.visible !== 'true';
        colDef.hide = !JSON.parse(widthInfo.visible);

        if (colDef.flex) {
          delete colDef.flex;
        }
      }
      if (colDef.children && colDef.children.length > 0) {
        colDef.children.forEach(updateColumnWidths);
      }
    };

    this.columnDefs.forEach(updateColumnWidths);
    // this.gridApi.setColumnDefs(this.columnDefs);

    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.sizeColumnsToFit();
      console.log('ColumnDef: ', this.columnDefs);
    } else {
      console.error('Sanırım bir problem var!');
    }
  }

  sendColumnStateToApi() {
    const allColumns = this.columnApi.getAllColumns();
    if (!allColumns) {
      console.error('No columns found.');
      return;
    }

    const columnStateString = allColumns
      .map((col) => {
        const colDef = col.getColDef();
        const width = col.getActualWidth();
        const visible = col.isVisible();
        return `${colDef.field || colDef.colId}#${width}#${visible}`;
      })
      .join('|');

    console.log(columnStateString);

    var sp: any[] = [
      {
        mkodu: 'yek104',
        ad: 'pdks_0_gridSettings',
        deger: columnStateString,
      },
    ];

    this.profileService
      .requestMethod(sp, { noloading: 'true' })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        console.log('Grid Settings Are Send: ', response);
      });
  }

  showVacationForm() {
    let selectedEmployees: any[] = [];
    this.attendanceService.selectedItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => {
        selectedEmployees = items;
      });
    if (selectedEmployees.length > 0) {
      this.displayVacationForm = true;
    } else {
      this.toastrService.warning(
        this.translateService.instant('Listeden_Seçim_Yapmalısınız!'),
        this.translateService.instant('Uyarı')
      );
      return;
    }
  }
  onHideVacationForm() {
    this.displayVacationForm = false;
  }

  showOvertimeForm() {
    let selectedEmployees: any[] = [];
    this.attendanceService.selectedItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => {
        selectedEmployees = items;
      });
    if (selectedEmployees.length > 0) {
      this.displayOvertimeForm = true;
    } else {
      this.toastrService.warning(
        this.translateService.instant('Listeden_Seçim_Yapmalısınız!'),
        this.translateService.instant('Uyarı')
      );
      return;
    }
  }
  onHideOvertimeForm() {
    this.displayOvertimeForm = false;
  }

  showShiftForm() {
    let selectedEmployees: any[] = [];
    this.attendanceService.selectedItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => {
        selectedEmployees = items;
      });
    if (selectedEmployees.length > 0) {
      this.displayShiftForm = true;
    } else {
      this.toastrService.warning(
        this.translateService.instant('Listeden_Seçim_Yapmalısınız!'),
        this.translateService.instant('Uyarı')
      );
      return;
    }
  }

  onHideShiftForm() {
    this.displayShiftForm = false;
  }

  showAttendanceForm() {
    let selectedEmployees: any[] = [];
    this.attendanceService.selectedItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => {
        selectedEmployees = items;
      });
    if (selectedEmployees.length > 0) {
      this.displayAttendanceForm = true;
    } else {
      this.toastrService.warning(
        this.translateService.instant('Listeden_Seçim_Yapmalısınız!'),
        this.translateService.instant('Uyarı')
      );
      return;
    }
  }

  onHideAttendanceForm() {
    this.displayAttendanceForm = false;
  }

  showAnnualCalendar(params: any) {
    console.log('Annual Calendar : ', params);

    this.displayAnnualCalendar = true;
    this.personInfoForAnnualCalendar = params;
    this.ref.detectChanges();
  }

  onHideAnnualCalendar() {
    this.displayAnnualCalendar = false;
  }

  formatDate(date: Date): string {
    const correctedDate = new Date(date); // Orijinal tarihi klonla
    correctedDate.setHours(0, 0, 0, 0); // Saat, dakika, saniye sıfırlanır

    const year = correctedDate.getFullYear();
    const month = String(correctedDate.getMonth() + 1).padStart(2, '0'); // Ay 0-11 arası
    const day = String(correctedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  showInOutModal(data?: any, terminal?: any): void {
    this.terminalSelect = terminal;

    this.attendanceService.selectedItems$.pipe(take(1)).subscribe((vals) => {
      // personInfo normalize
      if (Array.isArray(vals) && vals.length > 0) {
        this.personInfoForInOut = vals;
      } else {
        this.personInfoForInOut = data?.data;
      }

      const list = Array.isArray(this.personInfoForInOut)
        ? this.personInfoForInOut
        : this.personInfoForInOut
        ? [this.personInfoForInOut]
        : [];

      // terminali number'a çevir (55=Giriş, 56=Çıkış)
      const term = Number(this.terminalSelect);

      // yardımcılar
      const getProp = (obj: any, key: string) => {
        if (!obj) return undefined;
        // case-insensitive güvenlik (ggiris/GCikis gibi varyantlar için)
        const found = Object.keys(obj).find(
          (k) => k.toLowerCase() === key.toLowerCase()
        );
        return found ? obj[found] : undefined;
      };
      const isFilled = (v: any) => v !== null && v !== undefined && v !== '';

      // sadece ilgili alanı kontrol et
      let hasForTerminal = false;
      if (term === 55) {
        // GİRİŞ
        hasForTerminal = list.some((item) => isFilled(getProp(item, 'ggiris')));
      } else if (term === 56) {
        // ÇIKIŞ
        hasForTerminal = list.some((item) => isFilled(getProp(item, 'gcikis')));
      } else {
        // bilinmeyen terminal gelirse eski davranışa düş
        hasForTerminal = list.some(
          (item) =>
            isFilled(getProp(item, 'ggiris')) ||
            isFilled(getProp(item, 'gcikis'))
        );
      }

      if (hasForTerminal) {
        const typeText =
          term === 55 ? 'Girişte' : term === 56 ? 'Çıkışta' : 'Terminalde';
        const message = `${typeText} kayıtlı olan kayıt silinsin mi?`;

        this.confirmationService
          // confirmDelete(itemName, title?) — title olarak message veriyoruz
          .confirmDelete('', message)
          .then((result) => {
            this.displayInOut = true;
            if (result.isConfirmed) {
              this.silinsin = 1; // silinecek
            } else {
              this.silinsin = 0; // silinmeyecek
            }
          });
      } else {
        // ilgili alan boş → popup yok, direkt aç
        this.silinsin = 0;
        this.displayInOut = true;
      }

      this.ref.detectChanges();
    });
  }

  onHideInOutModal(): void {
    this.displayInOut = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    savedFilterModel = null;
  }
}

export const localeTr: { [key: string]: string } = {
  searchOoo: 'Arama...',
  filterOoo: 'Filtre...',
  rowGroupColumnsEmptyMessage: 'Satırları gruplamak için buraya sürükleyin',
};

var filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('-');
    var cellDate = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
  minValidYear: 2000,
  maxValidYear: 2058,
  inRangeFloatingFilterDateFormat: 'YYYY MMM Do',
};

var savedFilterModel: any = null;
