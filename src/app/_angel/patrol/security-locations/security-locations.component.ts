import { ChangeDetectorRef, Component } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-security-locations',
  templateUrl: './security-locations.component.html',
  styleUrls: ['./security-locations.component.scss']
})
export class SecurityLocationsComponent {

  locationName:string = "";
  _filteredItems:any[] = [];



  _locationEmergencyCall:any[] = [];
  _locationEmergencySms:any[] = [];
  _locationGuards:any[] = [];
  _locaitonStations:any[] = [];
  _locationTours:any[] = [];
  _locationDevices:any[] = [];
  _locationVehicle:any[] = [];


  selectedIndex: 0;
  _locations:any[] = [];

  _allLocationDetails:any[] = [];

  _locationDetails:any[] = [];
  targetProducts:any[]= [];

    constructor(
      private patrol : PatrolService,
      private ref : ChangeDetectorRef,
        private translateService: TranslateService,
    ) { }

    ngOnInit(): void {
      this.getLocation()
    }

    setLocation(name:string){
      if(name !== '')
      {
        this.patrol.setLocation(name).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          const setLocation = response[0].x;
          console.log("setLocation:", setLocation);
          this.getLocation();
        });
        this.ref.detectChanges();
        this.locationName = '';
      }else
      alert("LÜTFEN LOKASYON ADINI BOŞ GEÇMEYİNİZ")
    }

    getLocation(){
      this.patrol.getLocation().subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this._locations = response[0].x;
        this._filteredItems = [...this._locations];
        console.log("getLocation:", this._locations); 
        
        this.locationName = '';
      });
      this.ref.detectChanges();
    }

    deleteLocation(id:number){
      this.patrol.deletelocation(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const deleteLocation = response[0].x;
        console.log("deleteLocation:", deleteLocation);
        this.getLocation();
      });
      this.ref.detectChanges();
    }

    updateLocation(name:string,id:number){
      this.patrol.updateLocation(name,id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const updateLocation = response[0].x;
        console.log("updateLocation:", updateLocation);
      });
      this.ref.detectChanges();
    }


    getItem(item:any){
      console.log("lokasyon item",item);
      this.allLocationDetails(item.id);
      //this.getGuardTourCalendar(item.id);
      this.locationDetails(item.id);
      this.ref.detectChanges();
      this.ref.markForCheck();
    }


    allLocationDetails(id:number){
      this.patrol.allLocationDetails(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this._allLocationDetails = response[0].x;
  
        this._locationEmergencySms = this._allLocationDetails?.filter((x:any)=>x.tip === 'X');
        this._locationEmergencyCall = this._allLocationDetails?.filter((x:any)=>x.tip === 'Y');
        this._locationGuards = this._allLocationDetails?.filter((x:any)=>x.tip === 'G');
        this._locaitonStations = this._allLocationDetails?.filter((x:any)=>x.tip === 'I');
        this._locationTours = this._allLocationDetails?.filter((x:any)=>x.tip === 'T');
        this._locationDevices = this._allLocationDetails?.filter((x:any)=>x.tip === 'TE');
        this._locationVehicle = this._allLocationDetails?.filter((x:any)=>x.tip === 'C');
        console.log("allLocationDetails:", this._allLocationDetails);
        console.log("_locationEmergencyCall:", this._locationEmergencyCall);
        console.log("_locationEmergencySms:", this._locationEmergencySms);
        console.log("_locationGuards:", this._locationGuards);
        console.log("_locaitonStations:", this._locaitonStations);
        console.log("_locationTours:", this._locationTours);
        console.log("_locationDevices:", this._locationDevices);
        console.log("_locationVehicle:", this._locationVehicle);
      });
      this.ref.detectChanges();
    }

    locationDetails(id:number){
      this.patrol.locationDetails(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const locationDetails = response[0].x;
        console.log("locationDetails:", locationDetails);
      });
      this.ref.detectChanges();
    }
  
    // getGuardTourCalendar(id:number){
    //   this.patrol.getGuardTourCalendar(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
    //     const getGuardTourCalendar = response[0].x;
    //     console.log("getGuardTourCalendar:", getGuardTourCalendar);
    //   });
    //   this.ref.detectChanges();
    // }

    filterItems(){
      const query = this.locationName.toLowerCase();
      this._filteredItems = this._locations.filter(item =>
        item.ad?.toLowerCase().includes(query)
      );
    }

    
  changeTabMenu(event: any) {
    if (event.tab) {
      if (event.index == 0) {
        this.selectedIndex = event.index;
        // this.getShifts();
      } else if (event.index == 1) {
        this.selectedIndex = event.index;
      } else if (event.index == 2) {
        this.selectedIndex = event.index;
      } else if (event.index == 3) {
        this.selectedIndex = event.index;
      }
    }
  }

    
    relationStateChange(item:any, process:any) {
      var mkodu;
      if (process == "i") {
        mkodu = "yek156"
      } else if (process == "d") {
        mkodu = "yek157"
      }
  
      var sp: any[] = [
        {
          mkodu: mkodu,
          kaynakid: item.kaynakId.toString(),
          hedefid: item.hedefId.toString(),
          hedeftablo: 'mesaigruplari',
          extra: ""
          
        },
      ];
  
      // this.patrol
      //   .requestMethod(sp)
      //   .pipe(takeUntil(this.ngUnsubscribe))
      //   .subscribe((response: any) => {
      //     const data = response[0].x;
      //     const message = response[0].z;
  
      //     if (message.islemsonuc != 1) {
      //       return;
      //     }
      //     console.log('relations durum değişti: ', data);
  
      //     this.relations = [...data];        
                  
      //   });
    }
}
