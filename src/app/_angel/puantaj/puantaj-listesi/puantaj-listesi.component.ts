import { Component, OnInit } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-puantaj-listesi',
  templateUrl: './puantaj-listesi.component.html',
  styleUrls: ['./puantaj-listesi.component.scss']
})
export class PuantajListesiComponent implements OnInit {


  columnDefs: ColDef[] = [
    { field: 'TalepEkle' },
    { field: 'Simge' },
    { field: 'SID' },
    { field: 'SicilNo' },
    { field: 'Ad' },
    { field: 'Soyad' },
    { field: 'MesaiTarih' },
    { field: 'Giriş' },
    { field: 'Çıkış' },
    { field: 'MS' },
    { field: 'NM' },
    { field: 'AS' },
    { field: 'FM' },
    { field: 'GV' },
    { field: 'GZ' },
    { field: 'FAS' },
    { field: 'OFM' },
    { field: 'RTOFM' },
    { field: 'RTFM' },
    { field: 'IZS' },
    { field: 'YIZS' },
    { field: 'SGKI' },
    { field: 'UCZI' },
    { field: 'RM' },
    { field: 'EM' },
    { field: 'MesaiAçıklama' },
    { field: 'İzinAçıklama' },
    { field: 'RMAçıklama' }

  ];

  rowData:any[] = [
    { TalepEkle: 'Ford', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { TalepEkle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { TalepEkle: 'Porsche', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { TalepEkle: 'Ford', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { TalepEkle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},
  ];

  defaultColDef: ColDef = {
    sortable:true,
    filter:true
  }

  constructor() { }

  ngOnInit(): void {
  }

  onCellClicked(event: CellClickedEvent){
    console.log("event",event)
  }


}
