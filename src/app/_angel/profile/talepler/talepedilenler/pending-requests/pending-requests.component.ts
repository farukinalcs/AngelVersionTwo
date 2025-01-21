import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ProfileService } from '../../../profile.service';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss'],
})
export class PendingRequestsComponent implements OnInit, OnDestroy {
  @Input() pendingRequests: any;
  @Input() selectedNavItem: any;
  @Input() menuItems: any;
  @Output() getDemandsEvent = new EventEmitter<any>();
  @Output() showDetailSearchDialogEvent = new EventEmitter<any>();
  @Output() showDemandProcessDialogEvent = new EventEmitter<{
    demandId: any;
    demandTypeName: any;
  }>();
  @Output() showUploadedFilesEvent = new EventEmitter<any>();
  @Output() cancelMultipleDialogEvent = new EventEmitter<{
    item: any;
    tip: any;
  }>();

  private ngUnsubscribe = new Subject();

  allComplete: boolean = false;
  checkGrid: boolean = true;
  filterText: string = '';
  selectedItem: any;
  tip: any;
  checkedList: any[] = [];
  descriptionText: string;
  displayCancelDemand: boolean;
  @ViewChild('confirmAlert') confirmAlert: TemplateRef<any>; // Toplu onayda özet ekran dialog penceresinin açılması için
  @ViewChild('cancelAlert') cancelAlert: TemplateRef<any>; // Toplu reddetmek için özet ekran dialog pencersinin açılması için
  cancelAlertRef: any; // Dialog pencersini kapatmak için
  confirmAlertRef: any; // Dialog pencersini kapatmak için
  imageUrl: any;

  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.imageUrl = this.profileService.getImageUrl();
  }

  ngOnInit(): void {}

  getDemands(menuItemKey: any) {
    this.getDemandsEvent.emit(menuItemKey);
    this.allComplete = false;
  }

  showDetailSearchDialog() {
    this.showDetailSearchDialogEvent.emit(this.selectedNavItem);
  }

  showDemandProcessDialog(demandId: any, demandTypeName: any) {
    this.showDemandProcessDialogEvent.emit({ demandId, demandTypeName });
  }

  isCardOpen(item: any) {
    item.panelOpenState = true;
    console.log('Kard Açıldı : ');
  }

  confirmDialog(item: any, aktifMenu: any, isOnay: any) {
    Swal.fire({
      title: `Talebi ${isOnay == '+' ? 'Onaylamak' : 'Reddetmek'} İstediğinize Emin Misiniz?`,
      // text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: '#ed1b24',
      showCancelButton: true,
      confirmButtonColor: '#ed1b24',
      cancelButtonColor: '#ed1b24',
      cancelButtonText: 'Vazgeç',
      confirmButtonText: `Evet, ${isOnay == '+' ? 'Onayla' : 'Reddet'}!`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {

        isOnay == '+' ? this.confirmDemandSingle(item.Id, item.tipad, aktifMenu) : this.showCancelDemandDialog(item, 1);
        
        Swal.fire({
          title: `Talep ${isOnay == '+' ? 'Onaylandı' : 'Reddedildi'}!`,
          // text: "Your file has been deleted.",
          icon: 'success',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'İşlem Yapmaktan Vazgeçildi!',
          // text: "Your imaginary file is safe :)",
          icon: 'error',
          iconColor: '#ed1b24',
          confirmButtonColor: '#ed1b24',
          confirmButtonText: 'Kapat',
          allowOutsideClick: false,
          allowEscapeKey: false,
          heightAuto: false
        });
      }
    });
  }

  confirmDemandSingle(formid: any, kaynak: any, aktifMenu: any) {
    if (kaynak == 'Fazla Mesai') {
      kaynak = 'fm';
    } else if (kaynak == 'Yetki') {
      kaynak = 'sureliyetki';
    }


    this.profileService.confirmDemandSingle(formid, kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      console.log("Talep Onaylama :", response);

      if (data[0].sonuc == 1) {
        this.toastrService.success(
          this.translateService.instant("Talep_Onaylandı"),
          this.translateService.instant("Başarılı")
        );
        this.getDemandsEvent.emit(aktifMenu);
      }
    });
  }

  confirmDemandMultiple(aktifMenu: any) {
    if (this.checkedList.length > 0) {
      this.profileService
        .confirmDemandMultiple(this.checkedList)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response: any) => {
          console.log('Çoklu Onay :', response);
          this.getDemandsEvent.emit(aktifMenu);
          this.toastrService.success(
            this.translateService.instant('Talep_Onaylandı'),
            this.translateService.instant('Başarılı')
          );
          this.confirmAlertRef.close();

          this.allComplete = false;
          this.ref.detectChanges();
        });
    }
  }

  removeItemInCheckedList(removeItem: any, dialog: any) {
    this.checkedList = this.checkedList.filter(
      (item) => item.Id !== removeItem.Id
    );
    removeItem.completed = false;
    this.updateAllComplete();

    if (this.checkedList.length == 0) {
      dialog.close();
    }

    this.ref.detectChanges();
  }

  openDialog(tip: any) {
    this.checkedList = this.pendingRequests.filter((c: any) => {
      return c.completed == true;
    });
    console.log('SELECTED :', this.checkedList);

    if (this.checkedList.length > 0) {
      if (tip == '+') {
        this.confirmAlertRef = this.dialog.open(this.confirmAlert);
      } else if (tip == '-') {
        this.cancelAlertRef = this.dialog.open(this.cancelAlert);
      }
    } else {
      const audio = new Audio();
      audio.src = 'assets/media/sounds/notification.mp3';
      audio.load();
      audio.play();

      this.toastrService.error(
        this.translateService.instant('İşaretleme_Yapmalısınız'),
        this.translateService.instant('Hata')
      );
    }
  }

  getTooltipScript(item: any[]): string {
    const bosBelgeler = this.getBosBelgeler(item);
    const bosBelgeSayisi = bosBelgeler.length;
    const belgeAdlari = bosBelgeler
      .map((belge, index) => `${index + 1}) ${belge}`)
      .join('\r\n');

    return `Yüklenmesi Gereken ${bosBelgeSayisi} Adet Dosya Eksik.\r\n${belgeAdlari}`;
  }

  getBosBelgeler(item: any[]): string[] {
    return item
      .filter((belge) => belge.link === 'boş')
      .map((belge) => belge.BelgeAdi);
  }

  updateAllComplete() {
    this.allComplete =
      this.pendingRequests != null &&
      this.pendingRequests.every((t: any) => t.completed);

    console.log('AllComplete :', this.allComplete);
    console.log('updateAllComplete :', this.pendingRequests);
  }

  someComplete(): boolean {
    if (this.pendingRequests == null) {
      console.log('someComplete if :', this.pendingRequests);

      return false;
    }
    return (
      this.pendingRequests.filter((t: any) => t.completed).length > 0 &&
      !this.allComplete
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.pendingRequests == null) {
      console.log('setAll if :', this.pendingRequests);

      return;
    }
    this.pendingRequests.forEach((t: any) => (t.completed = completed));
    console.log('setAll else :', this.pendingRequests);
  }

  showCancelDemandDialog(item: any, tip: any) {
    this.cancelMultipleDialogEvent.emit({ item, tip });
  }

  showUploadedFiles(selectedDemand: any) {
    this.showUploadedFilesEvent.emit(selectedDemand);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
