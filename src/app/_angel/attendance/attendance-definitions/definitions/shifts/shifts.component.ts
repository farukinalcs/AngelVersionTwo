import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from 'src/app/_angel/profile/models/oKodFields';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { TimeFormatPipe } from 'src/app/_helpers/pipes/time-format.pipe';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
})
export class ShiftsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  form: FormGroup;
  shifts: any[] = [];
  selectedType: any;
  loading: boolean = false;
  selectedShift: OKodFieldsModel;
  filterText: string = '';
  // fadeInDanger: boolean;
  selectedIndex: 0;
  resting: any[] = [];
  roundingType: any = 1;
  movementRoundings: any[] = [];
  timeRoundings: any[] = [];
  fadeInDanger: { [key: string]: { active: boolean; timeoutId?: any } } = {};


  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getShifts();
  }

  createForm() {
    this.form = this.formBuilder.group({
      shiftName: [''],
      shiftCode: [''],
      startTime: [''],
      plus: [''],
      minus: [''],
      endTime: [''],
      maxWorkingTime: [''],
      overtimePercentage: [''],
      incompleteTimeZone: [''],
      minOvertimeTime: [''],
      maxOvertimeTime: [''],
      mostEarlyDuration: [''],
      inputTolerance: [''],
      outputTolerance: [''],

      overtimeOneStartTime: [''],
      overtimeOneEndTime: [''],
      overtimeTwoStartTime: [''],
      overtimeTwoEndTime: [''],

      restDescription: [''],
      restStartTime: [''],
      restEndTime: [''],
      restTime: [''],
      restIrregular: [true],

      target: [''],
      roundingStart: [''],
      roundingEnd: [''],
      roundingTime: [''],
    });
  }

  getShifts() {
    this.loading = false;

    this.profileService
      .getTypeValues('mesailer')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == 1) {
            this.shifts = [...data];
            console.log('Mesai Birimleri : ', this.shifts);
            this.selectShift(this.shifts[0]);
            setTimeout(() => {
              this.loading = true;
              this.ref.detectChanges();
            }, 1000);
          }
        }
      );
  }

  selectShift(shift: OKodFieldsModel) {
    this.selectedShift = shift;

    // this.fadeInDanger = true;
    // setTimeout(() => {
    //   if (this.fadeInDanger) {
    //     this.fadeInDanger = false;
    //   }
    //   this.ref.detectChanges();
    // }, 3000);

    this.getShiftDefinition(shift);
    this.getOvertimePart();
    this.getResting();
    this.getMovementRounding(shift);
    this.getTimeRounding(shift);
  }

  getShiftDefinition(shift: any) {
    var sp: any[] = [
      {
        mkodu: 'yek140',
        id: shift.ID.toString(),
        kaynak: 'mesailer',
      },
    ];

    console.log('Mesai Tanım Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }

        var shiftDefinition = [...data];
        console.log('Mesai Tanımı Geldi: ', shiftDefinition);

        this.matchDefinition(shiftDefinition[0]);
      });
  }

  // matchDefinition(definition:any) {
  //   const timeFormatPipe = new TimeFormatPipe();

  //   this.form.get("shiftName")?.setValue(definition.Aciklama);
  //   this.form.get("shiftCode")?.setValue(definition.Kod);
  //   this.form.get("startTime")?.setValue(definition.MesaiBas);

  //   // this.form.get("startTime")?.setValue(timeFormatPipe.transform(definition.MesaiBas));
  //   this.form.get("plus")?.setValue(timeFormatPipe.transform(definition.artiek));
  //   this.form.get("minus")?.setValue(timeFormatPipe.transform(definition.eksiek));
  //   this.form.get("endTime")?.setValue(definition.MesaiBit);
  //   this.form.get("maxWorkingTime")?.setValue(timeFormatPipe.transform(definition.EncokSure));
  //   this.form.get("overtimePercentage")?.setValue(definition.FazlaMesaiYuzde);
  //   this.form.get("incompleteTimeZone")?.setValue(definition.EksikMesaiYuzde);
  //   this.form.get("minOvertimeTime")?.setValue(timeFormatPipe.transform(definition.EnAzFazlaMesai));
  //   this.form.get("maxOvertimeTime")?.setValue(timeFormatPipe.transform(definition.EnCokFazlaMesai));
  //   this.form.get("mostEarlyDuration")?.setValue(timeFormatPipe.transform(definition.encokerken));
  //   this.form.get("inputTolerance")?.setValue(timeFormatPipe.transform(definition.GirisTolerans));
  //   this.form.get("outputTolerance")?.setValue(timeFormatPipe.transform(definition.CikisTolerans));

  // }

  matchDefinition(definition: any) {
    const timeFormatPipe = new TimeFormatPipe();
    const formControls = [
      { control: 'shiftName', newValue: definition.Aciklama },
      { control: 'shiftCode', newValue: definition.Kod },
      { control: 'startTime', newValue: definition.MesaiBas },
      { control: 'plus', newValue: timeFormatPipe.transform(definition.artiek)},
      { control: 'minus', newValue: timeFormatPipe.transform(definition.eksiek)},
      { control: 'endTime', newValue: definition.MesaiBit},
      { control: 'maxWorkingTime', newValue: timeFormatPipe.transform(definition.EncokSure)},
      { control: 'overtimePercentage', newValue: definition.FazlaMesaiYuzde},
      { control: 'incompleteTimeZone', newValue: definition.EksikMesaiYuzde},
      { control: 'minOvertimeTime', newValue: timeFormatPipe.transform(definition.EnAzFazlaMesai)},
      { control: 'maxOvertimeTime', newValue: timeFormatPipe.transform(definition.EnCokFazlaMesai)},
      { control: 'mostEarlyDuration', newValue: timeFormatPipe.transform(definition.encokerken)},
      { control: 'inputTolerance', newValue: timeFormatPipe.transform(definition.GirisTolerans)},
      { control: 'outputTolerance', newValue: timeFormatPipe.transform(definition.CikisTolerans)}
    ];

    formControls.forEach(({ control, newValue }) => {
      const formControl = this.form.get(control);
      if (formControl && formControl.value !== newValue) {
        // Önceki animasyon varsa iptal 
        if (this.fadeInDanger[control]?.timeoutId) {
          clearTimeout(this.fadeInDanger[control].timeoutId);
        }

        // Animasyonu başladı
        this.fadeInDanger[control] = { active: true };

        formControl.setValue(newValue);

        // Yeni animasyonu ayarladım
        this.fadeInDanger[control].timeoutId = setTimeout(() => {
          this.fadeInDanger[control].active = false;
          this.fadeInDanger[control].timeoutId = null;
          this.ref.detectChanges();
        }, 3000); // 3 saniye süre ile çalışacak
      } else {
        // Eğer değer aynıysa animasyonu devre dışı bırak
        if (this.fadeInDanger[control]?.timeoutId) {
          clearTimeout(this.fadeInDanger[control].timeoutId);
        }
        this.fadeInDanger[control] = { active: false };
      }
    });
  }

  addShiftDefinition() {
    var sp: any[] = [
      {
        mkodu: 'yek141',
        id: '0',
        kaynak: 'mesailer',
        mesaibas: this.form.get('startTime')?.value,
        mesaibit: this.form.get('endTime')?.value,
        encoksure: this.form.get('maxWorkingTime')?.value,
        enazsure: '00:00',
        enazfm: this.form.get('minOvertimeTime')?.value,
        fmhassasiyet: '00:01',
        fmyuzde: this.form.get('overtimePercentage')?.value.toString(),
        emyuzde: this.form.get('incompleteTimeZone')?.value.toString(),
        egyuzde: '0',
        fmyuvarlama: '00:00',
        mesaiadi: this.form.get('shiftName')?.value,
        mesaikodu: this.form.get('shiftCode')?.value,
        encokfm: this.form.get('maxOvertimeTime')?.value,
        encokem: this.form.get('minOvertimeTime')?.value,
        giristol: this.form.get('inputTolerance')?.value,
        cikistol: this.form.get('outputTolerance')?.value,
        artiek: this.form.get('plus')?.value,
        eksiek: this.form.get('minus')?.value,
      },
    ];

    console.log('Mesai Tanımı Ekleme Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Mesai Tanımı Eklendi: ', data);

        this.toastrService.success(
          this.translateService.instant('Yeni_Mesai_Tipi_Eklendi'),
          this.translateService.instant('Başarılı')
        );
        this.shifts = [...data];
      });
  }

  saveShiftDefinition() {
    var sp: any[] = [
      {
        mkodu: 'yek141',
        id: this.selectedShift.ID.toString(),
        kaynak: 'mesailer',
        mesaibas: this.form.get('startTime')?.value,
        mesaibit: this.form.get('endTime')?.value,
        encoksure: this.form.get('maxWorkingTime')?.value,
        enazsure: '00:00',
        enazfm: this.form.get('minOvertimeTime')?.value,
        fmhassasiyet: '00:01',
        fmyuzde: this.form.get('overtimePercentage')?.value.toString(),
        emyuzde: this.form.get('incompleteTimeZone')?.value.toString(),
        egyuzde: '0',
        fmyuvarlama: '00:00',
        mesaiadi: this.form.get('shiftName')?.value,
        mesaikodu: this.form.get('shiftCode')?.value,
        encokfm: this.form.get('maxOvertimeTime')?.value,
        encokem: this.form.get('minOvertimeTime')?.value,
        giristol: this.form.get('inputTolerance')?.value,
        cikistol: this.form.get('outputTolerance')?.value,
        artiek: this.form.get('plus')?.value,
        eksiek: this.form.get('minus')?.value,
      },
    ];

    console.log('Mesai Tanımı Kaydetme Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Mesai Tanımı Kaydedildi: ', data);

        this.toastrService.success(
          this.translateService.instant('Mesai_Tipi_Kaydedildi'),
          this.translateService.instant('Başarılı')
        );
        this.shifts = [...data];
      });
  }

  deleteShift() {
    var sp: any[] = [
      {
        mkodu: 'yek125',
        kaynak: 'mesailer',
        id: this.selectedShift.ID.toString(),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc != 1) {
            return;
          }

          console.log(this.selectedShift, ' Kaldırıldı : ', data);
          this.toastrService.success(
            this.translateService.instant('Tanım_Kaldırıldı'),
            this.translateService.instant('Başarılı')
          );

          this.getShifts();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  getOvertimePart() {
    var sp: any[] = [
      {
        mkodu: 'yek142',
        mesaiid: this.selectedShift.ID.toString(),
      },
    ];

    console.log('FM Bölümleri Tanım Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }

        var overtimePart = [...data];
        console.log('FM Bölümleri Tanımı Geldi: ', overtimePart);

        this.matchOvertimeDefinition(overtimePart[0]);
      });
  }

  matchOvertimeDefinition(item: any) {
    const timeFormatPipe = new TimeFormatPipe();

    this.form
      .get('overtimeOneStartTime')
      ?.setValue(timeFormatPipe.transform(item.XFM1Basi));
    this.form
      .get('overtimeOneEndTime')
      ?.setValue(timeFormatPipe.transform(item.XFM1Sonu));
    this.form
      .get('overtimeTwoStartTime')
      ?.setValue(timeFormatPipe.transform(item.XFM2Basi));
    this.form
      .get('overtimeTwoEndTime')
      ?.setValue(timeFormatPipe.transform(item.XFM2Sonu));
  }

  changeTabMenu(event: any) {
    if (event.tab) {
      if (event.index == 0) {
        this.selectedIndex = event.index;
        // this.getShifts();
      } else if (event.index == 1) {
        this.selectedIndex = event.index;
      } else if (event.index == 2) {
        this.selectedIndex = event.index;
      } else if (event.index == 3) {
        this.selectedIndex = event.index;
      }
    }
  }

  saveOvertimePart() {
    var sp: any[] = [
      {
        mkodu: 'yek143',
        mesaiid: this.selectedShift.ID.toString(),
        xfm1bas: this.form.get('overtimeOneStartTime')?.value,
        xfm1bit: this.form.get('overtimeOneEndTime')?.value,
        xfm2bas: this.form.get('overtimeTwoStartTime')?.value,
        xfm2bit: this.form.get('overtimeTwoEndTime')?.value,
      },
    ];

    console.log('FM Bölümleri Güncelle Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }

        console.log('FM Bölümü Güncellendi :', data);

        this.toastrService.success(
          this.translateService.instant('FM_Bölümleri_Kaydedildi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  getResting() {
    var sp: any[] = [
      {
        mkodu: 'yek140',
        id: this.selectedShift.ID.toString(),
        kaynak: 'dinlenmeler',
      },
    ];

    console.log('Mesai Dinlenmeler Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.resting = [...data];
        console.log('Mesai Dinlenmeler Geldi: ', this.resting);
      });
  }

  addResting() {
    var sp: any[] = [
      {
        mkodu: 'yek144',
        id: this.selectedShift.ID.toString(),
        kaynak: 'dinlenmeler',
        ad: this.form.get('restDescription')?.value,
        saat1: this.form.get('restStartTime')?.value,
        saat2: this.form.get('restEndTime')?.value,
        sure: this.form.get('restTime')?.value || '00:00',
        duzensiz: this.form.get('restIrregular')?.value ? '1' : '0',
      },
    ];

    console.log('Mesai Dinlenmeler Ekle Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Mesai Dinlenmeler Eklendi: ', data);
        this.resting = [...data];

        this.toastrService.success(
          this.translateService.instant('Dinlenme_Eklendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  deleteResting(resting: any) {
    var sp: any[] = [
      {
        mkodu: 'yek145',
        id: resting.ID.toString(),
        kaynak: 'dinlenmeler',
      },
    ];

    console.log('Mesai Dinlenmeler Sil Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Mesai Dinlenme Silindi: ', data);

        this.resting = [...data];
        this.toastrService.success(
          this.translateService.instant('Dinlenme_Kaldırıldı'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  updateRestIrregular(resting: any) {
    var sp: any[] = [
      {
        mkodu: 'yek149',
        id: resting.ID.toString(),
        mesaiid: this.selectedShift.ID.toString(),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Mesai Dinlenme Düzensiz Değişti: ', data);

        this.resting = [...data];
        this.toastrService.success(
          this.translateService.instant('Değer_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  updateRestOvertime(resting: any) {
    var sp: any[] = [
      {
        mkodu: 'yek147',
        id: resting.ID.toString(),
        mesaiid: this.selectedShift.ID.toString(),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Mesai Dinlenme FM Değişti: ', data);

        this.resting = [...data];
        this.toastrService.success(
          this.translateService.instant('Değer_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  updateRestNightShift(resting: any) {
    var sp: any[] = [
      {
        mkodu: 'yek146',
        id: resting.ID.toString(),
        mesaiid: this.selectedShift.ID.toString(),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Mesai Dinlenme GV Değişti: ', data);

        this.resting = [...data];
        this.toastrService.success(
          this.translateService.instant('Değer_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  updateRestPublicHoliday(resting: any) {
    var sp: any[] = [
      {
        mkodu: 'yek148',
        id: resting.ID.toString(),
        mesaiid: this.selectedShift.ID.toString(),
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        console.log('Mesai Dinlenme RT Değişti: ', data);

        this.resting = [...data];
        this.toastrService.success(
          this.translateService.instant('Değer_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  selectRoundingType(type: any) {
    this.roundingType = type;
  }

  getMovementRounding(shift: any) {
    var sp: any[] = [
      {
        mkodu: 'yek140',
        id: shift.ID.toString(),
        kaynak: 'yuvarlamalar',
      },
    ];

    console.log('Hareket Yuvarlama Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.movementRoundings = [...data];
        console.log('Hareket Yuvarlama Geldi: ', this.movementRoundings);
      });
  }

  getTimeRounding(shift: any) {
    var sp: any[] = [
      {
        mkodu: 'yek150',
        mesaiid: shift.ID.toString(),
      },
    ];

    console.log('Süre Yuvarlama Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        this.timeRoundings = [...data];
        console.log('Süre Yuvarlama Geldi: ', this.timeRoundings);
      });
  }

  addRounding(source: any) {
    var sp: any[] = [
      {
        mkodu: 'yek151',
        id: this.selectedShift.ID.toString(),
        kaynak: source,
        yon: this.form.get('target')?.value,
        saat1: this.form.get('roundingStart')?.value,
        saat2: this.form.get('roundingEnd')?.value,
        saat3: this.form.get('roundingTime')?.value,
      },
    ];

    console.log('Yuvarlama Ekle Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        if (this.roundingType == 1) {
          this.movementRoundings = [...data];
          console.log('Hareket Yuvarlama Eklendi: ', this.movementRoundings);
        } else {
          this.timeRoundings = [...data];
          console.log('Süre Yuvarlama Eklendi: ', this.timeRoundings);
        }

        this.toastrService.success(
          this.translateService.instant('Yuvarlama_Eklendi'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  deleteRounding(rounding: any, source: any) {
    var sp: any[] = [
      {
        mkodu: 'yek145',
        id: rounding.ID.toString(),
        kaynak: source,
      },
    ];

    console.log('Yuvarlama Sil Parametre : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc == -1) {
          return;
        }

        if (this.roundingType == 1) {
          this.movementRoundings = [...data];
          console.log('Hareket Yuvarlama Silindi: ', this.movementRoundings);
        } else {
          this.timeRoundings = [...data];
          console.log('Süre Yuvarlama Silindi: ', this.timeRoundings);
        }

        this.toastrService.success(
          this.translateService.instant('Yuvarlama_Kaldırıldı'),
          this.translateService.instant('Başarılı')
        );
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
