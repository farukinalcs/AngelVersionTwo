import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-permit-types',
  templateUrl: './permit-types.component.html',
  styleUrls: ['./permit-types.component.scss']
})
export class PermitTypesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject()

  form: FormGroup;
  permitTypes: any[] = [];
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
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getPermitTypes();
  }

  createForm() {
    this.form = this.formBuilder.group({
      code: [''],
      explanation: [''],
      hourlyPermission: [''],
      paid: [''],
      explanationRequired: [''],
      outOfSeniority: [''],
      job: [''],
      sickLeave: [''],
      visit: [''],
      compensationLeave: ['']
    });
  }

  getPermitTypes() {
    this.loading = false;
    
    var sp: any[] = [
      {
        mkodu: 'yek131'
      }
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
        console.log('izin tipleri: ', data);

        // this.permitTypes = data;    

        this.permitTypes = [...data];
        this.totalPages = Math.ceil(this.permitTypes.length / this.pageSize);
        setTimeout(() => {
          this.loading = true;
          this.ref.detectChanges();          
        }, 1000);
        
      });
  }
  
  selectType(type: any) {
    this.selectedType = type;
    
    this.form.get('explanation')?.setValue(this.selectedType.ad);
    this.form.get('code')?.setValue(this.selectedType.kod);
    this.form.get('hourlyPermission')?.setValue(this.selectedType.saatlikizin);
    this.form.get('paid')?.setValue(this.selectedType.ucretli);
    this.form.get('explanationRequired')?.setValue(this.selectedType.aciklamazorunlu);
    this.form.get('outOfSeniority')?.setValue(this.selectedType.kidemdisi);
    this.form.get('job')?.setValue(this.selectedType.gorevli);
    this.form.get('sickLeave')?.setValue(this.selectedType.sgk);
    this.form.get('visit')?.setValue(this.selectedType.vizite);
    this.form.get('compensationLeave')?.setValue(this.selectedType.denklestirme);
  }

  deletePermission() {
    var sp: any[] = [
      {
        mkodu: 'yek132',
        id: this.selectedType.id.toString()
      }
    ];

    console.log("İzin Tipi Sil Parametreleri : ", sp);
    
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
          this.translateService.instant('Seçili_İzin_Silindi'),
          this.translateService.instant('Başarılı')
        );

        this.getPermitTypes();

      });
  }

  updatePermission() {
    var sp: any[] = [
      {
        mkodu: 'yek133',
        id: this.selectedType.id.toString(),
        kod: this.form.get('code')?.value,
        aciklama: this.form.get('explanation')?.value,
        saatlik: this.form.get('hourlyPermission')?.value ? '1' : '0',
        ucretli: this.form.get('paid')?.value ? '1' : '0',
        aciklamazorunlu: this.form.get('explanationRequired')?.value ? '1' : '0',
        kidemdisi: this.form.get('outOfSeniority')?.value ? '1' : '0',
        gorevli: this.form.get('job')?.value ? '1' : '0',
        sgk: this.form.get('sickLeave')?.value ? '1' : '0',
        vizite: this.form.get('visit')?.value ? '1' : '0',
        denklestirme: this.form.get('compensationLeave')?.value ? '1' : '0',
      }
    ];

    console.log("İzin Tipi Güncelle Parametreleri : ", sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Yeni izin tipi güncelle: ', data);

        this.toastrService.success(
          this.translateService.instant('İzin_Tipi_Güncellendi'),
          this.translateService.instant('Başarılı')
        );

        this.getPermitTypes();
        this.matchSelectedPermission();

      });
  }

  addPermission() {
    var sp: any[] = [
      {
        mkodu: 'yek134',
        kod: this.form.get('code')?.value,
        aciklama: this.form.get('explanation')?.value,
        saatlik: this.form.get('hourlyPermission')?.value ? '1' : '0',
        ucretli: this.form.get('paid')?.value ? '1' : '0',
        aciklamazorunlu: this.form.get('explanationRequired')?.value ? '1' : '0',
        kidemdisi: this.form.get('outOfSeniority')?.value ? '1' : '0',
        gorevli: this.form.get('job')?.value ? '1' : '0',
        sgk: this.form.get('sickLeave')?.value ? '1' : '0',
        vizite: this.form.get('visit')?.value ? '1' : '0',
        denklestirme: this.form.get('compensationLeave')?.value ? '1' : '0',
      }
    ];

    console.log("İzin Tipi Ekle Parametreleri : ", sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Yeni izin tipi ekle: ', data);

        this.toastrService.success(
          this.translateService.instant('Yeni_İzin_Tipi_Eklendi'),
          this.translateService.instant('Başarılı')
        );

        this.getPermitTypes();
      });
  }

  matchSelectedPermission() {
    this.permitTypes.forEach((type:any) => {
      if (this.selectedType.id == type.id) {
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
