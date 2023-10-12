import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
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
  styleUrls: ['./talepedilenler.component.scss'],
  animations: [
    trigger("fileUploaded", [
      state("uploaded", style({ transform: "translateY(0)" })),
      transition(":enter", [
        style({ transform: 'translateY(-50%)' }),
        animate("500ms")
      ]),
      transition(':leave', [
        animate(200, style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class TalepedilenlerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('confirmAlert') confirmAlert: TemplateRef<any>; // Toplu onayda özet ekran dialog penceresinin açılması için
  @ViewChild('cancelAlert') cancelAlert: TemplateRef<any>; // Toplu reddetmek için özet ekran dialog pencersinin açılması için
  @ViewChild('base64Iframe') base64Iframe: ElementRef | undefined;


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
  cancelAlertRef: any; // Dialog pencersini kapatmak için
  confirmAlertRef: any; // Dialog pencersini kapatmak için
  checkGrid : boolean = true; // Liste görünümüne geçiş yapmak için 

  menuItems = [
    { id: 'izinNavItem', key: 'izin', icon: 'fa-umbrella-beach', label: 'DEMANDED.SUB_MENU.IZIN' },
    { id: 'fazlamesaiNavItem', key: 'fazlamesai', icon: 'fa-business-time', label: 'DEMANDED.SUB_MENU.FAZLA_MESAI' },
    { id: 'ziyaretciNavItem', key: 'ziyaretci', icon: 'fa-people-group', label: 'DEMANDED.SUB_MENU.ZIYARETCI' },
    { id: 'envanterNavItem', key: 'envanter', icon: 'fa-screwdriver-wrench', label: 'DEMANDED.SUB_MENU.MALZEME' },
    { id: 'tumuNavItem', key: 'tum', icon: 'fa-circle-question', label: 'DEMANDED.SUB_MENU.TUMU' }
  ];
  fileTypes: any[];
  uploadedFiles: any[];
  displayUploadedFiles : boolean = false;
  displayUploadedFile: boolean;
  currentUploadedFile: any;
  path: any;
  base64Data: any;
  selectedFormId: any;



  selectedDemand: any;
  
  constructor(
    private profilService : ProfileService,
    private toastrService : ToastrService,
    private formBuilder : FormBuilder,
    private translateService : TranslateService,
    private dialog : MatDialog,
    public layoutService : LayoutService,
    private sanitizer: DomSanitizer,
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

      let bosBelgeSayisi : any = 0;
      data.forEach((item : any) => {
        item.completed = false;
        item.atananlar = JSON.parse(item.atananlar);
        if (item.sectim == 0) {
          this.onayBeklenenFormlar.push(item);

        } else if (item.sectim == 9){
          this.reddedilenFormlar.push(item);
          
        } else if (item.sectim == 1){
          this.onaylananFormlar.push(item);
        }

        item.atananlar.forEach((belge : any) => {
          if (belge.link == 'boş') {
            bosBelgeSayisi++
          }
        })

        item.bosBelgeSayisi = bosBelgeSayisi;
        bosBelgeSayisi = 0;
      });
      

      this.uniqeFotoImage = this.getUniqeValue(this.onayBeklenenFormlar, 'fotoimage')
      console.log("Talep Edilenler YENİİ:", data);
      
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


    if (this.checkedList.length > 0) {
      this.profilService.cancelMyDemandsMultiple(this.checkedList, description).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
        console.log("Çoklu İptal :", response);
        this.getDemanded(aktifMenu);
        this.toastrService.success(
          this.translateService.instant("TOASTR_MESSAGE.TALEP_IPTAL_EDILDI"),
          this.translateService.instant("TOASTR_MESSAGE.BASARILI")
        );


        this.allComplete = false;

        this.ref.detectChanges();
      });  

      this.descriptionText = '';    
      this.displayCancelDemand = false;
    }   
    
  }

  cancelDemandSingle(formid : any, kaynak : any, aciklama : any, aktifMenu : any) {
    if (kaynak == 'İzin') {
      kaynak = 'izin';
    }else if (kaynak == 'Fazla Mesai'){
      kaynak = 'fm'
    }

    this.profilService.cancelMyDemands(formid, kaynak, aciklama).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      if (response[0].x[0].islemsonuc) {
        this.getDemanded(aktifMenu);
        this.toastrService.success(
          this.translateService.instant("TOASTR_MESSAGE.TALEP_IPTAL_EDILDI"),
          this.translateService.instant("TOASTR_MESSAGE.BASARILI")
        );

      }
      console.log("Talep İptal :", response);


      this.ref.detectChanges();
    });


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
    // this.cancelAlertRef.close();
    if (tip == 2) {
      let checkedList = this.onayBeklenenFormlar.filter((c : any) => {
        return c.completed == true;
      });
      if (checkedList.length > 0) {
        this.cancelAlertRef.close();
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

    this.ref.detectChanges();
    
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

  confirmDemandMultiple(aktifMenu: any) {
    if (this.checkedList.length > 0) {
      this.profilService.confirmDemandMultiple(this.checkedList).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
        console.log("Çoklu Onay :", response);
        this.getDemanded(aktifMenu);
        this.toastrService.success(
          this.translateService.instant("TOASTR_MESSAGE.TALEP_ONAYLANDI"),
          this.translateService.instant("TOASTR_MESSAGE.BASARILI")
        );
        this.confirmAlertRef.close();

        this.allComplete = false;
        this.ref.detectChanges();
      });
    }
  }

  removeItemInCheckedList(removeItem : any, dialog : any) {
    this.checkedList = this.checkedList.filter(item => item.Id !== removeItem.Id);
    removeItem.completed = false;
    this.updateAllComplete();

    if (this.checkedList.length == 0) {
      dialog.close();
    }
    
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

  isCardOpen(item : any) {
    item.panelOpenState = true;
    // this.panelOpenState = true
    console.log("Kard Açıldı : ");
    
  }

  showUploadedFiles(selectedDemand: any) {
    this.displayUploadedFiles = true;
    this.selectedDemand = selectedDemand;
  }

  OnHideUploadedFiles() {
    this.displayUploadedFiles = false;
    this.selectedDemand = undefined;
  }

  // getTooltopScript(item: any){
  //   console.log("bos belge sayisi : ", item);
  //   return `Yüklenmesi Gereken ${item.bosBelgeSayisi} Adet Dosya Eksik.\r\n\. `;
  // }

  // getTooltopScript(item: any[]): string {
  //   const bosBelgeler = this.getBosBelgeler(item);
  //   const bosBelgeSayisi = bosBelgeler.length;
  //   const belgeAdlari = bosBelgeler.join(", ");
    
  //   return `Yüklenmesi Gereken ${bosBelgeSayisi} Adet Dosya Eksik. (${belgeAdlari})`;
  // }

  getTooltopScript(item: any[]): string {
    const bosBelgeler = this.getBosBelgeler(item);
    const bosBelgeSayisi = bosBelgeler.length;
    const belgeAdlari = bosBelgeler.map((belge, index) => `${index + 1}) ${belge}`).join("\r\n");
    
    return `Yüklenmesi Gereken ${bosBelgeSayisi} Adet Dosya Eksik.\r\n${belgeAdlari}`;
  }
  
  getBosBelgeler(item: any[]): string[] {
    return item.filter(belge => belge.link === "boş").map(belge => belge.BelgeAdi);
  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
