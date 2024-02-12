import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { TransitionsModel } from '../../models/transations';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-gecislerim',
  templateUrl: './gecislerim.component.html',
  styleUrls: ['./gecislerim.component.scss']
})
export class GecislerimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  currentLang : any;
  transitions : any[]  = [];
  
  constructor(
    private profileService : ProfileService,
    private ref : ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getTransitions('1');
  }

  getTransitions(event : any) {
    var zamanAralik : any = '1';
    if (event.tab) {
      if (event.tab.textLabel == 'Günlük' || event.tab.textLabel == 'Daily') {
        zamanAralik = '1';
      } else if (event.tab.textLabel == 'Haftalık' || event.tab.textLabel == 'Weekly') {
        zamanAralik = '7';
      } else if (event.tab.textLabel == 'Aylık' || event.tab.textLabel == 'Monthly'){
        zamanAralik = '30';
      }  
    }
    
    this.profileService.getTransitions(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<TransitionsModel, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;
      let responseToken = response[0].y;

      this.transitions = data;
      console.log("Geçişler :", this.transitions);
      
      this.ref.detectChanges();
    })
  }







  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
