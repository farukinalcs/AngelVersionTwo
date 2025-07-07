import { ChangeDetectorRef, Component, EventEmitter, Input,OnDestroy, OnInit, Signal, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { AlarmModel } from '../models/alarm';
import { Incident } from '../models/incident';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDateFormats} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NativeDateAdapter } from '@angular/material/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { SignalrPatrolService } from '../signalr-patrol.service';
import { HelperService } from 'src/app/_helpers/helper.service';


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

  private ngUnsubscribe = new Subject();
 

  formattedDate: string = '';
  selectedDate: Date = new Date();
  dateControl = new FormControl();
  activeWidget: number = 0;
  latitude:any = "";
  longitude:any = "";
  map: google.maps.Map | undefined;

  patrolInfo:any[] = [];

  lastIncidentModal:boolean = false;
  lastAlarmModal:boolean = false;
  eventDetailsModal:boolean = false;
  deviceIncidentList:boolean = false;

  lastIncidentDesc:string;
  lastIncidentSecurity:string;
  IncidentDesc:string;
  IncidentHeader:string;
  IncidentTime:any;

  widgetTitle:string="";
  widgetData:any[] = [];
  widgetDetailModal:boolean = false;
  selectLocationId:number;

  guardEventList:any[]=[];
  eventDetails:any[]=[];

  dailyGuardTour:any[]=[];
  dailyGuardTour2:any[]=[];
  _locations:any[]=[];
  tour_s:any[]=[];
  tour_sd:any[]=[];
  atilan:any[]=[];
  atilmayan:any[]=[];
  atilacak:any[]=[];
  widgets:any;
  alarmlar:any[]=[];
  olaylar:any[]=[];

  constructor(
    private patrol : PatrolService,
    private ref : ChangeDetectorRef,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private signalRService: SignalrPatrolService,
     private helperService : HelperService
  ) { }


   ngOnInit(): void {

    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.dateControl.setValue(today);

    this.dateControl.valueChanges.subscribe((newDate) => {
      this.formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')!;
    });
    
   this.signalRService.startConnection();

   window.setInterval(() => {
    this.getPatrolInfo(this.selectLocationId);
    this.dailyGuardTourCheck(this.formattedDate);
    this.dailyGuardTourDetail(this.formattedDate,this.selectLocationId);
 
    }, 30000);
    this.getLocation();

    //await this.signalRService.startConnection();
    this.StartSignalR();
    this.signalRService.addTransferChartDataListener((data) => {
      console.log('Sunucudan gelen veri:', data);
    });

    this.signalRService.onReceivePatrolInfo((data) => {
      console.log('Patrol SignalR bilgisi geldi:', data);
    });
  }

  async StartSignalR(): Promise<void> {
    await this.signalRService.startConnection();
    // await this.signalRService.registerToServer({
    //   userId: "233",
    //   adSoyad: "string",
    //   kullaniciAdi: "string",
    //   tokenId: this.helperService.gateResponseY,
    //   loginId: "233",
    //   customerCode: 'MeyerTakip14367',
    //   clientType: 44,
    //   accessToken: this.helperService.gateResponseY,
    //   clientInfo: '{"AppName": "M5ServiceRD", "IpAddr": "10.20.24.27"}'

    // })
  }


  ngAfterViewInit(): void {
    this.initializeMap();
  }


  getFormattedDate(): string {
    return this.selectedDate ? this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')! : '';
  }

 getPatrolInfo(locationid:number): void {
 
  this.patrol.getPatrolInfo(locationid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
    this.patrolInfo = response[0]?.x;
    console.log(' this.patrolInfo:',  this.patrolInfo);
    this.ref.detectChanges();
    (this.patrolInfo ?? []).forEach((patrol) => {
      if (+patrol?.olay > 0) {
      this.lastIncidentModal = true;
      this.openAlarmModal(patrol);
      }
      if (+patrol?.alarm > 0) {
       // this.LastEventModal(patrol);
      }
    });

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
    
    if (this.patrolInfo?.length > 0) {
      (this.patrolInfo ?? []).forEach((patrol: any) => {
        if (!isNaN(+patrol?.lat) && !isNaN(+patrol?.lng) && this.map) {
          new google.maps.Marker({
            position: { lat: +patrol?.lat, lng: +patrol?.lng },
            map: this.map,
            title: patrol?.name,
            icon: patrol?.durum === 'offline'
              ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          });
        } else {
          console.warn('Geçersiz marker koordinatları:', patrol);
        }
      });
    }
  });

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
    this.getPatrolInfo(this.selectLocationId);
  }

  LastEventModal(item:AlarmModel){
    console.log("ALARM MODEL",item);
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

  getLocation(){
    this.patrol.getLocation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._locations = response[0].x;
      console.log("getLocation:", this._locations); 
      this.selectLocationId = this._locations[0]?.id;
      this.ref.detectChanges();

    });
  }

  incidentMedia = {
    photos: [
      // "assets/images/photo1.jpg",
      // "assets/images/photo2.jpg"
       "",
       ""
    ],
    videos: [
      // "assets/videos/video1.mp4",
      // "assets/videos/video2.mp4"
      "",
      ""
    ]
  };

  hasMedia(): boolean {
    return (
      (this.incidentMedia?.photos?.length ?? 0) > 0 || 
      (this.incidentMedia?.videos?.length ?? 0) > 0
    );
  }
  
  hasPhotos(): boolean {
    return (this.incidentMedia?.photos?.length ?? 0) > 0;
  }
  
  hasVideos(): boolean {
    return (this.incidentMedia?.videos?.length ?? 0) > 0;
  }

  private validateCoordinates(lat: string | null, lng: string | null): boolean {
    const latitude = parseFloat(lat || "0");
    const longitude = parseFloat(lng || "0");
    return !isNaN(latitude) && !isNaN(longitude);
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


  getGuardEventList(item:Incident){

    this.deviceIncidentList = true;
    const imei = item?.imei;
    this.patrol.getGuardEvents(0,imei).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
     this.guardEventList = response[0]?.x;
     this.ref.detectChanges();
     this.guardEventList = this.guardEventList?.map(olay => {
      olay.link = JSON.parse(olay.link);
      return olay;  });
    })
  }

  getEventDetail(item:Incident){
    console.log(":::DETAİLS::::",item);
    if (!this.validateCoordinates(item?.latitude, item?.longitude)) {
      console.error("Geçersiz koordinatlar:",item.latitude, item.longitude);
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

  openAlarmModal(patrol:any){
    this.lastAlarmModal = true;
    console.log("ALARMMMM",patrol);
    if (!this.validateCoordinates(patrol?.lat, patrol?.lng)) {
      console.error("Geçersiz koordinatlar:",patrol.lat, patrol.lng);
      return;
    }
    this.loadMap(parseFloat(patrol?.lat || "0"), parseFloat(patrol?.lng || "0"), patrol?.securityname);
  }



  dailyGuardTourCheck(date:any){
    this.patrol.dailyGuardTourCheck(date).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
       this.dailyGuardTour = response[0]?.x;
     
       this.atilmayan = (this.dailyGuardTour?? []).filter((item:any)=> item.durum === 0)
       this.atilan = (this.dailyGuardTour?? []).filter((item:any)=> item.durum === 1)
       this.atilacak = (this.dailyGuardTour?? []).filter((item:any)=> item.durum === 2)

       this.updateWidgets();
       this.ref.detectChanges();
     })

  }


  updateWidgets() {
    this.widgets = [
      { title: 'Planlanan Turlar', value: this.dailyGuardTour?.length, index:0},
      { title: 'Atılan Turlar', value: this.atilan?.length,index:1},
      { title: 'Atılmayan Turlar', value: this.atilmayan?.length,index:2},
      { title: 'Atılacak Turlar', value: this.atilacak?.length,index:3},
      { title: 'Alarmlar', value: this.alarmlar?.length,index:4},
      { title: 'Olaylar', value:this.olaylar?.length,index:5},
    ];
  }

  openWidget(widget:any){

    switch (widget.index) {
      case 0: this.widgetData = this.dailyGuardTour; break; // Planlanan Turlar
      case 1: this.widgetData = this.atilan; break; // Atılan Turlar
      case 2: this.widgetData = this.atilmayan; break; // Atılmayan Turlar
      case 3: this.widgetData = this.atilacak; break; // Atılacak Turlar
      case 4: this.widgetData = this.alarmlar; break; // Alarmlar
      case 5: this.widgetData = this.olaylar; break; // Olaylar
      default: this.widgetData = [];
    }
    console.log("openWidget",widget);
    this.widgetTitle = widget.title;
    this.widgetDetailModal = true;
  }

  dailyGuardTourDetail(date:any,locationid:number)
  {
    this.patrol.tour_s(date,locationid)?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.tour_s = response[0]?.x;
       console.log("this.tour_s",this.tour_s);
     })
     this.patrol.tour_sd(date,locationid)?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.tour_sd = response[0]?.x;
       console.log("this.tour_sd........sd",this.tour_sd);
     })
  }

  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}`;
  }
  
  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
