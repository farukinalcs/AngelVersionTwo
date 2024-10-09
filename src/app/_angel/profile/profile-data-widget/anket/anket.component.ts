import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-anket',
  templateUrl: './anket.component.html',
  styleUrls: ['./anket.component.scss']
})
export class AnketComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  items: any[] = [
    { id: '1', tarih: '01 Temmuz 2023', aciklama: 'Kahvaltı Yapalım mı ?', bolum: 'İnsan Kaynakları', selectedOption: null },
    { id: '2', tarih: '02 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Yazılım Geliştirme', selectedOption: null },
    { id: '3', tarih: '03 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Yazılım Geliştirme', selectedOption: null },
    { id: '4', tarih: '04 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Yazılım Geliştirme', selectedOption: null },
    { id: '5', tarih: '05 Temmuz 2023', aciklama: 'Araç Talep Modülü Yapalım mı ?', bolum: 'Teknik', selectedOption: null },
  ];

  surveyForm: FormGroup;
  displayAllSurveys : boolean;
  selectedItem: any;
  filteredItems: any[] = [];

  // Tekilleştirilmiş bölümleri içerecek yeni dizi
  uniqueDepartments: any[] = this.getUniqueBolumValues(this.items);
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createSurveyForm();
  }

  createSurveyForm() {
    this.surveyForm = this.formBuilder.group({
      survey: ['']
    });
    
    this.items.forEach(item => {
      item.selectedOption = null;
    });
  }

  onOptionSelect(item : any, optionValue : any) {
    item.selectedOption = optionValue;
  }

  getValues() {
    console.log("items : ", this.items);
    
  }

  showAllSurveys() {
    this.displayAllSurveys = true;
  }



  // Tekilleştirme işlemi
  getUniqueBolumValues(items: any[]) {
    const bolumler: string[] = [];

    // Tüm bölümleri dolaşıp bolumler dizisine ekleyin
    for (const item of items) {
      if (!bolumler.includes(item.bolum)) {
        bolumler.push(item.bolum);
      }
    }

    return bolumler;
  }

  onSelect(item: any): void {
    this.selectedItem = item;
    console.log("Selected Item: ", this.selectedItem);
    this.filterItems();
  }

  filterItems(): void {
    if (this.selectedItem && this.selectedItem !== 'Tümü') {
      this.filteredItems = this.items.filter(item => item.bolum === this.selectedItem);
    } else {
      this.filteredItems = this.items;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
