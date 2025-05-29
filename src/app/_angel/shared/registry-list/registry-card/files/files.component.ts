import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() selectedRegister: any;
  @Input() operationType: any;
  form: FormGroup;
  fileTypes: any[] = [];
  addedFiles: any[] = [];
  uploadedFile: any[] = [];
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>; // input[type="file"] elementine referans
  isFlipped = false;
  value: number = 5;
  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    public translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getFileType();
    this.getAddedFiles();
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  createForm() {
    this.form = this.fb.group({
      file: ['', Validators.required],
      fileType: ['', Validators.required],
    });
  }

  getFileType() {
    let sp: any[] = [{ mkodu: 'yek041', id: '0', kaynak: 'cbo_belgetipi' }];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Belge Tipleri Geldi :', data);
        this.fileTypes = data;
      });
  }

  getAddedFiles() {
    this.addedFiles = [];
    this.profileService
      .getUploadedFiles(this.selectedRegister.Id.toString(), 'sicil')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        this.addedFiles = data;
        console.log('Tipi geldi', data);

        this.addedFiles = this.addedFiles.map((file) => {
          const matchedType = this.fileTypes.find(
            (type) => type.ID == file.Tip
          );
          return {
            ...file,
            TipAd: matchedType ? matchedType.Ad : null, // Eşleşme yoksa tipad null olur
          };
        });

        console.log('Dosya Eşitlendi', this.addedFiles);
      });
  }

  showFile(item: any) {
    this.profileService
      .getFileForDemand(item.UniqueId, item.DosyaTipi, 'Sicil')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const base64Data = response[0].x; // Base64 string
        const contentType = item.ContentType; // Örn: 'application/pdf', 'image/png'

        console.log('Base64 Geldi :', base64Data);

        // Base64'ü Blob'a dönüştür
        const byteCharacters = atob(base64Data.base64Data);
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
      });
  }

  add(item?: any) {
    if (item) {
      if (item?.progressValue >= 100) {
        this.toastrService.warning(
          this.translateService.instant('Zaten_Yüklendi!'),
          this.translateService.instant('Hata')
        );
        return;
      }

      // Başlangıç değeri
      item.progressValue = 5;

      const maxValue = 100; // Maksimum değer

      const timer = setInterval(() => {
        const randomIncrease = Math.floor(Math.random() * 11) + 10; // 10-20 arasında rastgele artış
        item.progressValue = Math.min(
          item.progressValue + randomIncrease,
          maxValue
        ); // 100'ü geçmesin

        // Değişiklikleri algılamak için ChangeDetectorRef kullanımı
        this.ref.detectChanges();

        // Progress bar 100'e ulaştığında işlemi durdur
        if (item.progressValue >= maxValue) {
          clearInterval(timer);

          // İşlem tamamlandığında dosya gönderme
          this.profileService
            .postFileForDemand(
              item.sendFile,
              this.selectedRegister.Id.toString(),
              'Sicil',
              item.ID.toString()
            )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
              if (response[0].z.islemsonuc != 1) {
                this.toastrService.error(
                  this.translateService.instant(
                    'Belge_Yüklenirken_Bir_Hata_Oluştu!'
                  ),
                  this.translateService.instant('HATA')
                );
                return;
              }
              this.toastrService.success(
                this.translateService.instant('Belge_Yüklendi'),
                this.translateService.instant('Başarılı')
              );
              console.log('Dosya gönderildi : ', response);
              // item = { ...item, upload: true};
              item.upload = true;
              this.getAddedFiles();
            });
        }
      }, 200); // Her 200ms'de bir progress güncelle
    } else if (!item) {
      this.uploadedFile.forEach((element) => {
        // Başlangıç değeri
        element.progressValue = 5;

        const maxValue = 100; // Maksimum değer

        const timer = setInterval(() => {
          const randomIncrease = Math.floor(Math.random() * 11) + 10; // 10-20 arasında rastgele artış
          element.progressValue = Math.min(
            element.progressValue + randomIncrease,
            maxValue
          ); // 100'ü geçmesin

          // Değişiklikleri algılamak için ChangeDetectorRef kullanımı
          this.ref.detectChanges();

          // Progress bar 100'e ulaştığında işlemi durdur
          if (element.progressValue >= maxValue) {
            clearInterval(timer);

            // İşlem tamamlandığında dosya gönderme
            this.profileService
              .postFileForDemand(
                element.sendFile,
                this.selectedRegister.Id.toString(),
                'Sicil',
                element.ID.toString()
              )
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((response: any) => {
                if (response[0].z.islemsonuc != 1) {
                  this.toastrService.error(
                    this.translateService.instant(
                      'Belge_Yüklenirken_Bir_Hata_Oluştu!'
                    ),
                    this.translateService.instant('HATA')
                  );
                  return;
                }
                this.toastrService.success(
                  this.translateService.instant('Belge_Yüklendi'),
                  this.translateService.instant('Başarılı')
                );
                console.log('Dosya gönderildi : ', response);
                element = { ...element, upload: true};
                this.getAddedFiles();
                
              });
          }
        }, 200); // Her 200ms'de bir progress güncelle
      });
    }
  }

  remove(item: any) {
    this.profileService.deleteFileForDemand(item.UniqueId, item.DosyaTipi, 'sicil').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        this.toastrService.warning(
          this.translateService.instant('Belge_Kaldırılamadı!'),
          this.translateService.instant('HATA')
        );
        return;
      }

      console.log("Belge Silindi :", data);
      this.toastrService.success(
        this.translateService.instant('Belge_Kaldırıldı'),
        this.translateService.instant('Başarılı')
      );
      this.getAddedFiles();
    });
  }

  getFile(event: any) {
    // Dosya Yüklendiğinde İlk Çalışan Fonksiyon
    const valid = this.form.get('fileType')?.valid;
    if (!valid) {
      this.toastrService.error(
        this.translateService.instant('Belge_Tipi_Seçilmedi'),
        this.translateService.instant('Hata')
      );
      this.updateFileInput();
      return;
    }

    let item = this.form.get('fileType')?.value;
    let files: FileList = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      if (!this.checkFileSize(file, 1024 * 1024)) {
        this.toastrService.error(
          this.translateService.instant('Dosya_Boyutu_Yuksek'),
          this.translateService.instant('Hata')
        );
        this.updateFileInput();
        return;
      }
    }

    console.log(files);
    // item = { ...item, sendFile: files[0] };
    // item.sendFile = files[0];

    for (let file of event.target.files) {
      this.readAndPushFile(file, item);
    }
  }

  checkFileSize(file: File, maxSizeInBytes: number): boolean {
    // Dosya Boyutunu Kontrol Eden Fonksiyon
    const fileSizeInBytes = file.size;
    const maxSize = maxSizeInBytes;
    return fileSizeInBytes <= maxSize;
  }

  readAndPushFile(file: File, item: any) {
    // Yüklenen Dosyalar İçin Detay Bilgiler
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
      // item.files = {
      //   name : file.name,
      //   type : file.type,
      //   url : url,
      //   fileSize : fileSize,
      //   fileSizeType : fileSizeType
      // };
      let fileInfo = {
        name: file.name,
        type: file.type,
        url: url,
        fileSize: fileSize,
        fileSizeType: fileSizeType,
      };

      this.uploadedFile.push({ ...item, files: fileInfo, sendFile: file });
      // this.uploadedFile.push(item);
      console.log('Uploaded File : ', this.uploadedFile);
      console.log('Uploaded Fileee : ', item);
      this.ref.detectChanges();
    };
  }

  // removeUploadedFile(item: any, file: any) { // Yüklenmiş Dosyanın Kaldırlması İçin
  //   const index = item.files.indexOf(file);
  //   if (index !== -1) {
  //     item.files.splice(index, 1);
  //   }
  // }

  // Dosya kaldırıldığında
  removeUploadedFile(item: any) {
    if (item?.upload) {
      this.remove(item);
    }
    
    const index = this.uploadedFile.indexOf(item);
    if (index !== -1) {
      this.uploadedFile.splice(index, 1);
      console.log('Dosya Silindi: ', item.files.name);

      // Dosya input'u üzerine kalan dosyaları tekrar güncelleme
      this.updateFileInput();
    }
  }

  // Dosya input'unu, uploadedFile dizisindeki kalan dosyalarla eşleştireceğiz
  updateFileInput() {
    // Önce dosya input'unu sıfırlayalım
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = ''; // input'u sıfırlıyoruz
    }

    // Kalan dosyaları yeniden yükleme
    const fileList = this.createFileListFromUploadedFiles();

    // Dosya input'una yeni file listesi ekliyoruz
    if (this.fileInput && this.fileInput.nativeElement) {
      const inputElement = this.fileInput.nativeElement;
      for (let file of fileList) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputElement.files = dataTransfer.files;
      }
    }
  }

  // uploadedFile dizisinden DataTransfer ile file listesi oluşturma
  createFileListFromUploadedFiles() {
    let fileList: File[] = [];

    // uploadedFile dizisini dolaşıp, dosya bilgilerini alıyoruz
    for (let item of this.uploadedFile) {
      const file = new File([item.files], item.files.name, {
        type: item.files.type,
      });
      fileList.push(file);
    }

    return fileList;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
