import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ColGroupDef, IRowNode, IsRowSelectable, SideBarDef, StatusPanelDef } from 'ag-grid-enterprise';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { AttendanceService } from '../attendance.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance-registry-list',
  templateUrl: './attendance-registry-list.component.html',
  styleUrls: ['./attendance-registry-list.component.scss']
})
export class AttendanceRegistryListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();


  loading: boolean = false;
  tabList = [
    { name: this.translateService.instant('Aktifler'), type: '1' },
    { name: this.translateService.instant('İşten_Çıkanlar'), type: '2' },
    { name: this.translateService.instant('Yasaklılar'), type: '3' },
    { name: this.translateService.instant('Program_Kullanıcıları'), type: '4' },
    { name: this.translateService.instant('Hepsi'), type: '0' },
  ];
  selectedTab: any;
  clear: boolean = false;
  displayRegistryCard: boolean = false;
  requestTime: any;
  refreshEvent: boolean = false;
  displayAssignPeriod: boolean = false;
  periods: any[] = [];
  selectedPeriod: any;
  periodStartDate: any;
  displayOvertimeForm: boolean = false;
  selectedRegistry: any[] = [];
  displayVacationForm: boolean = false;
  filterEvent: boolean = false;
  bulkChangeEvent: boolean = false;
  loadingProgress: number = 0;
  completedRequests: number = 0;
  totalRequests: number = 0;
  imageUrl: string = "";
  incorrectAssign: any[] = [];
  successfulAssign: any[] = [];
  private abortController = new AbortController(); // Fetch isteğin iptal edilmesi için bir sinyal tanımladım
  bulkAssignLoading: boolean = false;
  bulkAssignComplete: boolean = false;
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private attendanceService: AttendanceService,
    private toastrService: ToastrService

  ) {
    this.selectedTab = this.tabList[0];
    this.imageUrl = this.profileService.getImageUrl();
  }

  ngOnInit(): void {
  }

  changeTabMenu(menu: any) {
    this.selectedTab = menu;
  }

  loadingEvent(event: any) {
    console.log("Event Geldi : ", event);
    this.loading = event;
    this.ref.detectChanges();
  }

  clearFilters() {
    this.clear = !this.clear;
  }

  showRegistryCard() {
    this.displayRegistryCard = true;
  }

  closeRegistryCard(event: any) {
    this.displayRegistryCard = event;
  }

  getRequestTime(event: any) {
    this.requestTime = event;
  }

  refreshList() {
    this.refreshEvent = !this.refreshEvent;
  }

  getSelectedRows() {
    this.attendanceService.getSelectedItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      console.log("Sicil Listesinde Siciller Geldi : ", items);

      if (items.length == 0) {
        this.toastrService.warning(
          this.translateService.instant("Sicil_Veya_Siciller_Seçiniz"),
          this.translateService.instant("Uyarı")
        )
        this.closeAssignPeriod();
        return;
      }

      this.selectedRegistry = [...items];
    });

  }

  openAssignPeriod() {
    this.displayAssignPeriod = true;
    this.getSelectedRows();
    this.getPeriods();
  }

  closeAssignPeriod() {
    if (this.bulkAssignComplete) {
      this.successfulAssign = [];
      this.incorrectAssign = [];
      this.completedRequests = 0;
      this.loadingProgress = 0;
      this.selectedPeriod = "";
      this.periodStartDate = "";
    }
    this.displayAssignPeriod = false;
  }

  checkAssignPeriodRequest() {
    Swal.fire({
      title: `Seçili kişilere periyot ataması yapılsın mı?`,
      icon: 'warning',
      iconColor: '#ed1b24',
      showCancelButton: true,
      showDenyButton: false,
      denyButtonText: 'İptal',
      denyButtonColor: '#ed1b24',
      confirmButtonColor: '#ed1b24',
      cancelButtonColor: '#ed1b24',
      cancelButtonText: 'Hayır',
      confirmButtonText: `Evet`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendAssignPeriodRequest();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire({
          title: 'İşlem Yapmaktan Vazgeçildi!',
          icon: 'error',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false
        });
      } else if (result.isDenied) {
      }
    });
  }
  
  sendAssignPeriodRequest() {
    // Toplam istek sayısını belirle
    this.totalRequests = this.selectedRegistry.length;
    this.completedRequests = 0;
    this.loadingProgress = 0;

    this.bulkAssignPeriod();
  }

  assignPeriod(registry: any) {
    var sp: any[] = [
      {
        mkodu: 'yek251',
        Tarih: this.periodStartDate,
        PeriyodID: this.selectedPeriod.ID.toString(),
        SicilID: registry.Id.toString(),
        baslangicgunu: '1'
      }
    ];

    console.log("Periyot Ata Param: ", sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.periods = [...data];
      console.log("Mesai Periyodu Atandı :", data);

      // Tamamlanan istek sayısını artır
      this.completedRequests++;

      // Yüzde hesapla
      this.loadingProgress = Math.round((this.completedRequests / this.totalRequests) * 100);

      console.log(`Yükleme Durumu: ${this.loadingProgress}%`);
    });
  }

  bulkAssignPeriod() {
    this.bulkAssignLoading = true;
    this.ref.detectChanges();
    var sp: any[] = [];

    this.selectedRegistry.forEach((registry: any) => {
      sp.push(
        {
          mkodu: 'yek251',
          Tarih: this.periodStartDate,
          PeriyodID: this.selectedPeriod.ID.toString(),
          SicilID: registry.Id.toString(),
          baslangicgunu: '1'
        }
      );
    });

    const self = this;
    this.profileService.processMultiPost(sp, this.abortController.signal)
      .then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        return reader?.read().then(function processText({ done, value }): any {
          if (done) {
            console.log("İşlem tamamlandı.");
            self.bulkAssignComplete = true;
            self.toastrService.info(
              self.translateService.instant("Periyot_Atama_İşlemi_Tamamlandı"),
              ""
            );
            return;
          }
          self.bulkAssignLoading = false;

          let text = decoder.decode(value, { stream: true });
          console.log("Gelen veri (Stream):", text);

          if (text.startsWith('[') && text.endsWith(']')) {
            console.log("Yanıt Boş Geldi :", text);
            return;
          }

          if (text.startsWith('[')) {
            text = text.replace('[', '');
          }

          if (text.startsWith(',') && !text.endsWith(']')) {
            text = text.replace(',', '');
          }

          if (text.startsWith(',') && text.endsWith(']')) {
            text = text.replace(',', '');
            const lastIndex = text.lastIndexOf("]");

            if (lastIndex !== -1) {
              const newText = text.substring(0, lastIndex) + text.substring(lastIndex + 1);

              text = newText;
            }
          }

          // Tamamlanan istek sayısını artır
          self.completedRequests++;
          // Yüzde hesapla
          self.loadingProgress = Math.round((self.completedRequests / self.totalRequests) * 100);

          self.updateSelectedRegistry(text);

          const formattedText = JSON.parse(text);
          console.log("Formatted Text :", formattedText);
          self.ref.detectChanges();
          return reader?.read().then(processText);
        });
      })
      .catch(error => {
        // Eğer hata "AbortError" ise log olarak basma
        if (error.name === 'AbortError') {
          console.log("API isteği iptal edildi, hata gösterilmiyor.");
          return;
        }
        console.error("Hata oluştu:", error);
      });
  }

  updateSelectedRegistry(text: any): void {
    text = JSON.parse(text);
    text.x = JSON.parse(text.x);
    text.z = JSON.parse(text.z);



    console.log("Son Test :", text);

    this.selectedRegistry.forEach((register: any) => {
      const message = text.z.islemsonuc;

      if (message == 1) {
        if (register.Id == text.x[0].sicilid) {
          const requestState = text.z.islemsonuc == -1 ? false : true;
          register = { ...register, requestState };
          console.log("registry : ", register);

          requestState ? this.successfulAssign.unshift(register) : this.incorrectAssign.unshift(register);

          this.ref.detectChanges();
        }
      } else if (message == -1) {
        if (register.Id == text.z.sicilid) {
          const requestState = text.z.islemsonuc == -1 ? false : true;
          register = { ...register, requestState };
          console.log("registry : ", register);

          requestState ? this.successfulAssign.unshift(register) : this.incorrectAssign.unshift(register);

          console.log("Hatalı Periyot atama :", this.successfulAssign.concat(this.incorrectAssign));


          this.ref.detectChanges();
        }
      }


    });
  }

  getPeriods() {
    var sp: any[] = [
      { mkodu: 'yek041', kaynak: 'cbo_mesaiperiyodlari', id: '0' }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.periods = [...data];
      console.log("Mesai Periyotları Geldi :", data);

    });
  }

  openOvertimeForm() {
    this.displayOvertimeForm = true;
  }

  onHideOvertimeForm() {
    this.displayOvertimeForm = false;
  }

  openVacationForm() {
    this.displayVacationForm = true;
  }

  onHideVacationForm() {
    this.displayVacationForm = false;
  }

  onFilter() {
    this.filterEvent = !this.filterEvent;
  }

  onClickBulkChange() {
    this.bulkChangeEvent = !this.bulkChangeEvent;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    this.attendanceService.setSelectedItems([]);
    this.abortController.abort();
  }
}
