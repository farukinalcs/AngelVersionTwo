import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dialog-ziyaretci-talebi',
  templateUrl: './dialog-ziyaretci-talebi.component.html',
  styleUrls: ['./dialog-ziyaretci-talebi.component.scss']
})
export class DialogZiyaretciTalebiComponent implements OnInit {

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;
  // Form geçerli ise geçiş olsun
  isLinear : boolean = true

  firstFormGroup : FormGroup;
  secondFormGroup : FormGroup;

  // Girilen form bilgilerinin olduğu object
  formsValues: any = {
    ad: null,
    soyad: null,
    email: null,
    firma: null,
    ziyaretTipi: null,
    aciklama: null,
    girisTarihi: null,
    girisSaati: null,
    cikisTarihi: null,
    cikisSaati: null,
  };

  // First form geçerli mi
  isFirstFormValid: boolean = false;  
  // Second form geçerli mi
  isSecondFormValid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.setResponsiveForm();
    this.createFormGroup();
    this.checkFirstFormValid();
    this.checkSecondFormValid();
  }

  // Formların oluşması
  createFormGroup() {
    this.firstFormGroup = this.formBuilder.group({
      ad : ['', Validators.required],
      soyad : ['', Validators.required],
      email : ['', Validators.required],
      firma : ['', Validators.required],
      ziyaretTipi : ['', Validators.required],
      aciklama : ['', Validators.required],
    });

    this.secondFormGroup = this.formBuilder.group({
      girisTarihi : ['', Validators.required],
      girisSaati : ['', Validators.required],
      cikisTarihi : ['', Validators.required],
      cikisSaati : ['', Validators.required]
    })
  }

  // Form değerlerinin alınması
  getFormsValues() {
    this.firstFormGroup.valueChanges.subscribe((d) => {
      this.formsValues.ad = d.ad;
      this.formsValues.soyad = d.soyad;
      this.formsValues.email = d.email;
      this.formsValues.firma = d.firma;
      this.formsValues.ziyaretTipi = d.ziyaretTipi;
      this.formsValues.aciklama = d.aciklama;

    });
    this.secondFormGroup.valueChanges.subscribe((d) => {
      this.formsValues.girisTarihi = d.girisTarihi;
      this.formsValues.girisSaati = d.girisSaati;
      this.formsValues.cikisTarihi = d.cikisTarihi;
      this.formsValues.cikisSaati = d.cikisSaati;
    });
    console.log("TEST :", this.formsValues);
  }

  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }
  
  // First form geçerli mi
  checkFirstFormValid() {
    this.firstFormGroup.valueChanges.subscribe(() => {
      this.isFirstFormValid = this.firstFormGroup.valid;
    });
  }

  // Second form geçerli mi
  checkSecondFormValid() {
    this.secondFormGroup.valueChanges.subscribe(() => {
      this.isSecondFormValid = this.secondFormGroup.valid;
    });
  }

}
