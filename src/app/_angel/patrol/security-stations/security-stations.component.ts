import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-security-stations',
  templateUrl: './security-stations.component.html',
  styleUrls: ['./security-stations.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default 
})

export class SecurityStationsComponent implements OnInit, OnDestroy  {

    private ngUnsubscribe = new Subject();

  allStation:any[]=[];
  filteredItems:any[]=[];
  stationType:any[]=[];
  locations: any[] = [];

  filterStationName:string = '';
  selectedStationId:number;

  newStationModal:boolean = false;
  stationName:string = ""
  numberForStation:string = ""
  selectTypeId:number;
  selectUpdateTypeId:string;

  updateStationId:number;


  deleteModal:boolean = false;
  updateModal:boolean = false;

  description:string = "";
  latitude: any = "39.9334";
  longitude: any = "32.8597";
  map: any;
  lokasyon: any;

  constructor(
    private patrol : PatrolService,
    private ref : ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {

    this.getGuardStation();
    //this.getLocation();
    this.tip23_s();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }


  getGuardStation(): void {
    this.patrol.getGuardStation('9').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.allStation = response[0].x;
      this.filteredItems = [...this.allStation]
      console.log("getStation:", this.allStation);
      this.ref.detectChanges();
    });
  }

  setGuardStation(): void {


    
    this.patrol.setGuardStation(this.stationName,this.selectTypeId,this.numberForStation,this.latitude,this.longitude,this.description).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const setStation = response[0].x;
      console.log("setStation:", setStation);
      this.getGuardStation();
      this.ref.detectChanges();
    });
  
    this.stationName = '';
    this.newStationModal = false;
  }

  setGuardStationModal(){
    this.newStationModal = true;
    this.description = "";
    this.stationName = "";
    this.numberForStation = "";
    this.lokasyon = "";
    setTimeout(() => {
      const mapOptions = {
          center: new google.maps.LatLng(this.latitude, this.longitude),
          zoom: 8,
      };
      console.log('ilk koordinatlar:', this.latitude, this.longitude);
      this.map = new google.maps.Map(document.getElementById('map')!, mapOptions);
      let clickMarker: google.maps.Marker | null = null;
      this.map.addListener('click', (event: any) => {
          this.latitude = event.latLng.lat();
          this.longitude = event.latLng.lng();
          this.lokasyon = this.latitude + ',' + this.longitude;
          console.log('Tıklanan koordinatlar:', this.latitude, this.longitude);
          if (clickMarker) {
            clickMarker.setMap(null);
          }
      
          clickMarker = new google.maps.Marker({
            position: event.latLng,
            map: this.map,
            title: 'Seçilen Konum'
          });  
      });
  }, 1000);
  }

  tip23_s(): void{
     this.patrol.tip23_s().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.stationType = response[0].x;
      console.log("tip23_s:", this.stationType);
      this.ref.detectChanges();
    });
  }

  getLocation() {
    this.patrol.getLocation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.locations = response[0].x;
      console.log("getLocation:", this.locations);
      this.ref.detectChanges();
    
    });
  }
  deleteGuardStationModal(id:number) {
    console.log("id:", id);
    this.selectedStationId = id;
    this.deleteModal = true;

  }

  deleteGuardStation(){
    this.patrol.deleteGuardStation(this.selectedStationId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const delStation = response[0].x;
      console.log("delStation:", delStation);
      this.getGuardStation();
      this.ref.detectChanges();
    });
  
    this.filterStationName = '';
    this.deleteModal = false;
  }

  updateGuardStationModal(item:any){
    this.updateModal = true;
    this.description = item?.aciklama;
    this.stationName = item?.kaynakad;
    this.numberForStation = item?.numara;
    this.selectUpdateTypeId = item?.tip;
    this.selectTypeId = parseInt(item?.tip, 10);
    this.lokasyon = item?.lat + ',' + item?.lng;
    this.updateStationId = item?.id;

    setTimeout(() => {
      const mapOptions = {
          center: new google.maps.LatLng(item?.lat, item?.lng),
          zoom: 8,
      };
      console.log('ilk koordinatlar:', item?.lat, item?.lng);
      this.map = new google.maps.Map(document.getElementById('map')!, mapOptions);
      let clickMarker: google.maps.Marker | null = null;
      this.map.addListener('click', (event: any) => {
          this.latitude = event.latLng.lat();
          this.longitude = event.latLng.lng();
          this.lokasyon = this.latitude + ',' + this.longitude;
          console.log('Tıklanan koordinatlar:', this.latitude, this.longitude);
          if (clickMarker) {
            clickMarker.setMap(null);
          }
      
          clickMarker = new google.maps.Marker({
            position: event.latLng,
            map: this.map,
            title: 'Seçilen Konum'
          });  
      });
  }, 1000);
    console.log("UPDATE",item);
  }

  updateGuardStation(): void{

    this.patrol.updateGuardStation(this.stationName,this.updateStationId,this.selectTypeId,this.numberForStation,this.latitude,this.longitude,this.description).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const updateGuardStation = response[0].x;
      console.log("updateGuardStation:", updateGuardStation);
      if(updateGuardStation.length == 1){
        alert("error")
      }else{
        alert("success")
      }
      this.getGuardStation();
      this.ref.detectChanges();
    });
  
    this.stationName = '';
    this.updateModal = false;
  }

  filterItems(){
    const query = this.filterStationName.toLowerCase();
    this.filteredItems = this.allStation.filter(item =>
      item.kaynakad?.toLowerCase().includes(query)
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
