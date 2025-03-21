import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { MyTeamModel } from 'src/app/_angel/profile/models/myTeam';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { SearchFilterPipe } from 'src/app/_helpers/pipes/search-filter.pipe';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
  selector: 'app-my-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    CustomPipeModule
  ],
  templateUrl: './my-team.component.html',
  styleUrl: './my-team.component.scss'
})
export class MyTeamComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  myTeam : any[] = [];
  filterText : string = "";
  filteredItems: any[] = [];
  imageUrl: string;

  constructor(
    private profileService : ProfileService,
  ) {
    this.imageUrl = this.profileService.getImageUrl();
  }
  

  ngOnInit(): void {
    this.getMyTeam();
  }

  getMyTeam() {
    this.profileService.getMyTeam().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MyTeamModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      console.log("Takımım :", response);
      if (message.islemsonuc == 1) {
        this.myTeam = data;
      }

    });
  }

  filterTextChange() {
    const searchPipe = new SearchFilterPipe();
    this.filteredItems = this.myTeam.filter(item => {
      const searchFilter = searchPipe.transform([item], this.filterText, ['durum', 'ad', 'soyad', 'sicilno', 'mesaiaciklama', 'ggiris', 'gcikis']);
      return searchFilter.length > 0;
    });
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
