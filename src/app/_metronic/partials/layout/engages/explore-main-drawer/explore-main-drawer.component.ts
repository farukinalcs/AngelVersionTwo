import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AttendanceService } from 'src/app/_angel/attendance/attendance.service';

@Component({
  selector: 'app-explore-main-drawer',
  templateUrl: './explore-main-drawer.component.html',
})
export class ExploreMainDrawerComponent implements OnInit, OnDestroy {
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
	
  constructor(private puantajService: AttendanceService) {}

  ngOnInit(): void {
    this.getSelectedRows();
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
    
    // return `${personsLength} Tane Personel Seçildi.\r\n${personsName}`;
    return firstPerson;
  }

	ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
