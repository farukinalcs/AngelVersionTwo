import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-add-visitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    SelectModule,
    ReactiveFormsModule,
    TranslateModule,
    ProgressBarModule
  ],
  templateUrl: './add-visitor.component.html',
  styleUrl: './add-visitor.component.scss'
})
export class AddVisitorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() visible: boolean; 
  @Output() hideEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();
  form: FormGroup;
  cards: any[] = [];
  registries: any[] = [];
  idTypes: any[] = [];
  visitTypes: any[] = [];
  companies: any[] = [];
  visitCodes: any[] = [];
  infoMessage: string = '';
  infoMessageStatus: boolean;
  passGroup: boolean = false;
  passGroups: any[] = [];
  visibleBanned: boolean = false;
  bannedList: any[] = [];
  visibleUpload: boolean = false;
  uploadedFile: any[] = [];
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>; // input[type="file"] elementine referans
  addedFiles: any[] = [];
  selectedVisitCode: any;
  
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    public translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }
  
  ngOnInit(): void {
    this.createForm();
    this.getRequirementControl()
    this.getRegistries();
    this.getVisitorCards();
    this.getIDTypes();
    this.getVisitTypes();
    this.getCompanies();
    this.changeVisitType();
    this.changeCredential();
  }

  onHide() {
    this.hideEvent.emit();
  }
  
  createForm() {
    this.form = this.formBuilder.group({
      idType: ['', Validators.required],
      credential: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      explanation: [''],
      company: ['', Validators.required],
      visitType: ['', Validators.required],
      oshTrainingDate: [''],
      confidentialityDate: [''],
      registry: ['', Validators.required],
      card: ['', Validators.required],
      carPlate: [''],
      file: ['']
    });
  }

  checkValidForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
  
      this.toastrService.error(
        this.translateService.instant("Lütfen_Zorunlu_Alanları_Doldurunuz"),
        this.translateService.instant("Hata")
      );
      return false; // Form geçersizse `false` döndür
    }
    return true; // Form geçerliyse `true` döndür
  }
  
  add() {
    if (!this.checkValidForm()) {
      return; // Eğer form geçersizse `add()` fonksiyonunu burada durdur
    }
  
    
    const formValues: FormModel = this.getFormValues();
    console.log("formValues: ", formValues);

    var sp: any[] = [
      {
        mkodu: 'yek264',
        ad: formValues.name,
        soyad: formValues.surname,
        bilgi: formValues.explanation,
        giris: '',
        cikis: '',
        isgtarih: formValues.oshTrainingDate,
        giztarih: formValues.confidentialityDate,
        plaka: formValues.carPlate,
        arac: '',
        firma: formValues.company?.ID?.toString(),
        kimlikno: formValues.credential,
        ziyarettipi: formValues.visitType?.ID?.toString(),
        kimliktipi: formValues.idType?.ID?.toString(),
        sicilid: formValues.registry?.id?.toString(),
        userid: formValues.card?.Id?.toString(),
        beklenen: '0',
        yetkistr: this.passGroup ? formValues.passGroup?.ID?.toString() : '0',
        zokod1: formValues.ZOKod1 || '',
        zokod2: formValues.ZOKod2 || '',
        zokod3: formValues.ZOKod3 || '',
        zokod4: formValues.ZOKod4 || '',
        zokod5: formValues.ZOKod5 || '',
        zokod6: formValues.ZOKod6 || '',
        zokod7: formValues.ZOKod7 || '',
        zokod8: formValues.ZOKod8 || '',
        zokod9: formValues.ZOKod9 || '',
        zokod10: formValues.ZOKod10 || '',
        zokod11: formValues.ZOKod11 || '',
        zokod12: formValues.ZOKod12 || ''
      }
    ];

    console.log("Ziyaretçi Ekle params: ", sp);
    
    
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Ziyaretçi Eklendi : ", data);
      this.toastrService.success(
        this.translateService.instant("Ziyaretçi_Eklendi"),
        this.translateService.instant("Başarılı")
      );

      this.onHide();
      this.refreshEvent.emit();
    });
    
  }
  
  getFormValues(): FormModel {
    return this.form.value;
  }

  getVisitorCards() {
    var sp: any[] = [
      {
        mkodu: 'yek275',
        type: 'z'
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.cards = [...data];
      console.log("Ziyaretçi Kartları : ", this.cards);
    });
  }

  getRegistries() {
    var sp: any[] = [
      {
        mkodu: 'yek261',
        id: '0',
        ad: '',
        soyad: '',
        sicilno: '',
        personelno: '', 
        firma: '0',
        bolum: '0',
        pozisyon: '0',
        gorev: '0',
        altfirma: '0',
        yaka: '0',
        direktorluk: '0',
        sicilgroup: '0', 
        userdef: '0',
        cardid: '',
        aktif: '0',
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.registries = [...data];
      console.log("Personeller : ", this.registries);
    });
  }

  getIDTypes() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        id: '0',
        kaynak: 'cbo_kimlik',
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.idTypes = [...data];
      console.log("Kimlik Tipleri : ", this.idTypes);
    });
  }

  getVisitTypes() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        id: '0',
        kaynak: 'cbo_ziyaretnedeni',
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.visitTypes = [...data];
      console.log("Ziyaret Tipleri : ", this.visitTypes);

      this.form.get('visitType')?.setValue(this.visitTypes[0]);
    });
  }

  getCompanies() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        id: '0',
        kaynak: 'cbo_ziyaretcifirma',
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.companies = [...data];
      console.log("Firmalar : ", this.companies);
    });
  }

  changeVisitType() {
    this.form.get('visitType')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
      if (value) {
        this.getVisitCodes(value);        
      }
    });
  }

  getVisitCodes(visitType: any) {
    var sp: any[] = [
      {
        mkodu: 'yek278',
        ziyaretnedeni: visitType.ID.toString()
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      
      // Her objeye isUpload: false ekleyerek yeni bir dizi oluştur
      this.visitCodes = data.map((item: any) => ({ ...item, isUpload: false }));
      console.log("Ziyaret Kodları : ", this.visitCodes);

      this.addFormControl(data);
    });
  }

  addFormControl(data: any) {
    data.forEach((item: any) => {
      this.form.addControl(item.ad, this.formBuilder.control(''));
    });
  }

  changeCredential() {
    this.form.get('credential')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
      if (value) {
        this.getCredentialControl(value);
      }
      // else {
      //   this.form.get('credential')?.setErrors({apiError:null}); // Boşsa hatayı temizle
      // }
    });
  }

  getCredentialControl(credential: any) {
    var sp: any[] = [
      {
        mkodu: 'yek279',
        kimlik: credential,
        kaynak: 'ziyaretci'
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        this.form.get('credential')?.setErrors({ apiError: message.message }); // API hatasını ekle
        return;
      } else if (message.islemsonuc == 9) {
        return;
      }

      console.log("Kimlik Bilgileri CTRL: ", data);
      this.form.get('credential')?.setErrors(
        { 
          apiError: data[0]?.ziykont == 'yasak' ? 'Girişi Yasaklanmış Ziyaretçi!!' : 'Ziyaretçinin iade edilemeyen kartı var. Ziyaretçi içeride görünüyor!!'
        }
      );

    });
  }


  changeNameOrSurname() {
    const nameControl = this.form.get('name');
    const surnameControl = this.form.get('surname');

    if (!nameControl || !surnameControl) return;

    combineLatest([nameControl.valueChanges, surnameControl.valueChanges])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([name, surname]) => {
        if (name || surname) {
          this.getNameSurnameControl(name, surname);
        }
        // else {
        //   // Boşsa hataları temizle
        //   nameControl.setErrors(null);
        //   surnameControl.setErrors(null);
        // }
      });
  }

  getNameSurnameControl(name: string, surname: string) {
    const sp: any[] = [
      {
        mkodu: 'yek280',
        ad: name,
        soyad: surname
      }
    ];

    this.profileService.requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data: any[] = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log("Ad Soyad Kontrol Edildi : ", data);

        this.bannedList = [...data];
        data.length > 0 ? this.infoMessage = this.translateService.instant("Ad Soyad Yasaklı Listesinde Mevcut") : this.infoMessage = this.translateService.instant("Ad_Soyad_Kontrol_Edildi");
        data.length > 0 ? this.infoMessageStatus = false : this.infoMessageStatus = true;
        
        if (!this.form.get('name')?.value || !this.form.get('surname')?.value) this.infoMessage = '';

        this.form.get('name')?.setErrors({ apiError: message.hataMesaji });
        this.form.get('surname')?.setErrors({ apiError: message.hataMesaji });
      });
  }

  onClickBanned() {
    if (this.infoMessageStatus) return;
    this.visibleBannedList();
  }

  visibleBannedList() {
    this.visibleBanned = !this.visibleBanned;
  }
  

  getRequirementControl() {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'ziyaretci'
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Zorunlu Alanlar Geldi : ", data);

      data.forEach((item: any) => {
        if (item.ad == 'ziyaretcigecisgrubu') {
          this.passGroup = item.deger == '1' ? true : false;

          this.getPassGroups();
          
          if (this.passGroup) {
            this.form.addControl('passGroup', this.formBuilder.control(''));
            this.form.get('passGroup')?.setValidators([Validators.required]);
          } 
        } else if (item.ad == 'ziyaretciadsoyadkontrol' && item.deger == '1') {
          this.changeNameOrSurname();
        }
        
      });
    });
  }

  getPassGroups() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        id: '0',
        kaynak: 'yetki',
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Geçiş Grupları Geldi: ", data);
      this.passGroups = [...data];
      
    });
  }

  visibleUploadDialog(item?:any) {
    if (item) {
      this.selectedVisitCode = item;
    }
    
    this.visibleUpload = !this.visibleUpload;
  }

  

  uploadFile(item?: any) {
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
              '233',
              'Ziyaretçi',
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
                '233',
                'Ziyaetçi',
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
    });
  }

  getFile(event: any) {
    // Dosya Yüklendiğinde İlk Çalışan Fonksiyon
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

    for (let file of event.target.files) {
      this.readAndPushFile(file);
    }
  }

  checkFileSize(file: File, maxSizeInBytes: number): boolean {
    // Dosya Boyutunu Kontrol Eden Fonksiyon
    const fileSizeInBytes = file.size;
    const maxSize = maxSizeInBytes;
    return fileSizeInBytes <= maxSize;
  }

  readAndPushFile(file: File) {
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
      let fileInfo = {
        name: file.name,
        type: file.type,
        url: url,
        fileSize: fileSize,
        fileSizeType: fileSizeType,
      };

      this.uploadedFile.push({ files: fileInfo, sendFile: file });
      console.log('Uploaded File : ', this.uploadedFile);
      this.ref.detectChanges();
    };
  }

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


export interface FormModel {
  idType: {ID: number, Ad: string},
  credential: string,
  name: string,
  surname: string,
  explanation: string,
  company: {ID: number, Ad: string},
  visitType: {ID: number, ad: string},
  oshTrainingDate: string,
  confidentialityDate: string,
  registry: any,
  card: any,
  carPlate: string,
  ZOKod1: string,
  ZOKod2: string,
  ZOKod3: string,
  ZOKod4: string,
  ZOKod5: string,
  ZOKod6: string,
  ZOKod7: string,
  ZOKod8: string,
  ZOKod9: string,
  ZOKod10: string,
  ZOKod11: string,
  ZOKod12: string,
  passGroup: {ID: number, Ad: string}
}
