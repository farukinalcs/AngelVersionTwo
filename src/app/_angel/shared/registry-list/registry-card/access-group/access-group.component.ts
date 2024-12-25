import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-access-group',
  templateUrl: './access-group.component.html',
  styleUrls: ['./access-group.component.scss']
})
export class AccessGroupComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() selectedRegister: any;
  @Input() operationType: any;
  accessGroups: any[] = [];  // Ana tablonun verilerini tutacak dizi
  addedGroups: any[] = [];    // Eklenen (diğer) tabloyu tutacak dizi
  display: boolean = false;
  startDate: any = "";
  endDate: any = "";
  startTime: any = "";
  endTime: any = "";
  desc: any = "";
  selectedItem: any;
  groupDetail: any[] = [];
  detailDisplay: boolean = false;
  header: string;
  filterTextAdded: string = "";
  filterTextMain: string = "";
  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.operationType == 'i') {
      this.getAccessGroup();
      
    } else if (this.operationType == 'u') {
      this.getAccessGroupForRegister();
      this.getAddedGroupForRegister();      
    }
  }
  
  getAccessGroupForRegister() {
    var sp: any[] = [
      {mkodu: 'yek206', kaynak: 'yetki', id: '0', sid: this.selectedRegister.Id.toString()}
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geçiş Grupları :", data);

      this.accessGroups = data.map((item:any) => ({
        ...item,
        hasItem: false 
      }));
    });
  }

  getAddedGroupForRegister() {
    var sp: any[] = [
      {mkodu: 'yek206', kaynak: 'yetki', id: '1', sid: this.selectedRegister.Id.toString()}
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geçiş Grupları :", data);

      this.addedGroups = data.map((item:any) => ({
        ...item,
        hasItem: true 
      }));
    });
  }
  
  getAccessGroup() {
    var sp: any[] = [
      {mkodu: 'yek206', kaynak: 'yetki', id: '0', sid: '0'}
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geçiş Grupları :", data);

      this.accessGroups = data.map((item:any) => ({
        ...item,
        hasItem: false 
      }));
    });
  }

            
  // İşlem değişikliği fonksiyonu
  relationStateChange(item: any, process: string, isTemp: any) {
    if (process === 'i') {
      // Item'ı ekle (ana tablodan çıkar, eklenen tablodan göster)
      this.addItemToAddedGroups(item, isTemp);
    } else if (process === 'd') {
      // Item'ı çıkar (eklenen tablodan çıkar, ana tablodan göster)
      this.removeItemFromAddedGroups(item, isTemp);
    }
  }

  // Item'ı eklenmiş tabloya ekle
  addItemToAddedGroups(item: any, isTemp: any) {
    // Eğer eklenmek istenen item'in ID'si 0 veya 1 ise
    if (item.ID === 0 || item.ID === 1) {
      // addedGroups içindeki mevcut item'leri accessGroups'a taşı ve hasItem değerini false yap
      this.addedGroups.forEach((group) => {
        group.hasItem = false; // hasItem değerini false yap
        this.accessGroups.push(group);
      });
      // addedGroups'u temizle
      this.addedGroups = [];
    } else {
      // Eğer addedGroups içinde 0 veya 1 ID'sine sahip bir item varsa
      const existingSpecialItem = this.addedGroups.find(
        (group) => group.ID === 0 || group.ID === 1
      );
  
      if (existingSpecialItem) {
        // Mevcut olanı addedGroups'tan çıkar ve accessGroups'a taşı
        this.addedGroups = this.addedGroups.filter(
          (group) => group.ID !== existingSpecialItem.ID
        );
        existingSpecialItem.hasItem = false; // hasItem değerini false yap
        this.accessGroups.push(existingSpecialItem);
      }
    }
  
    // Yeni item'i addedGroups'a ekle
    this.accessGroups = this.accessGroups.filter((group) => group.ID !== item.ID);
    item.hasItem = true;
  
    if (isTemp) {
      item.isTemp = true;
      item.tempStartDate = this.startDate;
      item.tempEndDate = this.endDate;
      item.tempStartTime = this.startTime;
      item.tempEndTime = this.endTime;
      item.tempDesc = this.desc;
      this.close();
    }
  
    this.addedGroups.push(item);
  
    // Angular değişiklik algılaması için dizileri yeniden oluştur
    this.addedGroups = [...this.addedGroups];
    this.accessGroups = [...this.accessGroups];
  
    console.log("AddedGroup:", this.addedGroups);
    console.log("AccessGroups:", this.accessGroups);
  }
  
  
  

  // Item'ı eklenmiş tablodan çıkar
  removeItemFromAddedGroups(item: any, isTemp: any) {
    // Eklenen tablodan item'ı çıkar
    this.addedGroups = this.addedGroups.filter(group => group.ID !== item.ID);
    // Ana tablodan item'ı ekle
    item.hasItem = false;

    if (isTemp) {
      item.isTemp = false;
    }
    this.accessGroups.push(item);

    console.log("Main Group : ", this.accessGroups);
    
  }
  
  open(item: any) {
    this.display = true;
    this.selectedItem = item;
  }

  close() {
    this.display = false;
    this.startDate = "";
    this.endDate = "";
    this.startTime = "";
    this.endTime = "";
    this.desc = "";
  }

  getGroupDetail(item: any) {
    var sp: any[] = [
      {mkodu: 'yek207', id: item.ID.toString()}
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geçiş Grup Detay :", data);

      this.groupDetail = [...data];
      if (this.groupDetail.length > 0) {
        this.detailDisplay = true;
      } else {
        this.toastrService.warning(this.translateService.instant("Detay_Bulunamadı!"), this.translateService.instant("Uyarı"));
      }

      
    });
  }

  showDetail(item: any) {
    this.header = `${item.Ad} Detay`;
    this.getGroupDetail(item);
  }

  hideDetail() {
    this.detailDisplay = false;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
