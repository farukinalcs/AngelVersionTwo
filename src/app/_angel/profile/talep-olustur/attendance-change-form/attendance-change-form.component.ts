import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { AttendanceService } from 'src/app/_angel/puantaj/attendance.service';
import { ProfileService } from '../../profile.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../models/oKodFields';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { AuthService } from 'src/app/modules/auth';
import Swal from 'sweetalert2';
import { DrawerComponent, MenuComponent, ScrollComponent, ScrollTopComponent, StickyComponent, ToggleComponent } from 'src/app/_metronic/kt/components';

@Component({
  selector: 'app-attendance-change-form',
  templateUrl: './attendance-change-form.component.html',
  styleUrls: ['./attendance-change-form.component.scss'],
})
export class AttendanceChangeFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Output() onHideAttendanceForm: EventEmitter<void> = new EventEmitter<void>();
  @Output() isCompletedFromAttendance: EventEmitter<void> =
    new EventEmitter<void>();
  @Input() isFromAttendance: boolean;
  @Input() displayAttendanceForm: boolean;
  @Input() gridStartDate: any;
  @Input() gridEndDate: any;



  stepperFields: any[] = [
    {
      class: 'stepper-item current',
      number: 1,
      title: this.translateService.instant('Test'),
      desc: '',
    },
    {
      class: 'stepper-item',
      number: 2,
      title: this.translateService.instant('Mesai_Tarihi'),
      desc: '',
    },
    {
      class: 'stepper-item',
      number: 3,
      title: this.translateService.instant('Terminal_Seçimi'),
      desc: '',
    },
    {
      class: 'stepper-item',
      number: 4,
      title: this.translateService.instant('Tamamlandı'),
      desc: this.translateService.instant('Özet_Bilgiler'),
    },
  ];

  formsCount: any = 5;
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentItem: any = this.stepperFields[0];
  attendanceFormValues: any;

  // Stepper responsive
  stepperOrientation: Observable<StepperOrientation>;

  attendanceForm: FormGroup;
  uploadedFiles: any[] = [];
  uploadedFile: any;

  dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');

  formId: any;
  files: any;
  fileTypes: any[] = [];
  displayUploadedFile: boolean;
  currentUploadedFile: any;

  currentUserValue: import('c:/Users/Developer/Desktop/AngleV2_Developer/src/app/modules/auth/index').UserType;
  selectedType: any;
  selectedEmployeesFromAttendance: any[] = [];
  deviceList: any[] = [];
  currentShift: string = this.translateService.instant('Tarih_Seçmelisiniz');
  isCompleted: boolean = false;

  items: any[] = []; // Tüm öğeler
  paginatedItems: any[] = []; // Gösterilecek öğeler
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  personActivity: any[] = [];
  isShow: boolean = false;
  removedActivties: any[] = [];
  updatedActivities: any[] = [];
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private attendanceService: AttendanceService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
        ToggleComponent.bootstrap();
        ScrollTopComponent.bootstrap();
        DrawerComponent.bootstrap();
        StickyComponent.bootstrap();
        MenuComponent.bootstrap();
        ScrollComponent.bootstrap();
    }, 200);

    console.log('gridStartDate: ', this.gridStartDate);
    console.log('gridEndDate: ', this.gridEndDate);

    this.createFormGroup();

    this.currentUserValue = this.authService.currentUserValue;
    console.log('currentUserValue izin talep :', this.currentUserValue);

    if (this.isFromAttendance) {
      this.getSelectedRows();

      if (
        this.gridStartDate == this.gridEndDate &&
        this.selectedEmployeesFromAttendance.length <= 1
      ) {
        this.attendanceForm.addControl(
          'shiftDate',
          this.formBuilder.control('', Validators.required)
        );
      }
    } else {
      this.attendanceForm.addControl(
        'shiftDate',
        this.formBuilder.control('', Validators.required)
      );
    }
    this.items = this.getTooltipScript(); // Öğelerinizi burada alın
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
    this.updatePaginatedItems();

    this.getDeviceList();

    this.setResponsiveForm();
    this.listenFormState();
  }

  getTooltipScript(): any[] {
    const personsLength = this.selectedEmployeesFromAttendance.length;
    const personsName = this.selectedEmployeesFromAttendance
      .map((person, index) => `${index + 1}) ${person.ad} ${person.soyad}`)
      .join('\r\n');
    let firstPerson: string = '';

    const uniquePersons = this.selectedEmployeesFromAttendance.filter(
      (person, index, self) =>
        index === self.findIndex((p) => p.sicilid === person.sicilid)
    );

    if (uniquePersons.length === 1) {
      firstPerson = `${uniquePersons[0].ad} ${uniquePersons[0].soyad} Seçildi`;
    } else if (uniquePersons.length === 2) {
      firstPerson = `${uniquePersons[0].ad} ${uniquePersons[0].soyad} ve ${uniquePersons[1].ad} ${uniquePersons[1].soyad} Seçildi`;
    } else {
      if (personsLength == 1) {
        firstPerson = `${this.selectedEmployeesFromAttendance[0].ad} ${this.selectedEmployeesFromAttendance[0].soyad} Seçildi`;
      } else if (personsLength == 2) {
        firstPerson = `${this.selectedEmployeesFromAttendance[0].ad} ${this.selectedEmployeesFromAttendance[0].soyad} ve ${this.selectedEmployeesFromAttendance[1].ad} ${this.selectedEmployeesFromAttendance[1].soyad} Seçildi`;
      } else if (personsLength > 2) {
        firstPerson = `${uniquePersons[0].ad} ${uniquePersons[0].soyad}, ${
          uniquePersons[1].ad
        } ${uniquePersons[1].soyad} ve ${personsLength - 2} Kişi Daha Seçildi`;
      }
    }

    // return firstPerson;
    return uniquePersons;
  }

  getDeviceList() {
    // Terminalleri Almak İçin API'ye İstek
    this.profileService
      .getTypeValues('terminaller')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == 1) {
            this.deviceList = data;
            console.log('Terminaller : ', data);
          }

          this.ref.detectChanges();
        }
      );
  }

  getSelectedRows() {
    this.attendanceService.selectedItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => {
        this.selectedEmployeesFromAttendance = items;
        console.log(
          'Puantaj Seçilen Personel :',
          this.selectedEmployeesFromAttendance
        );
      });

    console.log(
      'Giriş-Çıkış Kaydı Bulunan Var Mı? ',
      this.selectedEmployeesFromAttendance.some(
        (p: any) => p.ggiris != null || p.ggiris != undefined
      )
    );
  }

  isThereData(): boolean {
    return this.selectedEmployeesFromAttendance.some(
      (p: any) => p.ggiris != null || p.ggiris != undefined
    );
  }

  canProceedToNextStep(): boolean {
    this.attendanceFormValues = Object.assign({}, this.attendanceForm.value);

    console.log('Hareket Değişiklik Talep Form :', this.attendanceFormValues);

    if (this.currentStep$.value === 1) {
      return !!this.attendanceForm.get('formState')?.valid;
    } else if (this.currentStep$.value === 3) {
      return this.attendanceForm.valid;
    }
    //  else if (this.currentStep$.value === 3) {
    //   this.postForm(this.attendanceFormValues);
    //   return true;
    // }

    return true;
  }

  canProceedToPrevStep(): boolean {
    return true;
  }

  nextStep() {
    if (!this.canProceedToNextStep()) {
      this.toastrService.error(
        this.translateService.instant('Form_Alanlarını_Doldurmalısınız'),
        this.translateService.instant('Hata')
      );
      return;
    }

    const nextStep = this.currentStep$.value + 1;
    if (nextStep <= this.formsCount) {
      this.currentStep$.next(nextStep);
      this.currentItem = this.stepperFields[nextStep - 1];
      this.currentItem.class = 'stepper-item current';
      if (nextStep > 1) {
        this.stepperFields[nextStep - 2].class = 'stepper-item completed';
      }
    }
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
    this.currentItem = this.stepperFields[prevStep - 1];
    let prevItem = this.stepperFields[prevStep];
    this.currentItem.class = 'stepper-item current';
    prevItem.class = 'stepper-item';
  }

  // Formların oluşması
  createFormGroup() {
    this.attendanceForm = this.formBuilder.group({
      // shiftDate: ['', Validators.required],
      formState: ['', Validators.required],
      isDelete: ['0', Validators.required],
      shiftTime: ['', Validators.required],
      explanation: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500),
        ]),
      ],
      file: [null],
      device: ['', Validators.required],
    });
  }

  // Stepper'ı yataydan dikeye çevir
  setResponsiveForm() {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  getFile(event: any, item: any) {
    let files: FileList = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      if (!this.checkFileSize(file, 1024 * 1024)) {
        this.toastrService.error(
          this.translateService.instant('Dosya_Boyutu_Yuksek'),
          this.translateService.instant('Hata')
        );
        return;
      }
    }

    console.log(files);
    item.sendFile = files[0];

    for (let file of event.target.files) {
      this.readAndPushFile(file, item);
    }
  }

  // Dosya boyutunu kontrol eden fonk.
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

      console.log('Uploaded File : ', this.uploadedFile);
      console.log('Uploaded Fileee : ', item);
      this.ref.detectChanges();
    };
  }

  removeUploadedFile(item: any, file: any) {
    const index = item.files.indexOf(file);
    if (index !== -1) {
      item.files.splice(index, 1);
    }
  }

  closedFormDialog() {
    console.log('Closed Form');
    this.attendanceForm.reset();
    this.uploadedFile = '';
    this.selectedType = '';
    this.resetStepperFieldsClass();
    this.currentStep$.next(1);
    this.currentItem = this.stepperFields[0];
    this.selectedEmployeesFromAttendance = [];
    this.onHideAttendanceForm.emit();
  }

  resetStepperFieldsClass() {
    this.stepperFields.forEach((item, index) => {
      item.class = index === 0 ? 'stepper-item current' : 'stepper-item';
    });
  }

  getAttendanceFormValues() {
    this.attendanceFormValues = Object.assign({}, this.attendanceForm.value);
    console.log('Hareket Talep Form :', this.attendanceFormValues);
  }

  postForm(formValues: any, source: any, activities: any[]) {
    if (this.attendanceForm.get('formState')?.value != 0) {
      var sp: any[] = [];

      activities.forEach((item: any) => {
        sp.push({
          mkodu: 'yek109',
          tarih: '2000-10-22',
          terminalid: '0',
          aciklama: formValues?.explanation,
          sicilid: '0',
          sil: '0',
          hareketid: item.Id.toString(),
          kaynak: source,
        });

        console.log('item : ', item);
      });
    } else {
      let employees: any[] = [];
      if (this.isFromAttendance) {
        employees = this.selectedEmployeesFromAttendance.map((employee) =>
          employee.sicilid.toString()
        );
        console.log('Toplu Talep :', employees);
      } else {
        employees.push(this.currentUserValue?.xSicilID.toString());
      }

      var sp: any[] = [];

      employees.forEach((item: any) => {
        let tarih: string;

        if (
          this.gridStartDate == this.gridEndDate &&
          this.selectedEmployeesFromAttendance.length <= 1
        ) {
          tarih = formValues?.shiftDate + ' ' + formValues?.shiftTime;
        } else {
          tarih = this.gridStartDate + ' ' + formValues?.shiftTime;
        }

        sp.push({
          mkodu: 'yek109',
          tarih: tarih,
          terminalid: formValues?.device.ID.toString(),
          aciklama: formValues?.explanation,
          sicilid: item,
          sil: formValues?.isDelete,
          hareketid: '0',
          kaynak: source,
        });

        console.log('item : ', item);
      });
    }

    console.log('Saat Değişikliği Gönderildi :', sp);

    this.profileService
      .requestMethodPost(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        if (!this.isFromAttendance) {
          const data = response[0].x;
          const apiMessage = response[0].z;
          const spMessage = response[0].m[0];

          console.log('Mesai Form gönderildi :', response);
          if (data[0].sonuc == 1) {
            this.formId = data[0].formid;

            this.toastrService.success(
              this.translateService.instant('Talep_Gönderildi'),
              this.translateService.instant('Başarılı')
            );
          } else {
            this.toastrService.error(
              data[0]?.izinhesapsure,
              this.translateService.instant('Hata')
            );
            this.prevStep();
          }
        } else {
          let data: any[] = [];

          response.forEach((res: any) => {
            data.push(res.x[0]);
          });

          let successDemandCount: number = 0;
          let errorDemandCount: number = 0;

          data.forEach((item: any) => {
            if (!item) {
              return;
            }

            item.sonuc == 1 ? successDemandCount++ : errorDemandCount++;

            this.selectedEmployeesFromAttendance.forEach((employe) => {
              if (employe.sicilid == item.siciller) {
                Object.keys(item).forEach((key) => {
                  employe[key] = item[key];
                });
                employe.error = false;
              }
              return;
            });
          });

          if (successDemandCount > 0) {
            this.toastrService.success(
              this.translateService.instant(
                successDemandCount +
                  'Adet_Talep_Başarılı_Bir_Şekilde_Oluşturuldu'
              ),
              this.translateService.instant('Başarılı')
            );

            this.isCompletedFromAttendance.emit();
          }

          if (errorDemandCount > 0) {
            this.toastrService.error(
              this.translateService.instant(
                errorDemandCount + 'Adet_Talep_Oluşturulurken_Hata_Oluştu'
              ),
              this.translateService.instant('Hatalı')
            );
          }

          console.log('isCompleted : ', this.selectedEmployeesFromAttendance);
          this.isCompleted = true;
        }
      });
    this.ref.detectChanges();
  }

  getFileTypeForDemandType(typeId: any, source: any) {
    this.fileTypes = [];
    this.profileService
      .getFileTypeForDemandType(typeId, source)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        console.log('Tipi geldi', data);
        this.fileTypes = data;

        this.ref.detectChanges();
      });
  }

  showUploadedFile(item: any) {
    this.displayUploadedFile = true;
    this.currentUploadedFile = item;
  }

  getFormValues() {
    this.attendanceFormValues = Object.assign({}, this.attendanceForm.value);
    console.log('Hareket Talebi Form Değerleri : ', this.attendanceFormValues);

    if (this.attendanceForm.get('formState')?.value == 0) {
      Swal.fire({
        title: `Haraket bulunan kayıtlar mevcut. Bu kayıtları silmek ister misiniz?`,
        // text: "You won't be able to revert this!",
        icon: 'warning',
        iconColor: '#ed1b24',
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: 'İptal',
        denyButtonColor: '#ed1b24',
        confirmButtonColor: '#ed1b24',
        cancelButtonColor: '#ed1b24',
        cancelButtonText: 'Hayır',
        confirmButtonText: `Evet`,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.attendanceForm.get('isDelete')?.setValue('1');
          this.attendanceFormValues = Object.assign(
            {},
            this.attendanceForm.value
          );
          this.postForm(this.attendanceFormValues, 'i', []);

          Swal.fire({
            title: `Kayıtlar silinerek talep gönderildi`,
            icon: 'success',
            iconColor: '#ed1b24',
            confirmButtonColor: '#ed1b24',
            confirmButtonText: 'Kapat',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.postForm(this.attendanceFormValues, 'i', []);

          Swal.fire({
            title: 'İşlem Yapmaktan Vazgeçildi!',
            icon: 'error',
            iconColor: '#ed1b24',
            confirmButtonColor: '#ed1b24',
            confirmButtonText: 'Kapat',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        } else if (result.isDenied) {
        }
      });

      return;
    } else if (this.attendanceForm.get('formState')?.value == 2) {
      this.postForm(this.attendanceFormValues, 'u', this.updatedActivities);
    } else if (this.attendanceForm.get('formState')?.value == 1) {
      this.postForm(this.attendanceFormValues, 'd', this.removedActivties);
    }

    this.fileTypes.forEach((item: any) => {
      if (item.sendFile) {
        this.postAttendanceFile(item.sendFile, this.formId, 'fm', item.BelgeId);
      }
    });

    this.toastrService.success(
      this.translateService.instant('Talep_Gönderildi'),
      this.translateService.instant('Başarılı')
    );
    // this.closedFormDialog();
  }

  postAttendanceFile(file: any, formId: any, source: any, fileType: any) {
    this.profileService
      .postFileForDemand(file, formId, source, fileType)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        console.log('Mesai talep için dosya gönderildi : ', response);
        this.closedFormDialog();

        this.ref.detectChanges();
      });
  }

  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.items.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedItems();
  }

  getPersonActivity(sid: number) {
    let filteredArr = this.selectedEmployeesFromAttendance.filter(
      (e) => e.sicilid == sid
    );

    if (filteredArr.length > 0) {
      let minDate = filteredArr[0].mesaitarih;
      let maxDate = filteredArr[0].mesaitarih;

      filteredArr.forEach((item) => {
        if (item.mesaitarih < minDate) {
          minDate = item.mesaitarih;
        }
        if (item.mesaitarih > maxDate) {
          maxDate = item.mesaitarih;
        }
      });

      var sp: any[] = [
        {
          mkodu: 'yek110',
          sid: sid.toString(),
          tarihbas: minDate,
          tarihbit: maxDate,
        },
      ];
    } else {
      var sp: any[] = [];
      console.error('Filtered array is empty.');
    }

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        const data = response[0].x;
        const apiMessage = response[0].z;
        const spMessage = response[0].m[0];

        this.personActivity = data;
        this.personActivity = this.parseTerminalData(this.personActivity);

        if (this.personActivity.length > 0) {
          this.showUploadedFile('');
        } else {
          this.toastrService.warning(
            this.translateService.instant('Kayıt_Bulunamadı!'),
            this.translateService.instant('Uyarı')
          );
        }

        console.log('getPersonActivity: ', this.personActivity);
      });
  }

  parseTerminalData(response: any[]): any[] {
    return response.map((item) => {
      const { terminal } = item;
      const terminalParts = terminal.split('(i):');
      const terminalAdi = terminalParts[0].trim();
      const insertAndUpdateParts = terminalParts[1].split('(u):');

      const insert = this.parseInsertOrUpdate(insertAndUpdateParts[0]);
      const update = insertAndUpdateParts
        .slice(1)
        .map((part: any) => this.parseInsertOrUpdate(part));

      return {
        ...item,
        terminalAdi,
        insert: [insert],
        update: update.filter(Boolean),
        isShow: false,
        isDelete: false,
      };
    });
  }

  parseInsertOrUpdate(part: string) {
    const [userPart, datePart] = part.split('@');
    const insertEden = userPart.trim();
    const insertTarihi = datePart ? datePart.split(',')[0].trim() : '';
    return { insertEden, insertTarihi };
  }

  isThereActivity(item: any): boolean {
    // İlk arrayde sicilid değerine göre filtreleme
    const filteredItems = this.selectedEmployeesFromAttendance.filter(
      (s) => s.sicilid === item.sicilid
    );

    // ggiris veya gcikis değeri olan item olup olmadığını kontrol etme
    return filteredItems.some((f) => f.ggiris || f.gcikis);
  }

  textIO(io: any): string {
    if (io === 0) {
      return 'Geçiş';
    }

    if (io === 1) {
      return 'Giriş';
    }

    if (io === 2) {
      return 'Çıkış';
    }

    if (io === 5) {
      return '*Pdks';
    }

    if (io === 6) {
      return '*Giriş';
    }

    if (io === 7) {
      return '*Çıkış';
    }

    return '';
  }

  isThereTampering(value: any) {
    if (value.mudahale === false) {
      if (value.automatic !== false) return 'Yazılım Kararı';
      return 'Cihaz Yönü';
    } else {
      return 'Kullanıcı Değiştirdi';
    }
  }

  getClassForValue(value: any): any {
    if (value.deleted !== 0 && value.undelete === false) {
      return 'bg-light-danger';
    } else if (value.deleted !== 0 && value.undelete === true) {
      return 'bg-gray-100 ';
    } else {
      return '';
    }
  }

  getRecordStatusMessage(value: any): string {
    if (value.deleted !== 0 && value.undelete === false) {
      return 'Silinmiş!!';
    } else if (value.deleted !== 0 && value.undelete === true) {
      return 'Ara Kayıt..';
    } else {
      return '';
    }
  }

  closeUploadedFile() {
    this.displayUploadedFile = false;
    this.personActivity = [];
  }

  showDetails() {
    this.isShow = !this.isShow;
  }

  listenFormState() {
    this.attendanceForm
      .get('formState')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: any) => {
        // if (value == 0) {
        //   this.insertActivity = true;
        //   this.stepperFields = [
        //     {
        //       class: 'stepper-item current',
        //       number: 1,
        //       title: this.translateService.instant('Test'),
        //       desc: '',
        //     },
        //     {
        //       class: 'stepper-item',
        //       number: 2,
        //       title: this.translateService.instant('Mesai_Tarihi'),
        //       desc: '',
        //     },
        //     {
        //       class: 'stepper-item',
        //       number: 3,
        //       title: this.translateService.instant('Terminal_Seçimi'),
        //       desc: '',
        //     },
        //     {
        //       class: 'stepper-item',
        //       number: 4,
        //       title: this.translateService.instant('Tamamlandı'),
        //       desc: this.translateService.instant('Özet_Bilgiler'),
        //     }
        //   ];
        // } else {
        //   this.stepperFields = [
        //     {
        //       class: 'stepper-item current',
        //       number: 1,
        //       title: this.translateService.instant('Test'),
        //       desc: '',
        //     },
        //     {
        //       class: 'stepper-item',
        //       number: 2,
        //       title: this.translateService.instant('Mesai_Tarihi'),
        //       desc: '',
        //     },
        //     {
        //       class: 'stepper-item',
        //       number: 3,
        //       title: this.translateService.instant('Tamamlandı'),
        //       desc: this.translateService.instant('Özet_Bilgiler'),
        //     }
        //   ];
        //   this.insertActivity = false;
        // }

        const deviceControl = this.attendanceForm.get('device');
        const shiftTimeControl = this.attendanceForm.get('shiftTime');
        const shiftDateControl = this.attendanceForm.get('shiftDate');

        if (value != 0) {
          deviceControl?.clearValidators();
          shiftTimeControl?.clearValidators();
          shiftDateControl?.clearValidators();
        } else {
          deviceControl?.setValidators([Validators.required]);
          shiftTimeControl?.setValidators([Validators.required]);
          shiftDateControl?.setValidators([Validators.required]);
        }

        deviceControl?.updateValueAndValidity();
        shiftTimeControl?.updateValueAndValidity();
        shiftDateControl?.updateValueAndValidity();
      });
  }

  changeRotateActivity(item: any) {
    if (item.pdks == 1) {
      item.pdks = 2;
    } else {
      item.pdks = 1;
    }
    console.log('Hareketin yönü değişti :', item);
    this.updatedActivities.push(item);
    console.log(this.updatedActivities);
    
  }

  removeActivity(item: any) {
    item.deleted = 1;    
    item.undelete = false;
    item.isDelete = true;
    console.log('Hareket Kaldırıldı :', item);
    this.removedActivties.push(item);
    console.log(this.removedActivties);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
