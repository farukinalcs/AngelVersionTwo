import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/_metronic/layout';
import { ProfileService } from '../../../profile.service';

@Component({
  selector: 'app-uploaded-files',
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.scss']
})
export class UploadedFilesComponent implements OnInit {
  @Input() selectedDemand: any;
  
  private ngUnsubscribe = new Subject();
  
  uploadedFiles: any[] = [];
  fileTypes: any[] = [];
  base64Data: any;
  displayUploadedFile: boolean;
  currentUploadedFile: any;

  constructor(
    private profileService : ProfileService,
    private sanitizer: DomSanitizer,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getUploadedFiles(this.selectedDemand, 'izin');
  }

  getUploadedFiles(selectedDemand : any, kaynak : any){
    this.uploadedFiles = [];
    this.profileService.getUploadedFiles(selectedDemand.Id, kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {
        this.uploadedFiles = data;
        console.log("Yüklenen Belgeler : ", data);
        
      }
      this.getFileTypeForDemandType(selectedDemand.atananlar.length > 0 ? selectedDemand.atananlar[0].Izintipi : '0', 'izin');  
      
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
          if (item.ID == value.Tip) {
            item.uploadedFile = value;
          }
        });
      });

      console.log("Dosya Eşitlendi", this.fileTypes);
      console.log("Dosya Atandı", file);

      this.ref.detectChanges();
    });
  }

  getFileForDemand(id : any, uzanti : any, contentType : any){
    this.base64Data = null;
    this.profileService
    .getFileForDemand(id, uzanti)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      console.log("Dosya geldi", data);
      
      this.base64Data = this.sanitizer.bypassSecurityTrustResourceUrl('data:'+ contentType +  ';base64,' + data.base64Data);

      const base64Data = data.base64Data;
      const blob = new Blob([atob(base64Data)], { type: contentType });

      const fileName = `${contentType}.${uzanti}`;
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
    let files: FileList = event.target.files[0];
    console.log(files);
    item.sendFile = files;

    for (let file of event.target.files) {
      this.readAndPushFile(file, item);
    }
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
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(event.target?.result as string);
      item.files = {
        name : file.name,
        type : file.type,
        url : url,
        fileSize : fileSize,
        fileSizeType : fileSizeType  
      };

      console.log("Uploaded Fileee : ", item);
      this.ref.detectChanges();
    };    
  }

  onHideUploadedFile() {
    this.displayUploadedFile = false;
    this.currentUploadedFile = null;
    this.base64Data = null
  }
  
  postVacationFile(item : any, selectedDemand : any, kaynak : any) {
    this.profileService.postFileForDemand(item.sendFile, selectedDemand.Id, kaynak, item.ID)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      
      console.log("İzin için dosya gönderildi : ", response);
      this.getUploadedFiles(selectedDemand, 'izin');
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
      console.log("Dosya Silindi : ", data);
      
      this.getUploadedFiles(selectedDemand, 'izin');
      this.ref.detectChanges();
    });
  }

  removeUploadedFile(item: any, file: any) {
    const index = item.files.indexOf(file);
    if (index !== -1) {
      item.files.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
