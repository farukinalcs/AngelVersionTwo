import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { updateForm } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss']
})
export class OrganizationInfoComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject();
  @Input() operationType: any;
  @Input() selectedRegister: any;
  @Output() formEvent = new EventEmitter<any>();
  @Input() checkFormController: any;
  form: FormGroup;
  companies: any[] = [];
  departments: any[] = [];
  positions: any[] = [];
  jobs: any[] = [];
  subCompanies: any[] = [];
  collars: any[] = [];
  directorships: any[] = [];
  timeAttendances: any[] = [];
  registerDetail: any[] = [];
  
  // checkFormController: any = {
  //   checkCompany: "",
  //   checkDepartment: "",
  //   checkPosition: "",
  //   checkJob: "",
  //   checkSubcompany: "",
  //   checkCollar: "",
  //   checkDirectorship: "",
  //   checkTimeAttendance: ""
  // }
  

  constructor(
    private translateService: TranslateService,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private store: Store<{ form: FormState }>
  ) {}
  
  ngOnInit(): void {
    this.createForm();
    this.getValues();

    if (this.operationType == 'i') {
      this.changedFormValue(); 
    } 

    this.store.select('form').pipe(takeUntil(this.ngUnsubscribe)).subscribe((state) => {
      if (state.organizationInfo) {
        this.form.patchValue(state.organizationInfo, { emitEvent: false });
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
      company: [""],
      department: [""],
      position: [""],
      job: [""],
      subCompany: [""],
      collar: [""],
      directorship: [""],
      timeAttendance: [""]
    });
  }

  getValues() {
    var sp: any[] = [
      { mkodu: 'yek041', kaynak: 'cbo_firma', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_bolum', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_pozisyon', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_gorev', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_altfirma', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_yaka', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_direktorluk', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_puantaj', id: '0'}
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        
        data.forEach((item:any, index: any) => {
          if (item.z.islemsonuc == -1) {
            return;
          }

          if (index == 0) {
            this.companies = [...item.x];
            console.log('Firma Geldi: ', this.companies);

          } else if (index == 1) {
            this.departments = [...item.x];
            console.log('Firma Geldi: ', this.departments);

          } else if (index == 2) {
            this.positions = [...item.x];
            console.log('Firma Geldi: ', this.positions);

          } else if (index == 3) {
            this.jobs = [...item.x];
            console.log('Firma Geldi: ', this.jobs);

          } else if (index == 4) {
            this.subCompanies = [...item.x];
            console.log('Firma Geldi: ', this.subCompanies);

          } else if (index == 5) {
            this.collars = [...item.x];
            console.log('Firma Geldi: ', this.collars);

          } else if (index == 6) {
            this.directorships = [...item.x];
            console.log('Firma Geldi: ', this.directorships);

          } else if (index == 7) {
            this.timeAttendances = [...item.x];
            console.log('Firma Geldi: ', this.timeAttendances);

          }
          
        });
        
        this.store.select('form').pipe(take(1)).subscribe((state) => {
          if (!state.organizationInfo && this.operationType == 'u') {
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
      {
        mkodu: 'yek209',
        id: this.selectedRegister?.Id.toString()
      }
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
    const companyValue = this.companies.find(item => item.ID === this.registerDetail[0]?.firma);
    const departmentValue = this.departments.find(item => item.ID === this.registerDetail[0]?.bolum);
    const positionValue = this.positions.find(item => item.ID === this.registerDetail[0]?.pozisyon);
    const jobValue = this.jobs.find(item => item.ID === this.registerDetail[0]?.gorev);
    const subCompanyValue = this.subCompanies.find(item => item.ID === this.registerDetail[0]?.altfirma);
    const collarValue = this.collars.find(item => item.ID === this.registerDetail[0]?.yaka);
    const directorshipValue = this.directorships.find(item => item.ID === this.registerDetail[0]?.direktorluk);
    const timeAttendanceValue = this.timeAttendances.find(item => item.ID === this.registerDetail[0]?.puantaj);

    this.form.patchValue({
      company: companyValue || null,
      department: departmentValue || null,
      position: positionValue || null,
      job: jobValue || null,
      subCompany: subCompanyValue || null,
      collar: collarValue || null,
      directorship: directorshipValue || null,
      timeAttendance: timeAttendanceValue || null,
    });
  }
  
  saveFormToStore() {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value:any) => {
      this.store.dispatch(updateForm({ formName: 'organizationInfo', formData: this.form.value }));
    });    
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}