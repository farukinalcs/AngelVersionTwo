import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-takimim',
  templateUrl: './takimim.component.html',
  styleUrls: ['./takimim.component.scss']
})
export class TakimimComponent implements OnInit {

  panelOpenState = false;

  response : any[] = [
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'İçeride', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'İçeride', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'İçeride', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'İçeride', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'İçeride', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'İçeride', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'Dışarıda', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
    {durum : 'İçeride', gelmedi : 'Gelmedi', bekleyenizintalep : '0', bekleyenfmtalep : '6', geckalma : '0', erkencikma : '0', fotoimage : '', ad : 'Ad', soyad : 'Soyad', ggiris : '16-01-2023 07:58:09', gcikis : '16-01-2023 18:02:29', sicilno : '00000233', mesaiaciklama : 'Hafta İçi'},
  ]

  staffInside : any[] = [];
  staffOutside : any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.classification();
  }

  classification() {
    this.response.forEach((item) => {
      if (item.durum === 'Dışarıda') {
        this.staffOutside.push(item);
      } else {
        this.staffInside.push(item);
      }
    })
  }

}
