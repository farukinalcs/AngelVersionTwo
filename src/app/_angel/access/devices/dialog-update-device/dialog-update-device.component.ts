import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AccessService } from '../../access.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { Device } from '../../models/device';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dialog-update-device',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './dialog-update-device.component.html',
  styleUrls: ['./dialog-update-device.component.scss']
})
export class DialogUpdateDeviceComponent {
  selectedSection: number = 1;
  @Input() data: Device;
  @Output() close = new EventEmitter<void>();
  @Output() hideUpdateDevice = new EventEmitter<void>();
  @Input() displayUpdateDevice:boolean;


  // form listeleri
  public model_device: any[] = [];
  public IO:any [] = [];
  public type_device:any[] = [];
  public type_card:any[] = [];
  public type_door:any[] = [];
    //form değişkenler
    nameOfDevice:string = ""; //cihaz Adık  ++
    selectModelDevice: any = { ID: 0, Ad: ''}; // cihaz modeli +++
    selectModelDeviceID:number;
    portOfDevice:number; // Cihaz port 
    ipOfDevice:string = ""; // cihaz Ip ++
    moduleIdOfDevice:number = 546096986; //Cihaz module id (ControllerNo) ++
    selectIO:any = { ID: 0, Ad: ''} // giriş çıkıs +++
    selectIOID:number;
    selectTypeOfDevice:any; // cihaz tanımı +++
    selectTypeOfDeviceID:number;
    nameOfPc:string = ""; // Pc Adı
    selectFormatOfCard:any // Cihaz kart Fortmatı ++
    selectFormatOfCardName:string;
    infoOfDeviceDoor:string = ""; // Kapı Bilgisi
    secureKey:string = "";
    selectDoorType:any;
    selectDoorTypeName:string;
    pingTest: boolean = false;
    byPass:boolean = false;
    IsDevicePassive:boolean = false;
    IsShowTimeOfDevice:boolean = false;
    latitude:number;
    longitude:number;
    koordinatModal:boolean = false;
    lokasyon:any;
    numberOfFloor:string = "";
    numberOfRoom:string = "";
    address:string = "";
    map: any;
    @Input() mapTypeId: keyof typeof google.maps.MapTypeId = 'TERRAIN';

  constructor(
    private access: AccessService,
    private helper: HelperService,
    private ref: ChangeDetectorRef, 
    private translateService : TranslateService,
    private toastrService : ToastrService
  ){

  }

  ngOnInit(): void{
    console.log("DATAAAA",this.data);
    this.getDeviceValues(this.data); 
    this.fillToList();
    setTimeout(() => {
      const mapOptions = {
        center: new google.maps.LatLng(this.latitude, this.longitude),
        zoom: 8,
      };
      console.log('ilk koordinatlar:', this.latitude, this.longitude);
      this.map = new google.maps.Map(document.getElementById('map')!, mapOptions);
  
      this.map.addListener('click', (event: any) => {
        this.latitude = event.latLng.lat();
        this.longitude = event.latLng.lng();
        this.lokasyon = this.latitude + ',' + this.longitude;
        console.log('Tıklanan koordinatlar:', this.latitude, this.longitude);
      });
    }, 1000); 
    
  }

  olustur(){
    if(this.moduleIdOfDevice != undefined){
      this.access.getSecurityCode(this.moduleIdOfDevice,this.helper.customerCode).subscribe((response:any)=>{
        this.secureKey  = response[0].securekey;
        this.ref.detectChanges();
        console.log("this.secureKey ",this.secureKey);
        console.log("this.moduleIdOfDevice ",this.moduleIdOfDevice);
      })
    }else
    this.toastrService.error(
      this.translateService.instant('Eksik ya da yanlış Cihaz Module Id'),
      this.translateService.instant('Hata')
    );
    
  }

