import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../../profile.service';

@Component({
  selector: 'app-uploaded-files',
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.scss']
})
export class UploadedFilesComponent implements OnInit {
  @Input() selectedDemand: any;
  @Input() displayUploadedFiles: boolean;
  @Input() selectedNavItem : any;
  @Output() onHideUploadedFilesEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectedDemandEvent: EventEmitter<any> = new EventEmitter<any>();
  
  private ngUnsubscribe = new Subject();
  
  uploadedFiles: any[] = [];
  fileTypes: any[] = [];
  base64Data: any;
  displayUploadedFile: boolean;
  currentUploadedFile: any;
  contentType: any;

  public isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  selectedFile: any;
  selectedContentType: any;

  constructor(
    private profileService : ProfileService,
    private sanitizer: DomSanitizer,
    private toastrService : ToastrService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.selectedDemand.atananlar[0].FMNeden ? this.getUploadedFiles(this.selectedDemand, 'fm') : this.getUploadedFiles(this.selectedDemand, 'izin'); 
    this.getUploadedFiles(this.selectedDemand);
    console.log("Selected Item : ", this.selectedDemand);    
  }

  getUploadedFiles(selectedDemand : any){
    this.uploadedFiles = [];
    this.profileService.getUploadedFiles(selectedDemand.Id, selectedDemand.talepad).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        this.uploadedFiles = data;
        console.log("Yüklenen Belgeler : ", data);
        
      }

      if (selectedDemand.talepad == 'fm') {
        this.getFileTypeForDemandType(selectedDemand.atananlar.length > 0 ? selectedDemand.atananlar[0].FMNeden : '0', selectedDemand.talepad);        
      } else if (selectedDemand.talepad == 'izin') {
        this.getFileTypeForDemandType(selectedDemand.atananlar.length > 0 ? selectedDemand.atananlar[0].Izintipi : '0', selectedDemand.talepad);         
      }
    });
  }

  getFileTypeForDemandType(typeId : any, kaynak : any) {
    this.fileTypes = [];
    this.profileService
    .getFileTypeForDemandType(typeId, kaynak)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      this.fileTypes = data;
      console.log("Tipi geldi", data);

      let file;
      this.fileTypes.forEach((item : any) => {
        file = this.uploadedFiles.filter((value : any) => {
          if (item.BelgeId == value.Tip) {
            item.uploadedFile = value;
          }
        });
      });

      this.isLoading.next(false);

      console.log("Dosya Eşitlendi", this.fileTypes);
      console.log("Dosya Atandı", file);

      this.ref.detectChanges();
    });
  }

  getFileForDemand(id : any, uzanti : any, contentType : any){
    this.base64Data = null;
    this.contentType = null;
    this.profileService
    .getFileForDemand(id, uzanti)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      console.log("Dosya geldi", data);
      
      this.selectedFile = data.base64Data;
      this.selectedContentType = contentType;
      
      this.base64Data = this.sanitizer.bypassSecurityTrustResourceUrl('data:'+ contentType +  ';base64,' + data.base64Data);
      
      console.log("Download Link : ", this.base64Data);
      
      const base64Data = data.base64Data;
      const blob = new Blob([atob(base64Data)], { type: contentType });

      const fileName = `${contentType}.${uzanti}`;
      this.contentType = fileName;
      let file : any = new File([blob], fileName, { type: contentType });
      console.log("File : ", file);

      this.ref.detectChanges();
    });
  }

  showUploadedFile(item : any, isItUpload : boolean) {
    this.displayUploadedFile = true;

    if (isItUpload) {
      this.currentUploadedFile = item;
    } else {
      this.getFileForDemand(item.uploadedFile.UniqueId, item.uploadedFile.DosyaTipi, item.uploadedFile.ContentType);
    }
     
  }


  getFile(event: any, item: any) {
    let files: FileList = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      if (!this.checkFileSize(file, 1024 * 1024)) {
        this.toastrService.error("Dosya Boyutu Yüksek", "Hata");
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
    // let fileSize: any = (file.size / 1024).toFixed(1);
    // let fileSizeType = 'KB';
    // if (fileSize >= 1024) {
    //   fileSize = (fileSize / 1024).toFixed(1);
    //   fileSizeType = 'MB';
    // }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(event.target?.result as string);
      item.files = {
        name : file.name,
        type : file.type,
        url : url,
        fileSize : file.size,
        // fileSizeType : fileSizeType  
      };

      console.log("Uploaded Fileee : ", item);
      this.ref.detectChanges();
    };    
  }

  onHidePreviewFile() {
    this.displayUploadedFile = false;
    this.currentUploadedFile = null;
    this.base64Data = null
  }
  
  postVacationFile(item : any, selectedDemand : any) {
    this.profileService.postFileForDemand(item.sendFile, selectedDemand.Id, selectedDemand.atananlar[0].FMNeden ? 'fm' : 'izin', item.BelgeId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        this.isLoading.next(true);
        console.log("İzin için dosya gönderildi : ", response);

        // selectedDemand.atananlar[0].FMNeden ? this.getUploadedFiles(selectedDemand, 'fm') : this.getUploadedFiles(selectedDemand, 'izin'); 
        this.getUploadedFiles(selectedDemand);  
        
        this.selectedDemand.bosBelgeSayisi--;
        this.selectedDemandEvent.emit(this.selectedNavItem);
      } else {
        this.toastrService.error("Bir Hata Oluştu : " + message.message, "Hata");
      }
      
      
      
      this.ref.detectChanges();
    });
  }

  deleteFileForDemand(item : any, selectedDemand : any){
    this.base64Data = null;
    
    this.profileService
    .deleteFileForDemand(item.uploadedFile.UniqueId, item.uploadedFile.DosyaTipi)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        this.isLoading.next(true);
        console.log("Dosya Silindi : ", message.message);

        // selectedDemand.atananlar[0].FMNeden ? this.getUploadedFiles(selectedDemand, 'fm') : this.getUploadedFiles(selectedDemand, 'izin'); 
        this.getUploadedFiles(selectedDemand);  
        this.selectedDemand.bosBelgeSayisi++;
      } else {
        this.toastrService.error("Dosya Silinemedi : " + message.message, "Hata");
      }
      
      this.ref.detectChanges();
    });
  }

  removeUploadedFile(item: any, file: any) {
    const index = item.files.indexOf(file);
    if (index !== -1) {
      item.files.splice(index, 1);
    }
  }

  public b64toBlob(b64Data : any, contentType : any) {
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

  downloadFile(item : any) {
    this.profileService
      .getFileForDemand(item.uploadedFile.UniqueId, item.uploadedFile.DosyaTipi)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        console.log("Base64 geldi", data);

        const blob = new Blob([atob(data.base64Data)], { type: item.uploadedFile.ContentType });
        const fileName = `${item.uploadedFile.ContentType}.${item.uploadedFile.DosyaTipi}`;
        let file: any = new File([blob], fileName, { type: item.uploadedFile.ContentType });
        console.log("File : ", file);

        var link = this.b64toBlob(data.base64Data, item.uploadedFile.ContentType);
        let a = document.createElement("a");
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

  onHideUploadedFiles() {
    this.onHideUploadedFilesEvent.emit();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
