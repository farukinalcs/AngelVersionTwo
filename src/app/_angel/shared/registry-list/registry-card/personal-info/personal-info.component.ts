import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { resetForm, updateForm } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
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
    public translateService: TranslateService,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private store: Store<{ form: FormState }>
  ) {}
  
  ngOnInit(): void {
    this.createForm();
    this.getGenders();
    this.getBloodGroups();

    if (this.operationType == 'i') {
      this.changedFormValue(); 
    } 

    this.store.select('form').pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => {
      if (state.personalInfo) {
        this.form.patchValue(state.personalInfo, { emitEvent: false });
      }
    });

    this.saveFormToStore();
  }

  ngOnChanges() {
    // if (this.operationType == 'u') {
    //   this.setFormValue();
    // }
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
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

        this.store.select('form').pipe(take(1)).subscribe((state) => {
          if (!state.personalInfo && this.operationType == 'u') {
            this.getRegisterDetail();
          }
        });
        
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
  
  saveFormToStore() {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value:any) => {
      this.store.dispatch(updateForm({ formName: 'personalInfo', formData: this.form.value }));
    });    
  }
  
  ngOnDestroy(): void {
    // this.store.dispatch(resetForm()); // Form state'ini sıfırla
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
