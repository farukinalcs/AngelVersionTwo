import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-security-tour-calendar',
  templateUrl: './security-tour-calendar.component.html',
  styleUrls: ['./security-tour-calendar.component.scss']
})
export class SecurityTourCalendarComponent {
  locationName:string = "";
  tourList: any[] = [];
  _filteredItems:any[] = [];
  _locations:any[] = [];

    constructor(
        private patrol : PatrolService,
        private ref : ChangeDetectorRef
      ) { }


      ngOnInit(): void {
        this.getLocation();
      }

        getGuardTour(id:string): void {
          this.patrol.getGuardTour(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
            this.tourList = response[0].x;
            console.log("getGuardTour:", this.tourList);
            
          });
          this.ref.detectChanges();
        }

        getLocation(){
          this.patrol.getLocation().subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
            this._locations = response[0].x;
            this._filteredItems = [...this._locations];
            console.log("getLocation takvimm:", this._locations); 
            
            this.locationName = '';
          });
          this.ref.detectChanges();
        }
    

        filterItems(){
          const query = this.locationName.toLowerCase();
          this._filteredItems = this._locations.filter(item =>
            item.ad?.toLowerCase().includes(query)
          );
        }

        
      getItem(item:any){
        console.log("lokasyon item",item);
        this.getGuardTour(item.id);
        // this.allLocationDetails(item.id);
        // this.getGuardTourCalendar(item.id);
        // this.locationDetails(item.id);
      }

}
