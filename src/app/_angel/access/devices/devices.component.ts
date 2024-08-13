import { ProfileService } from './../../profile/profile.service';
import { AccessService } from './../access.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { TranslateService } from '@ngx-translate/core';
import { AttendanceService } from '../../puantaj/attendance.service';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { Device } from 'src/app/_angel/access/models/device'
import { ColDef, ColGroupDef,GridOptions,ModuleRegistry} from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';
import { CustomizedCellComponentComponent } from '../customized-cell-component/customized-cell-component.component';




@Component({
  selector: 'app-devices',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  public rowData!: Device[];
  private gridApi:any;
  private gridColumnApi:any;
  public frameworkComponents:any;
  savedFilterModel: any;

  gridOptionsLight = {};
  gridOptionsDark = {};

  // _getDevices : Device[] = []
  @ViewChild('agGridLight', { static: false }) agGridLight: AgGridAngular;
  @ViewChild('agGridDark', { static: false }) agGridDark: AgGridAngular;
  
 constructor(
  private Access : AccessService,
  private toastr : ToastrService,
  private translateService: TranslateService,
  private themeModeService: ThemeModeService,
  private ref: ChangeDetectorRef,
  private profil : ProfileService
 ){}

  ngOnInit(): void {
    this.getDevices();
  }
  onGridReady(params:any){
    console.log("params",params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  getDevices(){
    this.Access.getDevices().subscribe((response : ResponseModel<Device, ResponseDetailZ>[])=>{
      this.rowData = response[0].x;
      const message = response[0];
      const responseToken = response[0].y;
      // this.rowData = this._getDevices;
      this.ref.detectChanges();
      console.log("this.rowData ",this.rowData );
      console.log("zzzzzzzzzzzz",message);
      console.log("yyyyyyyyyyyy",responseToken);
    })
  }

  public  columnDefs: (ColDef | ColGroupDef)[]  = [
    { field: 'name', 
      headerName: 'Ad', 
      cellClass: 'header-class',
      cellRenderer: "customizedNameCall"},
    { field: 'modelad',  
      headerName: 'Model'},
    { field: 'port', headerName: 'Port'},
    { field: 'ip', headerName: 'Ip'},
    { field: 'controllerno', headerName: 'Module ID'},
    { field: 'IO', headerName: 'IO'},
    { field: 'kind', headerName: 'Tanım'},
    { field: 'durum', headerName: 'Durum'},
    { field: 'networkdurum', headerName: 'Network Durum'},
    { field: 'CardFormat', headerName: 'Kart Format'},
    { field: 'SourceName', headerName: 'PC'},
    { field: 'Door', headerName: 'Door'},
    { field: 'Ping', headerName: 'Ping'},
    { field: 'Debug', headerName: 'Debug'},
    { field: 'TimeSend', headerName: 'Time Send'},
    { field: 'Id', headerName: 'Id'},
    { field: 'lokasyon', headerName: 'Lokasyon'},
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
    filter: true,
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