import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { MyVisitorDemandedModel } from 'src/app/_angel/profile/models/myVisitorDemanded';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { VisitorUploadedFilesComponent } from './visitor-uploaded-files/visitor-uploaded-files.component';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';

@Component({
  selector: 'app-my-visitor-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    TranslateModule,
    TooltipModule,
    VisitorUploadedFilesComponent,
    DataNotFoundComponent
  ],
  templateUrl: './my-visitor-requests.component.html',
  styleUrl: './my-visitor-requests.component.scss'
})
export class MyVisitorRequestsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  myVisitorDemanded: any[] = [];
  visits: any[] = [];
  selectedVisit: any;
  displayVisitors: boolean = false;
  uploadedFiles: any[] = [];
  base64Data: any;
  contentType: any;
  selectedFile: any;
  selectedContentType: any;
  displayUploadedFile: boolean = false;
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isTableVisible: boolean[] = [];

  constructor(
    private profileService: ProfileService,
    private ref: ChangeDetectorRef,
  ) {
    this.isTableVisible = new Array(this.visits.length).fill(false);
  }

  ngOnInit(): void {
    this.getMyVisitorDemanded();
  }

  toggleTable(index: number) {
    this.isTableVisible[index] = !this.isTableVisible[index];
  }

  getMyVisitorDemanded() {
    this.visits = [];
    this.profileService.getMyVisitorDemanded().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<MyVisitorDemandedModel, ResponseDetailZ>[]) => {
      const message = response[0].z;
      console.log("ziyaretçi taleplerim : ", response);

      if (message.islemsonuc == -1) {
        this.ref.detectChanges();
        return;
      }
      
      const ziyaretciMap = new Map<number, any>();

      response[0].x.forEach((item: any) => {
        item.atananlar = JSON.parse(item.atananlar);

        const existingVisitor = this.visits.find((visitor) => visitor.ziyaretid === item.ziyaretid);

        if (existingVisitor) {
          existingVisitor.ziyaretciler.push({
            Ad: item.Ad,
            Soyad: item.Soyad,
            Dosyalar: item.atananlar,
            id: item.Id
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
            };
            this.visits.push(newVisitor);
          }
          const newZiyaretci = {
            Ad: item.Ad,
            Soyad: item.Soyad,
            Dosyalar: item.atananlar,
            id: item.Id
          };
          this.visits.find((visitor) => visitor.ziyaretid === item.ziyaretid).ziyaretciler.push(newZiyaretci);
        }
      });

      console.log("Ziyaretçiler : ", this.visits);
      const data = response[0].x;
      

      this.myVisitorDemanded = data;

      this.visits.forEach((visit: any) => {
        visit.ziyaretciler.forEach((ziyaretci: any) => {
          ziyaretci.Dosyalar.forEach((dosya: any) => {
            if (dosya.link != 'boş') {
              this.getUploadedFiles(dosya, 'ziyaretci');
            }
          });
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

      this.visits.forEach((visit: any) => {
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

      console.log("Yüklenen Belgelerden Sonra visits: ", this.visits);

      this.isLoading.next(false);
      this.ref.detectChanges();
    });
  }

  refreshVisit(selectedVisit: any) {
    this.getMyVisitorDemanded();
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
      
      this.getMyVisitorDemanded();

      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
