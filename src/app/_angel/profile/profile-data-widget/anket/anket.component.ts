import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-anket',
  templateUrl: './anket.component.html',
  styleUrls: ['./anket.component.scss']
})
export class AnketComponent implements OnInit {

  items: any[] = [
    {tarih : '04 Temmuz 2023', aciklama : "Kahvaltı Yapalım mı ?", bolum : 'İnsan Kaynakları'},
    {tarih : '05 Temmuz 2023', aciklama : 'Araç Talep Modülü Yapalım mı ?', bolum : 'Yazılım Geliştirme'},
  ];

  surveyForm : FormGroup;
  constructor(
    private formBuilder : FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createSurveyForm();
  }

  createSurveyForm() {
    this.surveyForm = this.formBuilder.group({
      survey : ['']
    });
  }

}
