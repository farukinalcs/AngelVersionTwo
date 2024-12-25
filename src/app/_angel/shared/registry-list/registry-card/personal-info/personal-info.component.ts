import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject();
  @Input() operationType: any;
  @Input() selectedRegister: any;
  @Output() formEvent = new EventEmitter<any>();
  bloodGroups: any[] = [];
  bloodGroup: any;
  genders: any[] = [];
  gender: any;
  form: FormGroup;
  registerDetail: any[] = [];
  constructor(
    private translateService: TranslateService,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.createForm();
    this.getGenders();
    this.getBloodGroups();

    if (this.operationType == 'i') {
      this.changedFormValue(); 
    } 
  }

  ngOnChanges() {
    // if (this.operationType == 'u') {
    //   this.setFormValue();
    // }
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [""],
      surname: [""],
      registryNo: [""],
      personNo: [""],
      bloodGroup: [""],
      gender: [""]
    });
  }
  
  getGenders() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'sys_cinsiyet',
        id: '0'
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        console.log('Cinsiyet Geldi: ', data);

        this.genders = [...data];      
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }

  getBloodGroups() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'sys_KanGrubu',
        id: '0'
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }
        console.log('Kan Grubu Geldi: ', data);

        this.bloodGroups = [...data];      

        if (this.operationType == 'u') {
          this.getRegisterDetail();
        }
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }
  
  changedFormValue() {
    this.form?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value : any) => {
      this.formEvent.emit(value);
    });
  }
  

  getRegisterDetail() {
    var sp: any[] = [
      { mkodu: 'yek209', id: this.selectedRegister?.Id.toString() }
    ];
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;
      if (message.islemsonuc == -1) {
        return;  
      }
      console.log("Sicil Detay Geldi : ", data);
      this.registerDetail = [...data];
      this.setFormValue();
    });
  }

  setFormValue() {
    const bloodGroupValue = this.bloodGroups.find(item => item.ID === this.registerDetail[0]?.kangrubu);
    const genderValue = this.genders.find(item => item.ID === this.registerDetail[0]?.cinsiyet);
  
    this.form.patchValue({
      name: this.registerDetail[0].ad,
      surname: this.registerDetail[0].soyad,
      registryNo: this.registerDetail[0].sicilno,
      personNo: this.registerDetail[0].personelno,
      bloodGroup: bloodGroupValue || null,
      gender: genderValue || null
    });
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
