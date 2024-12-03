import { ChangeDetectorRef, Component, EventEmitter, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { AlarmModel } from '../models/alarm';


@Component({
  selector: 'app-patroldashboard',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './patroldashboard.component.html',
  styleUrls: ['./patroldashboard.component.scss']
})
export class PatroldashboardComponent {
  latitude:any = "40.99795333575457";
  longitude:any = "29.13674675859511";
  map:any;
  patrolInfo1:AlarmModel[];
  patrolInfo:any[] = [];
  constructor(
    private patrol : PatrolService,
    private ref : ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
   // this.openKoordinatModal();
   this.initializeMap();
   window.setInterval(() => {
    this.getPatrolInfo();
    this.ref.detectChanges();
    }, 3000);

  }



  getPatrolInfo(): void{
    this.patrol.getPatrolInfo().subscribe((response:ResponseModel<"",ResponseDetailZ>[])=>{
      this.patrolInfo = response[0].x;
      console.log("......Patrol info........",this.patrolInfo);
      //this.latitude = response[0].x;
      this.ref.detectChanges();
    })
    const mapOptions = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: 8,
    };
    this.map = new google.maps.Map(document.getElementById('map')!, mapOptions);

    if (this.patrolInfo?.length > 0) {
      this.patrolInfo.forEach((patrol :any) => {
        
        if (this.map) {
          new google.maps.Marker({
            position: { lat: + patrol.lat, lng: + patrol.lng },
            map: this.map,
            title: patrol.name,
          });
        }
      })

      this.map.addListener('click', (event: any) => {
        this.latitude = event.latLng.lat();
        this.longitude = event.latLng.lng();
        this.latitude + ',' + this.longitude;
        console.log('Tıklanan koordinatlar:', this.latitude, this.longitude);
      });
      this.map.setCenter({
        lat: +this.patrolInfo[0].lat,
        lng: +this.patrolInfo[0].lng,
      });
    // İlk marker varsa harita merkezini ayarla
    //if (this.patrolInfo?.length > 0 && this.map) {}
  }
}

  initializeMap() {
    // Harita için varsayılan merkez koordinatı
    const defaultCenter = { lat: 40.997953, lng: 29.136747 };

    // Google Maps Map nesnesi
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: defaultCenter,
      zoom: 10,
    });
    console.log('Harita yüklendi:', this.map);
  }
}
