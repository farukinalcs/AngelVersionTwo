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
  filteredItems:any[]=[];
  tourNameInput:string='';
  tourList:any[]=[];

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
      this.filteredItems = [...this.tourList]
      //console.log("getGuardTour:", this.tourList);
      this.tourNameInput = "";
    });
    this.ref.detectChanges();
  }

  getGuardStation(): void {
    this.patrol.getGuardStation('-1').subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.allStation = response[0].x;
     // console.log("getGuardStation:", this.allStation);
    });
    this.ref.detectChanges();
  }

  getGuardStationForTour(turid:string){
    /* Tur a ait olan istasyonlar   */
    this.patrol.getGuardStation(turid).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.targetList = response[0].x;
     // console.log("TARGET LİST GET TOUR", this.targetList);
    });
    this.ref.detectChanges();
  }

  getItem(tour:any){
    this.selectedTour = tour;
    this.selectTourId = tour.id;
    //this.targetList = this.allStation.filter(item => item.id === tour.id);
    this.getGuardStationForTour(tour.id);
  }

  addTourStation(station:any){
    if(this.selectTourId != 0)
    {
    const exists = this.targetList.some(item => item.id === station.id);
    if(!exists){
      this.patrol.relation_i(station.id,this.selectTourId).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.targetList = response[0].x;
        //console.log("relation_i TARGET:", this.targetList);
    })}
    else{
      alert("Bu istasyon daha önce eklendi")
    }}else{
      alert("İstasyon eklemek istediğiniz turu seçin")
    }
  }
  
  deleteTourStation(item:any){
    const id = item.id;
    const hedefid = item.hedefid;
    console.log("SİL ID",id)
    console.log("SİL TUR İD",hedefid);
    console.log("deleteTourStation:", item);
    if(id !== undefined){
      
      this.patrol.relation_d(id,hedefid).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.targetList = response[0].x;
          console.log("deleteTourStation: TARGET", this.targetList);
      })
      this.getGuardStationForTour(hedefid);
    }else
    {
      const kaynakid = item.kaynakid;
      const hedefid = item.hedefid;
      console.log("kaynakid:", kaynakid);
        console.log("hedefid:", hedefid);
        console.log("Station:", item);
        this.patrol.relation_d(kaynakid,hedefid).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          this.targetList = response[0].x;
            console.log("deleteTourStation:", this.targetList);
        })
        this.getGuardStationForTour(hedefid);
    }
  }

  filterItems(){
    const query = this.tourNameInput.toLowerCase();
    this.filteredItems = this.tourList.filter(item =>
      item.ad?.toLowerCase().includes(query)
    );
  }

}
