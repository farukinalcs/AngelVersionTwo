import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { LayoutService } from 'src/app/_metronic/layout';
import { AccessDataModel } from '../../models/accessData';
import { DemandedModel } from '../../models/demanded';
import { DemandProcessModel } from '../../models/demandProcess';
import { OKodFieldsModel } from '../../models/oKodFields';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-talepedilenler',
  templateUrl: './talepedilenler.component.html',
  styleUrls: ['./talepedilenler.component.scss']
})
export class TalepedilenlerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('confirmAlert') confirmAlert: TemplateRef<any>;
  @ViewChild('cancelAlert') cancelAlert: TemplateRef<any>;


  filterText : string = ''; // Arama yapmak için
  kaynak : string; // Nav Linklerden seçilen

  panelOpenState = false; // Cardlardan checkbox ayarı için

  onayBeklenenFormlar : any[] = []; // *ngFor ile döndürülen arr
  onaylananFormlar : any[] = []; // *ngFor ile döndürülen arr
  reddedilenFormlar : any[] = [];  // *ngFor ile döndürülen arr
  demandProcess : any[] = []; // *ngFor ile döndürülen arr (Süreç İçin)

  displayDemandProcess : boolean; // Süreç dialog aç-kapat ayarı

  displayCancelDemand: boolean; // İptal dislog aç-kapat ayarı
  descriptionText  : string; // İptal açıklama değeri
  selectedItem : any; // İptal işleminde seçilen item

  allComplete: boolean = false; // Checkbox tümünü seç veya kaldır

  tip: number; // İptal tekli mi çoklu mu kontrolü

  detailSearchForm : FormGroup; // Detay formu
  displayDetailSearch : boolean; // Detaylı arama dialog aç-kapat ayarı

  uniqeFotoImage : any;

  oKodFields : any[] = [];
  fmNedenleri: OKodFieldsModel[] = [];
  izinTipleri: OKodFieldsModel[] = [];

  firma : any[] = [];
  bolum : any[] = [];
  pozisyon : any[] = [];
  gorev : any[] = [];
  yaka : any[] = [];
  altFirma : any[] = [];
  direktorluk : any[] = [];

  currentDate : any = new Date().toISOString().substring(0,10);
  checkedList: any[] = [];
  cancelAlertRef: any;
  confirmAlertRef: any;
  constructor(
    private profilService : ProfileService,
    private toastrService : ToastrService,
    private formBuilder : FormBuilder,
    private translateService : TranslateService,
    private dialog : MatDialog,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createDetailSearchForm();
  }

  createDetailSearchForm() {
    this.detailSearchForm = this.formBuilder.group({
      ad: [""],
      soyad: [""],
      sicilno: [""],
      personelno: [""],
      firma: ["0"],
      bolum: ["0"],
      pozisyon: ["0"],
      gorev: ["0"],
      altfirma: ["0"],
      yaka: ["0"],
      direktorluk: ["0"],
      okod0: [""],
      okod1: [""],
      okod2: [""],
      okod3: [""],
      okod4: [""],
      okod5: [""],
      okod6: [""],
      tarih: [""],
      tarihbit: [""],
      ftip: [""]
    });
  }

  getFormValues(kaynak : any){
    let detailSearchFormValues = Object.assign({}, this.detailSearchForm.value);


    if (kaynak == 'izin') {
      detailSearchFormValues.fsecimm = '1'
    } else if(kaynak == 'fazlamesai'){
      detailSearchFormValues.fsecimm = '2'

    } else {
      detailSearchFormValues.ftip = '0'
      
    }
    console.log("Detay Form Değerleri  :", detailSearchFormValues);
    this.displayDetailSearch = false;

    for (let key in detailSearchFormValues) {
      if (detailSearchFormValues.hasOwnProperty(key) && detailSearchFormValues[key] === null) {
        if (key === 'firma' || key === 'bolum' || key === 'pozisyon' || key === 'gorev' || key === 'yaka' || key === 'direktorluk' || key === 'fsecimm' || key === 'ftip') {
          detailSearchFormValues[key] = '0';
        } else if(key === 'tarih' || key === 'tarihbit') {
          
          let tarih = new Date();
          tarih.setMonth(tarih.getMonth());
          let formattedDate=tarih.toISOString().slice(0,10);
          
          detailSearchFormValues[key] = formattedDate;

        } else {
          detailSearchFormValues[key] = '';
        }
      }
    }

    this.profilService.postDetailSearch(kaynak, detailSearchFormValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      console.log("Detay Filtreleme : ", data);

      // if (message.islemsonuc == 1) {
        this.onayBeklenenFormlar = [];
        this.reddedilenFormlar = [];
        this.onaylananFormlar = [];


        data.forEach((item: any) => {
          item.completed = false;
          if (item.sectim == 0) {
            this.onayBeklenenFormlar.push(item);

          } else if (item.sectim == 9) {
            this.reddedilenFormlar.push(item);

          } else if (item.sectim == 1) {
            this.onaylananFormlar.push(item);

          }
        });

      this.ref.detectChanges();
    });
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
      });

      this.uniqeFotoImage = this.getUniqeValue(this.onayBeklenenFormlar, 'fotoimage')
      
      this.ref.detectChanges();
    });
  }

  getUniqeValue(data: any[], key: string): any[] {
    const uniqueOptions = new Set();
    data.forEach(item => uniqueOptions.add(item));
    return Array.from(uniqueOptions);
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

  cancelDemandMultiple(aktifMenu : any, description : string){
    this.checkedList = this.onayBeklenenFormlar.filter((c : any) => {
      return c.completed == true;
    });
    console.log("SELECTED :", this.checkedList);


    // if (this.checkedList.length > 0) {
    //   this.profilService.cancelMyDemandsMultiple(this.checkedList, description).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
    //     console.log("Çoklu İptal :", response);
    //     this.getDemanded(aktifMenu);
    //     this.toastrService.success(
    //       this.translateService.instant("TOASTR_MESSAGE.TALEP_IPTAL_EDILDI"),
    //       this.translateService.instant("TOASTR_MESSAGE.BASARILI")
    //     );


    //     this.allComplete = false;

    //     this.ref.detectChanges();
    //   });  

    //   this.descriptionText = '';    
    //   this.displayCancelDemand = false;
    // }   
    
  }

  cancelDemandSingle(formid : any, kaynak : any, aciklama : any, aktifMenu : any) {
    if (kaynak == 'İzin') {
      kaynak = 'izin';
    }else if (kaynak == 'Fazla Mesai'){
      kaynak = 'fm'
    }

    // this.profilService.cancelMyDemands(formid, kaynak, aciklama).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
    //   if (response[0].x[0].islemsonuc) {
    //     this.getDemanded(aktifMenu);
    //     this.toastrService.success(
    //       this.translateService.instant("TOASTR_MESSAGE.TALEP_IPTAL_EDILDI"),
    //       this.translateService.instant("TOASTR_MESSAGE.BASARILI")
    //     );

    //   }
    //   console.log("Talep İptal :", response);


    //   this.ref.detectChanges();
    // });


    this.descriptionText = '';    
    this.displayCancelDemand = false;

  }

  resetArr() {
    this.kaynak = '';
    this.allComplete = false;
    this.onayBeklenenFormlar = [];
    this.onaylananFormlar = [];
    this.reddedilenFormlar = [];

    this.firma = [];
    this.bolum = [];
    this.pozisyon = [];
    this.gorev = [];
    this.yaka = [];
    this.altFirma = [];
    this.direktorluk = [];

    var izinNavItem1 = document.getElementById('izinNavItem1');
    var izinNavItem2 = document.getElementById('izinNavItem2');
    var izinNavItem3 = document.getElementById('izinNavItem3');

    var fazlamesaiNavItem1 = document.getElementById('fazlamesaiNavItem1');
    var fazlamesaiNavItem2 = document.getElementById('fazlamesaiNavItem2');
    var fazlamesaiNavItem3 = document.getElementById('fazlamesaiNavItem3');

    var ziyaretciNavItem1 = document.getElementById('ziyaretciNavItem1');
    var ziyaretciNavItem2 = document.getElementById('ziyaretciNavItem2');
    var ziyaretciNavItem3 = document.getElementById('ziyaretciNavItem3');

    var digerNavItem1 = document.getElementById('digerNavItem1');
    var digerNavItem2 = document.getElementById('digerNavItem2');
    var digerNavItem3 = document.getElementById('digerNavItem3');

    izinNavItem1?.classList.remove('active');
    izinNavItem2?.classList.remove('active');
    izinNavItem3?.classList.remove('active');

    fazlamesaiNavItem1?.classList.remove('active');
    fazlamesaiNavItem2?.classList.remove('active');
    fazlamesaiNavItem3?.classList.remove('active');

    ziyaretciNavItem1?.classList.remove('active');
    ziyaretciNavItem2?.classList.remove('active');
    ziyaretciNavItem3?.classList.remove('active');

    digerNavItem1?.classList.remove('active');
    digerNavItem2?.classList.remove('active');
    digerNavItem3?.classList.remove('active');

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
        this.toastrService.warning(
          this.translateService.instant("TOASTR_MESSAGE.SUREC_BULUNAMADI"),
          this.translateService.instant("TOASTR_MESSAGE.UYARI")
        );
      }

      this.ref.detectChanges();
    })
  }

  showDemandProcessDialog(formId : any, formTip : any) {
    this.displayDemandProcess = true;
    this.getDemandProcess(formId, formTip);
  }

  showCancelDemandDialog(item : any, tip : number) {
    this.cancelAlertRef.close();
    if (tip == 2) {
      let checkedList = this.onayBeklenenFormlar.filter((c : any) => {
        return c.completed == true;
      });
      if (checkedList.length > 0) {
        this.displayCancelDemand = true;
        this.selectedItem = item;
        this.tip = tip;    
      } else {
        this.toastrService.error(
          this.translateService.instant("TOASTR_MESSAGE.ISARETLEME_YAPMALISINIZ"),
          this.translateService.instant("TOASTR_MESSAGE.HATA")
        );
      }
    } else {
      this.displayCancelDemand = true;
      this.selectedItem = item;
      this.tip = tip;
    }
    
  }

  showDetailSearchDialog(currentMenu : string) {
    this.getAccessData();

    this.detailSearchForm.reset();
    this.getOKodField('Okod');
    this.displayDetailSearch = true;
    this.kaynak = currentMenu;
    
    if (currentMenu == 'izin') {
      this.getOKodField('cbo_izintipleri');
    } else if (currentMenu == 'fazlamesai') {
      this.getOKodField('cbo_fmnedenleri');

    } else if (currentMenu == 'tum') {
      
    }
  }

  isSingleOrMultiple(aktifMenu : string, description : any) {
    if (this.tip == 1) {
      this.cancelDemandSingle(this.selectedItem.Id, this.selectedItem.tipad, description, aktifMenu);
    } else if (this.tip == 2) {
      this.cancelDemandMultiple(aktifMenu, description);
    }
  }

  getOKodField(kaynak : string) {
    this.profilService.getOKodField(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {

        if (kaynak == 'Okod') {
          this.oKodFields = data;  
          
        } else if(kaynak == 'cbo_fmnedenleri') {
          this.fmNedenleri = data;
          
        } else {
          this.izinTipleri = data;

        }
        console.log("Okod Alanları : ", data);
      }

      this.ref.detectChanges();
    });
  }

  getAccessData() {
    this.profilService.getAccessData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<AccessDataModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      console.log("Access Data :", response);

      this.firma = [];
      this.bolum = [];
      this.pozisyon = [];
      this.gorev = [];
      this.yaka = [];
      this.altFirma = [];
      this.direktorluk = [];

      
      if (message.islemsonuc == 1) {
        data.forEach((item : AccessDataModel) => {
          if (item.tip == 'cbo_Firma') {
            this.firma.push(item);
          } else if(item.tip == 'cbo_Bolum') {
            this.bolum.push(item);

          } else if(item.tip == 'cbo_Pozisyon') {
            this.pozisyon.push(item);
            
          } else if(item.tip == 'cbo_Gorev') {
            this.gorev.push(item);
            
          } else if(item.tip == 'cbo_AltFirma') {
            this.altFirma.push(item);
            
          } else if(item.tip == 'cbo_Yaka') {
            this.yaka.push(item);
            
          } else if(item.tip == 'cbo_Direktorluk') {
            this.direktorluk.push(item);
            
          }
        })
      }
      
      this.ref.detectChanges();
    });
  }

  confirmDemandSingle(formid : any, kaynak : any, aktifMenu : any){
    if (kaynak == 'İzin') {
      kaynak = 'izin';
    }else if (kaynak == 'Fazla Mesai'){
      kaynak = 'fm'
    }

    this.profilService.confirmDemandSingle(formid, kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      const data = response[0].x;
      console.log("Talep Onaylama :", response);

      if (data[0].sonuc == 1) {
        this.toastrService.success(
          this.translateService.instant("TOASTR_MESSAGE.TALEP_ONAYLANDI"),
          this.translateService.instant("TOASTR_MESSAGE.BASARILI")
        );
        this.getDemanded(aktifMenu);
      }
    });
  }

  confirmDemandMultiple(aktifMenu : any){
    if (this.checkedList.length > 0) {
      // this.profilService.confirmDemandMultiple(this.checkedList).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
    //     console.log("Çoklu Onay :", response);
    //     this.getDemanded(aktifMenu);
    //     this.toastrService.success(
    //       this.translateService.instant("TOASTR_MESSAGE.TALEP_ONAYLANDI"),
    //       this.translateService.instant("TOASTR_MESSAGE.BASARILI")
    //     );
    // this.confirmAlertRef.close();

    //     this.allComplete = false;
    //     this.ref.detectChanges();
    //   });  
    }   
    
  }

  removeItemInCheckedList(removeItem : any) {
    this.checkedList = this.checkedList.filter(item => item.Id !== removeItem.Id);
    this.ref.detectChanges();
  }

  openDialog(tip : any) {
    this.checkedList = this.onayBeklenenFormlar.filter((c : any) => {
      return c.completed == true;
    });
    console.log("SELECTED :", this.checkedList);

    if (this.checkedList.length > 0) {
      if (tip == '+') {
        this.confirmAlertRef = this.dialog.open(this.confirmAlert);

      } else if (tip == '-') {
        this.cancelAlertRef = this.dialog.open(this.cancelAlert);
        
      }
    } else {
      this.toastrService.error(
        this.translateService.instant("TOASTR_MESSAGE.ISARETLEME_YAPMALISINIZ"),
        this.translateService.instant("TOASTR_MESSAGE.HATA")
      );
    }
  }


  isCardOpen() {
    this.panelOpenState = true
    console.log("Kard Açıldı : ");
    
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
