import { ChangeDetectorRef, Component } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-security-locations',
  templateUrl: './security-locations.component.html',
  styleUrls: ['./security-locations.component.scss']
})
export class SecurityLocationsComponent {

  locationName:string = "";
  _filteredItems:any[] = [];
  _devices:any[] = [];

  _locations:any[] = [];

  _allLocationDetails:any[] = [];

  _locationDetails:any[] = [];

  targetProducts:any[] = [];
    constructor(
      private patrol : PatrolService,
      private ref : ChangeDetectorRef
    ) { }

    ngOnInit(): void {
      this.getLocation()
    }

    setLocation(name:string){
      this.patrol.setLocation(name).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          const setLocation = response[0].x;
          console.log("setLocation:", setLocation);
          this.getLocation();
        });
        this.ref.detectChanges();
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
      this.getGuardTourCalendar(item.id);
      this.locationDetails(item.id);
    }


    allLocationDetails(id:number){
      this.patrol.allLocationDetails(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this._allLocationDetails = response[0].x;
        console.log("allLocationDetails:", this._allLocationDetails);
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
  
    getGuardTourCalendar(id:number){
      this.patrol.getGuardTourCalendar(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const getGuardTourCalendar = response[0].x;
        console.log("getGuardTourCalendar:", getGuardTourCalendar);
      });
      this.ref.detectChanges();
    }

    filterItems(){
      const query = this.locationName.toLowerCase();
      this._filteredItems = this._locations.filter(item =>
        item.ad?.toLowerCase().includes(query)
      );
    }
}
