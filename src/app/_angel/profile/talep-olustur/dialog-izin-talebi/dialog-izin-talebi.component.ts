import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { HelperService } from 'src/app/_helpers/helper.service';
import { OKodFieldsModel } from '../../models/oKodFields';
import { UserInformation } from '../../models/user-information';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-dialog-izin-talebi',
  templateUrl: './dialog-izin-talebi.component.html',
  styleUrls: ['./dialog-izin-talebi.component.scss']
})
export class DialogIzinTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Output() vacationFormIsSend: EventEmitter<void> = new EventEmitter<void>();
  @Input() closedForm: BehaviorSubject<boolean>;


  vacationForm : FormGroup;
  vacationReasons : any[] = [];
  vacationFormValues : any;
  izinKalan: number;
  isHourly: boolean = false;

  currentDate = new Date(Date.now());
  selectedType  : any;
  userInformation: UserInformation;
  calcTimeDesc: any;
  calcTimeValue: any;
  currentSicilId: any;
  formDisabled: boolean = true;

  constructor(
    private profileService : ProfileService,
    private formBuilder : FormBuilder,
    private helperService : HelperService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentSicilId = this.helperService.userLoginModel.xSicilID
    this.createVacationForm();
    this.getVacationReason();
    this.getUserInformation();
    this.valueChanges();
    this.dateChanges();
    this.closedFormDialog();
  }

  createVacationForm() {
    this.vacationForm = this.formBuilder.group({
      tip : ['', [Validators.required]],
      bastarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      bassaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
      bittarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      bitsaat : [ {value: '', disabled: this.formDisabled }, [Validators.required]],
      aciklama : ['', [Validators.required]],
      izinadresi : ['', [Validators.required]],
      gunluksaatlik : ['gunluk'],
    });
  }

  getVacationReason() {
    this.profileService.getOKodField('cbo_izintipleri').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        this.vacationReasons = data;
        console.log("İzin Tipleri : ", data);
      }

      this.ref.detectChanges();
    });
  }

  getVacationFormValues() {
    this.vacationFormValues = Object.assign({}, this.vacationForm.value);
    console.log("İzin Formu :", this.vacationFormValues);

    this.postVacationForm();
  }

  getUserInformation() {
    this.profileService.getUserInformation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<UserInformation,ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;

      console.log("Sicil Bilgiler :", data);
      

      if (message.islemsonuc == 1) {
        this.izinKalan = data[0].Kalan;
        this.userInformation = data[0];
        console.log("USER :", this.izinKalan);
      }
      
      
      this.ref.detectChanges();
    })
  }

  valueChanges() {
    this.vacationForm.get("gunluksaatlik")?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      console.log("item : ",item);
      if (item == 'saatlik') {
        this.isHourly = true;
        this.vacationForm.get("bassaat")?.enable();
        this.vacationForm.get("bitsaat")?.enable();
        this.formDisabled = false;

      } else {

        this.isHourly = false;
        this.vacationForm.get("bassaat")?.disable();
        this.vacationForm.get("bitsaat")?.disable();
        this.formDisabled = true;
      }
    });
  }

  postVacationForm() {
    this.profileService.postOvertimeOrVacationDemand('izin', this.vacationFormValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      console.log("İzin Form gönderildi :", response);

      this.vacationFormIsSend.emit();
      this.vacationForm.reset();
    })
  }

  dateChanges() {
    this.vacationForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(item => {
      let formValue = Object.assign({}, this.vacationForm.value);
      formValue.siciller = this.currentSicilId;
      if (!formValue.tip) {
        this.calcTimeDesc = 'İzin Tipi Seçmelisiniz!'
      } else if (formValue.gunluksaatlik == 'saatlik' && (!formValue.bassaat || !formValue.bitsaat)){
        this.calcTimeDesc = 'Saat Bilgisi Girimelisiniz!'
      } else {
        this.calcTimeDesc = '';
        this.calculateVacationTime(formValue);
      }
    })
  }

  calculateVacationTime(form: any) {
    this.profileService.calculateVacationTime(form).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      const data = response[0].x;
      const apiMessage = response[0].z;

      if (apiMessage.islemsonuc == 1) {
        this.calcTimeValue = data[0].izinhesapsure;

      } else if (apiMessage.islemsonuc == -11) {
        this.calcTimeDesc = data[0].izinhesapsure;
      }
      console.log("İzin Süresi Hesaplama :", response);
      

      this.ref.detectChanges();
    });
  }

  closedFormDialog() {
    this.closedForm.subscribe(_ => {
      console.log("Closed Form : ", _);
      this.vacationForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
