export interface AlarmModel {
    alarm: string;              // Alarm durumu (örnek: "0")
    alarmid: string;            // Alarm ID'si
    appversion: string;         // Uygulama sürümü
    battery: string;            // Pil seviyesi
    durum: string;              // Durum (örnek: "offline")
    fotoimage: string;          // Fotoğrafın base64 verisi
    guncelleme: string;         // Güncelleme tarihi
    imei: string;               // IMEI numarası
    lat: string;                // Enlem bilgisi
    lng: string;                // Boylam bilgisi
    name: string;               // İsim (örnek: "Guard1")
    nfc: string;                // NFC durumu
    oaciklama: string | null;   // Açıklama
    olat: string | null;        // Önceki enlem bilgisi
    olay: string;               // Olay durumu
    olng: string | null;        // Önceki boylam bilgisi
    oresim: string | null;      // Önceki resim bilgisi
    ozaman: string | null;      // Önceki zaman bilgisi
    person: string;             // Kişi bilgisi
    port: string;               // Port numarası
    securityname: string;       // Güvenlik görevlisi ismi
    sicilupdate: string;        // Sicil güncelleme tarihi
    time: string;               // Zaman
    turupdate: string;          // Tur güncelleme tarihi
    wifi: string;               // WiFi durumu
  }
  