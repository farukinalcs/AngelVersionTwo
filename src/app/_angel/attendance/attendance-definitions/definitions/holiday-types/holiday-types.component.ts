import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-holiday-types',
  templateUrl: './holiday-types.component.html',
  styleUrls: ['./holiday-types.component.scss'],
})
export class HolidayTypesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  form: FormGroup;
  holidayTypes: any[] = [];
  selectedType: any;
  loading: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getHolidayTypes();
  }

  createForm() {
    this.form = this.formBuilder.group({
      code: [''],
      explanation: [''],
      date: [''],
      fixed: [''],
      halfDay: [''],
      startTime: ['']
    });
  }

  getHolidayTypes() {
    this.loading = false;

    var sp: any[] = [
      {
        mkodu: 'yek136',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('tatil tipleri: ', data);

        this.holidayTypes = data.map((item:any) => {
          return {
            ...item,
            Tarih: this.formatDate(item.Tarih),
          };
        });

        this.totalPages = Math.ceil(this.holidayTypes.length / this.pageSize);
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();
        }, 1000);
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  selectType(type: any) {
    this.selectedType = type;

    this.form.get('explanation')?.setValue(this.selectedType.Aciklama);
    this.form.get('code')?.setValue(this.selectedType.Kod);
    this.form.get('date')?.setValue(this.selectedType.Tarih);
    this.form.get('startTime')?.setValue(this.selectedType.Bassaat);
    this.form.get('fixed')?.setValue(this.selectedType.Sabit);
    this.form.get('halfDay')?.setValue(this.selectedType.YarimGun == 1 ? true : false);
  }

  deleteHolidayType() {
    var sp: any[] = [
      {
        mkodu: 'yek139',
        id: this.selectedType.Id.toString(),
      },
    ];

    console.log('Tatil Tipi Sil Parametreleri : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('izin tipi sil: ', data);

        this.toastrService.success(
          this.translateService.instant('Tatil_Tipi_Silindi'),
          this.translateService.instant('Başarılı')
        );

        this.getHolidayTypes();
      });
  }

  updateHolidayType() {
    var sp: any[] = [
      {
        mkodu: 'yek138',
        id: this.selectedType.Id.toString(),
        kod: this.form.get('code')?.value,
        aciklama: this.form.get('explanation')?.value,
        sabit: this.form.get('fixed')?.value ? '1' : '0',
        yarimgun: this.form.get('halfDay')?.value ? '1' : '0',
        tatilbas: this.form.get('startDate')?.value,
        tarih: this.form.get('date')?.value,
      },
    ];

    console.log('Tatil Tipi Güncelle Parametreleri : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Tatil tipi güncelle: ', data);

        this.toastrService.success(
          this.translateService.instant('Tatil_Tipi_Güncellendi'),
          this.translateService.instant('Başarılı')
        );

        this.getHolidayTypes();
        this.matchSelectedHolidayType();
      });
  }

  addHolidayType() {
    var sp: any[] = [
      {
        mkodu: 'yek137',
        kod: this.form.get('code')?.value,
        aciklama: this.form.get('explanation')?.value,
        sabit: this.form.get('fixed')?.value ? '1' : '0',
        yarimgun: this.form.get('halfDay')?.value ? '1' : '0',
        tatilbas: this.form.get('startDate')?.value,
        tarih: this.form.get('date')?.value,
      },
    ];

    console.log('Tatil Tipi Ekle Parametreleri : ', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Yeni tatil tipi ekle: ', data);

        this.toastrService.success(
          this.translateService.instant('Yeni_Tatil_Tipi_Eklendi'),
          this.translateService.instant('Başarılı')
        );

        this.getHolidayTypes();
      });
  }

  matchSelectedHolidayType() {
    this.holidayTypes.forEach((type: any) => {
      if (this.selectedType.Id == type.Id) {
        this.selectedType = type;
      }
    });
  }

  goToFirstPage() {
    this.pageNumber = 1;
  }

  goToLastPage() {
    this.pageNumber = this.totalPages;
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
