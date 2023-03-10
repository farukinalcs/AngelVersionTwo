import { Component, OnInit } from '@angular/core';
import { CellClickedEvent, ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-puantaj-listesi',
  templateUrl: './puantaj-listesi.component.html',
  styleUrls: ['./puantaj-listesi.component.scss']
})
export class PuantajListesiComponent implements OnInit {


  columnDefs: ColDef[] = [
    { headerName: "#", maxWidth: 40, headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true, pinned: 'left' }, 
    { headerName: "Talep Ekle", field: "Talepekle", cellRendererParams: { color: '#ff0000' }, maxWidth: 100},
    { headerName: "Simge", field: "Simge", cellRendererParams: { color: '#ff0000' }, maxWidth: 100},
    { headerName: "SID", field: "SID",cellRendererParams: { color: '#ff0000' }, maxWidth: 100},
    { headerName: "Sicil No", cellRendererParams: { color: '#ff0000' }, field: 'SicilNo', maxWidth: 120 },
    { headerName: "Ad", cellRendererParams: { color: '#ff0000' }, field: 'Ad', maxWidth: 120},
    { headerName: "Soyad", cellRendererParams: { color: '#ff0000' }, field: 'Soyad', maxWidth: 120 },
    { headerName: "Mesai Tarih", cellRendererParams: { color: '#ff0000' }, field: 'MesaiTarih', maxWidth: 120 },
    { headerName: "Giriş", cellRendererParams: { color: '#ff0000' }, field: 'Giriş', maxWidth: 120 },
    { headerName: "Çıkış", cellRendererParams: { color: '#ff0000' }, field: 'Çıkış', maxWidth: 120 },
    { headerName: "MS", cellRendererParams: { color: '#ff0000' }, field: 'MS', maxWidth: 80 },
    { headerName: "NM", cellRendererParams: { color: '#ff0000' }, field: 'NM', maxWidth: 80 },
    { headerName: "AS", cellRendererParams: { color: '#ff0000' }, field: 'AS', maxWidth: 80 },
    { headerName: "FM", cellRendererParams: { color: '#ff0000' }, field: 'FM', maxWidth: 80 },
    { headerName: "GV", cellRendererParams: { color: '#ff0000' }, field: 'GV', maxWidth: 80 },
    { headerName: "GZ", cellRendererParams: { color: '#ff0000' }, field: 'GZ', maxWidth: 80 },
    { headerName: "FAS", cellRendererParams: { color: '#ff0000' }, field: 'FAS', maxWidth: 80 },
    { headerName: "OFM", cellRendererParams: { color: '#ff0000' }, field: 'OFM', maxWidth: 80 },
    { headerName: "RTOFM", cellRendererParams: { color: '#ff0000' }, field: 'RTFM', maxWidth: 80 },
    { headerName: "IZS", cellRendererParams: { color: '#ff0000' }, field: 'IZS', maxWidth: 80 },
    { headerName: "YIZS", cellRendererParams: { color: '#ff0000' }, field: 'YIZS', maxWidth: 80 },
    { headerName: "SGKI", cellRendererParams: { color: '#ff0000' }, field: 'SGKI', maxWidth: 80 },
    { headerName: "UCZI", cellRendererParams: { color: '#ff0000' }, field: 'UCZI', maxWidth: 80 },
    { headerName: "RM", cellRendererParams: { color: '#ff0000' }, field: 'RM', maxWidth: 80 },
    { headerName: "EM", cellRendererParams: { color: '#ff0000' }, field: 'EM', maxWidth: 80 },
    { headerName: "Mesai Açıklama", cellRendererParams: { color: '#ff0000' }, field: 'MesaiAçıklama', maxWidth: 100 },
    { headerName: "İzin Açıklama", cellRendererParams: { color: '#ff0000' }, field: 'İzinAçıklama', maxWidth: 100 },
    { headerName: "RM Açıklama", cellRendererParams: { color: '#ff0000' }, field: 'RMAçıklama', maxWidth: 100 }

  ];

  rowData:any[] = [
    { Talepekle: 'Ford', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Porsche', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Ford', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
    MS: 'Celica', NM: 35000, AS: 'Toyota', FM: 'Celica', GV: 35000, GZ: 'Celica', FAS: 35000, OFM: 'Toyota', RTOFM: 'Celica', RTFM: 35000, IZS: 'Celica', 
    YIZS: 35000, SGKI: 'Toyota', UCZI: 'Celica', RM: 35000, EM: 35000, MesaiAçıklama: 'Toyota', İzinAçıklama: 'Celica', RMAçıklama: 35000,},

    { Talepekle: 'Toyota', Simge: 'Celica', SID: 35000, SicilNo: 'Toyota', Ad: 'Celica', Soyad: 35000, MesaiTarih: 'Toyota', Giriş: 'Celica', Çıkış: 35000, 
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
