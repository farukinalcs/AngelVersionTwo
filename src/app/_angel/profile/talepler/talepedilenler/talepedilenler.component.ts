import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { DemandProcessModel } from '../../models/demandProcess';
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
  @ViewChild('base64Iframe') base64Iframe: ElementRef | undefined;

  filterText : string = ''; // Arama yapmak için
  kaynak : string; // Nav Linklerden seçilen
  panelOpenState = false; // Cardlardan checkbox ayarı için
  onayBeklenenFormlar : any[] = []; // *ngFor ile döndürülen arr
  onaylananFormlar : any[] = []; // *ngFor ile döndürülen arr
  reddedilenFormlar : any[] = [];  // *ngFor ile döndürülen arr
  demandProcess : any[] = []; // *ngFor ile döndürülen arr (Süreç İçin)
  displayDemandProcess : boolean; // Süreç dialog aç-kapat ayarı
  allComplete: boolean = false; // Checkbox tümünü seç veya kaldır
  displayDetailSearch : boolean; // Detaylı arama dialog aç-kapat ayarı
  uniqeFotoImage : any;
  currentDate : any = new Date().toISOString().substring(0,10);
  checkedList: any[] = [];
  cancelAlertRef: any; // Dialog pencersini kapatmak için
  confirmAlertRef: any; // Dialog pencersini kapatmak için
  checkGrid : boolean = true; // Liste görünümüne geçiş yapmak için 

  menuItems = [
    { id: 'izinNavItem', key: 'izin', icon: 'fa-umbrella-beach', label: 'İzin' },
    { id: 'fazlamesaiNavItem', key: 'fazlamesai', icon: 'fa-business-time', label: 'Fazla_Mesai' },
    { id: 'yetkiNavItem', key: 'sureliyetki', icon: 'fa-door-open', label: 'Yetki' },
    { id: 'avansNavItem', key: 'avans', icon: 'fa-sack-dollar', label: 'Avans' },
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
  demandTypeNameForProcess: any;
  demandIdForProcess: any;



  displayCancelDemand: boolean;
  selectedItem: any;
  tip: any;
  descriptionText: string;
  
  constructor(
    private profilService : ProfileService,
    private toastrService : ToastrService,
    private translateService : TranslateService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
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
        if (key === 'firma' || key === 'bolum' || key === 'pozisyon' || key === 'gorev' || key === 'yaka' || key === 'direktorluk' || key === 'fsecimm' || key === 'ftip') {
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

    this.profilService.postDetailSearch(data.selectedNavItem, data.formValues).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
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

  getDemanded(kaynak : any) {
    this.profilService.getDemanded(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<any, ResponseDetailZ>[]) => {
      this.kaynak = kaynak;

      this.onayBeklenenFormlar = [];
      this.reddedilenFormlar = [];
      this.onaylananFormlar = [];
      
      let data = response[0].x;
      let message = response[0].z;

      if (message.islemsonuc != 1) {
        return;
      }

      console.log("Talep Edilenler :", data);

      let bosBelgeSayisi : any = 0;
      data.forEach((item : any) => {
        item.completed = false;

        if (item?.sectim == 0) {
          this.onayBeklenenFormlar.push(item);

        } else if (item?.sectim == 9){
          this.reddedilenFormlar.push(item);
          
        } else if (item?.sectim == 1){
          this.onaylananFormlar.push(item);
        }

        if (item.atananlar) {
          item.atananlar = JSON.parse(item?.atananlar);          

          item?.atananlar.forEach((belge : any) => {
            if (belge.link == 'boş') {
              bosBelgeSayisi++
            }
          });
  
          item.bosBelgeSayisi = bosBelgeSayisi;
          bosBelgeSayisi = 0;
        }
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

  resetArr() {
    this.kaynak = '';
    this.allComplete = false;
    this.onayBeklenenFormlar = [];
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
          this.translateService.instant("Gösterilecek_Süreç_Bulunamadı"),
          this.translateService.instant("Uyarı")
        );
      }

      this.ref.detectChanges();
    })
  }

  showDemandProcessDialog2(formId : any, formTip : any) { // Talepedilenler Onay Bekleyen Formlar İçin Ayrı Bir fonskiyon
    this.displayDemandProcess = true;
    // this.getDemandProcess(formId, formTip);
    this.demandIdForProcess = formId;
    this.demandTypeNameForProcess = formTip;
  }

  showDemandProcessDialog(data: {demandId : any, demandTypeName : any}) {
    this.displayDemandProcess = true;
    this.demandIdForProcess = data.demandId;
    this.demandTypeNameForProcess = data.demandTypeName;
  }

  showDetailSearchDialog(currentMenu : any) {
    this.displayDetailSearch = true;
    this.kaynak = currentMenu;
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

  onHideUploadedFiles() {
    this.displayUploadedFiles = false;
    this.selectedDemand = undefined;
  }

  setSelectedDemandEmptyFile(selectedNavItem: any) {
    this.getDemanded(selectedNavItem);
  }






  showCancelDemandDialog(data : {item: any, tip : any}) {
    // this.cancelAlertRef.close();
    if (data.tip == 2) {
      let checkedList = this.onayBeklenenFormlar.filter((c : any) => {
        return c.completed == true;
      });
      if (checkedList.length > 0) {
        this.cancelAlertRef.close();
        this.displayCancelDemand = true;
        this.selectedItem = data.item;
        this.tip = data.tip;    

      } else {
        this.toastrService.error(
          this.translateService.instant("İşaretleme_Yapmalısınız"),
          this.translateService.instant("Hata")
        );
      }
    } else {
      this.displayCancelDemand = true;
      this.selectedItem = data.item;
      this.tip = data.tip;
    }

    this.ref.detectChanges();
    
  }

  isSingleOrMultiple(aktifMenu: string, description: any) {
    if (this.tip == 1) {
      this.cancelDemandSingle(this.selectedItem.Id, this.selectedItem.tipad, description, aktifMenu);
    } else if (this.tip == 2) {
      this.cancelDemandMultiple(aktifMenu, description);
    }
  }

  cancelDemandMultiple(aktifMenu: any, description: string) {
    this.checkedList = this.onayBeklenenFormlar.filter((c: any) => {
      return c.completed == true;
    });
    console.log("SELECTED :", this.checkedList);


    if (this.checkedList.length > 0) {
      this.profilService.cancelMyDemandsMultiple(this.checkedList, description).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
        console.log("Çoklu İptal :", response);
        this.getDemanded(aktifMenu);
        this.toastrService.success(
          this.translateService.instant("Talep_İptal_Edildi"),
          this.translateService.instant("Başarılı")
        );


        this.allComplete = false;

        this.ref.detectChanges();
      });

      this.descriptionText = '';
      this.displayCancelDemand = false;
    }

  }

  cancelDemandSingle(formid: any, kaynak: any, aciklama: any, aktifMenu: any) {
    if (kaynak == 'İzin') {
      kaynak = 'izin';
    } else if (kaynak == 'Fazla Mesai') {
      kaynak = 'fm'
    } else if (kaynak == 'Yetki') {
      kaynak = 'sureliyetki'
    } else if (kaynak == 'Avans') {
      kaynak = 'avans'
    }

    this.profilService.cancelMyDemands(formid, kaynak, aciklama).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      if (response[0].x[0].islemsonuc) {
        this.getDemanded(kaynak);
        this.toastrService.success(
          this.translateService.instant("Talep_İptal_Edildi"),
          this.translateService.instant("Başarılı")
        );

      }
      console.log("Talep İptal :", response);


      this.ref.detectChanges();
    });


    this.descriptionText = '';
    this.displayCancelDemand = false;

  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
