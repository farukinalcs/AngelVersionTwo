import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccessService {
  apiUrl = 'https://www.meyerangel.com:8061/api/process';

  constructor(private httpClient: HttpClient) {}

  getMultipleAccessWidget() : any{
    var sp: any[] = [
      { mkodu: 'yek001' }, // İçerdekiler (personel + ziyeretçi)
      { mkodu: 'yek002' }, // İletişimi Kesik Cihazlar
      { mkodu: 'yek003' }, // Mesaisi Bitip Çıkmayan Personel Sayısı
      { mkodu: 'yek004' }, // Son 100 İşlem
      { mkodu: 'yek005' }, // Alarm Sayısı
    ];
    

    let convertBase64 = {
      securedata : window.btoa(JSON.stringify(sp))
    };

    return convertBase64;
  }

  getMultipleAccessWidgetData : any = this.httpClient.get<any>(this.apiUrl, this.getMultipleAccessWidget());
}
