import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { PatrolService } from '../patrol.service';
import { Subject, takeUntil } from 'rxjs';
import { ColDef, IRowNode, IsRowSelectable, RowHeightParams, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { FirstDataRenderedEvent } from 'ag-grid-community';
@Component({
  selector: 'app-security-guards',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './security-guards.component.html',
  styleUrls: ['./security-guards.component.scss']
})

export class SecurityGuardsComponent implements OnInit {
  private ngUnsubscribe = new Subject();

  // @Input() displayPersonsList: boolean;
  selectedPersons: any[];
  @Output() displayPersonsListEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectedPersonsList: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("agGridLight",{static:false}) agGridLight:AgGridAngular;
  @ViewChild("agGridDark",{static:false}) agGridDark:AgGridAngular;

  public columnDefs: ColDef[] = [
    {
      headerName: this.translateService.instant('Fotoğraf'), field: "imagePath", editable: false, pinned: 'left',
      minWidth: 80, maxWidth: 80, filter: false, sortable: false, headerTooltip: this.translateService.instant('Fotoğraf'),
      cellStyle: { 'padding-top': '1px !important', 'padding-right': '0px !important', 'padding-bottom': '0px !important', 'padding-left': '10px !important' },
      cellRenderer:(params: any)=> this.getImageGrid(params),
      cellRendererParams: { exampleParameter: 'red' }
    },
    { headerName: 'Id', field: 'Id', headerTooltip: 'Id', headerCheckboxSelection: true, checkboxSelection: true, showDisabledCheckboxes: true },
    { headerName: this.translateService.instant('Ad'), field: 'ad', headerTooltip: this.translateService.instant('Ad')},
    { headerName: this.translateService.instant('Soyad'), field: 'soyad', headerTooltip: this.translateService.instant('Soyad')},
    { headerName: this.translateService.instant('Sicil_No'), field: 'sicilno', headerTooltip: this.translateService.instant('Sicil_No'), type: 'numericColumn'},
    { headerName: this.translateService.instant('Personel_No'), field: 'personelno', headerTooltip: this.translateService.instant('Personel_No'), type: 'numericColumn' },
    // { headerName:'Giriş Tarihi', field: 'giristarih', type: ['dateColumn', 'nonEditableColumn']},
    { headerName: this.translateService.instant('Firma'), field: 'firmaad', headerTooltip: this.translateService.instant('Firma_Adı'), rowGroup: false, enableRowGroup: true, hide: false },
    { headerName: this.translateService.instant('Alt_Firma'), field: 'altfirmaad', headerTooltip: this.translateService.instant('Alt_Firma_Adı'), rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName: this.translateService.instant('Yaka'), field: 'yakaad', headerTooltip: this.translateService.instant('Yaka_Adı'), rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName: this.translateService.instant('Bölüm'), field: 'bolumad', headerTooltip: this.translateService.instant('Bölüm_Adı'), rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName: this.translateService.instant('Pozisyon'), field: 'pozisyonad', headerTooltip: this.translateService.instant('Pozisyon_Adı'), rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName: this.translateService.instant('Kimlik_Tanımı'), field: 'yetkistrad', headerTooltip: this.translateService.instant('Kimlik_Tanımı'), rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName: this.translateService.instant('Geçiş_Yetkileri'), field: 'userdefad', headerTooltip: this.translateService.instant('Geçiş_Yetkileri'), rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName: this.translateService.instant('Kart_Numarası'), field: 'cardID', headerTooltip: this.translateService.instant('Kart_Numarası') },
  ];
  
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    filter: true,
    floatingFilter: false,
    sortable: true,
    resizable: true,
    editable: false,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public isRowSelectable: IsRowSelectable = (
    params: IRowNode<any>
  ) => {
    return !!params.data && params.data.year >= 2012;
  };
  public rowData!: any[];
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true
        }
      }
    ]
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
  gridApi: any;
  constructor(
    private toastr : ToastrService,
    private translateService: TranslateService,
    private themeModeService: ThemeModeService,
    private patrol: PatrolService,
    private ref: ChangeDetectorRef
  ) {}

  
  ngOnInit(): void {
  this.getPersonsList();
  }
  getContextMenuItems(params:any) {
    return [
      'copy',
      'copyWithHeaders',
      'paste',
      'separator',
      {
        name: 'export',
        subMenu: [
          {
            name: 'exportToPDF',
          },
        ],
      },
    ];
  }
  onSelectionChangedLight() {
    const selectedRows = this.agGridLight.api.getSelectedRows();
    console.log("Seçilenler : ", selectedRows);
    this.selectedPersonsList.emit(selectedRows);
  }

  onSelectionChangedDark() {
    const selectedRows = this.agGridDark.api.getSelectedRows();
    console.log("Seçilenler : ", selectedRows);
    this.selectedPersonsList.emit(selectedRows);
  }

  getImageGrid(params: any, imageSize = '40') {

    if (params?.data?.Id == undefined) {
      return "";
    }

    return `
    <div  style="padding:0px !important" class="symbol symbol-` + imageSize + `  bg-hover-light ">
      <img class="symbol-label" src="http://localhost:5075/api/Image?sicilid=` + params.data.Id + `">
    </div>`
    // <img alt="Logo" src="http://localhost:5075/api/Image?sicilid={{_user.xSicilID}}" />
  }

  getRowHeight(params: RowHeightParams): number | undefined | null {
    return params?.data?.rowHeight;
  }

  getPersonsList() {
    var sp: any[] = [{
      mkodu: 'yek081',
      id: '0',
      ad: '',
      soyad: '',
      sicilno: '',
      personelno: '',
      firma: '0',
      bolum: '0',
      pozisyon: '0',
      gorev: '0',
      altfirma: '0',
      yaka: '0',
      direktorluk: '0',
      sicilgroup: '0',
      userdef: '9',
      yetki: '-1',
      cardid: '',
      aktif: '1',
      okod1: '',
      okod2: '',
      okod3: '',
      okod4: '',
      okod5: '',
      okod6: '',
      okod7: '',
      mesaiperiyodu:'0'
    }];

    this.patrol.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log("Sicil Listesi: ", data);
      
      this.rowData = data;
      this.rowData.forEach((row: any) => {
        row.rowHeight = 55;
      });
    });
  }

  // onFirstDataRendered(params: FirstDataRenderedEvent<any>) {
  //   const selectedPersons = this.selectedPersons;
  
  //   const nodesToSelect: IRowNode[] = [];
  //   params.api.forEachNode((node: IRowNode) => {
  //     if (node.data && selectedPersons.some(person => person.Id === node.data.Id)) {
  //       nodesToSelect.push(node);
  //     }
  //   });
  //   params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
  // }

  hidePersonsList() {
    this.displayPersonsListEvent.emit();
  }

  ngOnDestroy(): void {
    this.rowData = [];
    this.displayPersonsListEvent.emit();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
