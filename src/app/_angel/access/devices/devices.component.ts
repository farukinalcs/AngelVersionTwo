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
import { IHeaderParams, ICellRendererParams } from 'ag-grid-community';
import { CustomizedCellComponent } from '../customized-cell/customized-cell.component';





@Component({
  selector: 'app-devices',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  public rowData!: Device[];
  public type_Tk: any[];
  private gridApi:any;
  private gridColumnApi:any;
  public frameworkComponents:any;
  savedFilterModel: any;

  gridOptionsLight = {};
  gridOptionsDark = {};
 
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
    this.typeOfDevice('sys_terminalkind');
  }

  onGridReady(params:any){
    console.log("params",params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getDevices(){
    this.access.getDevices().subscribe((response : ResponseModel<Device, ResponseDetailZ>[])=>{
      this.rowData = response[0].x;
      const message = response[0];
      const responseToken = response[0].y;
      this.ref.detectChanges();
      console.log("this.rowData ",this.rowData );
      console.log("zzzzzzzzzzzz",message);
      console.log("yyyyyyyyyyyy",responseToken);
    })
  }

  typeOfDevice(source:string){
    this.access.getType_S(source).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.type_Tk = response[0].x;
      this.ref.detectChanges();
      console.log("type_Tk ",this.type_Tk );
    })
  }

  public  columnDefs: (ColDef | ColGroupDef)[]  = [
    
    { field: 'name', 
      headerName: 'Ad', 
      cellClass: 'header-class',
      cellRenderer: (item:any)=>{
          return "" +item.value
    }},

    { field: 'modelad',  
      headerName: 'Model',
    //   cellRenderer:CustomizedCellComponent,
    //   cellRendererParams:{
    //     buttontext:"MODEEEEEEL"
    // }
    },

    { field: 'port', 
      headerName: 'Port',

    },

    { field: 'ip', headerName: 'Ip'},
    { field: 'controllerno', headerName: 'Module ID'},
    { field: 'IOad', headerName: 'IO',
    // cellRenderer: function(params: ICellRendererParams) {
    //   if (params.value > 2) {
    //       return '<span style="color: green;">' + params.value + '</span>';
    //   } else {
    //       return '<span style="color: red;">' + params.value + '</span>';
    //   }
    // }
    },
    { field: 'kindad', headerName: 'Tanım',},
    { field: 'durum', headerName: 'Durum'},
    { field: 'networkdurum', headerName: 'Network Durum',
      cellRenderer: function(params: ICellRendererParams) {
      if (params.value === 'Cihaz Bağlı') {
          return '<span style="color:#659be0 ">' + params.value + '</span>';
      } else {
          return '<span style="color: #e3c464;">' + params.value + '</span>';
      }
    }},
    { field: 'CardFormat', headerName: 'Kart Format'},
    { field: 'SourceName', headerName: 'PC'},
    { field: 'Door', headerName: 'Door'},
    { field: 'PingCheck', headerName: 'Ping',
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
    cellRenderer: function(params: ICellRendererParams) {
      if (params.value === 1) {
        return '<span style="color: green;">Evet</span>';
      } else if (params.value === 0) {
        return '<span style="color: red;">Hayır</span>';
      } else {
        return ''; // Değer 1 veya 0 değilse boş bırak
      }
    }},
    { field: 'lokasyon', headerName: 'Lokasyon'},
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
    editable: true,
    filter: true
  };
  
  // saveFilterModel() {
  //   var savedFilterModel: any = null;
  //   const subscr = this.themeModeService.mode
  //     .asObservable()
  //     .subscribe((mode) => {
  //       savedFilterModel =
  //         mode === 'light'
  //           ? this.agGridLight.api.getFilterModel()
  //           : this.agGridDark.api.getFilterModel();
  //     });

  //   console.log('SavedFilterModel: ', savedFilterModel);

  //   this.savedFilterModel = savedFilterModel;
  //   // this.getAttendanceInfo();
  // }
}

export class CustomHeaderComponent {
  params: IHeaderParams;

  agInit(params: IHeaderParams): void {
    this.params = params;
  }
}