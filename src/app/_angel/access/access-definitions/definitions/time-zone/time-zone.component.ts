import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-time-zone',
  templateUrl: './time-zone.component.html',
  styleUrls: ['./time-zone.component.scss']
})
export class TimeZoneComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  loading: boolean = false;
  timeZoneList: any[] = [];
  dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');
  selectedTimeZone: any;
  timeZone: any[] = [];
  selectedTab: any;
  form: FormGroup;
  selectedTabIndex: number = 0; // Aktif sekme indeksini tutar
  displayAdd: boolean = false;
  formattedString: string = "";
  name: string = "";
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.formValueChangeListeners();
    this.getTimeZoneList();

  }

  createForm() {
    this.form = this.fb.group({});
    const timeZoneConfig = [1, 2, 3, 4]; // Dinamik olarak formda olacak temp gruplarını belirleyebilirsiniz
    timeZoneConfig.forEach((i) => {
      this.form.addControl(`temp${i}startTimeCheck`, this.fb.control(false));
      this.form.addControl(`temp${i}startTime`, this.fb.control({ value: '', disabled: true }));
      this.form.addControl(`temp${i}endTimeCheck`, this.fb.control(false));
      this.form.addControl(`temp${i}endTime`, this.fb.control({ value: '', disabled: true }));
      this.form.addControl(`temp${i}monday`, this.fb.control(false));
      this.form.addControl(`temp${i}tuesday`, this.fb.control(false));
      this.form.addControl(`temp${i}wednesday`, this.fb.control(false));
      this.form.addControl(`temp${i}thursday`, this.fb.control(false));
      this.form.addControl(`temp${i}friday`, this.fb.control(false));
      this.form.addControl(`temp${i}saturday`, this.fb.control(false));
      this.form.addControl(`temp${i}sunday`, this.fb.control(false));
      this.form.addControl(`temp${i}vac1`, this.fb.control(false));
      this.form.addControl(`temp${i}vac2`, this.fb.control(false));
    });
  }
  
  formValueChangeListeners() {
    const timeZoneConfig = [1, 2, 3, 4];
    timeZoneConfig.forEach((i) => {
      const startTimeCheck = this.form.get(`temp${i}startTimeCheck`);
      const endTimeCheck = this.form.get(`temp${i}endTimeCheck`);
      const startTime = this.form.get(`temp${i}startTime`);
      const endTime = this.form.get(`temp${i}endTime`);
  
      // StartTimeCheck listener
      startTimeCheck?.valueChanges.subscribe((checked) => {
        if (checked) {
          startTime?.enable();
        } else {
          startTime?.disable();
        }
      });
  
      // EndTimeCheck listener
      endTimeCheck?.valueChanges.subscribe((checked) => {
        if (checked) {
          endTime?.enable();
        } else {
          endTime?.disable();
        }
      });
    });
  }
  
  getTimeZoneList() {
    this.loading = false;
    const sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'Timezone',
        id: '0',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0]?.x;
        const message = response[0]?.z;

        if (message?.islemsonuc === -1) {
          this.loading = false;
          return;
        }
        console.log("timezone listesi : ", data);
        
        this.timeZoneList = [...data];
        this.timeZoneList.push({
          Ad: this.translateService.instant('Yeni'),
          ID: -1
        });
        this.timeZoneList = this.orderById(this.timeZoneList);
        this.selectedTimeZone = this.timeZoneList[0];
        this.getTimeZone(this.selectedTimeZone, this.selectedTabIndex);
        this.loading = true;
      });
  }

  onChangeTimeZone(event: any) {
    console.log("Event :", event);
    this.form.reset();
    this.selectedTabIndex = 0;
    this.getTimeZone(event, this.selectedTabIndex)
  }

  getTimeZone(item: any, tabIndex: number) {
    this.loading = false;
    const sp: any[] = [
      {
        mkodu: 'yek193',
        id: item.ID.toString(),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0]?.x;
        const message = response[0]?.z;

        if (message?.islemsonuc === -1) {
          this.loading = false;
          return;
        }

        console.log("Timezone info geldi : ", data);
        
        this.timeZone = [...data];

        this.timeZone.forEach((item:any, index) => {
          this.setFormValue(item, index);
        });
        // if (this.timeZone[tabIndex]) {
        //   this.selectedTabIndex = tabIndex;
        //   this.setFormValue(this.timeZone[tabIndex]);
        // }
        this.loading = true;
      });
  }
  
  setFormValue(item: any, index: number) {
    const timeSlotPrefix = `temp${index + 1}`;
    this.form.get(`${timeSlotPrefix}startTimeCheck`)?.setValue(item.Baslama ? true : false);
    this.form.get(`${timeSlotPrefix}endTimeCheck`)?.setValue(item.Bitme ? true : false);
    this.form.get(`${timeSlotPrefix}startTime`)?.setValue(item.Baslama ? item.Baslama.split('T')[1] : null);
    this.form.get(`${timeSlotPrefix}endTime`)?.setValue(item.Bitme ? item.Bitme.split('T')[1] : null);
    this.form.get(`${timeSlotPrefix}monday`)?.setValue(item.Pazartesi);
    this.form.get(`${timeSlotPrefix}tuesday`)?.setValue(item.Sali);
    this.form.get(`${timeSlotPrefix}wednesday`)?.setValue(item.Carsamba);
    this.form.get(`${timeSlotPrefix}thursday`)?.setValue(item.Persembe);
    this.form.get(`${timeSlotPrefix}friday`)?.setValue(item.Cuma);
    this.form.get(`${timeSlotPrefix}saturday`)?.setValue(item.Cumartesi);
    this.form.get(`${timeSlotPrefix}sunday`)?.setValue(item.Pazar);
    this.form.get(`${timeSlotPrefix}vac1`)?.setValue(item.Tatil1);
    this.form.get(`${timeSlotPrefix}vac2`)?.setValue(item.Tatil2);

    this.toggleStartTime(timeSlotPrefix);
    this.toggleEndTime(timeSlotPrefix);
  }
  
  
  toggleStartTime(timeSlotPrefix:any) {
    const startTimeCheck = this.form.get(`${timeSlotPrefix}startTimeCheck`)?.value;
    if (startTimeCheck) {
      this.form.get(`${timeSlotPrefix}startTime`)?.enable();
    } else {
      this.form.get(`${timeSlotPrefix}startTime`)?.disable();
    }
  }
  
  toggleEndTime(timeSlotPrefix: any) {
    const endTimeCheck = this.form.get(`${timeSlotPrefix}endTimeCheck`)?.value;
    if (endTimeCheck) {
      this.form.get(`${timeSlotPrefix}endTime`)?.enable();
    } else {
      this.form.get(`${timeSlotPrefix}endTime`)?.disable();
    }
  }
  

  remove() {
    if (this.selectedTimeZone.ID == -1) {
      this.toastrService.error(
        this.translateService.instant('Bu Seçenek Kaldırılamaz'),
        this.translateService.instant('HATA')
      )
    } else {
      Swal.fire({
        title: `Seçilen timezone "${this.selectedTimeZone.Ad}" kaldırılsın mı? `,
        // text: "You won't be able to revert this!",
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
          const sp: any[] = [
            {
              mkodu: 'yek125',
              id: this.selectedTimeZone.ID.toString(),
              kaynak: 'timezone'
            },
          ];
      
          console.log("Timezone kaldır param: ", sp);
          
      
          this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
              const data = response[0]?.x;
              const message = response[0]?.z;
      
              if (message?.islemsonuc === -1) {
                this.loading = false;
                return;
              }
      
              console.log("Timezone Kaldırıldı : ", data);
              this.form.reset();
              this.timeZoneList = [...data];
              this.timeZoneList.push({
                Ad: this.translateService.instant('Yeni'),
                ID: -1
              });
              this.timeZoneList = this.orderById(this.timeZoneList);
              this.selectedTimeZone = this.timeZoneList[0];
              this.getTimeZone(this.selectedTimeZone, this.selectedTabIndex);
              
  
              Swal.fire({
                title: `Timezone Kaldırıldı`,
                icon: 'success',
                iconColor: '#ed1b24',
                confirmButtonColor: '#ed1b24',
                confirmButtonText: 'Kapat',
                allowOutsideClick: false,
                allowEscapeKey: false,
                heightAuto: false
              });
            });
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
    
  }

  orderById(list: any[]): any[] {
    return list.sort((a, b) => a.ID - b.ID);
  }

  getFormValues() {
    // Form verilerini almak için
    if (this.form.valid) {
      let formData = this.form.value;
      console.log("FormValues : ", formData);
      
      // Boolean değerleri 1 veya 0'a dönüştür
      formData = this.transformBooleanToNumber(formData);
      

      this.formattedString = this.generateFormattedString(formData);
      console.log('Dönüştürülmüş Form Verisi:', this.formattedString);

      this.save();
    } else {
      console.log('Form geçerli değil');
    }
  }

  // Boolean değerleri 1 veya 0'a dönüştüren fonksiyon
  transformBooleanToNumber(formData: any): any {
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'boolean') {
        formData[key] = formData[key] ? 1 : 0;
      }
    });
    return formData;
  }

  formatTimeWithDate(time: string | null): string {
    const todayDate = new Date().toISOString().split('T')[0]; // YYY-MM-DD formatında
    
    if (time) {
      return `'${todayDate} ${time}'`;
    }
    return 'null';
  }

  formatTemp(tempName: string, data: any): string {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const dayValues = days.map(day => data[`${tempName}${day}`] ?? 'null').join(',');
    const vacValues = [
      data[`${tempName}vac1`] ?? 'null',
      data[`${tempName}vac2`] ?? 'null',
    ].join(',');
    const timeValues = [
      this.formatTimeWithDate(data[`${tempName}startTime`]),
      this.formatTimeWithDate(data[`${tempName}endTime`]),
    ].join(',');
    return [dayValues, vacValues, timeValues].join(',');
  }

  generateFormattedString(data: any): string {
    return ['temp1', 'temp2', 'temp3', 'temp4']
      .map(temp => this.formatTemp(temp, data))
      .join('#');
  }

  save() {
    if (this.selectedTimeZone.ID == -1) {
      this.openAddDialog();

    } else {
      Swal.fire({
        title: `Seçilen timezone "${this.selectedTimeZone.Ad}" güncellensin mi? `,
        // text: "You won't be able to revert this!",
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
          const sp: any[] = [
            {
              mkodu: 'yek195',
              insertparam: this.formattedString,
              tzid: this.selectedTimeZone.ID.toString(),
            },
          ];
      
          console.log("Timezone güncelle param: ", sp);
          
      
          this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
              const data = response[0]?.x;
              const message = response[0]?.z;
      
              if (message?.islemsonuc === -1) {
                this.loading = false;
                return;
              }
      
              console.log("Timezone Güncellendi : ", data);
              this.selectedTimeZone = this.timeZoneList.find(item => item.ID == data[0].TimeZoneId);
              this.getTimeZone(this.selectedTimeZone, this.selectedTabIndex);
              
  
              Swal.fire({
                title: `Timezone Güncellendi`,
                icon: 'success',
                iconColor: '#ed1b24',
                confirmButtonColor: '#ed1b24',
                confirmButtonText: 'Kapat',
                allowOutsideClick: false,
                allowEscapeKey: false,
                heightAuto: false
              });
            });
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
  }

  openAddDialog() {
    this.displayAdd = true;
  }

  closeAction() {
    this.displayAdd = false;
  }

  add() {
    this.displayAdd = false;
    Swal.fire({
      title: `Oluşturulan yeni timezone "${this.name}" eklensin mi? `,
      // text: "You won't be able to revert this!",
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
        const sp: any[] = [
          {
            mkodu: 'yek194',
            insertparam: this.formattedString,
            name: this.name
          },
        ];
    
        console.log("Timezone ekle param: ", sp);
        
    
        this.profileService
          .requestMethod(sp)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((response: any) => {
            const data = response[0]?.x;
            const message = response[0]?.z;
    
            if (message?.islemsonuc === -1) {
              this.loading = false;
              return;
            }
    
            console.log("Timezone Eklendi : ", data);

            this.timeZoneList.push({
              Ad: data[0]?.ad,
              ID:data[0]?.TimeZoneId 
            });


            this.selectedTimeZone = this.timeZoneList.find(item => item.ID == data[0].TimeZoneId);
            this.getTimeZone(this.selectedTimeZone, this.selectedTabIndex);
            

            Swal.fire({
              title: `Timezone Eklendi`,
              icon: 'success',
              iconColor: '#ed1b24',
              confirmButtonColor: '#ed1b24',
              confirmButtonText: 'Kapat',
              allowOutsideClick: false,
              allowEscapeKey: false,
              heightAuto: false
            });
          });
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


  changeTabMenu(event: any) {

  }


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}