import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { AlarmModel } from '../models/alarm';
import { Incident } from '../models/incident';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NativeDateAdapter } from '@angular/material/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { SignalrPatrolService } from '../signalr-patrol.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import * as signalR from '@microsoft/signalr';
import { ConnectionModel } from '../models/connection';
import { LocationService } from '../content-container/location.service';


export const MY_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: 'yyyy-MM-dd' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends NativeDateAdapter {
  override  parse(value: any): Date | null {
    if (!value) return null;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = +parts[0];
      const month = +parts[1] - 1;
      const year = +parts[2];
      return new Date(year, month, day);
    }
    return null;
  }

  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${this._to2digit(day)}/${this._to2digit(month)}/${year}`;
  }

  private _to2digit(n: number) {
    return ('0' + n).slice(-2);
  }
}

@Component({
  selector: 'app-patroldashboard',
  templateUrl: './patroldashboard.component.html',
  styleUrls: ['./patroldashboard.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})

export class PatroldashboardComponent implements OnInit, OnDestroy {

  eventLogs: {
    type: string;
    message: string;
    time: Date;
    icon: string;
    color: string;
  }[] = [];

  lastIncidentID: any;
  incidentLogsDB: any[] = [];
  incidentLogs: any[] = [];
  incidentFiles: any[] = [];

  alertLogsDB: any[] = [];
  alertLogs: any[] = [];


  voiceLogsDB: any[] = [];
  voiceLogs: any[] = [];

  otherLogs: any[] = [];
  alarmModal: boolean = false;
  IncidentModal: boolean = false;
  private ngUnsubscribe = new Subject();


  formattedDate: string = '';
  selectedDate: Date = new Date();
  dateControl = new FormControl();

  latitude: any = "";
  longitude: any = "";
  map: google.maps.Map | undefined;

  // patrolInfo: any[] = [];

  // lastIncidentModal: boolean = false;
  // lastAlarmModal: boolean = false;
  // eventDetailsModal: boolean = false;
  // deviceIncidentList: boolean = false;

  alarmMap!: google.maps.Map;
  incidentMap!: google.maps.Map;

  IncidentDesc: string;
  IncidentHeader: string;
  IncidentTime: any;

  widgetTitle: string = "";
  widgetData: any[] = [];
  widgetDetailModal: boolean = false;
  selectLocationId: number;

  guardEventList: any[] = [];
  eventDetails: any[] = [];

  dailyGuardTour: any[] = [];
  dailyGuardTour2: any[] = [];
  _locations: any[] = [];
  tour_s: any[] = [];
  tour_sd: any[] = [];
  atilan: any[] = [];
  atilmayan: any[] = [];
  atilacak: any[] = [];
  widgets: any;
  alarmlar: any[] = [];
  olaylar: any[] = [];
  displayList: any[] = [];

  mobileUsers: ConnectionModel[] = [];
  mobileClientInfos: any[] = [];
  intervalId: any;
  isCollapsed: boolean = true;
  selectedLocationID: number;
  onlineMobileUsers: ConnectionModel[] = [];
  allconnInfo: ConnectionModel[] = []
  allClitenInfos: any[] = []
  private markers: { [imei: string]: google.maps.Marker } = {};

  @ViewChild('alarmMap') alarmMapElement!: ElementRef;
  @ViewChild('incidentMap') incidentMapElement!: ElementRef;

  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private signalRService: SignalrPatrolService,
    private helperService: HelperService,
    private location: LocationService

  ) { }

  private hubConnection!: signalR.HubConnection;

  ngOnInit(): void {

    // const today = new Date();
    // this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    // this.dateControl.setValue(today);

    // this.dateControl.valueChanges.subscribe((newDate) => {
    //   this.formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')!;
    // });

    this.getLocation();
    this.startConnection(this.helperService.gateResponseY, 'https://mecloud.com.tr:8011/angelhub');
    this.intervalId = setInterval(() => {
      this.ref.detectChanges();
    }, 1000);

    console.log("ALERT LOG", this.alertLogs)
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;

    // if (!this.isCollapsed) {
    //   setTimeout(() => {
    //     google.maps.event.trigger(this.map, 'resize'); // veya this.map.invalidateSize() (Leaflet için)
    //   }, 300);
    // }
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
            console.log("geliyor muuuu0");
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
            console.log("geliyor muuuu111");
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

            console.log("geliyor muuuu2222");
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
                      scaledSize: new google.maps.Size(40, 40),
                      anchor: new google.maps.Point(20, 20)
                    }
                  });

                  this.markers[device.imei] = marker;
                  console.log("🆕 Yeni marker eklendi: http://maps.google.com/mapfiles/ms/icons/red-dot.png ", device.imei);
                } else {

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
    this.hubConnection.on('allconninfo', this.onConninfo.bind(this));
  }

  private onIncident(...args: any[]): void {

    if (args && args.length > 0) {
      const data = args[0] as string;
      this.incidentMap = new google.maps.Map(this.incidentMapElement.nativeElement, {
        center: { lat: 41.0082, lng: 28.9784 }, // İstanbul örnek
        zoom: 12
      });
      console.log("⚠️ INCIDENT:", data);
      this.handleIncidentMessage(data);
    }
  }

  private onAlert(...args: any[]): void {
    if (args && args.length > 0) {
      const alertData = args[0] as string;
      console.log("🚨 Alert event geldi:", alertData);

      this.alarmMap = new google.maps.Map(this.alarmMapElement.nativeElement, {
        center: { lat: 39.92077, lng: 32.85411 }, // Ankara örnek
        zoom: 12
      });
      this.handleAlarmMessage(alertData);

      const [lat, rest] = alertData.split('@@@');
      const [lng, security] = rest.split('@@@@@@');
      this.addEventLog("🚨 ALERT", lat, lng, security);
    }

  }

  private async onVoice(...args: any[]): Promise<void> {
    if (args && args.length > 0) {
      const voiceData = args[0] as string;
      console.log("🎧 Voice event geldi:", voiceData);
      await this.handleVoiceMessage(voiceData);
      this.addEventLog("🎧 VOICE", "", "", voiceData);
    }

  }

  private async onConninfo(...args: any[]): Promise<void> {
    if (args && args.length > 0) {
      try {
        const rawJson = args[0] as string;
        const parsed = JSON.parse(rawJson) as ConnectionModel[];
        console.log("CONNNN",rawJson)
        let connections: ConnectionModel[] = [];

        connections = parsed.map((conn) => {
          let clientInfoParsed: any;
          try {
            clientInfoParsed = JSON.parse(conn.ClientInfo);
          } catch {
            console.warn('❌ Conninfo ClientInfo JSON değil:', conn.ClientInfo);
            clientInfoParsed = {};
          }

          return {
            ...conn,
            ClientInfo: clientInfoParsed,
          };
        });
        const updates = connections.filter(c => c.ClientType === 4);
        updates.forEach(conn => {
          const uniqueKey = conn.LoginId || conn.ClientInfo?.person || conn.KullaniciAdi;
          console.log("CONNNN2222",rawJson)
          const index = this.displayList.findIndex(
            u =>
              u.loginId === uniqueKey || // loginId eşleşmesi varsa
              u.person === uniqueKey || // clientInfo.person eşleşiyorsa
              u.kullaniciAdi === uniqueKey
          );

          if (conn.Process === '+' && index === -1) {
            // ✔ cihaz yoksa → ekle
            this.displayList.push({
              adSoyad: conn.terminalname,
              connectionDate: conn.ConnectionDate,
              connectionId: conn.ConnectionId,
              loginId: conn.LoginId,
              kullaniciAdi: conn.KullaniciAdi,
              person: conn.ClientInfo?.person,
              ...conn.ClientInfo
            });
            console.log('🟢 Yeni cihaz eklendi:', conn);
            this.addEventLog("Yeni cihaz eklendi", "", "", conn.AdSoyad);
          }

          if (conn.Process === '+' && index !== -1) {
            // 🔁 varsa → güncelle (yani overwrite)
            this.displayList[index] = {
              adSoyad: conn.terminalname,
              connectionDate: conn.ConnectionDate,
              connectionId: conn.ConnectionId,
              loginId: conn.LoginId,
              kullaniciAdi: conn.KullaniciAdi,
              person: conn.ClientInfo?.person,
              ...conn.ClientInfo
            };
            console.log('♻ Güncellendi:', conn.AdSoyad);
            //this.addEventLog("♻ Güncellendi", conn.terminalname);
          }

          if (conn.Process === '-' && index !== -1) {
            // 🔴 cihaz offline olduysa → sil
            this.displayList.splice(index, 1);
            console.log('🔴 Cihaz listeden silindi:', conn.terminalname);
            this.addEventLog("🔴 Cihaz listeden silindi", "", "", conn.AdSoyad);
          }
        });

        console.log("🔴", connections);
        console.log("❌❌❌❌❌❌", this.displayList);
      } catch (err) {
        console.error('❌ conninfo parse hatası:', err);
      }
    }
  }

  private async generateClientInfo(): Promise<ClientInfo> {
    const now = new Date().toISOString();

    return {
      AppName: "MeCloud Guard"
      , IpAddr: "10.20.24.27"
    };
  }

  async handleAlarmMessage(rawAlarm: string): Promise<void> {
    this.IncidentModal = false;
    this.alarmModal = true;
    // Alert içeriğini yorumla, kullanıcıya göster, ses çal, vs.
    const [latStr, lngStr, title] = rawAlarm.split('@@@');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const person = parseFloat(title)

    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Geçersiz alarm koordinatı:", rawAlarm);
      return;
    }

    this.alarmMap?.setCenter({
      lat: +lat,
      lng: +lng,
    });

    new google.maps.Marker({
      position: { lat, lng },
      map: this.alarmMap,
      title: title,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });


    console.log("🔔 Alarm verisi işlendi:", rawAlarm);
  }

  async handleIncidentMessage(data: string): Promise<void> {
    this.alarmModal = false;
    this.IncidentModal = true;

    console.log("⚠️ INCIDENT:", typeof data, data);


    const parts = data.split('@@@');
    console.log("parts:", parts);

 
    const latStr = parts[0];
    const lngStr = parts[1];
    const idStr = parts[3]; // dikkat: index 3
    
    const lat = Number(latStr);
    const lng = Number(lngStr);
    const id = Number(idStr);
    this.addEventLog("⚠️ INCIDENT:", lat, lng, id);
    

    this.getIncidentFiles(id);
    // Olay haritası
    this.incidentMap = new google.maps.Map(this.incidentMapElement.nativeElement, {
      center: { lat: 41.0082, lng: 28.9784 }, // İstanbul örnek
      zoom: 12
    });

    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Geçersiz alarm koordinatı:", data);
      return;
    }

    this.incidentMap?.setCenter({
      lat: +lat,
      lng: +lng,
    });

    new google.maps.Marker({
      position: { lat, lng },
      map: this.incidentMap,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });


    console.log("🛑 INcident verisi işlendi:", data);
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

  ngAfterViewInit(): void {

  }


  getFormattedDate(): string {
    return this.selectedDate ? this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')! : '';
  }

  getIncidentDetail(log: any) {
    console.log("DETAİİİİİL", log)
  }


  getLocation() {
    this.patrol.getLocation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._locations = response[0].x;
      console.log("getLocation:", this._locations);
      this.selectLocationId = this._locations[0]?.id;
      this.guardIncidentLogs(this.selectLocationId);
      this.guardVoicetLogs(this.selectLocationId);
      this.guardAlerttLogs(this.selectLocationId);
      this.ref.detectChanges();

    });
  }

  guardIncidentLogs(locaitonId: number) {
    this.patrol.guardIncidentLogs(locaitonId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.incidentLogsDB = response[0].x;

      this.incidentLogsDB.forEach(log => {
        this.addEventLog("⚠️ INCIDENT:", log.olaybaslik, log.guvenlikadsoyad, log.Id);
      });
      console.log("guardIncidentLogs:", this.incidentLogsDB);
      this.ref.detectChanges();

    });
  }

  getIncidentFiles(IncidentId: any, source = "olay") {
    console.log("Incidentttt iddd ", IncidentId)
    this.patrol.getIncidentFiles(IncidentId, source).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.incidentFiles = response[0].x;
      console.log("🚨🚨🚨incidentFiles🚨🚨🚨", this.incidentFiles);
      this.ref.detectChanges();

    });
  }

  guardAlerttLogs(locaitonId: number) {
    this.patrol.guardAlertLogs(locaitonId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.alertLogsDB = response[0].x;
      this.alertLogsDB.forEach(log => {
        this.addEventLog("🚨 ALERT", log.lat, log.lng, log.guvenlikadsoyad)
      })
      console.log("guardAlertLogs:", this.alertLogsDB);
      this.ref.detectChanges();

    });
  }

  guardVoicetLogs(locaitonId: number) {
    this.patrol.guardVoiceLogs(locaitonId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.voiceLogsDB = response[0].x;
      console.log("guardVoicetLogs:", this.voiceLogsDB);
      this.ref.detectChanges();

    });
  }


  onLocationChange(locationid: number) {
    this.selectLocationId = locationid;
    this.guardIncidentLogs(this.selectLocationId);
    this.guardVoicetLogs(this.selectLocationId);
    this.guardAlerttLogs(this.selectLocationId);
  }

  // private validateCoordinates(lat: string | null, lng: string | null): boolean {
  //   const latitude = parseFloat(lat || "0");
  //   const longitude = parseFloat(lng || "0");
  //   return !isNaN(latitude) && !isNaN(longitude);
  // }

  private addEventLog(type: string, lat: any, lng: any, message: any) {

    let icon = "info";
    let color = "secondary";

    switch (type) {
      case "⚠️ INCIDENT:":
        icon = "alert";
        color = "warning";
        this.incidentLogs.unshift({
          type, lat, lng, message, time: new Date(), icon, color
        });
        if (this.incidentLogs.length > 20) this.incidentLogs.pop();

        break;

      case "🚨 ALERT":
        icon = "bell";
        color = "danger";
        this.alertLogs.unshift({
          type, lat, lng, message, time: new Date(), icon, color
        });
        if (this.alertLogs.length > 20) this.alertLogs.pop();

        break;

      case "🎧 VOICE":
        icon = "headphones";
        color = "primary";
        this.voiceLogs.unshift({
          type, lat, lng, message, time: new Date(), icon, color
        });
        if (this.voiceLogs.length > 20) this.voiceLogs.pop();
        break;

      default:
        icon = "info";
        color = "secondary";
        this.otherLogs.unshift({
          type, lat, lng, message, time: new Date(), icon, color
        });
        if (this.otherLogs.length > 20) this.otherLogs.pop();
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
  // private loadMap(lat: number, lng: number, title: string): void {
  //   setTimeout(() => {
  //     const mapElement = document.getElementById('mapIncident') as HTMLElement;
  //     if (mapElement) {
  //       const center = { lat, lng };
  //       this.map = new google.maps.Map(mapElement, {
  //         center: center,
  //         zoom: 15,
  //       });

  //       new google.maps.Marker({
  //         position: center,
  //         map: this.map,
  //         title: title,
  //       });

  //       google.maps.event.trigger(this.map, 'resize');
  //     }
  //   }, 0);
  // }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
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

