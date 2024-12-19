export interface IncidentLink {
    link: string;
    dosyatipi: string;
  }
  
  export interface Incident {
    Id: number;
    imei: string;
    latitude: string;
    longitude: string;
    link:IncidentLink[];
    loginsicilid: number;
    olayaciklama: string;
    olaybaslik: string;
    securityid: number;
    turid: number;
    zaman: string;
  }