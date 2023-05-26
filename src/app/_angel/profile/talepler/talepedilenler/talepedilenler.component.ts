import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { DemandedModel } from '../../models/demanded';
import { DemandProcessModel } from '../../models/demandProcess';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-talepedilenler',
  templateUrl: './talepedilenler.component.html',
  styleUrls: ['./talepedilenler.component.scss']
})
export class TalepedilenlerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  filterText : string = '';
  kaynak : string;

  panelOpenState = false;

  onayBeklenenFormlar : any[] = [];
  onaylananFormlar : any[] = [];
  reddedilenFormlar : any[] = [];  
  demandProcess : any[] = [];

  displayDemandProcess : boolean;
  
  selectedItems  : any[] = [];
  isChecked : any;
  checkboxText : any = 'Tümünü Seç';
  allComplete: boolean = false;

  constructor(
    private profilService : ProfileService,
    private toastrService : ToastrService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  getDemanded(kaynak : string) {

    this.profilService.getDemanded(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<DemandedModel, ResponseDetailZ>[]) => {
      this.kaynak = kaynak;

      let data = response[0].x;
      let message = response[0].z;

      console.log("Talep Edilenler :", data);

      this.onayBeklenenFormlar = [];
      this.reddedilenFormlar = [];
      this.onaylananFormlar = [];


      data.forEach((item : any) => {
        item.completed = false;
        if (item.sectim == 0) {
          this.onayBeklenenFormlar.push(item);

        } else if (item.sectim == 9){
          this.reddedilenFormlar.push(item);
          
        } else if (item.sectim == 1){
          this.onaylananFormlar.push(item);
          
        }
      })
      
      this.ref.detectChanges();
    });
  }

  updateAllComplete() {
    this.allComplete = this.onayBeklenenFormlar != null && this.onayBeklenenFormlar.every((t: any) => t.completed);
  
    console.log("AllComplete :", this.allComplete);    
    console.log("updateAllComplete :", this.onayBeklenenFormlar);    
  }

  someComplete(): boolean {
    if (this.onayBeklenenFormlar == null) {
      console.log("someComplete if :", this.onayBeklenenFormlar);    
      
      return false;
    }
    return this.onayBeklenenFormlar.filter((t: any) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.onayBeklenenFormlar == null) {
      console.log("setAll if :", this.onayBeklenenFormlar);    

      return;
    }
    this.onayBeklenenFormlar.forEach((t: any) => (t.completed = completed));
    console.log("setAll else :", this.onayBeklenenFormlar);    
  }

  postSelected(){
    let checkedList = this.onayBeklenenFormlar.filter((c : any) => {
      return c.completed == true;
    })
    console.log("SELECTED :", checkedList);
    
  }

  resetArr() {
    this.kaynak = '';
    this.allComplete = false;
    this.onayBeklenenFormlar = [];
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
