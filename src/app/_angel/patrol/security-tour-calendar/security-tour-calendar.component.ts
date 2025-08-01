import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-security-tour-calendar',
  templateUrl: './security-tour-calendar.component.html',
  styleUrls: ['./security-tour-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SecurityTourCalendarComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  locationName: string = "";

  tourList: any[] = [];
  _activeTourList: any[] = [];

  _filteredItems: any[] = [];

  _locations: any[] = [];

  _deleteTourCalendarModal:boolean = false;
  _setTourCalendarModal: boolean = false;



  dayIndex: string = '0';
  tourId: string;
  lokasyonId: number;
  tourTime: string;
  ozel: string = '0';
  checkboxValue: string = "0";
  selectedTourDetail:TourCalendarModel;
  stationsForTour:any[]=[];

  description:string = "";

  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.getLocation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }

  days = [
    { id: '1', name: 'Pazartesi' },
    { id: '2', name: 'Salı' },
    { id: '3', name: 'Çarşamba' },
    { id: '4', name: 'Perşembe' },
    { id: '5', name: 'Cuma' },
    { id: '6', name: 'Cumartesi' },
    { id: '7', name: 'Pazar' }
  ];


  getItemsByGun(dayId: string) {
    return this._activeTourList.filter(item => item.gun === dayId);
  }

  getGuardTour(id: number): void {
    this.patrol.getGuardTour(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.tourList = response[0].x;
      this.tourId = this.tourList[0].id;
      console.log("getGuardTour:", this.tourList);
      this.ref.detectChanges();
    });

  }

  getGuardTourCalendar(id: number) {
    this.patrol.getGuardTourCalendar(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._activeTourList = response[0].x;
      console.log("lokasyona ait planlı turlar:", this._activeTourList);
    });
    this.ref.detectChanges();
  }

  getLocation() {
    this.patrol.getLocation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._locations = response[0].x;
      this._filteredItems = [...this._locations];
      console.log("getLocation takvimm:", this._locations);
      this.ref.detectChanges();
      this.locationName = '';

      if (this._filteredItems.length > 0) {
        this.lokasyonId = this._filteredItems[0].id;
        this.getGuardTour(this.lokasyonId);
        this.getGuardTourCalendar(this.lokasyonId);
      }
    });


  }


  filterItems() {
    const query = this.locationName.toLowerCase();
    this._filteredItems = this._locations.filter(item =>
      item.ad?.toLowerCase().includes(query)
    );
  }


  getItem(item: any) {

    this.lokasyonId = item.id;
    console.log(" this.lokasyonId", typeof this.lokasyonId, this.lokasyonId);
    this.getGuardTour(item.id);
    this.getGuardTourCalendar(item.id)
  }

  setTourCalendar(dayId: string) {

    this.dayIndex = dayId;
    this._setTourCalendarModal = true;
    console.log("TOUR DAY", this.dayIndex)

  }

  setGuardTourCalendar() {
    console.log(" TUR KAYDETMEKİ TUR ID", typeof this.tourId, this.tourId);
    this.patrol.setGuardTourCalendar(this.lokasyonId, this.dayIndex, this.tourId, this.tourTime, this.ozel,this.description).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {

      this._activeTourList = response[0].x
      console.log("RESULT", this._activeTourList);
      this._setTourCalendarModal = false;
      this.ref.detectChanges();
    })
    this.getItemsByGun(this.dayIndex);
  }

  getTourId(item: any) {
    this.tourId = item;
    console.log(" SECİLİ TUR ID", typeof this.tourId, this.tourId);
  }

  getTourTime(item: any) {
    this.tourTime = item;
    console.log("tourTime.....", item)
  }

  ozelCheckbox(event: any) {
    const checked = (event.target as HTMLInputElement).checked;
    this.ozel = checked ? "1" : "0";
  }

  openDeleteModal(tour:TourCalendarModel){
    console.log("openDeleteModal",tour);
    this.selectedTourDetail = tour;
    try{
      this.stationsForTour = JSON.parse(tour.istasyon || '[]');
    }catch(err){
      this.stationsForTour = [];
    }
    this._deleteTourCalendarModal = true;
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}



interface TourCalendarModel {
  Aciklama: string;
  Lokasyon: string;
  Sure: number;
  bassaat: string;
  code: string;
  dayname: string;
  gun: number;
  istasyon: string; // JSON string
  lokasyonid: number;
  ozel: string;
  takvimid: number;
  turid: number;
}