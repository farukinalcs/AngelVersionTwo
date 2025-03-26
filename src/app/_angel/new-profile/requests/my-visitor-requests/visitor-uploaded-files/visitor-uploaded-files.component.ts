import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { SharedModule } from 'src/app/_angel/shared/shared.module';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
  selector: 'app-visitor-uploaded-files',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    FormsModule,
    TooltipModule,
    CustomPipeModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  templateUrl: './visitor-uploaded-files.component.html',
  styleUrl: './visitor-uploaded-files.component.scss'
})
export class VisitorUploadedFilesComponent implements OnInit, OnDestroy {
  @Input() selectedVisit: any;
  @Output() refreshVisit = new EventEmitter<string>();

  private ngUnsubscribe = new Subject();

  base64Data: any;
  contentType: any;
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  displayUploadedFile: boolean = false;
  selectedFile: any;
  selectedContentType: any;

  constructor(
    private profileService: ProfileService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {}

  getFileForDemand(id: any, uzanti: any, contentType: any) {
    this.base64Data = null;
    this.contentType = null;
    this.profileService
      .getFileForDemand(id, uzanti)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        console.log('Dosya geldi', data);

        this.selectedFile = data.base64Data;
        this.selectedContentType = contentType;

        // this.base64Data = this.sanitizer.bypassSecurityTrustResourceUrl(
        //   'data:' + contentType + ';base64,' + data.base64Data
        // );

        // console.log('Download Link : ', this.base64Data);

        // const base64Data = data.base64Data;
        // const blob = new Blob([atob(base64Data)], { type: contentType });

        // const fileName = `${contentType}.${uzanti}`;
        // this.contentType = fileName;
        // let file: any = new File([blob], fileName, { type: contentType });
        // console.log('File : ', file);




        // Base64'ü Blob'a dönüştür
        const byteCharacters = atob(data.base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });

        // Blob'dan bir URL oluştur
        const blobUrl = URL.createObjectURL(blob);

        // Yeni sekmede aç
        window.open(blobUrl);

        console.log('Dosya görüntüleniyor:', blobUrl);

        this.ref.detectChanges();
      });
  }

  onHideUploadedFile() {
    this.displayUploadedFile = false;
    // this.currentUploadedFile = null;
    this.base64Data = null;
  }

  downloadFile(item: any) {
    this.profileService
      .getFileForDemand(item.uploadedFile.UniqueId, item.uploadedFile.DosyaTipi)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        console.log('Base64 geldi', data);

        const blob = new Blob([atob(data.base64Data)], {
          type: item.uploadedFile.ContentType,
        });
        const fileName = `${item.uploadedFile.ContentType}.${item.uploadedFile.DosyaTipi}`;
        let file: any = new File([blob], fileName, {
          type: item.uploadedFile.ContentType,
        });
        console.log('File : ', file);

        var link = this.b64toBlob(
          data.base64Data,
          item.uploadedFile.ContentType
        );
        let a = document.createElement('a');
        document.body.appendChild(a);
        var url = window.URL.createObjectURL(link);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.ref.detectChanges();
      });
  }

  public b64toBlob(b64Data: any, contentType: any) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  deleteFileForDemand(item: any) {
    this.isLoading.next(true);

    this.base64Data = null;

    this.profileService
      .deleteFileForDemand(
        item.uploadedFile.UniqueId,
        item.uploadedFile.DosyaTipi,
        'ziyaretci'
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == 1) {
          this.isLoading.next(false);
          console.log('Dosya Silindi : ', message.message);

          this.refreshVisitFunc(item);
          // this.getMyVisitorDemanded();
          item.uploadedFile = null;
          // this.getUploadedFiles(item, 'ziyaretci');
        } else {
          this.toastrService.error(
            'Dosya Silinemedi : ' + message.message,
            'Hata'
          );
        }

        this.ref.detectChanges();
      });
  }

  getFile(event: any, item: any) {
    let files: FileList = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      if (!this.checkFileSize(file, 1024 * 1024)) {
        this.toastrService.error('Dosya Boyutu Yüksek', 'Hata');
        return;
      }
    }

    console.log(files);
    item.sendFile = files[0];

    for (let file of event.target.files) {
      this.readAndPushFile(file, item);
    }
  }

  // Dosya boyutunu kontrol eden yöntem
  checkFileSize(file: File, maxSizeInBytes: number): boolean {
    const fileSizeInBytes = file.size;
    const maxSize = maxSizeInBytes;
    return fileSizeInBytes <= maxSize;
  }

  readAndPushFile(file: File, item: any) {
    let fileSize: any = (file.size / 1024).toFixed(1);
    let fileSizeType = 'KB';
    if (fileSize >= 1024) {
      fileSize = (fileSize / 1024).toFixed(1);
      fileSizeType = 'MB';
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(
        event.target?.result as string
      );
      item.files = {
        name: file.name,
        type: file.type,
        url: url,
        fileSize: fileSize,
        fileSizeType: fileSizeType,
      };

      console.log('Uploaded Fileee : ', item);
      this.ref.detectChanges();
    };
  }

  postVacationFile(item: any) {
    this.isLoading.next(true);

    this.profileService
      .postFileForDemand(item.sendFile, item.ID, 'ziyaretci', item.Belgetip)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const message = response[0].z;

        if (message.islemsonuc == 1) {
          this.isLoading.next(false);
          console.log('Ziyaretçi için dosya gönderildi : ', response);

          this.refreshVisitFunc(item);
        } else {
          this.toastrService.error(
            'Bir Hata Oluştu : ' + message.message,
            'Hata'
          );
        }

        this.ref.detectChanges();
      });
  }

  showUploadedFile(item: any) {
    // this.displayUploadedFile = true;
    this.getFileForDemand(item.UniqueId, item.DosyaTipi, item.ContentType);
  }

  refreshVisitFunc(selectedVisit: any) {
    this.refreshVisit.emit(selectedVisit);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}