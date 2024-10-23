import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from 'src/app/_helpers/helper.service';
import { AccessService } from '../../access.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-new-device',
  templateUrl: './dialog-new-device.component.html',
  styleUrls: ['./dialog-new-device.component.scss']
})



//declare var google: any;

export class DialogNewDeviceComponent implements OnInit{
  selectedLocation: { lat: number; lng: number } | null = null;
  private unsubscribe: Subscription[] = [];
  @Input() isFromAttendance: boolean;
  @Input() mapTypeId: keyof typeof google.maps.MapTypeId = 'TERRAIN';
  constructor(
    private access: AccessService,
    private helper: HelperService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef, 
    private translateService : TranslateService,
    private formBuilder: FormBuilder,
    private toastrService : ToastrService) { }
    isCompleted: boolean = false;

    stepperFields: any[] = [
      { class: 'stepper-item current', number: 1, title: "Cihaz Ad ve Modeli" },
      { class: 'stepper-item', number: 2, title: "Cihaz Port/Ip/ModuleId"},
      { class: 'stepper-item', number: 3,title: "Cihaz Yön/Tanım"},
      { class: 'stepper-item', number: 4, title: "Pc/Kart/Kapı" },
      { class: 'stepper-item', number: 5, title: "Ping/ByPass/Pasif?" },
      { class: 'stepper-item', number: 6, title: "Lokasyon" },
      { id : '0', class: 'stepper-item', number: 7,title: "Özet"},
    ];

    // form listeleri
    public model_device: any[] = [];
    public IO:any [] = [];
    public type_device:any[] = [];
    public type_card:any[] = [];
    public type_door:any[] = [];
    //form değişkenler
    nameOfDevice:string = ""; //cihaz Adık
    selectModelDevice:any; // cihaz modeli
    portOfDevice:number; // Cihaz port 
    ipOfDevice:string = ""; // cihaz Ip
    moduleIdOfDevice:number =546096986; //Cihaz module id (ControllerNo)
    selectIO:any; // giriş çıkıs
    selectTypeOfDevice:any; // cihaz tanımı
    nameOfPc:string = ""; // Pc Adı
    selectFormatOfCard:any // Cihaz kart Fortmatı
    infoOfDeviceDoor:string = ""; // Kapı Bilgisi
    secureKey:string = "";
    selectDoorType:any;
    pingTest: boolean = false;
    byPass:boolean = false;
    IsDevicePassive:boolean = false;
    IsShowTimeOfDevice:boolean = false;
    latitude:any = "39.9334";
    longitude:any = "32.8597";
    koordinatModal:boolean = false;
    lokasyon:any;
    numberOfFloor:string = "";
    numberOfRoom:string = "";
    address:string = "";
    // form setting
    newDeviceForm: FormGroup;
    formsCount: any = 8;
    currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
    currentItem: any = this.stepperFields[0];
    newDeviceFormValues: any;
    currentDate = new Date(Date.now());
    map: any;

  ngOnInit(): void {
    this.fillToList();
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

  fillToList(){
    this.createFormGroup();
    this.modelOfDevice('sys_terminalmodel');
    this.sys_IO('sys_IO');
    this.typeOfDevice('sys_terminalkind');
    this.typeOfCard('sys_cardformat');
    this.typeOfDoor('doortype');
  }

  createFormGroup() {
    this.newDeviceForm = this.formBuilder.group({
      cihazAdi: ['', Validators.required],
      model: ['', Validators.required],
      port: ['', Validators.required],
      ip: ['', Validators.required],
      moduleid: ['', Validators.required],
      secureKey:['',Validators.required],
      girisCıkıs: ['', Validators.required],
      cihazTanimi: ['', Validators.required],
      pcAdi: [''],
      kartFormat: ['', Validators.required],
      kapiBilgi: ['', Validators.required],
      doortype:["",Validators.required],
      pingTest: ['', Validators.required],
      byPass: ['', Validators.required],
      aktifPasif: ['', Validators.required],
      showTime:['', Validators.required],
      lokasyon:['', Validators.required],
      katNo:[''],
      odaNo:[''],
      adres:[''],
    });

 
  }

  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error(
        this.translateService.instant('Form_Alanlarını_Doldurmalısınız'),
        this.translateService.instant('Hata')
      ); return;
    }
    const nextStep = this.currentStep$.value + 1;
    if (nextStep <= this.formsCount) {
      this.currentStep$.next(nextStep);
      this.updateStepperClasses(nextStep);
    }
  }

  updateStepperClasses(nextStep: number) {
    // Mevcut adımın sınıfını 'current' yapıyoruz
    this.currentItem = this.stepperFields[nextStep - 1];
    this.currentItem.class = "stepper-item current";
  
    // Önceki adımı 'completed' olarak işaretliyoruz
    if (nextStep > 1) {
      this.stepperFields[nextStep - 2].class = "stepper-item completed";
    }
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
    this.currentItem = this.stepperFields[prevStep - 1];
    let prevItem = this.stepperFields[prevStep];
    this.currentItem.class = "stepper-item current";
    prevItem.class = "stepper-item";
  }


  canProceedToNextStep(): boolean {
    this.newDeviceFormValues = { ...this.newDeviceForm.value };
    console.log("Form Değerleri: ", this.newDeviceFormValues);
  
    const currentStepFields = this.getStepFields(this.currentStep$.value);
  
    // Tüm gerekli alanlar geçerli mi kontrol ediliyor
    return currentStepFields.every(field => this.newDeviceForm.get(field)?.valid);
    
  }
  getStepFields(step: number): string[] {
    // Adım numarasına göre gerekli form kontrol isimlerini döndürür
    const stepFieldsMap: { [key: number]: string[] } = {
      1: ['cihazAdi', 'model'],
      2: ['port', 'ip', 'moduleid',],
      3: ['girisCıkıs', 'cihazTanimi'],
      4: ['pcAdi', 'kartFormat', 'kapiBilgi'],
      5: ['pingTest', 'byPass', 'aktifPasif','showTime'],
      6: ['lokasyon','katNo','odaNo','adres']
      //6: ['enlem','boylam','lokasyon','katNo','odaNo','adres']
    };
  
    return stepFieldsMap[step] || [];
  }

  closedFormDialog() {
      this.newDeviceForm.reset();
      this.resetStepperFieldsClass();
      this.currentStep$.next(1);
      this.currentItem = this.stepperFields[0];
      // this.advanceFormIsSend.emit(); 
  }

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? "stepper-item current" : "stepper-item";
    });
  }

  submitForm(){
    console.log("newDeviceFormValues....... ",this.newDeviceFormValues);
    console.log("selectIO ",this.selectIO);
    console.log("selectTypeOfDevice ",this.selectTypeOfDevice);
    console.log("selectModelDevice ",this.selectModelDevice);
    const enlem = this.latitude.toString();
    const boylam = this.longitude.toString();
    this.access.addNewDevice(this.newDeviceFormValues, this.latitude,this.longitude).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      const REsult = response[0];
      this.ref.detectChanges();
      console.log("SUBMİT ",REsult);
    })
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

  openKoordinatModal()
  {
    this.koordinatModal = true;

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


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
