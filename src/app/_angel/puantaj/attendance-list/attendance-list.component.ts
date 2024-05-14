import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { delay, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
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
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { AttendanceService } from '../attendance.service';
import { FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, GridApi, IProvidedFilter, ISetFilterParams } from 'ag-grid-community';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { OrganizationColumnFilterComponent } from '../organization-column-filter/organization-column-filter.component';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss'],
})
export class AttendanceListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('agGridLight', { static: false }) agGridLight: AgGridAngular;
  @ViewChild('agGridDark', { static: false }) agGridDark: AgGridAngular;

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
    { name: 'Özel', range: '-1' },
  ];

  private gridApi!: GridApi<any>;

  gridHeight = '80vh';
  gridStyle: any = {
    height: this.gridHeight,
    flex: '1 1 auto',
  };

  public columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: '#',
      colId: '#',
      pinned: 'left',
      minWidth: 50,
      maxWidth: 50,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      filter: false,
      checkboxSelection: true,
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
    },

    //Kişi Bilgileri
    {
      headerName: 'Kişi Bilgileri',
      marryChildren: true,
      headerClass: 'person-group',
      groupId: 'PersonInfoGroup',
      // headerGroupComponent: CustomHeaderGroup,
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
        },
        {
          headerName: this.translateService.instant('Sicil_No'),
          field: 'sicilno',
          headerTooltip: this.translateService.instant('Sicil_No'),
          filter: 'agTextColumnFilter',
          filterParams: {
            // buttons: ['reset', 'apply'],
            textMatcher: ({ filterOption, value, filterText }: { filterOption: string, value: string, filterText: string }) => {
              return true;
            },
            debounceMs: 3000
          },
          cellClass: (params) => this.applyWeekendClass(params),
        },
        {
          headerName: this.translateService.instant('Ad'),
          field: 'ad',
          headerTooltip: this.translateService.instant('Ad'),
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            textMatcher: ({ filterOption, value, filterText }: { filterOption: string, value: string, filterText: string }) => {
              return true;
            },
          },
          cellClass: (params) => this.applyWeekendClass(params),
        },
        {
          headerName: this.translateService.instant('Soyad'),
          field: 'soyad',
          headerTooltip: this.translateService.instant('Soyad'),
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            textMatcher: ({ filterOption, value, filterText }: { filterOption: string, value: string, filterText: string }) => {
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
          // filterParams: {
          //   values: async (params) => {
          //     try {
          //       // async update simulated using setTimeout()
          //       setTimeout(async () => {
          //           // fetch values from server
          //           const values = await this.getOrganizationInfo('cbo_firma');
          //           // supply values to the set filter
          //           params.success(values);
          //       }, 3000);
          //     } catch (error) {
          //       console.error("An error occurred while fetching organization info:", error);
          //       // Alternatively, you can handle the error in a different way here
          //       // For example, you can display an error message to the user
          //       // or perform any other action as needed
          //     }
          //   }
          // } as ISetFilterParams,
        },

        {
          headerName: this.translateService.instant('Alt_Firma'),
          field: 'altfirmaad',
          headerTooltip: this.translateService.instant('Alt_Firma_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: 'agSetColumnFilter',
          filterParams: {
            values: async (params) => {
              try {
                // async update simulated using setTimeout()
                setTimeout(async () => {
                    // fetch values from server
                    const values = await this.getOrganizationInfo('cbo_altfirma');
                    // supply values to the set filter
                    params.success(values);
                }, 3000);
              } catch (error) {
                console.error("An error occurred while fetching organization info:", error);
                // Alternatively, you can handle the error in a different way here
                // For example, you can display an error message to the user
                // or perform any other action as needed
              }
            }
          } as ISetFilterParams,
        },
        {
          headerName: this.translateService.instant('Yaka'),
          field: 'yakaad',
          headerTooltip: this.translateService.instant('Yaka_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: 'agSetColumnFilter',
          filterParams: {
            values: async (params) => {
              try {
                // async update simulated using setTimeout()
                setTimeout(async () => {
                    // fetch values from server
                    const values = await this.getOrganizationInfo('cbo_yaka');
                    // supply values to the set filter
                    params.success(values);
                }, 3000);
              } catch (error) {
                console.error("An error occurred while fetching organization info:", error);
                // Alternatively, you can handle the error in a different way here
                // For example, you can display an error message to the user
                // or perform any other action as needed
              }
            }
          } as ISetFilterParams,
        },
        {
          headerName: this.translateService.instant('Bölüm'),
          field: 'bolumad',
          headerTooltip: this.translateService.instant('Bölüm_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: 'agSetColumnFilter',
          filterParams: {
            values: async (params) => {
              try {
                // async update simulated using setTimeout()
                setTimeout(async () => {
                    // fetch values from server
                    const values = await this.getOrganizationInfo('cbo_bolum');
                    // supply values to the set filter
                    params.success(values);
                }, 3000);
              } catch (error) {
                console.error("An error occurred while fetching organization info:", error);
                // Alternatively, you can handle the error in a different way here
                // For example, you can display an error message to the user
                // or perform any other action as needed
              }
            }
          } as ISetFilterParams,
        },
        {
          headerName: this.translateService.instant('Görev'),
          field: 'gorevad',
          headerTooltip: this.translateService.instant('Görev_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: 'agSetColumnFilter',
          filterParams: {
            values: async (params) => {
              try {
                // async update simulated using setTimeout()
                setTimeout(async () => {
                    // fetch values from server
                    const values = await this.getOrganizationInfo('cbo_gorev');
                    // supply values to the set filter
                    params.success(values);
                }, 3000);
              } catch (error) {
                console.error("An error occurred while fetching organization info:", error);
                // Alternatively, you can handle the error in a different way here
                // For example, you can display an error message to the user
                // or perform any other action as needed
              }
            }
          } as ISetFilterParams,
        },
        {
          headerName: this.translateService.instant('Pozisyon'),
          field: 'pozisyonad',
          headerTooltip: this.translateService.instant('Pozisyon_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: 'agSetColumnFilter',
          filterParams: {
            values: async (params) => {
              try {
                // async update simulated using setTimeout()
                setTimeout(async () => {
                    // fetch values from server
                    const values = await this.getOrganizationInfo('cbo_pozisyon');
                    // supply values to the set filter
                    params.success(values);
                }, 3000);
              } catch (error) {
                console.error("An error occurred while fetching organization info:", error);
                // Alternatively, you can handle the error in a different way here
                // For example, you can display an error message to the user
                // or perform any other action as needed
              }
            }
          } as ISetFilterParams,
        },
        {
          headerName: this.translateService.instant('Direktörlük'),
          field: 'direktorlukad',
          headerTooltip: this.translateService.instant('Direktörlük_Adı'),
          rowGroup: false,
          enableRowGroup: true,
          hide: true,
          filter: 'agSetColumnFilter',
          filterParams: {
            values: async (params) => {
              try {
                // async update simulated using setTimeout()
                setTimeout(async () => {
                    // fetch values from server
                    const values = await this.getOrganizationInfo('cbo_direktorluk');
                    // supply values to the set filter
                    params.success(values);
                }, 3000);
              } catch (error) {
                console.error("An error occurred while fetching organization info:", error);
                // Alternatively, you can handle the error in a different way here
                // For example, you can display an error message to the user
                // or perform any other action as needed
              }
            }
          } as ISetFilterParams,
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
      children: [
        {
          headerName: this.translateService.instant('Mesai_Tarihi'),
          field: 'mesaitarih',
          headerTooltip: this.translateService.instant('Mesai_Tarihi'),
          filter: 'agDateColumnFilter',
          filterParams: filterParams,
          cellClass: (params) => this.applyWeekendClass(params),
          sort: 'asc',
        },
        {
          headerName: this.translateService.instant('Giriş'),
          field: 'ggiris',
          headerTooltip: this.translateService.instant('Giriş'),
          filter: false,
          valueFormatter: (params) => this.parseEntryExit(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('Çıkış'),
          field: 'gcikis',
          headerTooltip: this.translateService.instant('Çıkış'),
          filter: false,
          valueFormatter: (params) => this.parseEntryExit(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('Mesai_Açıklama'),
          field: 'mesaiaciklama',
          headerTooltip: this.translateService.instant('Mesai_Açıklama'),
          // filter: 'agMultiColumnFilter',
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            textMatcher: ({ filterOption, value, filterText }: { filterOption: string, value: string, filterText: string }) => {
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
        },
        {
          headerName: this.translateService.instant('MS'),
          field: 'mesaisuresi',
          headerTooltip: this.translateService.instant('Mesai_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.applyWeekendClass(params),
        },
        {
          headerName: this.translateService.instant('NM'),
          field: 'normalmesai',
          headerTooltip: this.translateService.instant('Normal_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('AS'),
          field: 'arasure',
          headerTooltip: this.translateService.instant('Ara_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('FM'),
          field: 'fazlamesai',
          headerTooltip: this.translateService.instant('Fazla_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('OFM'),
          field: 'onaylananfazlamesai',
          headerTooltip: this.translateService.instant('Onaylanan_Fazla_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
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
        },
        {
          headerName: this.translateService.instant('EM'),
          field: 'eksikmesai',
          headerTooltip: this.translateService.instant('Eksik_Mesai'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('RM'),
          field: 'resmitatilsuresi',
          headerTooltip: this.translateService.instant('Resmi_Tatil_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('GV'),
          field: 'gecevardiya',
          headerTooltip: this.translateService.instant('Gece_Vardiyası'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('GZ'),
          field: 'gecezammi',
          headerTooltip: this.translateService.instant('Gece_Zammı'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('IZS'),
          field: 'izinsuresi',
          headerTooltip: this.translateService.instant('Saatlik_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('YIZS'),
          field: 'yillikizinsuresi',
          headerTooltip: this.translateService.instant('Yıllık_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('SGKIZS'),
          field: 'sgkizinsuresi',
          headerTooltip: this.translateService.instant('SGK_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('UCZIZS'),
          field: 'ucretsizizinsuresi',
          headerTooltip: this.translateService.instant('Ücretsiz_İzin_Süresi'),
          filter: false,
          valueFormatter: (params) => this.convertFromMinuteToHour(params),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('RM_Açıklama'),
          field: 'resmitatilaciklama',
          headerTooltip: this.translateService.instant('Resmi_Tatil_Açıklama'),
          cellClass: (params) => this.timeClassChange(params),
        },
        {
          headerName: this.translateService.instant('İzin_Açıklama'),
          field: 'izinaciklama',
          headerTooltip: this.translateService.instant('İzin_Açıklama'),
        },
      ],
    },
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 90,
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
  attendanceInfo: any[] = [];
  attendanceList: any[] = [];
  formGroup: FormGroup;
  currentDate = new Date(Date.now());
  isCancel: boolean = false;
  companyList: OKodFieldsModel[] = [];
  positionList: OKodFieldsModel[] = [];
  collarList: OKodFieldsModel[] = [];
  subsidiaryList: OKodFieldsModel[] = [];
  directorshipList: OKodFieldsModel[] = [];
  jobList: OKodFieldsModel[] = [];
  departmentList: OKodFieldsModel[] = [];
  companyFilterList: any;
  jobFilterList: any;
  directorshipFilterList: any;
  subsidiaryFilterList: any;
  collarFilterList: any;
  departmentFilterList: any;
  positionFilterList: any;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private translateService: TranslateService,
    private puantajService: AttendanceService,
    private themeModeService: ThemeModeService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.changeStartDate();
    this.changeEndDate();
    this.changeDateRange();
    this.getAttendanceInfo();
  }

  onFilterOpened(e: FilterOpenedEvent) {
    console.log('onFilterOpened', e);
  }

  onFilterChanged(e: FilterChangedEvent) {
    // console.log("onFilterChanged", e);
    // // console.log("onFilterChanged", e.columns[0].getColId());
    // let t = e.api.getFilterModel();
    // console.log("onFilterChanged", t);
    this.saveFilterModel();
  }

  onFilterModified(e: FilterModifiedEvent) {
    // console.log("onFilterModified", e);
    // console.log("filterInstance.getModel() =>", e.filterInstance.getModel());
    // console.log(
    //   "filterInstance.getModelFromUi() =>",
    //   (e.filterInstance as unknown as IProvidedFilter).getModelFromUi(),
    // );
  }

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

    this.replaceValuesWithIds(savedFilterModel, this.companyList, "firmaad").then((replacedObj:any) => {
      this.companyFilterList = replacedObj;
      console.log("this.companyFilterList: ", this.companyFilterList);
    });

    this.replaceValuesWithIds(savedFilterModel, this.positionList, "pozisyonad").then((replacedObj:any) => {
      this.positionFilterList = replacedObj;
      console.log("this.companyFilterList: ", this.companyFilterList);
    });

    this.replaceValuesWithIds(savedFilterModel, this.departmentList, "bolumad").then((replacedObj:any) => {
      this.departmentFilterList = replacedObj;
      console.log("this.companyFilterList: ", this.companyFilterList);
    });

    this.replaceValuesWithIds(savedFilterModel, this.collarList, "yakaad").then((replacedObj:any) => {
      this.collarFilterList = replacedObj;
      console.log("this.companyFilterList: ", this.companyFilterList);
    });

    this.replaceValuesWithIds(savedFilterModel, this.subsidiaryList, "altfirmaad").then((replacedObj:any) => {
      this.subsidiaryFilterList = replacedObj;
      console.log("this.companyFilterList: ", this.companyFilterList);
    });

    this.replaceValuesWithIds(savedFilterModel, this.directorshipList, "direktorlukad").then((replacedObj:any) => {
      this.directorshipFilterList = replacedObj;
      console.log("this.companyFilterList: ", this.companyFilterList);
    });

    this.replaceValuesWithIds(savedFilterModel, this.jobList, "gorevad").then((replacedObj:any) => {
      this.jobFilterList = replacedObj;
      console.log("this.companyFilterList: ", this.companyFilterList);
    });
    
    
    this.getAttendanceInfo();
  }

  async replaceValuesWithIds(filterModel: any, listToUpdate: any[], filterKey: any): Promise<any> {
    const copiedFilterModel = JSON.parse(JSON.stringify(filterModel));
  
    for (const key in copiedFilterModel) {
      // if (copiedFilterModel.hasOwnProperty(key)) {
      if (copiedFilterModel.hasOwnProperty(key) && key == filterKey) {
        const filter = copiedFilterModel[key];
  
        if (filter.hasOwnProperty('values')) {
          const values = filter.values;
  
          for (let i = 0; i < values.length; i++) {
            const value = values[i];
            // value, listToUpdate içinde bir eleman olarak varsa, onun karşılığı olan "ID" ile değiştiriyoruz
            const foundItem = listToUpdate.find(item => item.Ad === value);
            if (foundItem) {
              values[i] = foundItem.ID;
            }
          }
        }
      }
    }
  
    return copiedFilterModel;
  }
  

  createForm() {
    this.formGroup = this.formBuilder.group({
      dateRange: ['1'],
      startDate: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en')],
      endDate: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en')],
    });
  }

  changeStartDate() {
    this.formGroup
      .get('startDate')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((item) => {
        const endDateValue = new Date(this.formGroup.get('endDate')?.value);

        if (new Date(item) > endDateValue) {
          console.log('Başlangıç Değeri, Bitiş Tarihinden Büyük Olamaz!!');
          this.formGroup
            .get('startDate')
            ?.setValue(formatDate(endDateValue, 'yyyy-MM-dd', 'en'));
        }

        if (this.formGroup.get('dateRange')?.value == '-1') {
          this.getAttendanceInfo();
        }
      });
  }

  changeEndDate() {
    this.formGroup
      .get('endDate')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((item) => {
        const startDateValue = new Date(this.formGroup.get('startDate')?.value);

        if (new Date(item) < startDateValue) {
          console.log('Bitiş Tarihi, Başlangıç Değerinden Küçük Olamaz!!');
          this.formGroup
            .get('endDate')
            ?.setValue(formatDate(startDateValue, 'yyyy-MM-dd', 'en'));
        }

        if (this.formGroup.get('dateRange')?.value == '-1') {
          this.getAttendanceInfo();
        }
      });
  }

  changeDateRange() {
    this.formGroup
      .get('dateRange')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((item) => {
        console.log('item : ', item);

        const startDateValue = new Date(this.formGroup.get('startDate')?.value);
        const endDateValue = new Date(this.formGroup.get('endDate')?.value);

        if (item == '1') {
          this.formGroup
            .get('startDate')
            ?.setValue(formatDate(startDateValue, 'yyyy-MM-dd', 'en'));
          this.formGroup
            .get('endDate')
            ?.setValue(formatDate(startDateValue, 'yyyy-MM-dd', 'en'));
        } else if (item == '7') {
          const today = new Date();
          const startOfWeek = new Date(
            startDateValue.getFullYear(),
            startDateValue.getMonth(),
            startDateValue.getDate() - startDateValue.getDay() + 1
          );
          const endOfWeek = new Date(
            startDateValue.getFullYear(),
            startDateValue.getMonth(),
            startDateValue.getDate() - startDateValue.getDay() + 7
          );
          this.formGroup
            .get('startDate')
            ?.setValue(formatDate(startOfWeek, 'yyyy-MM-dd', 'en'));
          this.formGroup
            .get('endDate')
            ?.setValue(formatDate(endOfWeek, 'yyyy-MM-dd', 'en'));
        } else if (item == '30') {
          const today = new Date();
          const startOfMonth = new Date(
            startDateValue.getFullYear(),
            startDateValue.getMonth(),
            1
          );
          const endOfMonth = new Date(
            startDateValue.getFullYear(),
            startDateValue.getMonth() + 1,
            0
          );
          this.formGroup
            .get('startDate')
            ?.setValue(formatDate(startOfMonth, 'yyyy-MM-dd', 'en'));
          this.formGroup
            .get('endDate')
            ?.setValue(formatDate(endOfMonth, 'yyyy-MM-dd', 'en'));
        }

        if (item != '-1') {
          this.getAttendanceInfo();
        }
      });
  }

  previousDate() {
    const range = this.formGroup.get('dateRange')?.value;
    const startDateValue = moment(this.formGroup.get('startDate')?.value);
    const endDateValue = moment(this.formGroup.get('endDate')?.value);

    if (range === '1') {
      startDateValue.subtract(1, 'days');
      endDateValue.subtract(1, 'days');
    } else if (range === '7') {
      startDateValue.subtract(1, 'weeks').startOf('isoWeek');
      endDateValue.subtract(1, 'weeks').endOf('isoWeek');
    } else if (range === '30') {
      startDateValue.subtract(1, 'months').startOf('month');
      endDateValue.subtract(1, 'months').endOf('month');
    }

    this.formGroup
      .get('startDate')
      ?.setValue(startDateValue.format('YYYY-MM-DD'));
    this.formGroup.get('endDate')?.setValue(endDateValue.format('YYYY-MM-DD'));

    this.getAttendanceInfo();
  }

  nextDate() {
    const range = this.formGroup.get('dateRange')?.value;
    const startDateValue = moment(this.formGroup.get('startDate')?.value);
    const endDateValue = moment(this.formGroup.get('endDate')?.value);

    if (range === '1') {
      startDateValue.add(1, 'days');
      endDateValue.add(1, 'days');
    } else if (range === '7') {
      startDateValue.add(1, 'weeks').startOf('isoWeek');
      endDateValue.add(1, 'weeks').endOf('isoWeek');
    } else if (range === '30') {
      startDateValue.add(1, 'months').startOf('month');
      endDateValue.add(1, 'months').endOf('month');
    }

    this.formGroup.get('endDate')?.setValue(endDateValue.format('YYYY-MM-DD'));
    this.formGroup
      .get('startDate')
      ?.setValue(startDateValue.format('YYYY-MM-DD'));

    this.getAttendanceInfo();
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
    this.puantajService.setSelectedItems(selectedRows);
  }

  onSelectionChangedDark() {
    const selectedRows = this.agGridDark.api.getSelectedRows();
    console.log('Seçilenler : ', selectedRows);
    this.puantajService.setSelectedItems(selectedRows);
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
    return params?.data?.rowHeight;
  }

  getAttendanceInfo() {
    this.rowData = [];
    this.value = 1;
    this.loading = true;

    var sp: any[] = [
      {
        mkodu: 'yek102',
        tip: this.selectedTab,
        tarih: this.formGroup.get('startDate')?.value,
        tarihbit: this.formGroup.get('endDate')?.value,
        ad: savedFilterModel?.ad ? savedFilterModel?.ad.filter : '',
        soyad: savedFilterModel?.soyad ? savedFilterModel?.soyad.filter : '',
        sicilno: savedFilterModel?.sicilno ? savedFilterModel?.sicilno.filter : '',
        firma: savedFilterModel?.cbo_firma ? savedFilterModel?.cbo_firma.toString() : '0',
        bolum: '0',
        pozisyon: '0',
        gorev: '0',
        altfirma: '0',
        yaka: '0',
        direktorluk: '0',
        okod1: '',
        okod2: '',
        okod3: '',
        okod4: '',
        okod5: '',
        okod6: '',
        okod7: '',
        aciklama: savedFilterModel?.mesaiaciklama ? savedFilterModel?.mesaiaciklama.filter : '',
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
          return;
        }
        console.log('PDKS Guid: ', data);
        this.attendanceInfo = data;

        if (this.attendanceInfo[0]?.maxpartnumber > 0) {
          for (
            let index = 1;
            index <= this.attendanceInfo[0]?.maxpartnumber;
            index++
          ) {
            if (!this.isCancel) {
              this.getAttendanceData(index);
              console.log('part_number', index);
            } else {
              this.value = 100;
              return;
            }
          }
        } else {
          this.value = 100;
          this.loading = false;
          this.ref.detectChanges();
          return;
        }
      });
  }

  getAttendanceData(partNumber: any) {
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
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe), delay(500))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        console.log('PDKS Listesi: ', data);

        this.rowData = [...this.rowData, ...data];
        this.rowData.forEach((row: any) => {
          row.rowHeight = 30;
        });

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

        this.value += Math.round(
          (1 / this.attendanceInfo[0].maxpartnumber) * 100
        );
        if (this.value >= 100) {
          this.value = 100;
          this.loading = false;
        }

        if (this.attendanceInfo[0].maxpartnumber == partNumber) {
          this.value = 100;
        }

        this.ref.detectChanges();
      });
  }

  changeTabMenu(menu: any) {
    this.selectedTab = menu;
    this.getAttendanceInfo();
  }

  convertFromMinuteToHour(params: ValueFormatterParams) {
    // Dakikayı moment nesnesine dönüştür
    const time = moment.duration(params.value, 'minutes');
    // Saat cinsine dönüştürülen zamanı formatla
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
  }

  applyWeekendClass(params: any) {
    if (params.data.mesaibas == params.data.mesaibit) {
      return 'cell-weekend';
    }
  }

  cancelAttendanceRequest() {
    this.isCancel = true;
  }

  async getOrganizationInfo(source: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.profileService.getTypeValues(source)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;
    
          if (message.islemsonuc == 1) {
            const organizationList: string[] = [];
            console.log("Organization List ", source, " ", data);
            
            if (source == 'cbo_firma') {
              data.forEach(value => {
                if (value.Ad !== undefined) {
                  organizationList.push(value.Ad);
                }
              });
              
              this.companyList = data;
            } else if (source == 'cbo_pozisyon') {
              data.forEach(value => {
                if (value.Ad !== undefined) {
                  organizationList.push(value.Ad);
                }
              });
              
              this.positionList = data;
            } else if (source == 'cbo_yaka') {
              data.forEach(value => {
                if (value.Ad !== undefined) {
                  organizationList.push(value.Ad);
                }
              });
              
              this.collarList = data;
            } else if (source == 'cbo_altfirma') {
              data.forEach(value => {
                if (value.Ad !== undefined) {
                  organizationList.push(value.Ad);
                }
              });
              
              this.subsidiaryList = data;
            } else if (source == 'cbo_direktorlük') {
              data.forEach(value => {
                if (value.Ad !== undefined) {
                  organizationList.push(value.Ad);
                }
              });
              
              this.directorshipList = data;
            } else if (source == 'cbo_gorev') {
              data.forEach(value => {
                if (value.Ad !== undefined) {
                  organizationList.push(value.Ad);
                }
              });
              
              this.jobList = data;
            } else if (source == 'cbo_bolum') {
              data.forEach(value => {
                if (value.Ad !== undefined) {
                  organizationList.push(value.Ad);
                }
              });
              
              this.departmentList = data;
            }
            
            resolve(organizationList);
          } else {
            reject(new Error('Bir hata oluştu'));
          }
        },
        error => {
          reject(error);
        });
    });
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
    var dateParts = dateAsString.split("-");
    var cellDate = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
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
  inRangeFloatingFilterDateFormat: "YYYY MMM Do",
};

var savedFilterModel: any = null;
