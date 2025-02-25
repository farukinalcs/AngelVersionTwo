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
  _activeTourList:any[] = [];

  _filteredItems:any[] = [];

  _locations:any[] = [];


  _setTourCalendarModal:boolean = false;

  dayIndex : string = '0';
  tourId:string;
  lokasyonId:number;
  tourTime:string;
  ozel:string = '0';
  checkboxValue: string = "0";

  selectTour:number;

    constructor(
        private patrol : PatrolService,
        private ref : ChangeDetectorRef
      ) { }


      ngOnInit(): void {
        this.getLocation();
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
        this.lokasyonId = item.id;
        this.getGuardTour(item.id);
      }

      setTourCalendar(dayId:string)
      {
        // const tourDay = day;
        this.dayIndex = dayId;
        this._setTourCalendarModal = true;
        console.log("TOUR DAY",this.dayIndex)

        // gun:gun.toString(),
        // tur:tur.toString(),
        // tursaat:tursaat.toString(),
        // lokasyon:id.toString(),
        // ozel:ozel.toString()
      }

      setGuardTourCalendar(){
        this.patrol.setGuardTourCalendar(this.lokasyonId,this.dayIndex,this.tourId,this.tourTime,this.ozel).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          // this._locations = response[0].x;
          // this._filteredItems = [...this._locations];
          // console.log("getLocation takvimm:", this._locations); 
          
          // this.locationName = '';
          this._activeTourList = response[0].x
          console.log("RESULT", this._activeTourList);
        })
        this.getItemsByGun(this.dayIndex);
        this.ref.detectChanges();
      }

      getTourId(item:any){
        this.tourId=item;
        console.log("TOUR.....",typeof item)
      }

      getTourTime(item:any){
        this.tourTime=item;
        console.log("tourTime.....",item)
      }

      ozelCheckbox(event:any){
        const checked = (event.target as HTMLInputElement).checked;
        this.ozel = checked ? "1" : "0";
      }
      
}
