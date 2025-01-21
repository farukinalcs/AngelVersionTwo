import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { LayoutService } from 'src/app/_metronic/layout';
import { NewPerson } from '../../models/newPerson';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-yeni-katilanlar',
  templateUrl: './yeni-katilanlar.component.html',
  styleUrls: ['./yeni-katilanlar.component.scss']
})
export class YeniKatilanlarComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  newPersons : NewPerson[] = [];
  todayNewPerson: NewPerson[] = [];
  displayAllNewPerson : boolean;
  imageUrl: string;

  constructor(
    private profileService : ProfileService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) {
    this.imageUrl = this.profileService.getImageUrl();
  }

  ngOnInit(): void {
    this.getNewPersons('1');
  }

  showAllNewPerson() {
    this.displayAllNewPerson = true;
  }

  getNewPersons(event : any) {
    var zamanAralik = '1';
    this.newPersons = [];
    if (event.index) {
      if (event.index == 0) {
        zamanAralik = '1';
      } else if (event.index == 1) {
        zamanAralik = '7';
      } else if (event.index == 2){
        zamanAralik = '30';
      }  
    }

    this.profileService.getNewPersons(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<NewPerson, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      
      if (message.islemsonuc == 1) {

        if (zamanAralik == '1') {
          this.todayNewPerson = data;
        } else {
          this.newPersons = data;
        }
        
      }
      console.log("Yeni Katılanlar :", this.newPersons);
      
      this.ref.detectChanges();
    });
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
