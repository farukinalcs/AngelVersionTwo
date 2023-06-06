import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { MyVisitorDemandedModel } from '../../models/myVisitorDemanded';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-ziyaretcitaleplerim',
  templateUrl: './ziyaretcitaleplerim.component.html',
  styleUrls: ['./ziyaretcitaleplerim.component.scss']
})
export class ZiyaretcitaleplerimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject;

  displayedColumns : string[] = ['adSoyad', 'firma', 'girisTarih', 'cikisTarih', 'ziyaretNedeni', 'durum'];
  dataSource : MatTableDataSource<any>;
  myVisitorDemanded : any[] = [];
  
  constructor(
    private profileService : ProfileService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMyVisitorDemanded();
  }

  getMyVisitorDemanded() {
    this.profileService.getMyVisitorDemanded().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MyVisitorDemandedModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      console.log("ziyaretçi taleplerim : ", response);

        this.myVisitorDemanded = data;
        this.dataSource = new MatTableDataSource(this.myVisitorDemanded);

      
      this.ref.detectChanges();
    });
  }

  cancelMyVisitor(item : any){
    console.log("Ziyaretçi iptal :", item);
    

  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
