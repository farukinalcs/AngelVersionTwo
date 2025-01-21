import { ChangeDetectorRef, Component, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { AlarmModel } from '../models/alarm';
import { Incident } from '../models/incident';


@Component({
  selector: 'app-patroldashboard',
  templateUrl: './patroldashboard.component.html',
  styleUrls: ['./patroldashboard.component.scss']
})
export class PatroldashboardComponent {
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

  constructor(
    private patrol : PatrolService,
    private ref : ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {

   window.setInterval(() => {
    this.getPatrolInfo();
    this.ref.detectChanges();
    }, 3000);

  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }



 getPatrolInfo(): void {
  this.patrol.getPatrolInfo().subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
    this.patrolInfo = response[0].x;
    console.log("Patrol Info:", this.patrolInfo);

    this.patrolInfo.forEach((patrol) => {
      if (+patrol.olay > 0) {
       //this.lastIncidentModal = true;
       //this.openAlarmModal(patrol);
      }
      if (+patrol.alarm > 0) {
        this.openAlarmModal(patrol);
      }
    });

    if (this.patrolInfo?.[0]?.lat != null && this.patrolInfo?.[0]?.lng != null &&
        !isNaN(+this.patrolInfo[0].lat) && !isNaN(+this.patrolInfo[0].lng)) {
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
    const imei = item.imei;
    console.log("guard_device",item.imei);

    this.patrol.getGuardEvents(0,imei).subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
     this.guardEventList = response[0].x;
     this.guardEventList = this.guardEventList.map(olay => {
      olay.link = JSON.parse(olay.link);
      return olay;  });
      console.log("......GuardEventList........",this.guardEventList);
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
    this.IncidentDesc = item.olayaciklama || '';
    this.IncidentHeader = item.olaybaslik || '';
    this.IncidentTime = item.zaman;

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

  widgets = [
    { title: 'Planlanan Turlar', value: 1},
    { title: 'Atılan Turlar', value: 2},
    { title: 'Atılmayan Turlar', value: 3},
    { title: 'Atılacak Turlar', value: 4},
    { title: 'Alarmlar', value: 5},
    { title: 'Olaylar', value: 6},
  ];
}
