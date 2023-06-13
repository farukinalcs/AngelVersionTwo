import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { AccessDataModel } from '../../models/accessData';
import { DemandProcessModel } from '../../models/demandProcess';
import { MyDemands } from '../../models/myDemands';
import { OKodFieldsModel } from '../../models/oKodFields';
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



  detailSearchForm : FormGroup; // Detay formu
  displayDetailSearch : boolean; // Detaylı arama dialog aç-kapat ayarı

  oKodFields : any[] = [];
  detayFormKaynak : any;
  fmNedenleri: OKodFieldsModel[] = [];
  izinTipleri: OKodFieldsModel[] = [];
  
  firma : any[] = [];
  bolum : any[] = [];
  pozisyon : any[] = [];
  gorev : any[] = [];
  yaka : any[] = [];
  altFirma : any[] = [];
  direktorluk : any[] = [];

  constructor(
    private profilService : ProfileService,
    private formBuilder : FormBuilder,
    private toastrService : ToastrService,
    private translateService : TranslateService,
    private ref : ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    this.createDetailSearchForm();
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
          this.translateService.instant("TOASTR_MESSAGE.TALEP_IPTAL_EDILDI"),
          this.translateService.instant("TOASTR_MESSAGE.BASARILI")
        );

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


  trackBy(index: number, item: any): number {
    return item.Id;
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
        if (key === 'firma' || key === 'bolum' || key === 'pozisyon' || key === 'gorev' || key === 'yaka' || key === 'direktorluk' || key === 'altfirma' || key === 'fsecimm' || key === 'ftip') {
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

    this.profilService.postMyDemandedDetailSearch(kaynak, detailSearchFormValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
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
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
