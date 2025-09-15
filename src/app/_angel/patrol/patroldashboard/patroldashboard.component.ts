import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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

  //DASHBOARD
  eventLogs: {
    type: string;
    message: string;
    time: Date;
    icon: string;
    color: string;
  }[] = [];



  private ngUnsubscribe = new Subject();


  formattedDate: string = '';
  selectedDate: Date = new Date();
  dateControl = new FormControl();
  activeWidget: number = 0;
  latitude: any = "";
  longitude: any = "";
  map: google.maps.Map | undefined;

  patrolInfo: any[] = [];

  lastIncidentModal: boolean = false;
  lastAlarmModal: boolean = false;
  eventDetailsModal: boolean = false;
  deviceIncidentList: boolean = false;

  lastIncidentDesc: string;
  lastIncidentSecurity: string;
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

  selectedLocationID: number;
  onlineMobileUsers: ConnectionModel[] = [];
  allconnInfo: ConnectionModel[] = []
  allClitenInfos: any[] = []
  private markers: { [imei: string]: google.maps.Marker } = {};
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
    if (args && args.length > 0) {
      try {
        const rawJson = args[0] as string;
        const parsed = JSON.parse(rawJson) as ConnectionModel[];

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
            console.log('🟢 Yeni cihaz eklendi:', conn.terminalname);
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
            console.log('♻ Güncellendi:', conn.terminalname);
          }

          if (conn.Process === '-' && index !== -1) {
            // 🔴 cihaz offline olduysa → sil
            this.displayList.splice(index, 1);
            console.log('🔴 Cihaz listeden silindi:', conn.terminalname);
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

  ngAfterViewInit(): void {

  }


  getFormattedDate(): string {
    return this.selectedDate ? this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')! : '';
  }

  LastEventModal(item: AlarmModel) {
    console.log("ALARM MODEL", item);
    if (!this.validateCoordinates(item.olat, item.olng)) {
      console.error("Geçersiz koordinatlar:", item.olat, item.olng);
      return;
    }
    this.loadMap(parseFloat(item.olat || "0"), parseFloat(item.olng || "0"), item.name);
    this.lastIncidentModal = true;
    this.lastIncidentDesc = item.oaciklama || '';
    this.lastIncidentSecurity = item.securityname;

    const lat = parseFloat(item.olat || "0");
    const lng = parseFloat(item.olng || "0");

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Geçersiz koordinatlar:", item.olat, item.olng);
      return;
    }
  }

  getLocation() {
    this.patrol.getLocation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._locations = response[0].x;
      console.log("getLocation:", this._locations);
      this.selectLocationId = this._locations[0]?.id;
      this.ref.detectChanges();

    });
  }

  onLocationChange(locationid: number) {

    this.selectLocationId = locationid;

  }


  private validateCoordinates(lat: string | null, lng: string | null): boolean {
    const latitude = parseFloat(lat || "0");
    const longitude = parseFloat(lng || "0");
    return !isNaN(latitude) && !isNaN(longitude);
  }

  private addEventLog(type: string, message: string) {

    console.log("addEventLog:", this.eventLogs);
    console.log("addEventLog:", type, message);
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

  private loadMap(lat: number, lng: number, title: string): void {
    setTimeout(() => {
      const mapElement = document.getElementById('mapIncident') as HTMLElement;
      if (mapElement) {
        const center = { lat, lng };
        this.map = new google.maps.Map(mapElement, {
          center: center,
          zoom: 15,
        });

        new google.maps.Marker({
          position: center,
          map: this.map,
          title: title,
        });

        google.maps.event.trigger(this.map, 'resize');
      }
    }, 0);
  }



  getEventDetail(item: Incident) {
    console.log(":::DETAİLS::::", item);
    if (!this.validateCoordinates(item?.latitude, item?.longitude)) {
      console.error("Geçersiz koordinatlar:", item.latitude, item.longitude);
      return;
    }
    this.loadMap(parseFloat(item.latitude || "0"), parseFloat(item?.longitude || "0"), item?.olaybaslik);
    this.eventDetailsModal = true;
    this.IncidentDesc = item?.olayaciklama || '';
    this.IncidentHeader = item?.olaybaslik || '';
    this.IncidentTime = item?.zaman;

    const lat = parseFloat(item?.latitude || "0");
    const lng = parseFloat(item?.longitude || "0");

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Geçersiz koordinatlar:", item.latitude, item.longitude);
      return;
    }
  }

  openAlarmModal(patrol: any) {
    this.lastAlarmModal = true;
    console.log("ALARMMMM", patrol);
    if (!this.validateCoordinates(patrol?.lat, patrol?.lng)) {
      console.error("Geçersiz koordinatlar:", patrol.lat, patrol.lng);
      return;
    }
    this.loadMap(parseFloat(patrol?.lat || "0"), parseFloat(patrol?.lng || "0"), patrol?.securityname);
  }


  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

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

