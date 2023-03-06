import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-gecisgruplari',
  templateUrl: './gecisgruplari.component.html',
  styleUrls: ['./gecisgruplari.component.scss']
})
export class GecisgruplariComponent implements OnInit {
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns : string[] = ['checkbox', 'terminal', 'durum', 'edit'];

  /* Material Table Dataes */
  dataSourceAtanmamis : MatTableDataSource<any>;
  dataSourceYetkili : MatTableDataSource<any>;
  dataSourceBelirsiz : MatTableDataSource<any>;
  /* ---------------------------------------------------------- */

  /* Dummy Data */
  terminaller : any[] = [
    {terminal : 'BioMini 998', durum : 'Belirsiz', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Atanmamış', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Yetkili', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Atanmamış', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Yetkili', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Atanmamış', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Atanmamış', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Belirsiz', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Atanmamış', isEdit: false},
    {terminal : 'BioMini 998', durum : 'Yetkili', isEdit: false}
  ];
  cards : any[] = [
    {id: 1, name: 'Yetkili Terminal Tablosu', isOpen: true, table: 'yekili', dataSource: 'dataSourceYetkili'},
    {id: 2, name: 'Atanmamış Terminal Tablosu', isOpen: true, table: 'atanmamis', dataSource: 'dataSourceAtanmamis'},
    {id: 3, name: 'Belirsiz Terminal Tablosu', isOpen: true, table: 'belirsiz', dataSource: 'dataSourceBelirsiz'},
  ];
  /* ---------------------------------------------------------- */


  atanmamis : any[] = [];
  yetkili : any[] = [];
  belirsiz : any[] = [];

  /* Form Variables */
  terminalForm : FormGroup;
  passGroupForm : FormGroup;
  passGroupValue : any;
  passGroupUpdateForm : FormGroup;
  passGroupInsertForm : FormGroup;
  /* ---------------------------------------------------------- */


  removeCards : any[] = [];

  constructor(
    private formBuilder : FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.classification();
    this.setDataTable();
  }

  // Terminaller dizisi parçalandı
  classification() {
    this.terminaller.forEach((item, index) => {
      item.index = index;

      if (item.durum == 'Belirsiz') {
        this.belirsiz.push(item);
      } else if(item.durum == 'Atanmamış') {
        this.atanmamis.push(item);
      } else {
        this.yetkili.push(item);
      }
    });
  }

  // Tablo için verileri yerleştirme
  setDataTable() {
    this.dataSourceAtanmamis = new MatTableDataSource(this.atanmamis);
    this.dataSourceAtanmamis.paginator = this.paginator;

    this.dataSourceYetkili = new MatTableDataSource(this.yetkili);
    this.dataSourceYetkili.paginator = this.paginator;

    this.dataSourceBelirsiz = new MatTableDataSource(this.belirsiz);
    this.dataSourceBelirsiz.paginator = this.paginator;
  }

  // Tablodan düzenleme alanı açma
  onEdit(item: any) {
    item.isEdit = true;
  }

  // Formları oluşturma
  createForm() {
    this.passGroupForm = this.formBuilder.group({
      passGroup : ['-1 Asansör', Validators.required]
    });

    this.passGroupInsertForm = this.formBuilder.group({
      text : ['', Validators.required]
    });
    
    this.passGroupUpdateForm = this.formBuilder.group({
      text : [this.passGroupForm.controls['passGroup'].value, Validators.required]
    });

    this.terminalForm = this.formBuilder.group({
      durum : [''],
    });
  }
  
  // Tablodaki veriyi güncelleme 
  updateData(table: any, element: any, value: any) {
    console.log("element :", element);
    console.log("value :", value);
    console.log("table :", table);

    let f = table.filter((item:any) => item.durum != value);
    console.log("table.filteredData :", f);
    this.setDataTable();

    element.durum = value;
    element.isEdit = false;
  }


}
