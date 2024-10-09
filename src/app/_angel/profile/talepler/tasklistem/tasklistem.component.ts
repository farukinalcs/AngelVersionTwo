import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { MyTaskListModel } from '../../models/myTaskList';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-tasklistem',
  templateUrl: './tasklistem.component.html',
  styleUrls: ['./tasklistem.component.scss']
})
export class TasklistemComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  
  displayedColumns : string[] = ['ProjeAd', 'Aciklama', 'Baslangic', 'Bitis', 'Durum'];
  dataSource : MatTableDataSource<MyTaskListModel>;
  myTaskList : MyTaskListModel[] = [];

  filterText : string = "";
  constructor(
    private profileService : ProfileService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMyTaskList();
  }

  getMyTaskList() {
    this.profileService.getMyTaskList().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MyTaskListModel, ResponseDetailZ>[]) => {
      const data : MyTaskListModel[] = response[0].x;
      const apiMessage : ResponseDetailZ = response[0].z;

      this.myTaskList = data;
      this.dataSource = new MatTableDataSource(this.myTaskList);

      console.log("Task Listem :", response);
      
      
      this.ref.detectChanges();
    });
  }

  applyFilter(event : Event){
    const filterValue  = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
