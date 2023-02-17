import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dialog-gunluk-izin-talebi',
  templateUrl: './dialog-gunluk-izin-talebi.component.html',
  styleUrls: ['./dialog-gunluk-izin-talebi.component.scss']
})
export class DialogGunlukIzinTalebiComponent implements OnInit {

  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;
  // Form geçerli ise geçiş olsun
  isLinear : boolean = true

  firstFormGroup : FormGroup;
  secondFormGroup : FormGroup;

  // Girilen form bilgilerinin olduğu object
  formsValues: any = {
    yeniIzinHakki : null,
    izinHakki: 30,
    talepEdilenIzinTuru: null,
    izinBalangicTarihi: null,
    isBasiTarihi: null,
    izinSuresi: null,
    izinAdresi: null,
    izinAciklama: null,
    vekaletVerilecekKisi: null,
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
      izinHakki : [{value : this.formsValues.izinHakki, disabled: true}, Validators.required],
      talepEdilenIzinTuru : ['', Validators.required],
      izinAdresi : ['test', Validators.required],
      izinAciklama : ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      izinSuresi : ['', Validators.required],
      izinBaslangicTarihi : ['', Validators.required],
      isBasiTarihi : ['', Validators.required],
      vekaletVerilecekKisi : ['', Validators.required]
    })
  }

  // Form değerlerinin alınması
  getFormsValues() {
    this.firstFormGroup.valueChanges.subscribe((d) => {
      this.formsValues.izinHakki = d.izinHakki;
      this.formsValues.talepEdilenIzinTuru = d.talepEdilenIzinTuru;
      this.formsValues.izinAciklama = d.izinAciklama;
      this.formsValues.izinAdresi = d.izinAdresi;
    });
    this.secondFormGroup.valueChanges.subscribe((d) => {
      this.formsValues.izinSuresi = d.izinSuresi;
      this.formsValues.izinBaslangicTarihi = d.izinBaslangicTarihi;
      this.formsValues.isBasiTarihi = d.isBasiTarihi;
      this.formsValues.vekaletVerilecekKisi = d.vekaletVerilecekKisi;
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
