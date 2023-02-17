import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tanimlamalar',
  templateUrl: './tanimlamalar.component.html',
  styleUrls: ['./tanimlamalar.component.scss']
})
export class TanimlamalarComponent implements OnInit {

  displayedColumns : string[] = ['id', 'isim', 'düzenle'];
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
  ];
  firma : any[] = [
    {id : 11, isim : "MEYER GROUP"},
    {id : 12, isim : "MEYER BIOMETRIC"},
    {id : 13, isim : "MEYER RFID"},
    {id : 14, isim : "MEYER SECURITY"},
  ];

  selectedItem : any;
  
  formTest : FormGroup;

  constructor(
    private formBuilder : FormBuilder
  ) { }

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

}
