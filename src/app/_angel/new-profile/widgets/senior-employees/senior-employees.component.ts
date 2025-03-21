import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { SeniorPerson } from 'src/app/_angel/profile/models/seniorPerson';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { LayoutService } from 'src/app/_metronic/layout';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
  selector: 'app-senior-employees',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    CustomPipeModule,
    TooltipModule,
    MatTabsModule,
    CarouselModule
  ],
  templateUrl: './senior-employees.component.html',
  styleUrl: './senior-employees.component.scss'
})
export class SeniorEmployeesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  todaySeniorPersons: SeniorPerson[] = [];
  seniorPersons: SeniorPerson[] = [];

  items : any[] = [
    {isim : 'Işık', soyisim : 'Ekrem', kidem : '1. Yılı', img : './assets/media/avatars/300-5.jpg'},
    {isim : 'Ekrem', soyisim : 'Işık', kidem : '10. Yılı', img : './assets/media/avatars/300-17.jpg'},
  ]
  currentItemIndex = 0;

  displayAllSeniors : boolean;
  imageUrl: string;
  
  constructor(
    private profileService : ProfileService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { 
    this.imageUrl = this.profileService.getImageUrl();
  }

  ngOnInit(): void {
    this.getSeniorPersons('1');
  }

  get currentItem(): any {
    return this.items[this.currentItemIndex];
  }

  showAllNewPerson() {
    this.displayAllSeniors = true;
  }

  getSeniorPersons(event : any) {
    var zamanAralik = '1';
    this.seniorPersons = [];
    // this.todaySeniorPersons = [];
    if (event.index) {
      if (event.index == 0) {
        zamanAralik = '1';
      } else if (event.index == 1) {
        zamanAralik = '7';
      } else if (event.index == 2){
        zamanAralik = '30';
      }  
    }

    this.profileService.getSeniorPersons(zamanAralik).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<SeniorPerson, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      
      if (message.islemsonuc == 1) {
        if (zamanAralik == '1') {
          this.todaySeniorPersons = data;
        } else {
          this.seniorPersons = data;
        }
      }

      console.log("Kıdemliler :", this.seniorPersons);
      console.log("Kıdemliler bugün :", this.todaySeniorPersons);
      
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

