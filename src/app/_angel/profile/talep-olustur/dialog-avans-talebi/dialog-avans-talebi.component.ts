import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AccessDataModel } from '../../models/accessData';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ProfileService } from '../../profile.service';
import { OKodFieldsModel } from '../../models/oKodFields';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dialog-avans-talebi',
  templateUrl: './dialog-avans-talebi.component.html',
  styleUrls: ['./dialog-avans-talebi.component.scss'],
  animations: [
    trigger("elemanEkle", [
      state("ekle", style({ transform: "translateX(0)" })),
      transition(":enter", [
        style({ transform: 'translateX(-100%)' }),
        animate("500ms")
      ]),
      transition(':leave', [
        animate(1000, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class DialogAvansTalebiComponent implements OnInit {

  private ngUnsubscribe = new Subject();

  @Output() visitRequestFormIsSend: EventEmitter<void> = new EventEmitter<void>();

  visitorForm: FormGroup;
  visitorFormValues: any;
  company: any[] = [];
  selectedCompany: any;
  visitTypes: OKodFieldsModel[] = [];
  fieldCount = 0;
  isOtherCompany: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private profilService: ProfileService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createFormGroup();
    this.getAccessData();
    this.getOKodField('cbo_ziyaretnedeni');
    this.isThereCompany();
  }

  // Formların oluşması
  createFormGroup() {
    this.visitorForm = this.formBuilder.group({
      ad: ['', Validators.required],
      soyad: ['', Validators.required],
      email: ['', Validators.required],
      firma: ['', Validators.required],
      ziyaretTipi: ['', Validators.required],
      aciklama: ['', Validators.required],
      girisTarihi: ['', Validators.required],
      girisSaati: ['', Validators.required],
      cikisTarihi: ['', Validators.required],
      cikisSaati: ['', Validators.required]
    });
  }

  // Form değerlerinin alınması
  getFormsValues() {
    this.visitorFormValues = Object.assign({}, this.visitorForm.value)
    console.log("form : ", this.visitorFormValues);
  }

  getFieldCountArray() {
    return Array.from({ length: this.fieldCount }, (_, i) => i + 1);
  }

  addNewFields() {
    this.fieldCount++;
    this.visitorForm.addControl('ad' + this.fieldCount, this.formBuilder.control('', Validators.required));
    this.visitorForm.addControl('soyad' + this.fieldCount, this.formBuilder.control('', Validators.required));

    this.ref.detectChanges();

  }

  removeNewFields(index: number) {
    this.fieldCount--;
    const adControlName = 'ad' + index;
    const soyadControlName = 'soyad' + index;

    this.visitorForm.removeControl(adControlName);
    this.visitorForm.removeControl(soyadControlName);

    this.ref.detectChanges();
  }

  getAccessData() {
    this.profilService.getAccessData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<AccessDataModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      this.company = [];

      if (message.islemsonuc == 1) {
        data.forEach((item: AccessDataModel) => {
          if (item.tip == 'cbo_Firma') {
            this.company.push(item);
          }
        })
      }
      console.log("cbo_firma :", this.company);


      this.ref.detectChanges();
    });
  }

  getOKodField(kaynak: string) {
    this.profilService.getOKodField(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        console.log("Okod Alanları : ", data);
        this.visitTypes = data;
      }

      this.ref.detectChanges();
    });
  }

  isThereCompany() {
    this.visitorForm.get('firma')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value : any) => {
      if (value?.id == '0') {
        this.visitorForm.addControl('otherCompany', this.formBuilder.control('', Validators.required));
        this.isOtherCompany = true; // ng-container da durum kontrolü için eklendi
      } else {
        this.isOtherCompany = false; // ng-container da durum kontrolü için eklendi
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}