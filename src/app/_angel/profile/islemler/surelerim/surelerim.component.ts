import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-surelerim',
  templateUrl: './surelerim.component.html',
  styleUrls: ['./surelerim.component.scss']
})
export class SurelerimComponent implements OnInit {
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns : string[] = ['tarih', 'girisCikis', 'normalSure', 'araSure', 'izinSure', 'fazlaSure', 'eksikSure']; 
  
  dataSourceGunluk :MatTableDataSource<any>;
  dataSourceHaftalik :MatTableDataSource<any>;
  dataSourceAylik :MatTableDataSource<any>;

  gunlukSureler : any[] = [
    {tarih : '16-12-2022 Cuma', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '17-12-2022 Cumartesi', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
  ];

  haftalikSureler : any[] = [
    {tarih : '16-12-2022 Cuma', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '17-12-2022 Cumartesi', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '18-12-2022 Pazar', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '19-12-2022 Pazartesi', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '20-12-2022 Salı', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '21-12-2022 Çarşamba', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
  ];

  aylikSureler : any[] = [
    {tarih : '16-12-2022 Cuma', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '17-12-2022 Cumartesi', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '18-12-2022 Pazar', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '19-12-2022 Pazartesi', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '20-12-2022 Salı', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '21-12-2022 Çarşamba', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
    {tarih : '22-12-2022 Perşembe', girisCikis : '08:00 18:04', normalSure : '00:00', araSure : '00:00', izinSure : '00:00 ', fazlaSure : '', eksikSure : '540'},
  ];

  
  constructor() { }

  ngOnInit(): void {
    this.dataSourceGunluk = new MatTableDataSource(this.gunlukSureler);
    this.dataSourceGunluk.paginator = this.paginator;

    this.dataSourceHaftalik = new MatTableDataSource(this.haftalikSureler);
    this.dataSourceHaftalik.paginator = this.paginator;

    this.dataSourceAylik = new MatTableDataSource(this.aylikSureler);
    this.dataSourceAylik.paginator = this.paginator;
  }













  ngAfterViewInit() {
    this.dataSourceGunluk.sort = this.sort;
    this.dataSourceHaftalik.sort = this.sort;
    this.dataSourceAylik.sort = this.sort;

  }

}
