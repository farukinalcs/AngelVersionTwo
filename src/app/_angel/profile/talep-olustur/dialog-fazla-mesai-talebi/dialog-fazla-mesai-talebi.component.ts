import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { map, Observable } from 'rxjs';
import { StepperOrientation } from '@angular/material/stepper';
import {BreakpointObserver} from '@angular/cdk/layout';

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
export class DialogFazlaMesaiTalebiComponent implements OnInit {
  // Stepper responsive 
  stepperOrientation: Observable<StepperOrientation>;
  // Form geçerli ise geçiş olsun
  isLinear : boolean = true
  

  firstFormGroup : FormGroup;
  secondFormGroup : FormGroup;

  // Girilen form bilgilerinin olduğu object
  formsValues: any = {
    fmAciklama: null,
    fmNedeni: null,
    ulasim: null,
    yemek: null,
    fmBaslangicTarihi: null,
    fmBaslangicSaati: null,
    fmBitisTarihi: null,
    fmBitisSaati: null,
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
      fmAciklama : ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])],
      fmNedeni : ['', Validators.required],
      ulasim : ['', Validators.required],
      yemek : ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      fmBaslangicTarihi : ['', Validators.required],
      fmBaslangicSaati : ['', Validators.required],
      fmBitisTarihi : ['', Validators.required],
      fmBitisSaati : ['', Validators.required]
    })
  }

  // First form değerlerinin alınması
  getFirstFormValues() {
    let fmAciklama = this.firstFormGroup.get("fmAciklama")?.value;
    this.formsValues.fmAciklama = fmAciklama;
    let fmNedeni = this.firstFormGroup.get("fmNedeni")?.value;
    this.formsValues.fmNedeni = fmNedeni;
    let ulasim = this.firstFormGroup.get("ulasim")?.value;
    this.formsValues.ulasim = ulasim;
    let yemek = this.firstFormGroup.get("yemek")?.value;
    this.formsValues.yemek = yemek;
  }

  // Second form değerlerinin alınması
  getSecondFormValues() {
    let fmBaslangicTarihi = this.secondFormGroup.get("fmBaslangicTarihi")?.value;
    this.formsValues.fmBaslangicTarihi = fmBaslangicTarihi;
    let fmBaslangicSaati = this.secondFormGroup.get("fmBaslangicSaati")?.value;
    this.formsValues.fmBaslangicSaati = fmBaslangicSaati;
    let fmBitisTarihi = this.secondFormGroup.get("fmBitisTarihi")?.value;
    this.formsValues.fmBitisTarihi = fmBitisTarihi;
    let fmBitisSaati = this.secondFormGroup.get("fmBitisSaati")?.value;
    this.formsValues.fmBitisSaati = fmBitisSaati;
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
