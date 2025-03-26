import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MyTaskListModel } from 'src/app/_angel/profile/models/myTaskList';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
  selector: 'app-my-task-list',
  standalone: true,
  imports: [],
  templateUrl: './my-task-list.component.html',
  styleUrl: './my-task-list.component.scss'
})
export class MyTaskListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  
  displayedColumns : string[] = ['ProjeAd', 'Aciklama', 'Baslangic', 'Bitis', 'Durum'];
  myTaskList : MyTaskListModel[] = [];

  filterText : string = "";
  constructor(
    private profileService : ProfileService,
  ) { }

  ngOnInit(): void {
    this.getMyTaskList();
  }

  getMyTaskList() {
    this.profileService.getMyTaskList().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MyTaskListModel, ResponseDetailZ>[]) => {
      const data : MyTaskListModel[] = response[0].x;
      const apiMessage : ResponseDetailZ = response[0].z;

      this.myTaskList = data;

      console.log("Task Listem :", response);
      
    });
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
