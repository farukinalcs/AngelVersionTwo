
export class IncidentDetails {
    Id: number; // Sayısal ID
    imei: string; // IMEI numarası
    latitude: string; // Enlem
    longtitude: string; // Boylam
    link: Array<{ link: string; dosyatipi: string }>; // Link dizisi
    loginsicilid: number; // Sicil ID'si
    olayaciklama: string; // Olay açıklaması
    olaybaslik: string; // Olay başlığı
    securityid: number; // Güvenlik ID'si
    turid: number; // Tür ID'si
    zaman: string; // Zaman (ISO formatında tarih)
  
    constructor(data: any) {
      this.Id = data.Id;
      this.imei = data.imei;
      this.latitude = data.latitude;
      this.longtitude = data.longtitude;
      this.link = data.link ? JSON.parse(data.link) : [];
      this.loginsicilid = data.loginsicilid;
      this.olayaciklama = data.olayaciklama;
      this.olaybaslik = data.olaybaslik;
      this.securityid = data.securityid;
      this.turid = data.turid;
      this.zaman = data.zaman;
    }
  }