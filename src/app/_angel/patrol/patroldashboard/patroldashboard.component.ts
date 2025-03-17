import { ChangeDetectorRef, Component, EventEmitter, Input,OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { AlarmModel } from '../models/alarm';
import { Incident } from '../models/incident';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';



export const MY_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: 'yyyy-MM-dd' },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'yyyy MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'yyyy MMMM',
  },
};

@Component({
  selector: 'app-patroldashboard',
  templateUrl: './patroldashboard.component.html',
  styleUrls: ['./patroldashboard.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})

export class PatroldashboardComponent implements OnInit, OnDestroy {
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


  

  guardEventList:any[]=[];
  eventDetails:any[]=[];

  dailyGuardTour:any[]=[];
  dailyGuardTour2:any[]=[];

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
    private datePipe: DatePipe
  ) { }

  ngOnDestroy(): void {
    console.log("destroyyy")
  }
  

  ngOnInit(): void {

    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.dateControl.setValue(today);

    this.dateControl.valueChanges.subscribe((newDate) => {
      this.formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')!;
    });
    
 
   window.setInterval(() => {
    this.getPatrolInfo();
    this.dailyGuardTourCheck(this.formattedDate);
    this.dailyGuardTourCheck2(this.formattedDate);
    this.dailyGuardTourDetail(this.formattedDate);
    this.ref.detectChanges();
    }, 3000);

  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }


  getFormattedDate(): string {
    return this.selectedDate ? this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')! : '';
  }

 getPatrolInfo(): void {
  this.patrol.getPatrolInfo().subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
    this.patrolInfo = response[0].x;
    //console.log("Patrol Info:", this.patrolInfo);

    this.patrolInfo?.forEach((patrol) => {
      if (+patrol?.olay > 0) {
      // this.lastIncidentModal = true;
      // this.openAlarmModal(patrol);
      }
      if (+patrol?.alarm > 0) {
        this.openAlarmModal(patrol);
      }
    });

    if (this.patrolInfo?.[0]?.lat != null && this.patrolInfo?.[0]?.lng != null &&
        !isNaN(+this.patrolInfo[0]?.lat) && !isNaN(+this.patrolInfo[0]?.lng)) {
      this.map?.setCenter({
        lat: +this.patrolInfo[0].lat,
        lng: +this.patrolInfo[0].lng,
      });
    } else {
      console.warn('Geçersiz koordinatlar:', this.patrolInfo?.[0]);
    }

    if (this.patrolInfo?.length > 0) {
      this.patrolInfo.forEach((patrol: any) => {
        if (!isNaN(+patrol.lat) && !isNaN(+patrol.lng) && this.map) {
          new google.maps.Marker({
            position: { lat: +patrol.lat, lng: +patrol.lng },
            map: this.map,
            title: patrol.name,
            icon: patrol.durum === 'offline'
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
    this.activeWidget = 0;
  
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
  this.getPatrolInfo();
  }

  // LastEventModal(item:AlarmModel){
  //   console.log("ALARM MODEL",item);
  //   if (!this.validateCoordinates(item.olat, item.olng)) {
  //     console.error("Geçersiz koordinatlar:", item.olat, item.olng);
  //     return;
  //   }
  //   this.loadMap(parseFloat(item.olat || "0"), parseFloat(item.olng || "0"), item.name);
  //   this.lastIncidentModal = true;
  //   this.lastIncidentDesc = item.oaciklama || '';
  //   this.lastIncidentSecurity = item.securityname;

  //   const lat = parseFloat(item.olat || "0");
  //   const lng = parseFloat(item.olng || "0");
  
  //   if (isNaN(lat) || isNaN(lng)) {
  //     console.error("Geçersiz koordinatlar:", item.olat, item.olng);
  //     return;
  //   }
  // }

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
    //console.log("guard_device",item?.imei);

    this.patrol.getGuardEvents(0,imei).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
     this.guardEventList = response[0].x;
     this.guardEventList = this.guardEventList?.map(olay => {
      olay.link = JSON.parse(olay.link);
      return olay;  });
    //  console.log("......GuardEventList........",this.guardEventList);
    })
  }

  getEventDetail(item:Incident){
    console.log(":::DETAİLS::::",item);
    if (!this.validateCoordinates(item.latitude, item.longitude)) {
      console.error("Geçersiz koordinatlar:",item.latitude, item.longitude);
      return;
    }
    this.loadMap(parseFloat(item.latitude || "0"), parseFloat(item.longitude || "0"), item.olaybaslik);
    this.eventDetailsModal = true;
    this.IncidentDesc = item?.olayaciklama || '';
    this.IncidentHeader = item?.olaybaslik || '';
    this.IncidentTime = item?.zaman;

    const lat = parseFloat(item.latitude || "0");
    const lng = parseFloat(item.longitude || "0");

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Geçersiz koordinatlar:", item.latitude, item.longitude);
      return;
    }
  }

  openAlarmModal(patrol:any){
    this.lastAlarmModal = true;
    console.log("ALARMMMM",patrol);
    if (!this.validateCoordinates(patrol.lat, patrol.lng)) {
      console.error("Geçersiz koordinatlar:",patrol.lat, patrol.lng);
      return;
    }
    this.loadMap(parseFloat(patrol.lat || "0"), parseFloat(patrol.lng || "0"), patrol.securityname);
  }

  changeContent(widgetValue: number) {
    this.activeWidget = widgetValue;
  }

  dailyGuardTourCheck(date:any){
    this.patrol.dailyGuardTourCheck(date).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
       this.dailyGuardTour = response[0].x;
       //console.log("......dailyGuardTourCheck........",this.dailyGuardTour);
       this.atilmayan = this.dailyGuardTour.filter((item:any)=> item.durum === 0)
       this.atilan = this.dailyGuardTour.filter((item:any)=> item.durum === 1)
       this.atilacak = this.dailyGuardTour.filter((item:any)=> item.durum === 2)
       //console.log("......atilmayan........",this.atilmayan);
       this.updateWidgets();
       this.ref.markForCheck();
       this.ref.detectChanges();
     })

  }

  dailyGuardTourCheck2(date:any){
    this.patrol.dailyGuardTourCheck2(date).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.dailyGuardTour2 = response[0].x;
      this.alarmlar = this.dailyGuardTour2.filter((item:any)=> item.durum === 1)
      this.olaylar = this.dailyGuardTour2.filter((item:any)=>item.durum === 2)
      this.updateWidgets();
      // console.log("......dailyGuardTourCheck2........",this.dailyGuardTour2);
     })
  }

  updateWidgets() {
    this.widgets = [
      { title: 'Planlanan Turlar', value: this.dailyGuardTour.length, index:0},
      { title: 'Atılan Turlar', value: this.atilan.length,index:1},
      { title: 'Atılmayan Turlar', value: this.atilmayan.length,index:2},
      { title: 'Atılacak Turlar', value: this.atilacak.length,index:3},
      { title: 'Alarmlar', value: this.alarmlar.length,index:4},
      { title: 'Olaylar', value:this.olaylar.length,index:5},
    ];
  }

  dailyGuardTourDetail(date:any)
  {
    this.patrol.tour_s(date).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.tour_s = response[0].x;
       //console.log("...........................................",this.tour_s);
     })
     this.patrol.tour_sd(date).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.tour_sd = response[0].x;
       //console.log(".........................................sd",this.tour_sd);
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
  // widgets = [
  //   { title: 'Planlanan Turlar', value: 1},
  //   { title: 'Atılan Turlar', value: this.atilan.length},
  //   { title: 'Atılmayan Turlar', value: this.atilmayan.length},
  //   { title: 'Atılacak Turlar', value: this.atilacak.length},
  //   { title: 'Alarmlar', value: 5},
  //   { title: 'Olaylar', value: 6},
  // ];
}
