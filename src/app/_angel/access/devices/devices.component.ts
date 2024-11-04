import { ProfileService } from './../../profile/profile.service';
import { AccessService } from './../access.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { TranslateService } from '@ngx-translate/core';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { Device } from 'src/app/_angel/access/models/device'
import { ColDef, ColGroupDef} from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { IHeaderParams, ICellRendererParams, SideBarDef } from 'ag-grid-community';



@Component({
  selector: 'app-devices',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})

export class DevicesComponent implements OnInit {
  public rowData!: Device[];
  public type_device: any[];
  private gridApi:any;
  private gridColumnApi:any;
  public frameworkComponents:any;
  savedFilterModel: any;
  newDeviceModal:boolean;

  displayUpdateDevice:boolean;
  //updateDeviceModal:boolean;

  gridOptionsLight = {};
  gridOptionsDark = {};
  selectedRowData: any = null;
  @ViewChild('agGridLight', { static: false }) agGridLight: AgGridAngular;
  @ViewChild('agGridDark', { static: false }) agGridDark: AgGridAngular;
  
 constructor(
  private access : AccessService,
  private toastr : ToastrService,
  private translateService: TranslateService,
  private themeModeService: ThemeModeService,
  private ref: ChangeDetectorRef,
  private profil : ProfileService
 ){}

  ngOnInit(): void {
    this.getDevices();
    //this.typeOfDevice('sys_terminalkind');
    this.access.triggerEvent$.subscribe(() => {
      this.getDevices();
    });
  }

  // onGridReady(params:any){
  //   console.log("params",params);
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  // }

  getDevices(){
    this.access.getDevices().subscribe((response : ResponseModel<Device, ResponseDetailZ>[])=>{
      this.rowData = response[0].x;
      const message = response[0];
      const responseToken = response[0].y;
      this.ref.detectChanges();
      console.log("this.rowData ",this.rowData );
    })
  }

  typeOfDevice(source:string){
    this.access.getType_S(source).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.type_device = response[0].x;
      this.ref.detectChanges();
      console.log("type_Tk ",this.type_device );
    })
  }

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
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public  columnDefs: (ColDef | ColGroupDef)[]  = [
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
    { field: 'name', 
      headerName: 'Ad', 
      filter: true,
      rowGroup: false,
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
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center'  
      },
   
      cellRenderer: (item:any)=>{
          return "" +item.value
    }},

    { field: 'modelad',  
      headerName: 'Model',
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center'  
      },
      rowGroup: false,
    //   cellRenderer:CustomizedCellComponent,
    //   cellRendererParams:{
    //     buttontext:"MODEEEEEEL"
    // }
    },

    { field: 'port', 
      headerName: 'Port',
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center'  
      },
      rowGroup: false,
    },

    { field: 'ip', headerName: 'Ip',
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center' 
      }
    },
    { field: 'controllerno', headerName: 'Module ID', 
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center'  
      }
    },
    { field: 'IOad', headerName: 'IO',
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center' 
      }

    },

    { field: 'kindad', headerName: 'Tanım',
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center' 
      } 
    },

    { field: 'durum', headerName: 'Durum',
      cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center' 
      }
    },

    { field: 'networkdurum', headerName: 'Network Durum',
      cellStyle: { 
      border: '1px solid #f5f8fa',
      textAlign: 'center' 
      },
      cellRenderer: function(params: ICellRendererParams) {
      if (params.value === 'Cihaz Bağlı') {
          return '<span style="color:#659be0">' + params.value + '</span>';
      } else {
          return '<span style="color: #e3c464;">' + params.value + '</span>';
      }}
    },

    { field: 'CardFormat', headerName: 'Kart Format',
      cellStyle: { 
      border: '1px solid #f5f8fa',
      textAlign: 'center' 
    }},
    { field: 'SourceName', headerName: 'PC',
    cellStyle: { 
      border: '0.5px solid #f5f8fa',
      textAlign: 'center' 
    },},
    { field: 'Door', headerName: 'Door',
    cellStyle: { 
      border: '0.5px solid #f5f8fa',
      textAlign: 'center'  
    },},
    { field: 'PingCheck', headerName: 'Ping',
    cellStyle: { 
      border: '0.5px solid #f5f8fa',
      textAlign: 'center'  
    },
    cellRenderer: function(params: ICellRendererParams) {
      if (params.value === 1) {
        return '<span style="color: green;">Evet</span>';
      } else if (params.value === 0) {
        return '<span style="color: red;">Hayır</span>';
      } else {
        return ''; 
      }
    }},
    { field: 'Debug', headerName: 'Debug',
        cellStyle: { 
        border: '0.5px solid #f5f8fa',
        textAlign: 'center'  
      },
    cellRenderer: function(params: ICellRendererParams) {
      if (params.value === 1) {
        return '<span style="color: green;">Evet</span>';
      } else if (params.value === 0) {
        return '<span style="color: red;">Hayır</span>';
      } else {
        return ''; // Değer 1 veya 0 değilse boş bırak
      }
    }},
    { field: 'TimeSend', headerName: 'Time Send',
    cellStyle: { 
      border: '0.5px solid #f5f8fa',
      textAlign: 'center'  
    },
    cellRenderer: function(params: ICellRendererParams) {
      if (params.value === 1) {
        return '<span style="color: green;">Evet</span>';
      } else if (params.value === 0) {
        return '<span style="color: red;">Hayır</span>';
      } else {
        return ''; // Değer 1 veya 0 değilse boş bırak
      }
    }},
    { field: 'lokasyon', headerName: 'Lokasyon',
      cellStyle: { 
      border: '0.5px solid #f5f8fa',
      textAlign: 'center'  
    }},
    //{ field: 'Id', headerName: 'Id'},
    //{ field: 'IOad', headerName: 'IO ad' },
    //{ field: 'model', headerName: 'Model'},
    //{ field: 'LastEventTime', headerName: 'Last Event Time' },
    //{ field: 'PingCheck', headerName: 'Ping Check' },
    //{ field: 'SonGecen', headerName: 'Son Gecen' },
    //{ field: 'TemplateCount', headerName: 'Template Count' },
    //{ field: 'UserCount', headerName: 'User Count' },
    //{ field: 'deviceImage', headerName: 'Device Image' },
    //{ field: 'firma', headerName: 'firma' },
    //{ field: 'firmaad', headerName: 'firmaad' },
    //{ field: 'kindad', headerName: 'kindad' },
    //{ field: 'latitude', headerName: 'latitude' },
    //{ field: 'longtitude', headerName: 'longtitude' },
    //{ field: 'templatecapacity', headerName: 'Template Capacity' },
    //{ field: 'usercapacity', headerName: 'User Capacity' },

  ];

  public defaultColDef: ColDef = {
    minWidth: 20,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
    editable: true,
  };
  
  // onGridReady(params:any) {
   
  //   params.api.sizeColumnsToFit(); 
  

  //   const allColumnIds = params.columnApi.getAllColumns().map((column: Column) => column.getColId());

  //   params.columnApi.autoSizeColumns(allColumnIds);
  // }

  showNewDeviceDialog(){
    this.newDeviceModal = true;
  
  }
  

  showUpdateDevice(event: any) {
    this.selectedRowData = event.data;
    // this.updateDeviceModal= true;
    this.displayUpdateDevice = true;
  
    console.log(".....selectedRowData",this.selectedRowData)
  }

  hideUpdateDevice(){
    this.displayUpdateDevice = false;
  }

}

export class CustomHeaderComponent {
  params: IHeaderParams;

  agInit(params: IHeaderParams): void {
    this.params = params;
  }
}