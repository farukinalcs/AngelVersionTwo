import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from 'src/app/_helpers/helper.service';
import { AccessService } from '../../access.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dialog-new-device',
  templateUrl: './dialog-new-device.component.html',
  styleUrls: ['./dialog-new-device.component.scss'],
  animations: [
    trigger("fileUploaded", [
      state("uploaded", style({ transform: "translateY(0)" })),
      transition(":enter", [
        style({ transform: 'translateY(-50%)' }),
        animate("500ms")
      ]),
      transition(':leave', [
        animate(200, style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})


export class DialogNewDeviceComponent implements OnInit{
  private unsubscribe: Subscription[] = [];
  constructor(
    private access: AccessService,
    private helper: HelperService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef, 
    private translateService : TranslateService,
    private formBuilder: FormBuilder,
    private toastrService : ToastrService) { }
    
    isCompleted: boolean = false;

    @Input() isFromAttendance: boolean;

    stepperFields: any[] = [
      { class: 'stepper-item current', number: 1, title: "Cihaz Ad ve Modeli" },
      { class: 'stepper-item', number: 2, title: "Cihaz Port/Ip/ModuleId"},
      { class: 'stepper-item', number: 3,title: "Cihaz Yön/Tanım"},
      { class: 'stepper-item', number: 4, title: "Pc/Kart/Kapı" },
      { id : '0', class: 'stepper-item', number: 5,title: "Ping/ByPass/Pasif?/"},
    ];

    // form listeleri
    public model_device: any[] = [];
    public IO:any [] = [];
    public type_device:any[] = [];
    public type_card:any[] = [];
    //form değişkenler
    nameOfDevice:string = ""; //cihaz Adı
    selectModelDevice:any; // cihaz modeli
    portOfDevice:string = ""; // Cihaz port 
    ipOfDevice:string = ""; // cihaz Ip
    moduleIdOfDevice:string = ""; //Cihaz module id
    selectIO:any; // giriş çıkıs
    selectTypeOfDevice:any; // cihaz tanımı
    nameOfPc:string = ""; // Pc Adı
    selectFormatOfCard:any // Cihaz kart Fortmatı
    infoOfDeviceDoor:string = ""; // Kapı Bilgisi
    pingTest: boolean = false;
    byPass:boolean = false;
    IsDevicePassive:boolean = false;
    IsShowTimeOfDevice:boolean = false;


    // form setting
    newDeviceForm: FormGroup;
    formsCount: any = 6;
    currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
    currentItem: any = this.stepperFields[0];
    newDeviceFormValues: any;
    currentDate = new Date(Date.now());

  ngOnInit(): void {
    this.modelOfDevice('sys_terminalmodel');
    this.sys_IO('sys_IO');
    this.typeOfDevice('sys_terminalkind');
    this.typeOfCard('sys_cardformat');
  }

  createFormGroup() {
    this.newDeviceForm = this.formBuilder.group({
      cihazAdi: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])],
      model: ['', Validators.required],
      port: ['', Validators.required],
      ip: ['', Validators.required],
      moduleid: ['', Validators.required],
      girisCıkıs: ['', Validators.required],
      cihazTanimi: ['', Validators.required],
      pcAdi: ['', Validators.required],
      kartFormat: ['', Validators.required],
      kapiBilgi: ['', Validators.required],
      pingTest: ['', Validators.required],
      byPass: ['', Validators.required],
      aktifPasif: ['', Validators.required],
      showTime: ['', Validators.required],
      // bastarih: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required],
      // bassaat: [formatDate(this.currentDate, 'HH:mm', 'en'), Validators.required],
      // bittarih: [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required],
      // bitsaat: [formatDate(this.currentDate, 'HH:mm', 'en'), Validators.required],
      // file: [null] 
    });
  }

  nextStep() {
    // if (!this.canProceedToNextStep()) {
    //   this.toastrService.error(
    //     this.translateService.instant('Form_Alanlarını_Doldurmalısınız'),
    //     this.translateService.instant('Hata')
    //   );
    //   return;

    // }
  
    const nextStep = this.currentStep$.value + 1;
    if (nextStep <= this.formsCount) {
      this.currentStep$.next(nextStep);
      this.currentItem = this.stepperFields[nextStep - 1];
      this.currentItem.class = "stepper-item current";
      if (nextStep > 1) {
        this.stepperFields[nextStep - 2].class = "stepper-item completed";
      }
    }
  }
  
  prevStep() {
    // if (this.currentStep$.value === 2) {
    //   this.overtimeForm.reset();
    // }
    
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
    this.newDeviceFormValues = Object.assign({}, this.newDeviceForm.value);

    for (let key in this.newDeviceFormValues) {
      if (this.newDeviceFormValues.hasOwnProperty(key) && this.newDeviceFormValues[key] === '') {
        if (key === 'cihazAdi' || key === 'model') {
          this.newDeviceFormValues[key] = '0';
        } else if (key === 'port' || key === 'ip' || key === 'moduleid' || key === 'girisCıkıs' || key === 'cihazTanimi') {
          this.newDeviceFormValues[key] = '';
        }
      }
    }

    // this.newDeviceFormValues.izinadresi = '';
    console.log("newDeviceFormValues Form :", this.newDeviceFormValues);

    if(this.currentStep$.value === 3) {
      return this.newDeviceForm.valid;

    } else if(this.currentStep$.value === 4) {
      // this.postOvertimeForm(this.newDeviceFormValues);
      return true;
    }

    return true;
  }

  getNewDeviceFormValues() {
    this.newDeviceFormValues = Object.assign({}, this.newDeviceForm.value);

    for (let key in this.newDeviceFormValues) {
      if (this.newDeviceFormValues.hasOwnProperty(key) && this.newDeviceFormValues[key] === '') {
        if (key === 'cihazAdi' || key === 'model') {
          this.newDeviceFormValues[key] = '0';
        } else if (key === 'port' || key === 'ip' || key === 'moduleid' || key === 'girisCıkıs' || key === 'cihazTanimi') {
          this.newDeviceFormValues[key] = '';
        }
      }
    }
    console.log("newDeviceFormValues:", this.newDeviceFormValues);
  }

  getFormValues() {
    this.newDeviceFormValues = Object.assign({}, this.newDeviceForm.value);

    for (let key in this.newDeviceFormValues) {
      if (this.newDeviceFormValues.hasOwnProperty(key) && this.newDeviceFormValues[key] === '') {
        if (this.newDeviceFormValues.hasOwnProperty(key) && this.newDeviceFormValues[key] === '') {
          if (key === 'cihazAdi' || key === 'model') {
            this.newDeviceFormValues[key] = '0';
          } else if (key === 'port' || key === 'ip' || key === 'moduleid' || key === 'girisCıkıs' || key === 'cihazTanimi') {
            this.newDeviceFormValues[key] = '';
          }
        }
    }

    console.log("newDeviceFormValues:", this.newDeviceFormValues);

    // if (this.isFromAttendance) {
    //   this.postOvertimeForm(this.newDeviceFormValues);
    //   return;
    // }
    if (this.isFromAttendance) {
      return;
    }
   }
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
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
