import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { MyDemands } from 'src/app/_angel/profile/models/myDemands';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ApprovedRequestsComponent } from './approved-requests/approved-requests.component';
import { OngoingRequestsComponent } from './ongoing-requests/ongoing-requests.component';
import { DeniedRequestsComponent } from './denied-requests/denied-requests.component';
import { SharedModule } from 'src/app/_angel/shared/shared.module';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatTabsModule,
    DialogModule,
    ApprovedRequestsComponent,
    OngoingRequestsComponent,
    DeniedRequestsComponent,
    SharedModule
  ],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  myDemands : MyDemands[] = [];
  sureciDevamEdenFormSayisi : any = 0;
  kaynak : string;

  sureciDevamEdenFormlar : any[] = [];
  onaylananFormlar : any[] = [];
  reddedilenFormlar : any[] = [];

  allComplete: boolean = false;

  displayPosition: boolean;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';
  displayDemandProcess : boolean;

  selectedItem : any;
  descriptionText : string;

  displayDetailSearch : boolean; // Detaylı arama dialog aç-kapat ayarı
  checkGrid : boolean = true;
  menuItems = [
    { id: 'izinNavItem1', key: 'izin', icon: 'fa-umbrella-beach', label: 'İzin' },
    { id: 'fazlamesaiNavItem1', key: 'fazlamesai', icon: 'fa-business-time', label: 'Fazla_Mesai' },
    { id: 'yetkiNavItem', key: 'sureliyetki', icon: 'fa-door-open', label: 'Yetki' },
    { id: 'avansNavItem', key: 'avans', icon: 'fa-sack-dollar', label: 'Avans' },
    // { id: 'envanterNavItem1', key: 'envanter', icon: 'fa-screwdriver-wrench', label: 'Malzeme' },
    // { id: 'digerNavItem1', key: 'tum', icon: 'fa-circle-question', label: 'Tümü' }
  ];

  demandTypeNameForProcess: any;
  demandIdForProcess: any;

  constructor(
    private profilService : ProfileService,
    private toastrService : ToastrService,
    private translateService : TranslateService,
    private ref : ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
  }

  getMyDemands(kaynak : string) {
    this.kaynak = kaynak;
    console.log("KAYNAK :", kaynak);
    
    this.profilService.getMyDemands(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<MyDemands, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      const responseToken = response[0].y;
      

      console.log("Taleplerim : ", data);
      this.myDemands = data;
      this.sureciDevamEdenFormlar = [];
      this.reddedilenFormlar = [];
      this.onaylananFormlar = [];


      this.myDemands?.forEach((item : any) => {
        item.completed = false;
        if (item.durum == 0) {
          this.sureciDevamEdenFormlar.push(item);
          this.sureciDevamEdenFormSayisi = this.sureciDevamEdenFormlar.length;

        } else if (item.durum == -1){
          this.reddedilenFormlar.push(item);
          
        } else if (item.durum == 1){
          this.onaylananFormlar.push(item);
          
        }
      })
      
      this.ref.detectChanges();
    });
  }

  updateAllComplete(item : any) {
    this.allComplete = item != null && item.completed;
  
    console.log("AllComplete :", this.allComplete);    
    console.log("updateAllComplete :", item);    
  }

  someComplete(arr : any[]): boolean {
    if (arr == null) {
      console.log("someComplete if :", arr);    
      
      return false;
    }
    return arr.filter((t: any) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean, arr: any[]) {
    this.allComplete = completed;
    if (arr == null) {
      console.log("setAll if :", arr);    

      return;
    }
    arr.forEach((t: any) => (t.completed = completed));
    console.log("setAll else :", arr);    
  }

  resetArr() {
    this.kaynak = '';
    this.sureciDevamEdenFormlar = [];
    this.sureciDevamEdenFormSayisi = 0;
    this.onaylananFormlar = [];
    this.reddedilenFormlar = [];
  
    const classList = ['active'];
  
    for (const menuItem of this.menuItems) {
      const bekleyenNavItem = document.getElementById('bekleyen-' + menuItem.id);
      const onaylananNavItem = document.getElementById('onaylanan-' + menuItem.id);
      const reddedilenNavItem = document.getElementById('reddedilen-' + menuItem.id);
  
      if (bekleyenNavItem) {
        bekleyenNavItem.classList.remove(...classList);
      }
      if (onaylananNavItem) {
        onaylananNavItem.classList.remove(...classList);
      }
      if (reddedilenNavItem) {
        reddedilenNavItem.classList.remove(...classList);
      }
    }
  }

  postSelected(aktifMenu : any) {
    let checkedList = this.sureciDevamEdenFormlar.filter((c : any) => {
      return c.completed == true;
    });

    console.log("Checked List :", checkedList);


    if (checkedList.length > 0) {
      this.profilService.cancelMyDemandsMultiple(checkedList, '').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
        console.log("Çoklu İptal :", response);
        this.getMyDemands(aktifMenu);
        
        this.ref.detectChanges();
      });  

      this.displayPosition = false;
    }    
  }

  cancelMyDemands(formid : any, kaynak : any, aciklama : any, aktifMenu : any) {
    if (kaynak == 'İzin') {
      kaynak = 'izin';
    }else if (kaynak == 'Fazla Mesai'){
      kaynak = 'fm'
    }
    
    

    this.profilService.cancelMyDemands(formid, kaynak, aciklama).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      if (response[0].x[0].islemsonuc) {
        this.toastrService.success(
          this.translateService.instant("Talep_İptal_Edildi"),
          this.translateService.instant("Başarılı")
        );

        this.getMyDemands(aktifMenu);
      }
      console.log("Talep İptal :", response);

      this.ref.detectChanges();
    });


    this.descriptionText = '';    
    this.displayPosition = false;

  }

  showPositionDialog(data : {position: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright', demand : any}) {
    this.position = data.position;
    this.displayPosition = true;

    this.selectedItem = data.demand;
  }

  showDemandProcessDialog(data: {demandId : any, demandTypeName : any}) {
    this.displayDemandProcess = true;
    this.demandIdForProcess = data.demandId;
    this.demandTypeNameForProcess = data.demandTypeName;
  }

  getFormValues(data: {selectedNavItem: any, formValues: any}){
    // let detailSearchFormValues = Object.assign({}, this.detailSearchForm.value);


    if (data.selectedNavItem == 'izin') {
      data.formValues.fsecimm = '1'
    } else if(data.selectedNavItem == 'fazlamesai'){
      data.formValues.fsecimm = '2'

    } else {
      data.formValues.ftip = '0'
      
    }
    console.log("Detay Form Değerleri  :", data.formValues);
    this.displayDetailSearch = false;

    for (let key in data.formValues) {
      if (data.formValues.hasOwnProperty(key) && data.formValues[key] === null) {
        if (key === 'firma' || key === 'bolum' || key === 'pozisyon' || key === 'gorev' || key === 'yaka' || key === 'direktorluk' || key === 'altfirma' || key === 'fsecimm' || key === 'ftip') {
          data.formValues[key] = '0';
        } else if(key === 'tarih' || key === 'tarihbit') {
          
          let tarih = new Date();
          tarih.setMonth(tarih.getMonth());
          let formattedDate=tarih.toISOString().slice(0,10);
          
          data.formValues[key] = formattedDate;

        } else {
          data.formValues[key] = '';
        }
      }
    }

    this.profilService.postMyDemandedDetailSearch(data.selectedNavItem, data.formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      console.log("Detay Filtreleme : ", data);

      // if (message.islemsonuc == 1) {
        this.sureciDevamEdenFormlar = [];
        this.reddedilenFormlar = [];
        this.onaylananFormlar = [];


        data.forEach((item: any) => {
          item.completed = false;
          if (item.sectim == 0) {
            this.sureciDevamEdenFormlar.push(item);

          } else if (item.sectim == 9) {
            this.reddedilenFormlar.push(item);

          } else if (item.sectim == 1) {
            this.onaylananFormlar.push(item);

          }
        });
      // }

      this.ref.detectChanges();
    });
  }

  showDetailSearchDialog(currentMenu : string) {
    this.displayDetailSearch = true;
    this.kaynak = currentMenu;
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

