import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, delay, filter, map, Subject, takeUntil } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ProfileService } from '../../profile/profile.service';
import { AttendanceService } from '../attendance.service';
import { FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, GridApi, IProvidedFilter, ISetFilterParams } from 'ag-grid-community';
import {
  ColDef,
  ColGroupDef,
  IDateFilterParams,
  IMultiFilterParams,
  IRowNode,
  IsRowSelectable,
  ITextFilterParams,
  RowHeightParams,
  SideBarDef,
  StatusPanelDef,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import * as moment from 'moment';
import { OrganizationColumnFilterComponent } from '../organization-column-filter/organization-column-filter.component';
import { formatDate } from '@angular/common';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { SearchFilterPipe } from 'src/app/_helpers/pipes/search-filter.pipe';

@Component({
  selector: 'app-attendance-pivot-list',
  templateUrl: './attendance-pivot-list.component.html',
  styleUrls: ['./attendance-pivot-list.component.scss'],
})
export class AttendancePivotListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('agGridLight', { static: false }) agGridLight: AgGridAngular;
  @ViewChild('agGridDark', { static: false }) agGridDark: AgGridAngular;
  selectedTab: string = '3';
  tabList = [
    { name: this.translateService.instant('Planlanan_Gerçekleşen'), type: '0' },
    { name: this.translateService.instant('Plan_Uyarılar'), type: '1' },
    { name: this.translateService.instant('Vardiya_Plan'), type: '2' },
  ];

  tabListProcess = [
    {
      name: this.translateService.instant('Mesailer'),
      type: '0',
      icon: 'fa-solid fa-calendar-days',
    },
    {
      name: this.translateService.instant('İzinler'),
      type: '1',
      icon: 'fa-solid fa-image',
    },
    {
      name: this.translateService.instant('Geçmiş'),
      type: '2',
      icon: 'fa-solid fa-clock-rotate-left',
    },
    {
      name: this.translateService.instant('FM_Sıra'),
      type: '3',
      icon: 'fa-solid fa-business-time',
    },
  ];

  selectedRange = '1';
  rangeList = [
    { name: this.translateService.instant('Aylık'), range: '30' },
    { name: this.translateService.instant('Haftalık'), range: '7' },
    { name: this.translateService.instant('Günlük'), range: '1' },
    { name: this.translateService.instant('Özel'), range: '-1' },
  ];

  private gridApi!: GridApi<any>;

  gridHeight = '80vh';
  gridStyle: any = {
    height: this.gridHeight,
    flex: '1 1 auto',
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    // Sütunların eklendiği ve sütun özelliklerinin ayarladığı kısım
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
      hide: false,
      children: [
        // {
        //   headerName: this.translateService.instant('SID'),
        //   field: 'sicilid',
        //   headerTooltip: this.translateService.instant('Sicil_Id'),
        //   type: 'numericColumn',
        //   filter: false,
        //   cellClass: (params) => this.applyWeekendClass(params),
        //   hide: false,
        //   pinned:'left',
        // },
        {
          headerName: this.translateService.instant('Sicil_No'),
          field: 'sicilno',
          headerTooltip: this.translateService.instant('Sicil_No'),
          filter: 'agTextColumnFilter',
          filterParams: {
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
          pinned: 'left',
          width: 120,
          minWidth: 120,
        },
        {
          headerName: this.translateService.instant('Personel'),
          field: 'personel',
          headerTooltip: this.translateService.instant('Personel'),
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
          pinned: 'left',
          width: 150,
          minWidth: 150,
        },
      ],
    },

    //Organizasyon Bilgileri
    {
      headerName: 'Organizasyon Bilgileri',
      headerClass: 'organization-group',
      marryChildren: true,
      groupId: 'organizationGroup',
      hide: true,
      children: [
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

    {
      colId: 'plan',
      headerName: this.translateService.instant('Plan'),
      field: 'planlanan',
      headerTooltip: this.translateService.instant('Plan'),
      rowGroup: false,
      enableRowGroup: true,
      hide: false,
      filter: false,
      pinned: 'right',
      cellClass: (params) => this.applyWeekendClass(params),
      width: 100,
      minWidth: 100,
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
    menuTabs: ['filterMenuTab'],
    // cellStyle: { height: '100px', fontWeight: 'bold' }
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
  gridOptionsLight = {};
  gridOptionsDark = {};

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
  formGroup: FormGroup;
  isCancel: boolean = false;
  displayFilterModal: boolean = false;
  filterFromModal: boolean = false;
  filterValueFromModal: { formValues: any };
  cancelRequest: Subject<void> = new Subject<void>();
  isOpen: boolean = false;
  savedFilterModel: any;
  columnDefsTemp: (ColDef<any, any> | ColGroupDef<any>)[] = [];
  shiftList: any[] = [];
  filterText: string = '';
  selectedShift: any;
  filteredItems: any[] = [];
  vacationList: OKodFieldsModel[] = [];
  selectedProcess: any = { type: 0 };
  selectedVacation: any;
  processExpanded: boolean = false;
  overtimeSubtotal: any[] = [];
  processLoading: boolean = false;
  assignmentLogList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private translateService: TranslateService,
    private attendanceService: AttendanceService,
    private themeModeService: ThemeModeService,
    private ref: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.setInitialDates();
    this.subscribeToDateRangeChanges();
    this.subscribeToDateChanges();
    this.getAttendancePivotData();
    this.getShiftList();
  }

  onFilterOpened(e: FilterOpenedEvent) {
    console.log('onFilterOpened', e);
  }

  onFilterChanged(e: FilterChangedEvent) {
    this.saveFilterModel();
  }

  onFilterModified(e: FilterModifiedEvent) {}

  saveFilterModel() {
    const subscr = this.themeModeService.mode
      .asObservable()
      .subscribe((mode) => {
        savedFilterModel =
          mode === 'light'
            ? this.agGridLight.api.getFilterModel()
            : this.agGridDark.api.getFilterModel();
      });

    console.log('SavedFilterModel: ', savedFilterModel);

    this.savedFilterModel = savedFilterModel;
    this.getAttendancePivotData();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      dateRange: ['1'], // Günlük seçili olarak başlıyor
      startDate: [moment().format('YYYY-MM-DD')],
      endDate: [moment().format('YYYY-MM-DD')],
    });
  }

  setInitialDates() {
    const today = moment();
    this.formGroup.get('startDate')?.setValue(today.format('YYYY-MM-DD'));
    this.formGroup.get('endDate')?.setValue(today.format('YYYY-MM-DD'));
  }

  subscribeToDateChanges() {
    const startDate$ = this.formGroup.get('startDate')?.valueChanges;
    const endDate$ = this.formGroup.get('endDate')?.valueChanges;

    if (startDate$ && endDate$) {
      combineLatest([startDate$, endDate$])
        .pipe(filter(([startDate, endDate]) => startDate && endDate))
        .subscribe(([startDate, endDate]) => {
          const start = moment(startDate);
          const end = moment(endDate);

          if (start.isAfter(end)) {
            this.formGroup
              .get('endDate')
              ?.setValue(start.format('YYYY-MM-DD'), { emitEvent: false });
          } else if (end.isBefore(start)) {
            this.formGroup
              .get('startDate')
              ?.setValue(end.format('YYYY-MM-DD'), { emitEvent: false });
          }

          if (this.formGroup.get('dateRange')?.value == '-1') {
            this.getAttendancePivotData();
          }
        });
    }
  }

  subscribeToDateRangeChanges() {
    this.formGroup.get('dateRange')?.valueChanges.subscribe((range) => {
      const start = moment(this.formGroup.get('startDate')?.value);

      if (range == '1') {
        // Günlük
        this.formGroup.get('endDate')?.setValue(start.format('YYYY-MM-DD'));
      } else if (range == '7') {
        // Haftalık
        const startOfWeek = start.clone().startOf('isoWeek');
        const endOfWeek = start.clone().endOf('isoWeek');
        this.formGroup
          .get('startDate')
          ?.setValue(startOfWeek.format('YYYY-MM-DD'));
        this.formGroup.get('endDate')?.setValue(endOfWeek.format('YYYY-MM-DD'));
      } else if (range == '30') {
        // Aylık
        const startOfMonth = start.clone().startOf('month');
        const endOfMonth = start.clone().endOf('month');
        this.formGroup
          .get('startDate')
          ?.setValue(startOfMonth.format('YYYY-MM-DD'));
        this.formGroup
          .get('endDate')
          ?.setValue(endOfMonth.format('YYYY-MM-DD'));
      }

      if (range != '-1') {
        this.getAttendancePivotData();
      }
    });
  }

  previousDate() {
    const range = this.formGroup.get('dateRange')?.value;
    const startDate = moment(this.formGroup.get('startDate')?.value);
    const endDate = moment(this.formGroup.get('endDate')?.value);

    if (range === '1') {
      startDate.subtract(1, 'days');
      endDate.subtract(1, 'days');
    } else if (range === '7') {
      startDate.subtract(1, 'weeks').startOf('isoWeek');
      endDate.subtract(1, 'weeks').endOf('isoWeek');
    } else if (range === '30') {
      startDate.subtract(1, 'months').startOf('month');
      endDate.subtract(1, 'months').endOf('month');
    }

    this.formGroup.get('startDate')?.setValue(startDate.format('YYYY-MM-DD'));
    this.formGroup.get('endDate')?.setValue(endDate.format('YYYY-MM-DD'));

    this.getAttendancePivotData();
  }

  nextDate() {
    const range = this.formGroup.get('dateRange')?.value;
    const startDate = moment(this.formGroup.get('startDate')?.value);
    const endDate = moment(this.formGroup.get('endDate')?.value);

    if (range === '1') {
      startDate.add(1, 'days');
      endDate.add(1, 'days');
    } else if (range === '7') {
      startDate.add(1, 'weeks').startOf('isoWeek');
      endDate.add(1, 'weeks').endOf('isoWeek');
    } else if (range === '30') {
      startDate.add(1, 'months').startOf('month');
      endDate.add(1, 'months').endOf('month');
    }

    this.formGroup.get('startDate')?.setValue(startDate.format('YYYY-MM-DD'));
    this.formGroup.get('endDate')?.setValue(endDate.format('YYYY-MM-DD'));

    this.getAttendancePivotData();
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

  onSelectionChangedLight() {
    const selectedRows = this.agGridLight.api.getSelectedRows();
    console.log('Seçilenler : ', selectedRows);
    this.attendanceService.setSelectedItems(selectedRows);
  }

  onSelectionChangedDark() {
    const selectedRows = this.agGridDark.api.getSelectedRows();
    console.log('Seçilenler : ', selectedRows);
    this.attendanceService.setSelectedItems(selectedRows);
  }

  getImageGrid(params: any, imageSize = '10') {
    if (params?.data?.sicilid == undefined) {
      return '';
    }

    return (
      `
    <div class="bg-hover-light d-flex justify-content-center mt-1">
      <img style="width: 23px; height: 23px; border-radius: 5px;" src="http://localhost:5075/api/Image?sicilid=` +
      params.data.sicilid +
      `">
    </div>`
    );
  }

  getRowHeight(params: RowHeightParams): number | undefined | null {
    // const dateKeys = Object.keys(params.data).filter((key) =>
    //   /^y\d{4}x\d{2}x\d{2}$/.test(key)
    // );

    // for (const key of dateKeys) {
    //   if (params.data[key] && params.data[key].includes('<br>')) {
    //     return 60;
    //   }
    // }
    // return 30;

    return 40;
  }

  getAttendancePivotData() {
    if (this.columnDefsTemp.length > 0) {
      this.columnDefs = this.columnDefsTemp;
    }
    this.rowData = [];
    this.value = 30;
    this.loading = true;
    var sp: any[] = !this.filterFromModal
      ? [
          {
            mkodu: 'yek112',
            tarih: this.formGroup.get('startDate')?.value,
            tarihbit: this.formGroup.get('endDate')?.value,
            ad: savedFilterModel?.personel?.filter || '',
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
            sicilid: '',
          },
        ]
      : [
          {
            mkodu: 'yek112',
            tarih: this.formGroup.get('startDate')?.value, //Burası düzenlenecek
            tarihbit: this.formGroup.get('endDate')?.value, //Burası düzenlenecek
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
            sicilid: '',
          },
        ];

    console.log('PDKS Guid Parametreler:', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc != 1) {
            this.value = 100;
            this.loading = false;
            return;
          }
          console.log('PDKS Pivot Listesi: ', data);

          this.columnDefsTemp = this.columnDefs;
          const processedData = this.processApiResponse(data);
          const newColumnDefs = this.createColumnDefs(processedData);

          this.columnDefs = [...this.columnDefs, ...newColumnDefs];

          this.rowData = [...this.rowData, ...processedData];

          this.agGridLight.api.setColumnDefs(this.columnDefs);
          this.agGridLight.api.setRowData(this.rowData);

          this.agGridDark.api.setColumnDefs(this.columnDefs);
          this.agGridDark.api.setRowData(this.rowData);

          this.gridOptionsLight = {
            localeTextFunc: (key: string, defaultValue: string) => {
              const data = this.translateService.instant(key);
              return data === key ? defaultValue : data;
            },
          };

          this.gridOptionsDark = {
            localeTextFunc: (key: string, defaultValue: string) => {
              const data = this.translateService.instant(key);
              return data === key ? defaultValue : data;
            },
          };
          this.value = 100;

          if (this.value >= 100) {
            this.value = 100;
            this.loading = false;
          }

          // Hücreleri yeniden render et
          this.agGridLight.api.refreshCells();
          this.agGridDark.api.refreshCells();

          if (this.selectedProcess?.type == '3') {
            this.getOvertimeSubtotal();
          }

          this.ref.detectChanges();
        },
        (error) => {
          if (this.isCancel) {
            console.log('Request canceled');
          }
        }
      );
  }

  processApiResponse(data: any[]): any[] {
    return data.map((item) => {
      const newItem: any = {};

      Object.keys(item).forEach((key) => {
        // Tarih anahtarlarını dönüştür
        if (/^\d{4}\.\d{2}\.\d{2}$/.test(key)) {
          const [year, month, day] = key.split('.');
          const newKey = `y${year}x${month}x${day}`;
          // newItem[newKey] = item[key].split(',')[0];
          newItem[newKey] = item[key];
        } else {
          newItem[key] = item[key];
        }
      });

      return newItem;
    });
  }

  createColumnDefs(data: any[]): ColDef[] {
    const dateKeys = Object.keys(data[0]).filter((key) =>
      /^y\d{4}x\d{2}x\d{2}$/.test(key)
    );

    const dateColumns = dateKeys.map((dateKey) => {
      // Tarih anahtarını '2024.08.06' formatına dönüştürdüm
      const parts = dateKey.split('x');
      const year = parts[0].slice(1); // 'y' karakterini atmak için slice(1) kullandım
      const month = parts[1];
      const day = parts[2];
      const originalDateKey = `${year}.${month}.${day}`;

      const date = new Date(originalDateKey.replace(/\./g, '-'));
      const formattedDate = formatDate(date, 'dd-MM-yyyy', 'en-US');
      const dayOfWeek = formatDate(date, 'EEEE', 'en-US');
      const translatedDayOfWeek = this.translateService.instant(dayOfWeek);
      return {
        // headerName: `${formattedDate}\n${dayOfWeek}`,
        field: dateKey,
        filter: false,
        width: 90,
        minWidth: 90,
        headerComponentParams: {
          template: `<div class="m-auto">
                      <div class="ui-grid-vertical-bar">&nbsp;</div>
                      <div class="ui-grid-cell-contents" align="center">
                        ${formattedDate}<br>${translatedDayOfWeek}
                      </div>
                    </div>`,
        },
        cellClass: (params: any) => this.pivotCellClass(params),
        // valueFormatter: (params:any) => this.pivotCellParse(params),
        cellRenderer: (params: any) => this.pivotSetValue(params),
      };
    });

    return [...dateColumns];
  }

  pivotSetValue(params: any): string {
    if (params?.data?.sicilid == undefined) {
      return '';
    }

    const dateKeys = Object.keys(params.data).filter((key) =>
      /^y\d{4}x\d{2}x\d{2}$/.test(key)
    );

    return dateKeys
      .map((key) => {
        if (params?.column?.colId === key) {
          let value = params?.data[key];

          let parts = value.split(',');
          let color = parts[1];
          if (color === 'green') {
            let firstValue = parts[0].split('<br>')[0] || '';
            let secondValue = parts[0].split('<br>')[1] || '';
            return `
            <div class="fw-bolder">
              ${firstValue}
              <br>
              ${secondValue}
            </div>
          `;
          }

          return `<div class="fw-bolder">${value.split(',')[0]}</div>`;
        }
        return '';
      })
      .join('');
  }

  changeTabMenu(menu: any) {
    if (this.selectedTab == menu) {
      return;
    }
    this.selectedTab = menu;
    this.getAttendancePivotData();
  }

  convertFromMinuteToHour(params: ValueFormatterParams) {
    // Dakikayı moment nesnesine dönüştürdüm
    const time = moment.duration(params.value, 'minutes');
    // Saat cinsine dönüştürülen zamanı formatladım
    const formattedTime = moment.utc(time.asMilliseconds()).format('HH:mm');
    return formattedTime;
  }

  parseEntryExit(params: ValueFormatterParams) {
    if (!params.value) {
      return '__:__';
    } else {
      return moment(params.value).format('HH:mm:ss');
    }
  }

  applyWeekendClass(params: any) {
    if (params.column.colId == 'plan') {
      return 'cell-weekend d-flex justify-content-center align-items-center';
    } else {
      return 'cell-weekend';
    }
  }

  pivotCellClass(params: any) {
    if(!params.data) {
      return;
    }
    
    const dateKeys = Object.keys(params?.data).filter((key) =>
      /^y\d{4}x\d{2}x\d{2}$/.test(key)
    );

    for (const key of dateKeys) {
      if (params.column.colId === key) {
        const color = params.data[key].split(',')[1].trim();

        switch (color) {
          case 'blue':
            return 'piv-cell-blue d-flex justify-content-center align-items-center';
          case 'yellow-casablanca':
            return 'piv-cell-yellow-casablanca d-flex justify-content-center align-items-center';
          case 'green':
            return 'piv-cell-green d-flex justify-content-center align-items-center lh-sm';
          case 'red':
            return 'piv-cell-red d-flex justify-content-center align-items-center';
          case 'white':
            return 'piv-cell-white d-flex justify-content-center align-items-center';
          default:
            return 'piv-cell-white d-flex justify-content-center align-items-center';
        }
      }
    }

    return 'piv-cell-white d-flex justify-content-center align-items-center';
  }

  pivotCellParse(params: ValueFormatterParams) {
    let parsedValue = params?.value.split(',')[0];
    return parsedValue;
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
    this.agGridLight.api.setFilterModel(null);
    this.agGridDark.api.setFilterModel(null);
  }

  setFilterFormFromModal(value: { formValues: any }) {
    console.log('Filtre Geldii. :', value);
    this.filterValueFromModal = value;
    this.filterFromModal = true;

    this.getAttendancePivotData();
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
        this.agGridLight.columnApi.getAllGridColumns()
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
      .requestMethod(sp)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map((response) => this.parseValue(response[0].x[0].deger))
      )
      .subscribe((response: any) => {
        console.log('Grid Settings: ', response);
        this.setColumnWidths(response);
      });
  }

  private parseValue(
    value: string
  ): { col: string; width: string; visible: string }[] {
    return value.split('|').map((item) => {
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
      const widthInfo = widths.find((w) => w.col === colDef.field);
      if (widthInfo) {
        colDef.width = parseInt(widthInfo.width, 10);
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

    if (this.agGridLight) {
      this.agGridLight.api.setColumnDefs(this.columnDefs);
      this.agGridLight.api.sizeColumnsToFit();
      console.log('ColumnDef: ', this.columnDefs);
    } else if (this.agGridDark) {
      this.agGridDark.api.setColumnDefs(this.columnDefs);
    } else {
      console.error('Sanırım bir problem var!');
    }
  }

  sendColumnStateToApi() {
    const allColumns = this.agGridLight.columnApi.getAllColumns();
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
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        console.log('Grid Settings Are Send: ', response);
      });
  }

  getShiftList() { // Mesai Birimlerini Almak İçin API'ye İstek
    this.processLoading = false;
    this.profileService
      .getTypeValues('mesailer')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == 1) {
            this.shiftList = data;
            console.log('Mesai Birimleri : ', data);
            this.processLoading = true;
          }

          this.ref.detectChanges();
        }
      );
  }

  selectShift(shift: OKodFieldsModel) {
    this.selectedShift = shift;
  }

  selectVacation(vacation: OKodFieldsModel) {
    this.selectedVacation = vacation;
  }

  filterTextChange() {
    const searchPipe = new SearchFilterPipe();
    if (this.selectedProcess?.type == '0') {
      this.filteredItems = searchPipe.transform(this.shiftList, this.filterText, ['ad',]);
      
    } else if (this.selectedProcess?.type == '1') {
      this.filteredItems = searchPipe.transform(this.vacationList, this.filterText, ['ad',]);
      
    } else if (this.selectedProcess?.type == '2') {
      this.filteredItems = searchPipe.transform(this.overtimeSubtotal, this.filterText, ['ad',]);
      
    } else if (this.selectedProcess?.type == '3') {
      this.filteredItems = searchPipe.transform(this.overtimeSubtotal, this.filterText, ['ad','soyad','sicilno']);
      
    }
    
  }

  changeProcess(process: any) {
    this.selectedShift = {};
    this.selectedVacation = {};
    this.selectedProcess = process;
    if (process.type == 0) {
      if (this.shiftList.length == 0) {
        this.getShiftList();
        return;
      }
    } else if (process.type == 1) {
      if (this.vacationList.length == 0) {
        this.getVacationList();
        return;
      }
    } else if (process.type == 2) {
      this.getAssignmentLog();
    } else if (process.type == 3) {
      this.getOvertimeSubtotal();
    }
  }

  getVacationList() {
    this.processLoading = false;

    this.profileService
      .getTypeValues('izintipleri')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == 1) {
            this.vacationList = data;
            console.log('İzin Tipleri : ', data);
            this.processLoading = true;

          }

          this.ref.detectChanges();
        }
      );
  }

  getAssignmentLog() {
    this.processLoading = false;

    var sp: any[] = [
      {mkodu: 'yek114'}
    ];
      

    console.log('Atama Log Parametreler:', sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc != 1) {
        return;
      }
      console.log('Atama log Listesi: ', data);

      // Data manipülasyonu
      this.assignmentLogList = data.map((item: any) => {
        // "islem" ve "AdSoyad" key'lerindeki boşlukları kaldırdım
        item.islem = item.islem.trim();
        item.AdSoyad = item.AdSoyad.trim();
        item.MesaiBirimi = item.MesaiBirimi.trim();

        // "Aciklama" key'inden Id değerini çekme ve JSON'a ekledim
        const idMatch = item.Aciklama.match(/Id:(\d+)/);
        if (idMatch) {
          item.sicilid = idMatch[1];
        }

        // "Aciklama" key'inden SicilNo değerini çekme ve JSON'a ekledim
        const sicilNoMatch = item.Aciklama.match(/SicilNo:(\S+)/);
        if (sicilNoMatch) {
          item.SicilNo = sicilNoMatch[1];
        }

        // "Aciklama" key'inden İzinTipi değerini çekme ve JSON' a ekleedim
        const izinTipiMatch = item.Aciklama.match(/İzinTipi:(.*)Tarih:/);
        if (izinTipiMatch) {
          item.IzinTipi = izinTipiMatch[1].trim();
        } 

        return item;
      });

      this.processLoading = true;
    });

  }

  getOvertimeSubtotal() {
    this.processLoading = false;

    var sp: any[] = !this.filterFromModal
      ? [
          {
            mkodu: 'yek113',
            ad: savedFilterModel?.personel?.filter || '',
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
          },
        ]
      : [
          {
            mkodu: 'yek112',
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
          },
        ];

    console.log('FM Sıra Parametreler:', sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x; 
      const message = response[0].z;

      if (message.islemsonuc != 1) {
        return;
      }
      console.log('FM Sıra Listesi: ', data);

      this.overtimeSubtotal = data;
      this.processLoading = true;

    });
  }

  expandProcess() {
    this.processExpanded = true;
  }

  collapseProcess() {
    this.processExpanded = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    savedFilterModel = null;
  }
}

var savedFilterModel: any = null;
