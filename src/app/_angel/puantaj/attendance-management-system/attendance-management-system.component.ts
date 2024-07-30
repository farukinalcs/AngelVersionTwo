import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { AttendanceService } from 'src/app/_angel/puantaj/attendance.service';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-attendance-management-system',
  templateUrl: './attendance-management-system.component.html',
  styleUrls: ['./attendance-management-system.component.scss']
})
export class AttendanceManagementSystemComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
	
  tabList: any[] = [
    { name: 'Mesailer', type: '0' },
    { name: 'İzinler', type: '1' },
    { name: 'Geçişler', type: '2' },
    { name: 'FM Sıra', type: '3' },
  ];
  selectedTab = '0';
  selectedItems: any[];
	filterText: string = '';
  workShifts: OKodFieldsModel[];
	
  constructor(
    private puantajService: AttendanceService,
    private profileService: ProfileService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSelectedRows();
    this.getWorkShifts();
  }

  getSelectedRows() {
    this.puantajService.selectedItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      this.selectedItems = items;
      console.log('Puantaj Service :', this.selectedItems);
    });
  }
	
  changeTabMenu(menu: any) {
    this.selectedTab = menu;
  }

	getTooltipScript(): string {
    const personsLength = this.selectedItems.length;
    const personsName = this.selectedItems.map((person, index) => `${index + 1}) ${person.ad} ${person.soyad}`).join("\r\n");
    let firstPerson: string = '';
    
    if (personsLength == 1) {
      firstPerson = `${this.selectedItems[0].ad} ${this.selectedItems[0].soyad} Seçildi`;      
    } else if (personsLength == 2) {
      firstPerson = `${this.selectedItems[0].ad} ${this.selectedItems[0].soyad} ve ${this.selectedItems[1].ad} ${this.selectedItems[1].soyad} Seçildi`;      
    } else if (personsLength > 2) {
      firstPerson = `${this.selectedItems[0].ad} ${this.selectedItems[0].soyad}, ${this.selectedItems[1].ad} ${this.selectedItems[1].soyad} ve ${personsLength - 2} Kişi Daha Seçildi`;      
    }
    
    return firstPerson;
  }

  getWorkShifts() {
    this.profileService.getTypeValues('mesailer').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
  
      if (message.islemsonuc == 1) {
        this.workShifts = data;
        console.log("Mesailer : ", data);
      }
  
      this.ref.detectChanges();
    });
  }
  

	ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
