import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/_metronic/layout';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-visitor-requests',
  templateUrl: './visitor-requests.component.html',
  styleUrls: ['./visitor-requests.component.scss']
})
export class VisitorRequestsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  ongoingVisitRequests: any[] = [];
  filterText: string = "";
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isTableVisible: boolean[] = [];
  selectedVisit: any;
  displayVisitors: boolean = false;
  uploadedFiles: any[] = [];

  allComplete: boolean = false;

  constructor(
    private profileService: ProfileService,
    public layoutService: LayoutService,
    private ref: ChangeDetectorRef
  ) {
    this.isTableVisible = new Array(this.ongoingVisitRequests.length).fill(false);

  }
  
  ngOnInit(): void {
    this.getVisitorRequest()
  }

  resetArr(value: any) {
    console.log("Reset: ", value);
    
    // this.ongoingVisitRequests = [];
    
  }

  toggleTable(index: number) {
    this.isTableVisible[index] = !this.isTableVisible[index];
  }

  getVisitorRequest() {
    this.ongoingVisitRequests = [];
    this.profileService.getMyVisitorDemanded().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const message = response[0].z;
      console.log("ziyaretçi taleplerim : ", response);

      if (message.islemsonuc == -1) {
        this.ref.detectChanges();
        return;
      }
      
      const ziyaretciMap = new Map<number, any>();

      response[0].x.forEach((item: any) => {
        item.atananlar = JSON.parse(item.atananlar);

        const existingVisitor = this.ongoingVisitRequests.find((visitor) => visitor.ziyaretid === item.ziyaretid);

        if (existingVisitor) {
          existingVisitor.ziyaretciler.push({
            Ad: item.Ad,
            Soyad: item.Soyad,
            Dosyalar: item.atananlar,
            id: item.Id,
            completed: false
          });
        } else {
          if (!ziyaretciMap.has(item.ziyaretid)) {
            ziyaretciMap.set(item.ziyaretid, true);
            const newVisitor = {
              giris: item.Giris,
              cikis: item.Cikis,
              aciklama: item.Bilgi,
              firma: item.Firma,
              talepSahibi: item.Sicilid1adsoyad,
              talepSahibiId: item.SicilId1,
              ziyaretid: item.ziyaretid,
              ziyaretNedeni: item.ZiyaretNedeni,
              ziyaretNedeniId: item.ZiyaretNedeniId,
              ziyaretciler: [],
              completed: false,
              allComplete: false
            };
            this.ongoingVisitRequests.push(newVisitor);
          }
          const newZiyaretci = {
            Ad: item.Ad,
            Soyad: item.Soyad,
            Dosyalar: item.atananlar,
            id: item.Id,
            completed: false
          };
          this.ongoingVisitRequests.find((visitor) => visitor.ziyaretid === item.ziyaretid).ziyaretciler.push(newZiyaretci);
        }
      });

      console.log("Ziyaretçiler : ", this.ongoingVisitRequests);

      this.ongoingVisitRequests.forEach((visit: any) => {
        visit.ziyaretciler.forEach((ziyaretci: any) => {
          
          let numberOfEmptyFile = 0;

          ziyaretci.Dosyalar.forEach((dosya: any) => {
            if (dosya.link != 'boş') {
              this.getUploadedFiles(dosya, 'ziyaretci');
            } else {
              numberOfEmptyFile++;
            }
          });

          ziyaretci.numberOfEmptyFile = numberOfEmptyFile;

        });
      });

      this.ref.detectChanges();
    });
  }

  showVisitorFiles(item: any) {
    this.selectedVisit = item;
    this.displayVisitors = true;
    this.isLoading.next(false);
    console.log("Ziyaretçiler :", this.selectedVisit);
  }

  getUploadedFiles(file: any, kaynak: any) {
    this.uploadedFiles = [];
    this.profileService.getUploadedFiles(file.ID, kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        this.isLoading.next(false);
        this.ref.detectChanges();
        return;
      }

      this.uploadedFiles = data;
      console.log("Yüklenen Belgeler : ", data);

      this.ongoingVisitRequests.forEach((visit: any) => {
        visit.ziyaretciler.forEach((ziyaretci: any) => {
          ziyaretci.Dosyalar.forEach((dosya: any) => {
            this.uploadedFiles.forEach((uploadedFile: any) => {
              if (dosya.ID == uploadedFile.FormId && dosya.Belgetip == uploadedFile.Tip) {
                dosya.uploadedFile = uploadedFile;
              }

              if (this.selectedVisit) {
                this.selectedVisit.Dosyalar.forEach((sDosya: any) => {
                  if (sDosya.ID == uploadedFile.FormId && sDosya.Belgetip == uploadedFile.Tip) {
                    sDosya.uploadedFile = uploadedFile;
                    sDosya.files = undefined;
                    sDosya.sendFile = undefined;
                  }
                });
              }
            });
          });
        });
      });

      console.log("Yüklenen Belgelerden Sonra ongoingVisitRequests: ", this.ongoingVisitRequests);

      this.isLoading.next(false);
      this.ref.detectChanges();
    });
  }

  refreshVisit(selectedVisit: any) {
    this.getVisitorRequest();
    console.log("Child Comp. Geldi : ", selectedVisit);
  }

  removeVisit(removedVisit : any) {
    console.log("Removed Visit : ", removedVisit);
    
    this.profileService.removeVisit(removedVisit.ziyaretid, '').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      const data = response[0].x;
      const message = response[0].z;

      console.log("Ziyaret Talebim Kaldırıldı : ", data);
      
      if (message == -1) {
        return;
      }
      
      this.getVisitorRequest();

      this.ref.detectChanges();
    });
  }

  updateAllComplete(item: any) {
    item.allComplete = item != null && item.ziyaretciler.every((t:any) => t.completed);
  }

  someComplete(item: any): boolean {
    if (item == null) {
      return false;
    }
    return item.ziyaretciler.filter((t:any) => t.completed).length > 0 && !item.allComplete;
  }

  setAll(completed: boolean, item: any) {
    item.allComplete = completed;
    if (this.ongoingVisitRequests == null) {
      return;
    }
    
    item.ziyaretciler.forEach((t:any) => (t.completed = completed));
  }

  approvedVisit() {
    this.ongoingVisitRequests.forEach((visit: any) => {
      if (visit.allComplete) {
        console.log("Onaylanacak Ziyaret: ", visit);  

      } else {
        let t = visit.ziyaretciler.filter((visitor: any) => visitor.completed)
        visit.approved = t;
        console.log("Onaylanan Ziyaretçiler: ", visit);
      }
    });
  }

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
