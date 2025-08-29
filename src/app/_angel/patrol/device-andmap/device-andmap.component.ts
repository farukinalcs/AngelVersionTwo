import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { SignalrPatrolService } from '../signalr-patrol.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ConnectionModel } from '../models/connection';
import { FormControl } from '@angular/forms';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { Incident } from '../models/incident';
import { LocationService } from '../content-container/location.service';

@Component({
  selector: 'app-device-andmap',
  templateUrl: './device-andmap.component.html',
  styleUrls: ['./device-andmap.component.scss']
})


export class DeviceAndmapComponent {

  //DASHBOARD
  eventLogs: {
    type: string;
    message: string;
    time: Date;
    icon: string;
    color: string;
  }[] = [];

  // locationSub!: Subscription;
  private hubConnection!: signalR.HubConnection;

  private ngUnsubscribe = new Subject();
  deviceIncidentList: boolean = false;
  dateControl = new FormControl();
  selectedDate: Date = new Date();
  formattedDate: string = '';
  selectedLocationID : number;
  displayList: any[] = [];
  patrolInfo: any[] = [];
  guardEventList: any[] = [];
  eventDetails: any[] = [];
  mobileUsers: ConnectionModel[] = [];
  allconnInfo: ConnectionModel[] = [];
  onlineMobileUsers: ConnectionModel[] = [];
  mobileClientInfos: any[] = [];
  intervalId:any;
  allClitenInfos: any[] = [];
  
  map: google.maps.Map | undefined;
  latitude: any = "";
  longitude: any = "";

  disableLayoutPadding = true;
  selectedItem: any = null;
 
