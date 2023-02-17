import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-taleplerim',
  templateUrl: './taleplerim.component.html',
  styleUrls: ['./taleplerim.component.scss']
})
export class TaleplerimComponent implements OnInit {
  sureciDevamEdenFormSayisi : any = 2;
  panelOpenState = false;

  sureciDevamEdenFormlar : any[] = [
    {talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı1', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'}
  ];

  onaylananFormlar : any[] = [
    {talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı2', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Fazla Mesai Talebi', name : 'Test Kullanıcısı3', neden : 'Fazla mesai nedeni', baslangicTarih : '10-10-2022 00:00:00', bitisTarihi : '12-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'}
  ];

  reddedilenFormlar : any[] = [
    {talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı1', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'İzin Talebi', name : 'Test Kullanıcısı2', neden : 'Yıllık İzin', baslangicTarih : '20-10-2022 00:00:00', bitisTarihi : '20-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Fazla Mesai Talebi', name : 'Test Kullanıcısı3', neden : 'Fazla mesai nedeni', baslangicTarih : '10-10-2022 00:00:00', bitisTarihi : '12-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
    {talepTipi : 'Araç Talebi', name : 'Test Kullanıcısı4', neden : 'Araç talebi nedeni', baslangicTarih : '22-10-2022 00:00:00', bitisTarihi : '24-10-2022 00:00:00', aciklama : 'Test açıklama yazıyorum'},
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
