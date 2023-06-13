import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../models/oKodFields';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { PostFormModel } from '../../models/postForm';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-fazla-mesai-talebi',
  templateUrl: './dialog-fazla-mesai-talebi.component.html',
  styleUrls: ['./dialog-fazla-mesai-talebi.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class DialogFazlaMesaiTalebiComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Output() overtimeFormIsSend: EventEmitter<void> = new EventEmitter<void>();

  overtimeForm : FormGroup;
  fmNedenleri : any[] = [];
  yemek : any[] = [];
  ulasim : any[] = [];
  overtimeFormValues: any;
  currentDate = new Date(Date.now());
  selectedOvertime : any;
  selectedUlasim : any;
  selectedYemek : any;


  constructor(
    private profileService : ProfileService,
    private formBuilder: FormBuilder,
    private toastrService : ToastrService,
    private translateService: TranslateService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createFormGroup();
    this.getOvertimeReason('cbo_fmnedenleri');
    this.getOvertimeReason('cbo_ulasim');
    this.getOvertimeReason('cbo_yemek');
  }


  createFormGroup() {
    this.overtimeForm = this.formBuilder.group({
      aciklama : ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])],
      tip : ['', Validators.required],
      ulasim : ['', Validators.required],
      yemek : ['', Validators.required],
      bastarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required],
      bassaat : ['', Validators.required],
      bittarih : [formatDate(this.currentDate, 'yyyy-MM-dd', 'en'), Validators.required],
      bitsaat : ['', Validators.required]
    });
  }

  getOvertimeFormValues() {
    this.overtimeFormValues = Object.assign({}, this.overtimeForm.value);

    for (let key in this.overtimeFormValues) {
      if (this.overtimeFormValues.hasOwnProperty(key) && this.overtimeFormValues[key] === '') {
        if (key === 'tip' || key === 'ulasim' || key === 'yemek') {
          this.overtimeFormValues[key] = '0';
        } else if(key === 'aciklama' || key === 'bastarih' || key === 'bassaat' || key === 'bittarih' || key === 'bitsaat') {
          this.overtimeFormValues[key] = '';
        }
      }
    }

    this.overtimeFormValues.izinadresi = '';
    console.log("Fazla Mesai Form :", this.overtimeFormValues);

    this.postOvertimeForm();
  }

  getOvertimeReason(kaynak : string) {
    this.profileService.getOKodField(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        if (kaynak == 'cbo_fmnedenleri') {
          this.fmNedenleri = data;
        } else if(kaynak == 'cbo_ulasim') {
          this.ulasim = data;
        } else {
          this.yemek = data;
        }
        console.log("FM Nedenleri : ", data);
      }

      this.ref.detectChanges();
    });
  }

  postOvertimeForm() {
    this.profileService.postOvertimeOrVacationDemand('fm', this.overtimeFormValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<PostFormModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const apiMessage = response[0].z;
      const spMessage = response[0].m[0];

      console.log("Fm Form gönderildi :", response);
      if (data[0].sonuc == 1) {
        this.overtimeFormIsSend.emit();
        this.overtimeForm.reset();
        
        this.toastrService.success(
          this.translateService.instant('TOASTR_MESSAGE.TALEP_GONDERILDI'),
          this.translateService.instant('TOASTR_MESSAGE.BASARILI')
        );
      } else {
        this.toastrService.error(
          this.translateService.instant(spMessage.usermessage),
          this.translateService.instant('TOASTR_MESSAGE.HATA')
        );
      }
    });
  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
