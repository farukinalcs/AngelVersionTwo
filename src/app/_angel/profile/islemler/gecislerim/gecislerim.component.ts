import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gecislerim',
  templateUrl: './gecislerim.component.html',
  styleUrls: ['./gecislerim.component.scss']
})
export class GecislerimComponent implements OnInit {

  gunlukGecisler : any[] = [
    {hareketTipi : '1', tarih : '17-01-2023', saat : '07:50:20'},
    {hareketTipi : '-1', tarih : '17-01-2023', saat : '18:05:20'},
  ];

  haftalikGecisler : any[] = [
    {hareketTipi : '1', tarih : '17-01-2023', saat : '07:50:20'},
    {hareketTipi : '-1', tarih : '17-01-2023', saat : '18:05:20'},
    {hareketTipi : '1', tarih : '16-01-2023', saat : '07:50:20'},
    {hareketTipi : '-1', tarih : '16-01-2023', saat : '18:05:20'},
    {hareketTipi : '1', tarih : '15-01-2023', saat : '07:50:20'},
    {hareketTipi : '-1', tarih : '15-01-2023', saat : '18:05:20'},
    {hareketTipi : '1', tarih : '14-01-2023', saat : '07:50:20'},
    {hareketTipi : '-1', tarih : '14-01-2023', saat : '18:05:20'},
    {hareketTipi : '1', tarih : '13-01-2023', saat : '07:50:20'},
    {hareketTipi : '-1', tarih : '13-01-2023', saat : '18:05:20'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
