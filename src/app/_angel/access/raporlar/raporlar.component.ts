import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-raporlar',
  templateUrl: './raporlar.component.html',
  styleUrls: ['./raporlar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        width: '25%'
      })),
      state('out', style({
        width: '100%'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),

    trigger('slideInOutReport', [
      state('in', style({
        width: '75%'
      })),
      state('out', style({
        width: '25%'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class RaporlarComponent implements OnInit {

  reports: any[] = [
    { id: 1, name: 'Geçiş Yetkileri Raporu', params: [{ name: '@ad', labelName: 'Ad', type: 'text' }, { name: '@soyad', labelName: 'Soyad', type: 'text' }, { name: '@firma', labelName: 'Firma', type: 'select' }] },
    { id: 2, name: 'Access Devamsızlar Raporu', params: [{ name: '@sicil_no', labelName: 'Sicil No', type: 'text' }, { name: '@kart_no', labelName: 'Kart No', type: 'text' }, { name: '@terminal', labelName: 'Terminal', type: 'select' }, { name: '@alt_firma', labelName: 'Alt Firma', type: 'select' }] },
    { id: 3, name: 'Acil Durum Raporu', params: [{ name: '@ad', labelName: 'Ad', type: 'text' }, { name: '@soyad', labelName: 'Soyad', type: 'text' }, { name: '@sicil_no', labelName: 'Sicil No', type: 'text' }] },
    { id: 4, name: 'Acil Durum Raporu', params: [{ name: '@ad', labelName: 'Ad', type: 'text' }, { name: '@soyad', labelName: 'Soyad', type: 'text' }, { name: '@sicil_no', labelName: 'Sicil No', type: 'text' }] },
    { id: 5, name: 'Acil Durum Raporu', params: [{ name: '@ad', labelName: 'Ad', type: 'text' }, { name: '@soyad', labelName: 'Soyad', type: 'text' }, { name: '@sicil_no', labelName: 'Sicil No', type: 'text' }] },
    { id: 6, name: 'Acil Durum Raporu', params: [{ name: '@ad', labelName: 'Ad', type: 'text' }, { name: '@soyad', labelName: 'Soyad', type: 'text' }, { name: '@sicil_no', labelName: 'Sicil No', type: 'text' }] }

  ];

  selectedCities2: any[] = [];
  cities: any = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];
  

  selectedItem: any;

  animation: string = 'out';
  animationReport: string = 'in';

  showTable: boolean = false;

  dynamicReportForm !: FormGroup;

  selectedValue : any[] = []

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {

  }

  createDynamicForm(item: any) {
    this.dynamicReportForm = this.formBuilder.group({})

    item.params.forEach((param: any) => {
      this.dynamicReportForm.addControl(param.name, this.formBuilder.control(''));
    })
    console.log("Reactiveform : ", this.dynamicReportForm);
  }

  toggleDiv(): void {
    this.animation = 'in';
  }

  toggleReport(): void {
    this.animationReport = 'out';
  }

  onSelect(item: any): void {
    if (this.showTable) {
      this.showTable = false;
      this.animationReport = 'in';
    }
    this.selectedItem = item;
    console.log("Selected Item: ", this.selectedItem);

    this.createDynamicForm(item);
  }

  getFormValue(contorls : any) {
    // this.selectedValue.push(this.dynamicReportForm.controls[contorls].value);
    this.dynamicReportForm.controls[contorls].valueChanges.subscribe((v : any) => {
      this.selectedValue = v;
    });
    
    console.log("Get Value : ", this.selectedValue);
  }

  remove(param: any): void {
    const index = this.selectedValue.indexOf(param);

    if (index >= 0) {
      this.selectedValue.splice(index, 1);
    }
  }

}

