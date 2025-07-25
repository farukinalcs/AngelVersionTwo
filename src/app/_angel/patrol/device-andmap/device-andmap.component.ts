import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDateFormats } from '@angular/material/core';
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

    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.dateControl.setValue(today);

    this.dateControl.valueChanges.subscribe((newDate) => {
      this.formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')!;
    });

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

  private clearAllMarkers() {
    for (const marker of Object.values(this.markers)) {
      marker.setMap(null);
    }
    this.markers = {};
  }

  getLocation() {

    this.location.selectedLocationId$.subscribe(id => {
      if(id !== null){
        this.selectedLocationID = id;
        console.log("DMLocation:", this.selectedLocationID);
        // this.markers.forEach(marker => marker.setMap(null));
        // this.markers = [];
        this.clearAllMarkers();
        this.getPatrolInfo(id);
      }
    })
  }

  getPatrolInfo(locationid: number): void {

    this.patrol.getPatrolInfo(locationid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.displayList = response[0]?.x;
      this.patrolInfo = response[0]?.x;
      console.log(' Apiden gelen:', this.patrolInfo);
      console.log(' APİ display:', this.displayList);
      this.ref.detectChanges();
      // (this.patrolInfo ?? []).forEach((patrol) => {
      //   if (+patrol?.olay > 0) {
      //     this.lastIncidentModal = true;
      //     this.openAlarmModal(patrol);
      //   }
      //   if (+patrol?.alarm > 0) {
      //     this.LastEventModal(patrol);
      //   }
      // });

      if (this.patrolInfo?.[0]?.lat != null && this.patrolInfo?.[0]?.lng != null &&
        !isNaN(+this.patrolInfo[0]?.lat) && !isNaN(+this.patrolInfo[0]?.lng)) {

        this.map?.setCenter({
          lat: +this.patrolInfo[0]?.lat,
          lng: +this.patrolInfo[0]?.lng,
        });

        console.log('lat:', this.patrolInfo[0]?.lat);
        console.log('lng:', this.patrolInfo[0]?.lng);
      } else {
        console.warn('Geçersiz koordinatlar:', this.patrolInfo?.[0]);
      }

      if (this.displayList?.length > 0) {
        (this.displayList ?? []).forEach((patrol: any) => {
          if (!isNaN(+patrol?.lat) && !isNaN(+patrol?.lng) && this.map) {
            const marker =  new google.maps.Marker({
              position: { lat: +patrol?.lat, lng: +patrol?.lng },
              map: this.map,
              title: patrol?.terminalname,
              icon:
              'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            this.markers[patrol.imei] = marker;
          } else {
            console.warn('Geçersiz marker koordinatları:', patrol);
          }
        });
      }
    });

  }


  getGuardEventList(item: Incident) {

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

        this.register(); // yeniden bağlandıysa tekrar register
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
  
            console.log('📦 SİGANL R VERİİİ:', connections);
  
            const mobileConnections = connections.filter(c => c.ClientType === 4);
  
            // Yeni clientInfo'lar
            const newClientInfos = mobileConnections.map(user => ({
              terminalname: user.terminalname,
              connectionDate: user.ConnectionDate,
              ...user.ClientInfo
            }));
  

            const lokasyonfilter = newClientInfos.filter(x=>  
              x.LokasyonId == this.selectedLocationID
            )
            console.log('🧾lokasyon......................filter......:', this.selectedLocationID,lokasyonfilter);
            // ❗ Sadece yeni olanları ekle (imei ile karşılaştır)
            const uniqNewDevices = lokasyonfilter.filter(newItem =>
              !this.displayList.some(existing => existing.imei === newItem.imei)
            );
            console.log('🧾 Yeni eklenen cihazlar:', uniqNewDevices);

            const uniqNewDevices2 = this.displayList.filter(newItem =>
              !lokasyonfilter.some(existing => existing.imei !== newItem.imei)
            );
           console.log('🧾 ime i farklı  liste:', uniqNewDevices2);
            
            this.displayList = [...uniqNewDevices2, ...uniqNewDevices];
  
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

    }
  }

  private onAlert(...args: any[]): void {
    if (args && args.length > 0) {
      const alertData = args[0] as string;
      console.log("⚠️ Alert event geldi:", alertData);

      this.handleAlarmMessage(alertData);
    }

  }

  private async onVoice(...args: any[]): Promise<void> {
    if (args && args.length > 0) {
      const voiceData = args[0] as string;
      console.log("🎧 Voice event geldi:", voiceData);
      await this.handleVoiceMessage(voiceData);
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
        if (!imei) return; // imei olmayanlar işlenmez
  
        const index = this.displayList.findIndex(item => item.imei === imei);
  
        if (conn.Process === '+' && index === -1) {
          // ✅ Yeni cihaz: listeye ekle
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
          //this.displayList.splice(index, 1);
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

      console.log("Displayyy.................",this.displayList);
      if (this.displayList?.length > 0) {
        (this.displayList ?? []).forEach((device: any) => {
          if (!isNaN(+device?.lat) && !isNaN(+device?.lng) && this.map) {
            const marker = new google.maps.Marker({
              
              position: { lat: +device?.lat, lng: +device?.lng },
              map: this.map,
              title: device?.terminalname,
              animation: null,
              //icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          
              icon: device?.isOnline !== true
                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            });
            this.markers[device.imei] = marker;
          } else {
            console.warn('Geçersiz marker koordinatları:', device);
          }
          this.ref.detectChanges();
        });
      }

     
      this.displayList = this.displayList.filter(x=>  
        x.lokasyonid == this.selectedLocationID
      )
      console.log('📦 Güncel....... selectedLocationID...............:', this.selectedLocationID);
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


  // getFormattedDate(): string {
  //   return this.selectedDate ? this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')! : '';
  // }

  focusOnDevice(device: any): void {
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