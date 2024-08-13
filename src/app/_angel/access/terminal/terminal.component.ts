import { Component, OnInit,OnDestroy,ViewChild,ChangeDetectorRef} from '@angular/core';
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
import * as moment from 'moment';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, GridApi, IProvidedFilter, ISetFilterParams } from 'ag-grid-community';
import { AccessService } from '../access.service';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ToastrService } from 'ngx-toastr';
import { OrganizationColumnFilterComponent } from '../../puantaj/organization-column-filter/organization-column-filter.component';
import { ProfileService } from '../../profile/profile.service';
import { map, Subject, takeUntil } from 'rxjs';
import { AttendanceService } from '../../puantaj/attendance.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})

export class TerminalComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @ViewChild('agGridLight', { static: false }) agGridLight: AgGridAngular;
  @ViewChild('agGridDark', { static: false }) agGridDark: AgGridAngular;

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
  personInfoForAnnualCalendar: any;

  displayOvertimeForm: boolean = false;
  displayShiftForm: boolean = false;
  displayAttendanceForm: boolean = false;

  constructor(private access : AccessService,
    private themeModeService: ThemeModeService,
    private ref: ChangeDetectorRef,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private profileService: ProfileService,
    private attendanceService: AttendanceService,) { }

  ngOnInit(): void {
  }

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

          },
          cellClass: (params) => this.applyWeekendClass(params),
          hide: false,
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
          filter: 'agDateColumnFilter',
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
        },
        {
          headerName: this.translateService.instant('Çıkış'),
          field: 'gcikis',
          headerTooltip: this.translateService.instant('Çıkış'),
          filter: false,
          valueFormatter: (params) => this.parseEntryExit(params),
          cellClass: (params) => this.timeClassChange(params),
          hide: false,
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
    menuTabs: ['filterMenuTab'],
  };

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

  applyWeekendClass(params: any) {
    if (params.data.mesaibas == params.data.mesaibit) {
      return 'cell-weekend';
    }
  }
  convertFromMinuteToHour(params: ValueFormatterParams) {
    // Dakikayı moment nesnesine dönüştür
    const time = moment.duration(params.value, 'minutes');
    // Saat cinsine dönüştürülen zamanı formatla
    const formattedTime = moment.utc(time.asMilliseconds()).format('HH:mm');
    return formattedTime;
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


  parseEntryExit(params: ValueFormatterParams) {
    if (!params.value) {
      return '__:__';
    } else {
      return moment(params.value).format('HH:mm:ss');
    }
  }

  showAnnualCalendar(params: any) {
    console.log('Annual Calendar : ', params);

    this.displayAnnualCalendar = true;
    this.personInfoForAnnualCalendar = params;
    this.ref.detectChanges();
  }
  getRowHeight(params: RowHeightParams): number | undefined | null {
    return params?.data?.rowHeight;
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

  // sendColumnStateToApi() {
  //   const allColumns = this.agGridLight.columnApi.getAllColumns();
  //   if (!allColumns) {
  //     console.error('No columns found.');
  //     return;
  //   }

  //   const columnStateString = allColumns
  //     .map((col) => {
  //       const colDef = col.getColDef();
  //       const width = col.getActualWidth();
  //       const visible = col.isVisible();
  //       return `${colDef.field || colDef.colId}#${width}#${visible}`;
  //     })
  //     .join('|');

  //   console.log(columnStateString);

  //   var sp: any[] = [
  //     {
  //       mkodu: 'yek104',
  //       ad: 'pdks_0_gridSettings',
  //       deger: columnStateString,
  //     },
  //   ];

  //   this.profileService
  //     .requestMethod(sp)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe((response: any) => {
  //       console.log('Grid Settings Are Send: ', response);
  //     });
  // }

  showVacationForm() {
    let selectedEmployees: any[] = [];
    this.attendanceService.selectedItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      selectedEmployees = items;
    });
    if (selectedEmployees.length > 0) {
      this.displayVacationForm = true;      
    }else {
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
    this.attendanceService.selectedItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      selectedEmployees = items;
    });
    if (selectedEmployees.length > 0) {
      this.displayOvertimeForm = true;      
    }else {
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
    this.attendanceService.selectedItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      selectedEmployees = items;
    });
    if (selectedEmployees.length > 0) {
      this.displayShiftForm = true;      
    }else {
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
  // onColumnVisible(event: any) {
  //   this.sendColumnStateToApi();
  // }

  // sendColumnStateToApi() {

  // }
}

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