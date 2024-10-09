import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { LayoutService } from 'src/app/_metronic/layout';
import { PersonBirthday } from '../../models/personsBirthday';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-dogum-gunu',
  templateUrl: './dogum-gunu.component.html',
  styleUrls: ['./dogum-gunu.component.scss']
})
export class DogumGunuComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  
  currentItemIndex = 0;

  displayAllBirthdays : boolean;
  personsBirthday: PersonBirthday[] = [];
  todayPersonsBirthday: PersonBirthday[] = [];
  constructor(
    private profileService : ProfileService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getPersonsBirthday('1');
  }

  showAllBirthdays() {
    this.displayAllBirthdays = true;
  }

  getPersonsBirthday(event : any) {
    var zamanAralik = '1';
    this.personsBirthday = [];
    // this.todayPersonsBirthday = [];

    if (event.index) {
      if (event.index == 0) {
        zamanAralik = '1';
      } else if (event.index == 1) {
        zamanAralik = '7';
      } else if (event.index == 2){
        zamanAralik = '30';
      }  
    }

    this.profileService.getPersonsBirthday(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<PersonBirthday, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      
      if (message.islemsonuc == 1) {

        if (zamanAralik == '1') {
          this.todayPersonsBirthday = data;
        } else {
          this.personsBirthday = data;
        }
        
      }
      console.log("Doğum Günüsü :", this.personsBirthday);
      
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