  markerMap = new Map<string, google.maps.Marker>();
  //private markers: google.maps.Marker[] = [];
  private markers: { [imei: string]: google.maps.Marker } = {};
  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private signalRService: SignalrPatrolService,
    private helperService: HelperService,
    private location :LocationService

  ) { }


  ngOnInit(): void {


    this.getLocation();

    this.startConnection(this.helperService.gateResponseY, 'https://mecloud.com.tr:8011/angelhub');
    this.intervalId = setInterval(() => {
      this.updateOnlineStatus();
      this.ref.detectChanges(); 
    }, 1000);
  }


  ngAfterViewInit(): void {

    this.initializeMap();

  }

  private addEventLog(type: string, message: string) {

    console.log("addEventLog:",  this.eventLogs);
    console.log("addEventLog:", type,message);
    let icon = "info";
    let color = "secondary";
  
    switch (type) {
      case "🚨 INCIDENT:":
        icon = "alert-octagon";
        color = "danger"; // kırmızı
        break;
      case "⚠️ ALERT":
        icon = "bell";
        color = "warning"; // sarı
        break;
      case "🎧 VOICE":
        icon = "headphones";
        color = "primary"; // mavi
        break;
      default:
        icon = "info";
        color = "secondary";
    }
  
    this.eventLogs.unshift({
      type,
      message,
      time: new Date(),
      icon,
      color
    }); 
  
    if (this.eventLogs.length > 20) {
      this.eventLogs.pop();
    }
  }

  private clearAllMarkers(): void {
    Object.values(this.markers).forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = {};
  }
  
  initializeMap() {

    const mapElement = document.getElementById('map') as HTMLElement;
    if (!mapElement) {
      console.error('Harita elementi bulunamadı.');
      return;
    }

    const defaultCenter = { lat: 40.997953, lng: 29.136747 };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: defaultCenter,
      zoom: 10,
    });

    console.log('Harita yüklendi:', this.map);
  }


  getLocation() {
    this.clearAllMarkers();
    this.location.selectedLocationId$.subscribe(id => {
      if(id !== null){
        this.selectedLocationID = id;
        console.log("DMLocation:", this.selectedLocationID);
        this.getPatrolInfo(id);
      }
    })
  }

  getPatrolInfo(locationid: number): void {
    this.patrol.getPatrolInfo(locationid)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.displayList = response[0]?.x || [];
        this.patrolInfo = response[0]?.x || [];
  
        this.ref.detectChanges();
  
        // Haritayı merkeze al
        const firstDevice = this.patrolInfo[0];
        const lat = +firstDevice?.lat;
        const lng = +firstDevice?.lng;
  
        if (!isNaN(lat) && !isNaN(lng)) {
          this.map?.setCenter({ lat, lng });
        } else {
          console.warn('Geçersiz koordinatlar:', firstDevice);
        }
  

        this.clearAllMarkers();
 
        this.displayList.forEach((device: any) => {
          const lat = +device?.lat;
          const lng = +device?.lng;
  
          if (!isNaN(lat) && !isNaN(lng) && this.map) {
            const marker = new google.maps.Marker({
              position: { lat, lng },
              map: this.map,
              title: device?.terminalname,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
                    <path
                      d="M20 0C9 0 0 9 0 20c0 11 20 40 20 40s20-29 20-40C40 9 31 0 20 0z"
                      fill="red"
                      stroke="white"
                      stroke-width="3"
                    />
                    <text
                      x="20"
                      y="27"
                      font-size="15"
                      text-anchor="middle"
                      fill="white"
                      font-family="Arial"
                      dominant-baseline="top"
                    >
                      ${device?.terminalname.trim()?.charAt(0)}
                    </text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(30, 45),
                anchor: new google.maps.Point(20, 60)
              }
            });
  
            this.markers[device.imei] = marker;
          } else {
            console.warn('Geçersiz marker koordinatları:', device);
          }
        });
  
        console.log("✅ Marker listesi güncellendi", this.markers);
      });
  }
  


  getGuardEventList(item: Incident) {
    this.selectedItem = item.imei;
    
    console.log('📦 selectedItem:', this.selectedItem);
    console.log('📦 selectedItem ime:', this.selectedItem.imei);
    this.deviceIncidentList = true;
    const imei = item?.imei;
    this.patrol.getGuardEvents(0, imei).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.guardEventList = response[0]?.x;
      this.ref.detectChanges();
      this.guardEventList = this.guardEventList?.map(olay => {
        olay.link = JSON.parse(olay.link);
        return olay;
      });
    })
  }


  public startConnection(accessToken: string, serverUrl: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(serverUrl, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR bağlantısı kuruldu.');

        this.register();
        this.listenSignalREvents();
      })
      .catch(err => console.error('🔴 SignalR bağlantı hatası:', err));
  }

  public async register(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.warn("❌ SignalR bağlantısı yok, register yapılamıyor.");
      return;
    }
  
    try {
      const data = await this.generateRegisterData();
      const jsonData = JSON.stringify(data);
  
      console.log('📦 Register gönderiliyor:', jsonData);
  
      this.hubConnection.on('allconninfo', (...args: any[]) => {
        if (args && args.length > 0) {
          try {
            const rawJson = args[0] as string;
            const parsed = JSON.parse(rawJson) as ConnectionModel[];
  
            const connections = parsed.map((conn) => {
              let clientInfoParsed: any;
              try {
                clientInfoParsed = JSON.parse(conn.ClientInfo);
              } catch {
                console.warn('❌ ClientInfo JSON değil:', conn.ClientInfo);
                clientInfoParsed = {};
              }
  
              return {
                ...conn,
                ClientInfo: clientInfoParsed,
              };
            });
  
            const mobileConnections = connections.filter(c => c.ClientType === 4);
  
            const newClientInfos = mobileConnections.map(user => ({
              terminalname: user.terminalname,
              connectionDate: user.ConnectionDate,
              ...user.ClientInfo
            }));
  
            const filteredByLocation = newClientInfos.filter(x =>
              x.LokasyonId == this.selectedLocationID
            );
  
            // 🔄 Display list'i yeni lokasyon cihazlarıyla güncelle
            this.displayList = [...filteredByLocation];
  

            // 🔄 Marker senkronizasyonu
            filteredByLocation.forEach(device => {
              const lat = +device.lat;
              const lng = +device.lng;
  
              if (!isNaN(lat) && !isNaN(lng)) {
                const existingMarker = this.markers[device.imei];
  
                if (!existingMarker) {
                  const marker = new google.maps.Marker({
                    position: { lat, lng },
                    map: this.map,
                    title: device.terminalname,
                    icon: {
                      url:'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
                     <path
                      d="M20 0C9 0 0 9 0 20c0 11 20 40 20 40s20-29 20-40C40 9 31 0 20 0z"
                      fill="red"
                      stroke="white"
                      stroke-width="3"
                    />
                    <text
                      x="20"
                      y="27"
                      font-size="15"
                      text-anchor="middle"
                      fill="white"
                      font-family="Arial"
                      dominant-baseline="top"
                    >
                      ${device?.terminalname.trim()?.charAt(0)}
                    </text>
                  </svg>
                `),
                      scaledSize: new google.maps.Size(40, 40),
                      anchor: new google.maps.Point(20, 20)
                    }
                  });
  
                  this.markers[device.imei] = marker;
                  console.log("🆕 Yeni marker eklendi: http://maps.google.com/mapfiles/ms/icons/red-dot.png ", device.imei);
                } else {
                  // İstenirse mevcut marker konumu güncellenebilir:
                  // existingMarker.setPosition({ lat, lng });
                }
              } else {
                console.warn('❌ Geçersiz koordinat:', device);
              }
            });
  
          } catch (err) {
            console.error('❌ allconninfo parse hatası:', err);
          }
        }
      });
  
      const result = await this.hubConnection.invoke("register", jsonData);
      console.log('✅ Register başarılı:', result);
  
    } catch (err) {
      console.error('❌ Register hatası:', err);
    }
  }
  
  
  public listenSignalREvents(): void {
    this.hubConnection.on('incident', this.onIncident.bind(this));
    this.hubConnection.on('alert', this.onAlert.bind(this));
    this.hubConnection.on('voice', this.onVoice.bind(this));
    this.hubConnection.on('conninfo', this.onConninfo.bind(this));
  }

  private onIncident(...args: any[]): void {


    if (args && args.length > 0) {
      const data = args[0] as string;
      console.log("🚨 INCIDENT:", data);
      this.addEventLog("🚨 INCIDENT:", data);

    }
  }

  private onAlert(...args: any[]): void {
    if (args && args.length > 0) {
      const alertData = args[0] as string;
      console.log("⚠️ Alert event geldi:", alertData);

      this.handleAlarmMessage(alertData);
      this.addEventLog("⚠️ ALERT", alertData);
     
    }

  }

  private async onVoice(...args: any[]): Promise<void> {
    if (args && args.length > 0) {
      const voiceData = args[0] as string;
      console.log("🎧 Voice event geldi:", voiceData);
      await this.handleVoiceMessage(voiceData);
      this.addEventLog("🎧 VOICE", voiceData);
    }

  }

  private async onConninfo(...args: any[]): Promise<void> {
    if (!args || args.length === 0) return;
  
    try {
      const rawJson = args[0] as string;
      const parsed = JSON.parse(rawJson) as ConnectionModel[];
  
      const connections = parsed.map((conn) => {
        let clientInfoParsed: any;
        try {
          clientInfoParsed = JSON.parse(conn.ClientInfo);
        } catch {
          console.warn('❌ ClientInfo parse hatası:', conn.ClientInfo);
          clientInfoParsed = {};
        }
  
        return {
          ...conn,
          ClientInfo: clientInfoParsed,
        };
      });
  
      const updates = connections.filter(c => c.ClientType === 4);
  
      updates.forEach(conn => {
        const imei = conn.ClientInfo?.imei;
        if (!imei) return;
  
        const index = this.displayList.findIndex(item => item.imei === imei);
  
        if (conn.Process === '+' && index === -1) {
          this.displayList.push({
            terminalname: conn.terminalname,
            connectionDate: conn.ConnectionDate,
            connectionId: conn.ConnectionId,
            loginId: conn.LoginId,
            kullaniciAdi: conn.KullaniciAdi,
            person: conn.ClientInfo?.person,
            ...conn.ClientInfo
          });
          console.log('🟢 Yeni cihaz eklendi:', imei);
          
        }
  
        if (conn.Process === '+' && index !== -1) {
          this.displayList[index] = {
            terminalname: conn.terminalname,
            connectionDate: conn.ConnectionDate,
            connectionId: conn.ConnectionId,
            loginId: conn.LoginId,
            kullaniciAdi: conn.KullaniciAdi,
            person: conn.ClientInfo?.person,
            ...conn.ClientInfo
          };
          console.log('♻ Güncellendi:', imei);
 
        }
  
        if (conn.Process === '-' && index !== -1) {
          this.displayList[index] = {
            terminalname: conn.terminalname,
            connectionDate: conn.ConnectionDate,
            connectionId: conn.ConnectionId,
            loginId: conn.LoginId,
            kullaniciAdi: conn.KullaniciAdi,
            person: conn.ClientInfo?.person,
            ...conn.ClientInfo
          };
          console.log('🔴 Cihaz offline oldu, güncellendi:', imei);
          this.addEventLog('🔴 Cihaz offline oldu', imei);
        }
      });
  
      const now = new Date();
  
      this.displayList = this.displayList.map(user => {
        const connectionDate = new Date(user.time);
        const diffMs = now.getTime() - connectionDate.getTime();
        const diffSeconds = (diffMs / 1000);
  
        return {
          ...user,
          isOnline: diffSeconds <= 60
        };
      });
  
      // Markerları harita üzerinden temizle
      Object.values(this.markers).forEach(marker => marker.setMap(null));
      this.markers = {};
  
      // Display list'i filtrele seçili lokasyona göre
      this.displayList = this.displayList.filter(x => x.lokasyonid == this.selectedLocationID);
  
      // Yeni markerları oluştur
      this.displayList.forEach(device => {
        const lat = +device?.lat;
        const lng = +device?.lng;
  
        if (!isNaN(lat) && !isNaN(lng) && this.map) {
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            title: device?.terminalname,
            animation: null,

            icon: {
              url:'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
             <path
              d="M20 0C9 0 0 9 0 20c0 11 20 40 20 40s20-29 20-40C40 9 31 0 20 0z"
              fill="red"
              stroke="white"
              stroke-width="3"
            />
            <text
              x="20"
              y="27"
              font-size="15"
              text-anchor="middle"
              fill="white"
              font-family="Arial"
              dominant-baseline="top"
            >
              ${device?.terminalname.trim()?.charAt(0)}
            </text>
          </svg>
        `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20)
            }
          });
          this.markers[device.imei] = marker;
        } else {
          console.warn('Geçersiz marker koordinatları:', device);
        }
      });


  
      this.ref.detectChanges();
  
      console.log('📦 Güncel displayList:', this.displayList);
    } catch (err) {
      console.error('❌ conninfo parse hatası:', err);
    }
  }
  

  updateOnlineStatus() {
    
    const now = new Date();

    this.displayList = this.displayList.map(user => {
      const connectionDate = new Date(user.time);
      const diffMs = now.getTime() - connectionDate.getTime();
      const diffSeconds = (diffMs / 1000);
  
      return {
        ...user,
        isOnline: diffSeconds <= 60
        
      };
    
    });
  }

  private async generateClientInfo(): Promise<ClientInfo> {
    const now = new Date().toISOString();

    return {
      AppName: "MeCloud Guard"
      , IpAddr: "10.20.24.27"
    };
  }

  async handleAlarmMessage(rawAlarm: string): Promise<void> {
    // Alert içeriğini yorumla, kullanıcıya göster, ses çal, vs.
    const [latStr, lngStr, title] = rawAlarm.split('@@@');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const person = parseFloat(title)

    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Geçersiz alarm koordinatı:", rawAlarm);
      return;
    }

    this.map?.setCenter({
      lat: +lat,
      lng: +lng,
    });

    new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: title,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });


    console.log("🔔 Alarm verisi işlendi:", rawAlarm);
  }

  async handleVoiceMessage(data: string): Promise<void> {
    // Belki sesli mesaj oynatılacak?
    console.log("🔊 Voice mesajı işlendi:", data);
  }

  private async generateRegisterData(): Promise<RegisterData> {
    const clientInfo = await this.generateClientInfo();

    return {
      terminalname: 'Guard Dashboard',
      KullaniciAdi: 'Guard Dashboard',
      LoginId: '',
      TokenId: '',
      CustomerCode: 'MeyerTakip14367',
      ClientType: 44,
      ClientInfo: JSON.stringify(clientInfo),
    };
  }

  public stopConnection(): void {
    this.hubConnection
      .stop()
      .then(() => console.log('🛑 SignalR bağlantısı durduruldu.'))
      .catch(err => console.error('❌ Bağlantı durdurulurken hata:', err));
  }



  focusOnDevice2(device: any): void {
    if (!device || !this.map) return;
    Object.values(this.markers).forEach(marker => marker.setAnimation(null));
    const marker = this.markers[device.imei];

    const lat = parseFloat(device.lat);
    const lng = parseFloat(device.lng);
  
    if (!isNaN(lat) && !isNaN(lng)) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      this.map.setCenter({ lat, lng });
      this.map.setZoom(20);
      console.log("📍 Harita ortalandı:", lat, lng);
    } else {
      console.warn("⚠ Geçersiz koordinatlar:", device);
    }
  }

  focusOnDevice(device: any): void {
    Object.values(this.markers).forEach(marker =>{
      marker.setAnimation(null);
      marker.setZIndex(1);
    }
   );
  
    const marker = this.markers[device.imei];
    if (marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1); // en üstte olacak
      const position = marker.getPosition();
      if (position && this.map) {
        this.map.panTo(position);
        this.map.setZoom(17);
      } else {
        console.warn("⚠ Marker pozisyonu veya map eksik:", device);
      }
    }
  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    // this.locationSub.unsubscribe();
    this.stopConnection();
  }
}
export interface ClientInfo {
  AppName: String;
  IpAddr: String;
}

export interface RegisterData {
  terminalname: string;
  KullaniciAdi: string;
  LoginId: string;
  TokenId: string;
  CustomerCode: string;
  ClientType: number;
  ClientInfo: string; // JSON.stringify edilmiş ClientInfo
}