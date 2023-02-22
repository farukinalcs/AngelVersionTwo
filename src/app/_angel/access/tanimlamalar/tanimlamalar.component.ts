import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tanimlamalar',
  templateUrl: './tanimlamalar.component.html',
  styleUrls: ['./tanimlamalar.component.scss']
})
export class TanimlamalarComponent implements OnInit {

  displayedColumns : string[] = ['id', 'isim', 'duzenle'];
  dataSource :any

  tanimlar : any[] = [
    {id : 1, isim : "Firma"},
    {id : 2, isim : "Mail Servis"},
    {id : 3, isim : "Yaka"},
    {id : 4, isim : "Görev"},
    {id : 5, isim : "Pozisyon"},
    {id : 6, isim : "Bölüm"},
    {id : 7, isim : "Parmak İzi"},
    {id : 8, isim : "Time Zone"},
    {id : 9, isim : "Alt Firma"},
    {id : 10, isim : "Direktörlük"},
    {id : 11, isim : "Terminal Grupları"},
    {id : 12, isim : "Belge Tipi"},
    {id : 13, isim : "Puantaj"},
    {id : 14, isim : "FTP Bilgileri"},
    {id : 15, isim : "Ayrılış Nedeni"},
    {id : 16, isim : "Güvenlik"},
    {id : 17, isim : "Olay Kodları"},
    {id : 18, isim : "Yazıcılar"},
    {id : 19, isim : "Led Panolar"},
    {id : 20, isim : "Yetki Rolleri"},
    {id : 21, isim : "Ben Sayfası"}
  ];
  firma : any[] = [
    {id : 11, isim : "MEYER GROUP"},
    {id : 12, isim : "MEYER BIOMETRIC"},
    {id : 13, isim : "MEYER RFID"},
    {id : 14, isim : "MEYER SECURITY"},
  ];

  selectedItem : any = this.tanimlar[0];
  
  formTest : FormGroup;
  
	responsiveOptions;

  constructor(
    private formBuilder : FormBuilder
  ) {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
   }

  ngOnInit(): void {
    this.setTableValue();
    this.createForm();
    this.getFormValue();
  }

  setTableValue(){
    this.dataSource = this.firma;
    this.dataSource = new MatTableDataSource(this.dataSource);
  }

  createForm() {
    this.formTest = this.formBuilder.group({
      ekelenenDeger : ['', Validators.required]
    })
  }

  getFormValue() {
    this.formTest.valueChanges.subscribe((d) => {
      console.log("TEST :", d);
      console.log("TEST :", d.ekelenenDeger);
      this.firma.push({
        id : 15, isim : d.ekelenenDeger
      });
    });
    console.log("TEST :", this.firma);
  }

  onSelect(item : any): void {
    this.selectedItem = item;
  }
}
