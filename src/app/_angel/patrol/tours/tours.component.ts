import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { SignalrPatrolService } from '../signalr-patrol.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
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
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})

export class ToursComponent implements OnInit, OnDestroy {
  locationSub!: Subscription;
  private ngUnsubscribe = new Subject();

  formattedDate: string = '';
  selectedDate: Date = new Date();

  dateControl = new FormControl();
  activeWidget: number = 0;

  tour_s: any[] = [];
  tour_sd: any[] = [];

  dailyGuardTour: any[] = [];
  dailyGuardTour2: any[] = [];

  atilan: any[] = [];
  atilmayan: any[] = [];
  atilacak: any[] = [];
  widgets: any;
  alarmlar: any[] = [];
  olaylar: any[] = [];
  tourDetail:any[]= [];

  widgetTitle: string = "";
  widgetData: any[] = [];
  widgetDetailModal: boolean = false;
  tourDetailModal:boolean = false;
  allTourMap:boolean = false;
  selectLocationId: number;
  imageUrl: string;

  markers: google.maps.Marker[] = [];
  markerMap = new Map<string, google.maps.Marker>();
  map!: google.maps.Map;
  lastLat: any = "";
  lastLng: any = "";
  stationLat: any ="";
  stationLng: any = "";
  mapMarkers: any[] = [];
  @ViewChild('gmap', { static: false }) gmapElement!: ElementRef;
  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private signalRService: SignalrPatrolService,
    private helperService: HelperService,
    private location : LocationService

  ) { this.imageUrl = this.patrol.getImageUrl();}

  ngOnInit(): void {

    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd')!;
    this.dateControl.setValue(today);

    this.dateControl.valueChanges.subscribe((newDate) => {
      this.formattedDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')!;
      this.dailyGuardTourCheck(this.formattedDate,this.selectLocationId);
      this.guardTourDetail(this.formattedDate,this.selectLocationId);
    });

    // this.dailyGuardTourCheck(this.formattedDate,this.selectLocationId);
    this.getLocation();
  
  }

  
  ngAfterViewInit(): void {


  }

  updateWidgets() {
    this.widgets = [
      { title: 'Planlanan Turlar', value: this.dailyGuardTour?.length, index: 0,  icon: 'fa-solid fa-calendar'},
      { title: 'Atılan Turlar', value: this.atilan?.length, index: 1,  icon: 'fa-solid fa-route'},
      { title: 'Atılmayan Turlar', value: this.atilmayan?.length, index: 2,  icon: 'fa-solid fa-user-xmark'},
      { title: 'Atılacak Turlar', value: this.atilacak?.length, index: 3,  icon: 'fa-solid fa-person-walking-arrow-right'},
      { title: 'Alarmlar', value: this.alarmlar?.length, index: 4,  icon: 'fa-solid fa-volume-high'},
      { title: 'Olaylar', value: this.olaylar?.length, index: 5,  icon: 'fa-solid fa-bell'},
    ];
  }

  openWidget(widget: any) {

    switch (widget.index) {
      case 0: this.widgetData = this.dailyGuardTour; break; // Planlanan Turlar
      case 1: this.widgetData = this.atilan; break; // Atılan Turlar
      case 2: this.widgetData = this.atilmayan; break; // Atılmayan Turlar
      case 3: this.widgetData = this.atilacak; break; // Atılacak Turlar
      case 4: this.widgetData = this.alarmlar; break; // Alarmlar
      case 5: this.widgetData = this.olaylar; break; // Olaylar
      default: this.widgetData = [];
    }
    console.log("openWidget", widget);
    this.widgetTitle = widget.title;
    this.widgetDetailModal = true;
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
  
  dailyGuardTourCheck(date: any, lokasyonId:number) {
    this.patrol.dailyGuardTourCheck(date,lokasyonId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.dailyGuardTour = response[0]?.x;

      const tourList = Array.isArray(this.dailyGuardTour) ? this.dailyGuardTour : [];

      this.atilmayan = tourList.filter(item => item.durum === 0);
      this.atilan = tourList.filter(item => item.durum === 1);
      this.atilacak = tourList.filter(item => item.durum === 2);

      console.log("atilmayan", this.atilmayan);
      console.log("atilan", this.atilan);
      console.log("atilacak", this.atilacak);

      this.updateWidgets();
      this.ref.detectChanges();
    })

  }

  getLocation() {

    this.location.selectedLocationId$.subscribe(locationId => {
      if (locationId !== null) {
        this.selectLocationId = locationId;
        console.log("TOUR Location:",  this.selectLocationId);
        this.dailyGuardTourCheck(this.formattedDate,this.selectLocationId);
        this.guardTourDetail(this.formattedDate,this.selectLocationId);
      }
    });
    
  }

  guardTourDetail(date: any, locationid: number){
    this.patrol.guardTourDetail(date, locationid)?.pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {

     this.tourDetail = response[0]?.x.map(item => ({
      ...item,
      turdetaylari: JSON.parse(item.turdetaylari) // string → object array
    }));

      console.log("tourDetail", this.tourDetail);
    })
  }

  openMap(stations:any[]){
    console.log("openMap",stations)
    this.allTourMap = true;
    setTimeout(() => {
      this.initMap();
      this.prepareMarkers(stations);
      this.fitBoundsToMarkers();
      this.drawRoute();
    }, 300); // modal renderı için küçük gecikme
    
  }

  fitBoundsToMarkers() {
    if (!this.map || this.markers.length === 0) return;
  
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(m => bounds.extend(m.getPosition()!));
    this.map.fitBounds(bounds);
  }

  drawRoute() {
    if (!this.map || this.markers.length === 0) return;
  
    const pathCoords = this.markers.map(m => m.getPosition()!); // marker pozisyonlarını al
    const routeLine = new google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: "#0000FF",  // mavi çizgi
      strokeOpacity: 0,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: 'M 0,-1 0,1',   // küçük çizgi
            strokeOpacity: 1,
            scale: 2              // boyut
          },
          offset: '0',
          repeat: '10px'          // aralık
        }
      ]
    });
  
    routeLine.setMap(this.map);
  }

  prepareMarkers(stations: any[]) {
    if (!stations || !Array.isArray(stations)) {
      console.error("stations yok veya hatalı:", stations);
      return;
    }
  
    // Önceki markerları temizle
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  
    console.log("Marker ekleme başlıyor. Toplam stations:", stations.length);
  
    stations.forEach((station: any, index: number) => {
      const lat = station.lat ? parseFloat(station.lat) : parseFloat(station.istasyonlat);
      const lng = station.lng ? parseFloat(station.lng) : parseFloat(station.istasyonlng);
  
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Geçersiz koordinat atlandı: ${station.istasyonad}`, station);
        return;
      }
  
      let pinColor = '';
      if (station.istasyonid === -1) pinColor = 'blue';
      else if (station.eventtime) pinColor = 'green';
      else pinColor = 'red';
      
      const iconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
          <path
            d="M20 0C9 0 0 9 0 20c0 11 20 40 20 40s20-29 20-40C40 9 31 0 20 0z"
            fill="${pinColor}"
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
            ${station?.istasyonad?.trim()?.charAt(0).toUpperCase() || ''}
          </text>
        </svg>
      `);
      // let iconUrl = '';
      // if (station.istasyonid === -1) iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      // else if (station.eventtime) iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      // else iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: station.istasyonad,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(30, 45),
          anchor: new google.maps.Point(20, 60)
        }
      });
  
      this.markers.push(marker);
      console.log(`Marker eklendi [${index}]:`, station.istasyonad, lat, lng);
    });
  
    console.log("Toplam marker eklendi:", this.markers.length);
  }

  initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 41.0, lng: 29.0 }, 
      zoom: 15
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
  }

  getItem(item: any) {
    console.log("SEÇİLİ İSTASYON", item);
    this.tourDetailModal = true;
  
    const lat = Number(item?.lat);
    const lng = Number(item?.lng);
    const stationLAT = Number(item?.istasyonlat);
    const stationLNG = Number(item?.istasyonlng)
  
    this.stationLat = stationLAT;
    this.stationLng = stationLNG;
    this.lastLat = lat;
    this.lastLng = lng;
    console.log("this.stationLat", this.stationLat);
    console.log("his.stationLng", this.stationLng);
    console.log("this.lastLat", this.lastLat);
    console.log("this.lastLng", this.lastLng);
  }


  onMapDialogShow() {
    setTimeout(() => {
      const mapElement = document.getElementById('map') as HTMLElement;
      if (!mapElement) {
        console.error('Harita elementi bulunamadı.');
        return;
      }
  
      const defaultCenter = this.lastLat && this.lastLng
        ? { lat: this.lastLat, lng: this.lastLng }
        : { lat: 40.997953, lng: 29.136747 };
  
      // Haritayı modal açıldığında oluştur
      this.map = new google.maps.Map(mapElement, {
        center: defaultCenter,
        zoom: 14
      });
  
      // Marker ekleme
      if (this.lastLat && this.lastLng) {
        new google.maps.Marker({
          position: { lat: this.lastLat, lng: this.lastLng },
          map: this.map
        });
      }
  
    }, 200); // Modal animasyonu bitene kadar bekle
  }

  onDateChanged(date: Date) {
    console.log("Seçilen tarih:", date);
    // İşlem yapılacak yer
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }


}