  getDeviceValues(values:Device){
    this.moduleIdOfDevice = values.controllerno;
    this.nameOfDevice = values.name;
    this.ipOfDevice = values.ip
    this.selectFormatOfCardName = values.CardFormat;
    this.selectDoorTypeName = values.Doortype;
    this.selectModelDeviceID = values.model;
    this.selectIOID = values.IO;
    this.portOfDevice = values.port;
    this.selectTypeOfDeviceID = values.kind;
    this.secureKey = values.securitycode;
    this.latitude = values.latitude;
    this.longitude = values.longtitude;
    this.lokasyon = this.latitude +','+this.longitude;
    this.nameOfPc = values.SourceName;
    this.infoOfDeviceDoor = values.Door;
    this.selectFormatOfCard = this.type_card.find(item => item.Ad === this.selectFormatOfCardName);
    this.selectIO = this.IO.find(item => item.ID === this.selectIOID);
    this.selectTypeOfDevice = this.type_device.find(item => item.ID === this.selectTypeOfDeviceID);
    this.selectDoorType = this.type_door.find(item => item.GateTypeName === this.selectDoorTypeName);
    this.selectModelDevice = this.model_device.find(item => item.ID === this.selectModelDeviceID);
    console.log("!!!!!!!!!!!!", this.selectDoorTypeName);
    console.log("???????????", this.selectDoorType);
  }

  submitForm(){
    const enlem = this.latitude.toString();
    const boylam = this.longitude.toString();
    this.access.UpdateDevice(this.nameOfDevice,this.selectTypeOfDevice,this.selectModelDevice,this.selectIO,
      this.nameOfPc, this.selectFormatOfCard,this.pingTest,this.IsDevicePassive,this.IsShowTimeOfDevice,
      this.selectDoorType,this.infoOfDeviceDoor,this.ipOfDevice,this.portOfDevice,this.moduleIdOfDevice,this.secureKey,this.latitude,this.longitude).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      const REsult = response[0];
      this.ref.detectChanges();
      console.log("SUBMİT UPDATEEEE ",REsult);
    })
  }


  // getKoordinat(row:Result)
  // {
  //  this._koordinat = row.koordinat;
  //  const koordinatlar: any[] = row.koordinat.split(',');
  //   // const koordinatlar: any[] = ["41.029263","28.987094"];
  //   const latLng: number[] = [];
  //   for (const koordinat of koordinatlar) {
  //     const value = parseFloat(koordinat);
  //     if (!isNaN(value)) {
  //       latLng.push(value);
  //       // console.log("latLng", latLng);
  //     } else {
  //       console.error(`Geçersiz koordinat değeri: ${koordinat}`); 
  //     }
  //   }
  //   if (latLng.length === 2) {
  //     this.latitude = latLng[0];
  //     this.longitude = latLng[1];
  //     // this.mapTypeId = 'SATELLITE';
  //     console.log("Latitude:", this.latitude);
  //     console.log("Longitude:", this.longitude);
  //     $('#koordinat').modal('show');
  //   } else {
  //     console.error("Koordinatlar eksik veya hatalı.");
  //     alert(`Koordinatlar eksik veya hatalı`)
  //     $('#koordinat').modal('hide');
  //   }
  // }

  fillToList(){
    this.modelOfDevice('sys_terminalmodel');
    this.sys_IO('sys_IO');
    this.typeOfDevice('sys_terminalkind');
    this.typeOfCard('sys_cardformat');
    this.typeOfDoor('doortype');
  }

  modelOfDevice(source:string){
    this.access.getType_S(source).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.model_device = response[0].x;
      this.ref.detectChanges();
      console.log("model_device ",this.model_device );
    })
  }

  sys_IO(source:string){
    this.access.getType_S(source).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.IO = response[0].x;
      this.ref.detectChanges();
      console.log("IO ",this.IO );
    })
  }

  typeOfDevice(source:string){
    this.access.getType_S(source).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.type_device = response[0].x;
      this.ref.detectChanges();
      console.log("type_device ",this.type_device );
    })
  }

  typeOfCard(source:string){
    this.access.getType_S(source).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.type_card = response[0].x;
      this.ref.detectChanges();
      console.log("type_card ",this.type_card );
    })
  }

  typeOfDoor(source:string){
    this.access.getType_S(source).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.type_door = response[0].x;
      this.ref.detectChanges();
      console.log("type_door ",this.type_door );
    })
  }

  showSection(section: number) {
    this.selectedSection = section;
  }

  kapat(){
    this.hideUpdateDevice.emit();
  }
  onSave() {
    // Güncelleme işlemleri burada yapılabilir
    this.close.emit(); // Modalı kapat
  }
}
