import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { FirstDataRenderedEvent } from 'ag-grid-community';
// import { ColDef, IRowNode, IsRowSelectable, SideBarDef } from 'ag-grid-community';
import { ColDef, IRowNode, IsRowSelectable, RowHeightParams, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';


@Component({
  selector: 'app-sicil-liste',
  templateUrl: './sicil-liste.component.html',
  styleUrls: ['./sicil-liste.component.scss']
})
export class SicilListeComponent implements OnInit {
  private ngUnsubscribe = new Subject();

  @Input() displayPersonsList: boolean;
  @Input() selectedPersons: any[];
  @Output() displayPersonsListEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectedPersonsList: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild("agGrid",{static:false}) agGrid:AgGridAngular;


  public columnDefs: ColDef[] = [
    {
      headerName: "Fotoğraf", field: "imagePath", editable: false, pinned: 'left',
      minWidth: 80, maxWidth: 80, filter: false, sortable: false, headerTooltip: 'Fotoğraf',
      cellStyle: { 'padding-top': '1px !important', 'padding-right': '0px !important', 'padding-bottom': '0px !important', 'padding-left': '10px !important' },
      cellRenderer:(params: any)=> this.getImageGrid(params),
      cellRendererParams: { exampleParameter: 'red' }
    },
    { headerName: 'Id', field: 'Id', headerTooltip: 'Id', headerCheckboxSelection: true, checkboxSelection: true, showDisabledCheckboxes: true },
    { headerName:'Ad', field: 'ad', headerTooltip: 'Ad'},
    { headerName:'Soyad', field: 'soyad', headerTooltip: 'Soyad'},
    { headerName:'Sicil No', field: 'sicilno', headerTooltip: 'Sicil Numarası', type: 'numericColumn'},
    { headerName:'Personel No', field: 'personelno', headerTooltip: 'Personel Numarası', type: 'numericColumn' },
    // { headerName:'Giriş Tarihi', field: 'giristarih', type: ['dateColumn', 'nonEditableColumn']},
    { headerName:'Firma', field: 'firmaad', headerTooltip: 'Firma Adı', rowGroup: false, enableRowGroup: true, hide: false },
    { headerName:'Alt Firma', field: 'altfirmaad', headerTooltip: 'Alt Firma Adı', rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName:'Yaka', field: 'yakaad', headerTooltip: 'Yaka Adı', rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName:'Bölüm', field: 'bolumad', headerTooltip: 'Bölüm Adı', rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName:'Pozisyon', field: 'pozisyonad', headerTooltip: 'Pozisyon Adı', rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName:'Kimlik Tanımı', field: 'yetkistrad', headerTooltip: 'Kimlik Tanımı', rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName:'Geçiş Yetkileri', field: 'userdefad', headerTooltip: 'Geçiş Yetkileri', rowGroup: false, enableRowGroup: true, hide: false  },
    { headerName:'Kart No', field: 'cardID', headerTooltip: 'Kart Numarası' },
  ];
  
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 180,
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
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private http: HttpClient
  ) { }

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
  

  onSelectionChanged() {
    const selectedRows = this.agGrid.api.getSelectedRows();
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
      userdef: '1',
      yetki: '-1',
      cardid: '',
      aktif: '1',
      okod1: '',
      okod2: '',
      okod3: '',
      okod4: '',
      okod5: '',
      okod6: '',
      okod7: ''
    }];
    this.profileService.sendRequestForProcess(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
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

  onFirstDataRendered(params: FirstDataRenderedEvent<any>) {
    const selectedPersons = this.selectedPersons;
  
    const nodesToSelect: IRowNode[] = [];
    params.api.forEachNode((node: IRowNode) => {
      if (node.data && selectedPersons.some(person => person.Id === node.data.Id)) {
        nodesToSelect.push(node);
      }
    });
    params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
  }
  

  
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
