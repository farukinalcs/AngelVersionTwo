import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { LayoutService } from 'src/app/_metronic/layout';
import { NewPerson } from 'src/app/_angel/profile/models/newPerson';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { CarouselModule } from 'primeng/carousel';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { SharedModule } from 'src/app/_angel/shared/shared.module';

@Component({
  selector: 'app-new-joiners',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    MatTabsModule,
    CarouselModule,
    TranslateModule,
    TooltipModule,
    CustomPipeModule,
    SharedModule
  ],
  templateUrl: './new-joiners.component.html',
  styleUrl: './new-joiners.component.scss'
})
export class NewJoinersComponent implements OnInit, OnDestroy {
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
