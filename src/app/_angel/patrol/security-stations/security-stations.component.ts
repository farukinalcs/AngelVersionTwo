import { ChangeDetectorRef, Component } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-security-stations',
  templateUrl: './security-stations.component.html',
  styleUrls: ['./security-stations.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default 
})

export class SecurityStationsComponent {
  allStation:any[]=[];
  filteredItems:any[]=[];
  stationName:string = '';
  stationId:number;

  constructor(
    private patrol : PatrolService,
    private ref : ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
  this.getGuardStation();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }
  getGuardStation(): void {
    this.patrol.getGuardStation('-1').subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.allStation = response[0].x;
      this.filteredItems = [...this.allStation]
      console.log("getStation:", this.allStation);
      this.ref.detectChanges();
    });
 
 
  }

  setGuardStation(name:string): void {
    this.patrol.setGuardStation(name).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const setStation = response[0].x;
      console.log("setStation:", setStation);
      this.getGuardStation();
      this.ref.detectChanges();
    });
  
  
  }

  deleteGuardStation(id:number): void {
    this.patrol.deleteGuardStation(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const delStation = response[0].x;
      console.log("delStation:", delStation);
      this.getGuardStation();
      this.ref.detectChanges();
    });
  
    this.stationName = '';

  }

  getItem(item:any){
    console.log(item)
  }

  filterItems(){
    const query = this.stationName.toLowerCase();
    this.filteredItems = this.allStation.filter(item =>
      item.kaynakad?.toLowerCase().includes(query)
    );
  }


}
