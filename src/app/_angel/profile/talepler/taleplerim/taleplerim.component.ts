import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { DemandProcessModel } from '../../models/demandProcess';
import { MyDemands } from '../../models/myDemands';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-taleplerim',
  templateUrl: './taleplerim.component.html',
  styleUrls: ['./taleplerim.component.scss']
})
export class TaleplerimComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  myDemands : MyDemands[] = [];
  sureciDevamEdenFormSayisi : any = 0;
  filterText : string  = "";
  kaynak : string;
  checkedListLength : number;

  panelOpenState = false;

  sureciDevamEdenFormlar : any[] = [];
  onaylananFormlar : any[] = [];
  reddedilenFormlar : any[] = [];

  allComplete: boolean = false;

  displayPosition: boolean;
  position: string;
  displayDemandProcess : boolean;

  selectedItem : any;
  descriptionText : string;

  demandProcess : any[] = [];
  constructor(
    private profilService : ProfileService,
    private toastrService : ToastrService,
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


      this.myDemands.forEach((item : any) => {
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
    })
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

    var izinNavItem = document.getElementById('izinNavItem');
    var fazlamesaiNavItem = document.getElementById('fazlamesaiNavItem');
    var ziyaretciNavItem = document.getElementById('ziyaretciNavItem');
    var digerNavItem = document.getElementById('digerNavItem');

    izinNavItem?.classList.remove('active');
    fazlamesaiNavItem?.classList.remove('active');
    ziyaretciNavItem?.classList.remove('active');
    digerNavItem?.classList.remove('active');

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
    this.toastrService.success("Talep İptal Edildi", "BAŞARILI");

    this.profilService.cancelMyDemands(formid, kaynak, aciklama).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      if (response[0].x[0].islemsonuc) {
        this.getMyDemands(aktifMenu);
      }
      console.log("Talep İptal :", response);
      


      this.ref.detectChanges();
    });


    this.descriptionText = '';    
    this.displayPosition = false;

  }

  showPositionDialog(position: string, item : any) {
    this.position = position;
    this.displayPosition = true;

    this.selectedItem = item;
  }


  getDemandProcess(formId : any, formTip : any) {
    if (formTip == 'İzin') {
      formTip = 'izin';
    }else if (formTip == 'Fazla Mesai'){
      formTip = 'fazlamesai'
    }

    this.profilService.getDemandProcess(formId, formTip).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<DemandProcessModel, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;

      console.log("Talep Süreci : ", data);
      if (message.islemsonuc == 1) {
        this.demandProcess = data; 

      }else {
        this.toastrService.warning("UYARI!","Gösterilecek Süreç Bulunamadı")
      }



      this.ref.detectChanges();
    })
  }

  showDemandProcessDialog(formId : any, formTip : any) {
    this.displayDemandProcess = true;
    this.getDemandProcess(formId, formTip);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
