import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-security-locations',
  templateUrl: './security-locations.component.html',
  styleUrls: ['./security-locations.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SecurityLocationsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  locationName: string = "";
  _filteredItems: any[] = [];


  selectLocationId: number;
  _setlocationEmergencyCall: any[] = [];
  _setlocationEmergencySms: any[] = [];
  _setlocationGuards: any[] = [];
  _setlocaitonStations: any[] = [];
  _setlocationTours: any[] = [];
  _setlocationDevices: any[] = [];
  _setlocationVehicle: any[] = [];

  _getlocationEmergencyCall: any[] = [];
  _getlocationEmergencySms: any[] = [];
  _getlocationGuards: any[] = [];
  _getlocaitonStations: any[] = [];
  _getlocationTours: any[] = [];
  _getlocationDevices: any[] = [];
  _getlocationVehicle: any[] = [];


  selectedIndex: 0;
  _locations: any[] = [];

  _allLocationDetails: any[] = [];

  _locationDetails: any[] = [];
  targetProducts: any[] = [];

  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getLocation()
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }

  setLocation(name: string) {
    if (name !== '') {
      this.patrol.setLocation(name).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const setLocation = response[0].x;
        console.log("setLocation:", setLocation);
        this.getLocation();
        this.ref.detectChanges();
      });

      this.locationName = '';
    } else
      this.toastrService.error(
        "LÜTFEN LOKASYON ADINI BOŞ GEÇMEYİNİZ"
      );
  }

  getLocation() {
    this.patrol.getLocation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._locations = response[0].x;
      this._filteredItems = [...this._locations];
      console.log("getLocation:", this._locations);
      this.ref.detectChanges();
      this.locationName = '';
    });
  }

  deleteLocation(id: number) {
    this.patrol.deletelocation(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const deleteLocation = response[0].x;
      console.log("deleteLocation:", deleteLocation);
      this.ref.detectChanges();
      this.getLocation();
    });
  }

  updateLocation(name: string, id: number) {
    this.patrol.updateLocation(name, id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const updateLocation = response[0].x;
      console.log("updateLocation:", updateLocation);
      this.ref.detectChanges();
    });

  }


  selectLocation(item: any) {
    this.selectLocationId = item.id;
    console.log("lokasyon item", item);
    console.log("this.selectLocationId item", this.selectLocationId);
    this.allLocationDetails(this.selectLocationId);
    //this.getGuardTourCalendar(item.id);
    this.locationDetails(this.selectLocationId);
    this.ref.detectChanges();
  }


  allLocationDetails(id: number) {
    this.patrol.allLocationDetails(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._allLocationDetails = response[0].x;

      this._getlocationEmergencySms = this._allLocationDetails?.filter((x: any) => x.tip === 'X');
      this._getlocationEmergencyCall = this._allLocationDetails?.filter((x: any) => x.tip === 'Y');
      this._getlocationGuards = this._allLocationDetails?.filter((x: any) => x.tip === 'G');
      this._getlocaitonStations = this._allLocationDetails?.filter((x: any) => x.tip === 'I');
      this._getlocationTours = this._allLocationDetails?.filter((x: any) => x.tip === 'T');
      this._getlocationDevices = this._allLocationDetails?.filter((x: any) => x.tip === 'TE');
      this._getlocationVehicle = this._allLocationDetails?.filter((x: any) => x.tip === 'C');
      this.ref.detectChanges();
    });
  }

  locationDetails(id: number) {
    this.patrol.locationDetails(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._locationDetails = response[0].x;
      console.log("locationDetails yek248:", this._locationDetails);
      this._setlocationEmergencySms = this._locationDetails?.filter((x: any) => x.tip === 'X');
      this._setlocationEmergencyCall = this._locationDetails?.filter((x: any) => x.tip === 'Y');
      this._setlocationGuards = this._locationDetails?.filter((x: any) => x.tip === 'G');
      this._setlocaitonStations = this._locationDetails?.filter((x: any) => x.tip === 'I');
      this._setlocationTours = this._locationDetails?.filter((x: any) => x.tip === 'T');
      this._setlocationDevices = this._locationDetails?.filter((x: any) => x.tip === 'TE');
      this._setlocationVehicle = this._locationDetails?.filter((x: any) => x.tip === 'C');
      this.ref.detectChanges();
    });

  }

  setGuardLocation(item: any, islem: number) {
    console.log("setGuardLocation", item)
    this.patrol.setGuardLocation(item.id, item.tip, this.selectLocationId, islem).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._locationDetails = response[0].x;
      this._setlocationEmergencySms = this._locationDetails?.filter((x: any) => x.tip === 'X');
      this._setlocationEmergencyCall = this._locationDetails?.filter((x: any) => x.tip === 'Y');
      this._setlocationGuards = this._locationDetails?.filter((x: any) => x.tip === 'G');
      this._setlocaitonStations = this._locationDetails?.filter((x: any) => x.tip === 'I');
      this._setlocationTours = this._locationDetails?.filter((x: any) => x.tip === 'T');
      this._setlocationDevices = this._locationDetails?.filter((x: any) => x.tip === 'TE');
      this._setlocationVehicle = this._locationDetails?.filter((x: any) => x.tip === 'C');
      console.log("ATAMADAN SONRA DÖNEN yek243:", this._locationDetails);
      this.ref.detectChanges();
      this.locationDetails(item.id);
      this.allLocationDetails(item.id);
    });

  }

  // getGuardTourCalendar(id:number){
  //   this.patrol.getGuardTourCalendar(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
  //     const getGuardTourCalendar = response[0].x;
  //     console.log("getGuardTourCalendar:", getGuardTourCalendar);
  //   });
  //   this.ref.detectChanges();
  // }

  filterItems() {
    const query = this.locationName.toLowerCase();
    this._filteredItems = this._locations.filter(item =>
      item.ad?.toLowerCase().includes(query)
    );
  }


  changeTabMenu(event: any) {
    if (event.tab) {
      if (event.index == 0) {
        this.selectedIndex = event.index;
      } else if (event.index == 1) {
        this.selectedIndex = event.index;
      } else if (event.index == 2) {
        this.selectedIndex = event.index;
      } else if (event.index == 3) {
        this.selectedIndex = event.index;
      }
    }
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  // relationStateChange(item:any, process:any) {
  //   var mkodu;
  //   if (process == "i") {
  //     mkodu = "yek156"
  //   } else if (process == "d") {
  //     mkodu = "yek157"
  //   }

  //   var sp: any[] = [
  //     {
  //       mkodu: mkodu,
  //       kaynakid: item.kaynakId.toString(),
  //       hedefid: item.hedefId.toString(),
  //       hedeftablo: 'mesaigruplari',
  //       extra: ""

  //     },
  //   ];

  //   // this.patrol
  //   //   .requestMethod(sp)
  //   //   .pipe(takeUntil(this.ngUnsubscribe))
  //   //   .subscribe((response: any) => {
  //   //     const data = response[0].x;
  //   //     const message = response[0].z;

  //   //     if (message.islemsonuc != 1) {
  //   //       return;
  //   //     }
  //   //     console.log('relations durum değişti: ', data);

  //   //     this.relations = [...data];        

  //   //   });
  // }
}
