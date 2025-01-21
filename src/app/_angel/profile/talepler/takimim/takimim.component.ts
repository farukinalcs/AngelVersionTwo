import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { SearchFilterPipe } from 'src/app/_helpers/pipes/search-filter.pipe';
import { MyTeamModel } from '../../models/myTeam';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-takimim',
  templateUrl: './takimim.component.html',
  styleUrls: ['./takimim.component.scss']
})
export class TakimimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  myTeam : any[] = [];
  filterText : string = "";
  filteredItems: any[] = [];
  imageUrl: string;

  constructor(
    private profileService : ProfileService,
    private ref : ChangeDetectorRef
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

      this.ref.detectChanges();
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
