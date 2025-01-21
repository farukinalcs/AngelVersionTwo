import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-security-tours',
  templateUrl: './security-tours.component.html',
  styleUrls: ['./security-tours.component.scss']
})

export class SecurityToursComponent {

  targetList: any[] = [];
  selectedTour: any = null;
  selectTourId:number = 0;
  selectStationId:number = 0;
  allStation:any[];
  
  tourNameInput:string='';

  tourList:any;

  constructor(
      private patrol : PatrolService,
      private ref : ChangeDetectorRef
    ) { }


  ngOnInit(): void {
    this.getGuardTour();
    this.getGuardStation();
  }

  setGuardTour(): void {
    if(this.tourNameInput != '')
    {
      this.patrol.setGuardTour(this.tourNameInput).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const responsee = response[0].x;
        console.log("setGuardTour:", responsee);
        this.getGuardTour();
      });
    }else{
      alert("Tur adı boş geçilemez")
    }
  }

  getGuardTour(): void {


    this.patrol.getGuardTour('0').subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.tourList = response[0].x;
      console.log("getGuardTour:", this.tourList);
    });
    this.ref.detectChanges();
  }

  getGuardStation(): void {
    this.patrol.getGuardStation('-1').subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.allStation = response[0].x;
      console.log("getGuardStation:", this.allStation);
    });
    this.ref.detectChanges();
  }

  getGuardStationForTour(turid:string){
    /* Tur a ait olan istasyonlar   */
    this.patrol.getGuardStation(turid).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.targetList = response[0].x;
      console.log("TARGET LİST GET", this.targetList);
    });
    this.ref.detectChanges();
  }

  addToTargetList(item: any) {
    console.log('İSTASYON ',item)
    console.log('targetList ',this.targetList)
    // Eğer hedef listede yoksa ekle
    if (!this.targetList.includes(item.id)) {
      this.targetList.push(item);
      this.setTourStation(item.id)
    }
    console.log('targetList ADDD ',this.targetList)
  }



  getItem(tour:any){
    console.log('TOUR',tour)
    this.selectedTour = tour;
    this.selectTourId = tour.id;
    //this.targetList = this.allStation.filter(item => item.id === tour.id);
    this.getGuardStationForTour(tour.id);
  }

  setTourStation(kaynakid:number){
    console.log("kaynakid:", kaynakid);
    console.log("hedefid:", this.selectTourId);
    this.patrol.relation(kaynakid,this.selectTourId).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const result = response[0].x;
        console.log("setTourStation:", result);
    })
  }
  

}
