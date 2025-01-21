import { ChangeDetectorRef, Component } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';


@Component({
  selector: 'app-security-stations',
  templateUrl: './security-stations.component.html',
  styleUrls: ['./security-stations.component.scss']
})

export class SecurityStationsComponent {
  allStation:any[];

  constructor(
    private patrol : PatrolService,
    private ref : ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
  this.getGuardStation('0');
  }
  getGuardStation(turid:string): void {
    this.patrol.getGuardStation('0').subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.allStation = response[0].x;
      console.log("getGuardStation:", this.allStation);
    });
    this.ref.detectChanges();
  }


}
