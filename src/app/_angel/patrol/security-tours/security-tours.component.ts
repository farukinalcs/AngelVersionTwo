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


 deleteGuardTour(tour:any): void {
  this.selectedTour = tour;
  this.selectTourId = tour.id;
      this.patrol.deleteGuardTour(this.selectTourId).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const responsee = response[0].x;
        console.log("deleteGuardTour:", responsee);
        this.getGuardTour();
      });
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




  getItem(tour:any){
    console.log('TOUR',tour)
    this.selectedTour = tour;
    this.selectTourId = tour.id;
    console.log("TYPE 1",typeof tour.id)
    //this.targetList = this.allStation.filter(item => item.id === tour.id);
    this.getGuardStationForTour(tour.id);
  }

  addTourStation(item:any){
    if(this.selectTourId != 0)
    {
    this.patrol.relation_i(item.id,this.selectTourId).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        // const result = response[0].x;
        console.log("TYPE 2",typeof this.selectTourId)
        this.targetList = response[0].x;
        console.log("setTourStation:", this.targetList);
    })
    }else{
      alert("İstasyon eklemek istediğiniz turu seçin")
    }
    console.log("this.selectTourId",this.selectTourId)
    console.log("itemmmmmm",item)

  
  }
  
  deleteTourStation(item:any){
    const kaynakid = item.id;
    const hedefid = item.hedefid;
    console.log("kaynakid:", kaynakid);
    console.log("hedefid:", hedefid);
    console.log("adana:", item);
    this.patrol.relation_d(kaynakid,hedefid).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.targetList = response[0].x;
        console.log("deleteTourStation:", this.targetList);
    })
    this.getGuardStationForTour(hedefid);
  }

}
