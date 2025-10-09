import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PatrolService } from '../patrol.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-security-tours',
  templateUrl: './security-tours.component.html',
  styleUrls: ['./security-tours.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class SecurityToursComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();


  selectedTour: any = null;
  selectTourId: number = 0;
  selectStationId: number = 0;

  selectTypeId:number;

  targetList: any[] = [];
  allStation: any[] = [];
  filteredStations: any[] = [];
  filteredTours: any[] = [];
  filteredTargets: any[] = [];
  tourList: any[] = [];
  tourType: any[] = [];

  tourNameInput: string = '';
  stationNameInput: string = '';
  targetNameInput: string = "";
  updateTourName:string = "";
  zorunlu:string = '0';
  _updateTourModal:boolean = false;
  _deleteTourModal: boolean = false;
  _addTourModal:boolean = false;
 
  constructor(
    private patrol: PatrolService,
    private ref: ChangeDetectorRef,
    private toastrService: ToastrService
  ) { }


  ngOnInit(): void {
    this.getGuardTour();
    this.getGuardStation();
    this.type_tour();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }

  setGuardTourModal(): void {
    this._addTourModal = true
   
  }

  setGuardTour(){
    if (this.tourNameInput != '') {
      this.patrol.setGuardTour(this.tourNameInput,this.selectTypeId,this.zorunlu).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        const responsee = response[0].x;
        console.log("setGuardTour:", responsee);
        this.getGuardTour();
      });
    } else {
      this.toastrService.error(
        "Tur Adı Boş Geçilemez"
      );
    }
    this._addTourModal = false;
  }

  deleteGuardTourModal(tour: any): void {
    this.selectedTour = tour;
    this.selectTourId = tour.id;
    this._deleteTourModal = true;
  }

  deleteGouardTour() {
    this.patrol.deleteGuardTour(this.selectTourId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const responsee = response[0].x;
      console.log("deleteGuardTour:", responsee);
      this.getGuardTour();
    });
    this._deleteTourModal = false;
  }

  getGuardTour(): void {
    this.patrol.getGuardTour(0).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.tourList = response[0].x;
      this.filteredTours = [...this.tourList];
      console.log("getGuardTour:", this.filteredTours);
      this.tourNameInput = "";
      
    });
    this.ref.detectChanges();
  }

  getGuardStation(): void {
    this.patrol.getGuardStation('-1').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.allStation = response[0].x;
      this.filteredStations = [...this.allStation];

      this.ref.detectChanges();
    });

  }

  getGuardStationForTour(turid: string) {
    /* Tur a ait olan istasyonlar   */
    this.patrol.getGuardStation(turid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.targetList = response[0].x;
      this.filteredTargets = [...this.targetList];
      this.ref.detectChanges();

    });

  }

  getItem(tour: any) {
    this.selectedTour = tour;
    this.selectTourId = tour.id;
    this.getGuardStationForTour(tour.id);
  }

  addTourStation(station: any) {
    if (this.selectTourId != 0) {
      const exists = this.targetList.some(item => item.id === station.id);
      if (!exists) {
        this.patrol.relation_i(station.id, this.selectTourId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          this.targetList = response[0].x;
          this.filteredTargets = [...this.targetList];
          this.ref.detectChanges();

        })
      }
      else {
        this.toastrService.error(
          "Bu istasyon daha önce eklendi"
        );
      }
    } else {
      this.toastrService.error(
        "İstasyon eklemek istediğiniz turu seçin"
      );

    }
  }

  deleteTourStation(item: any) {
    const id = item.id;
    const hedefid = item.hedefid;

    if (id !== undefined) {

      this.patrol.relation_d(id, hedefid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.targetList = response[0].x;
        this.filteredTargets = [...this.targetList];

        this.ref.detectChanges();
      })
      this.getGuardStationForTour(hedefid);
    } else {
      const kaynakid = item.kaynakid;
      const hedefid = item.hedefid;

      this.patrol.relation_d(kaynakid, hedefid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.targetList = response[0].x;
        this.filteredTargets = [...this.targetList];

        this.ref.detectChanges();
      })
      this.getGuardStationForTour(hedefid);
    }
  }

  updateTourModal(item:any){
    console.log("updateTourName",item);
    if (item?.id != null) {
      this.selectTourId = item?.id;
      this.updateTourName = item?.ad;
      this._updateTourModal = true;
      this.zorunlu = item.zorlama;
      this.selectTypeId = item?.tip;
    } else {
      console.error("updateData.id undefined veya null!", item);
    }
  }

  updateTour(){

    this.patrol.upGuardTour(this.updateTourName, this.selectTourId,this.selectTypeId,this.zorunlu).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.tourList = response[0].x;
      this.filteredTours = [...this.tourList];
      console.log("upGuardTour",this.filteredTours);
      this.ref.detectChanges();
    })
    this.getGuardTour();
    this.filterTours();
    this._updateTourModal = false;
  }

  filterTours() {
    const query = this.tourNameInput.toLowerCase();
    this.filteredTours = this.tourList.filter(item =>
      item.ad?.toLowerCase().includes(query)
    );
  }

  filterStation() {
    const query = this.stationNameInput.toLowerCase();
    this.filteredStations = this.allStation.filter(item =>
      item.kaynakad?.toLowerCase().includes(query)
    );
  }

  filterTargets() {
    const query = this.targetNameInput.toLowerCase();
    this.filteredTargets = this.targetList.filter(item =>
      item.kaynakad?.toLowerCase().includes(query)
    );
  }

  type_tour(){
    
    this.patrol.tip23_ss().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.tourType = response[0].x;
      
      console.log("this.tourType",this.tourType);
      this.ref.detectChanges();
    })

  }

  zorunluCheckbox(event: any) {
    const checked = (event.target as HTMLInputElement).checked;
    this.zorunlu = checked ? "1" : "0";
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

