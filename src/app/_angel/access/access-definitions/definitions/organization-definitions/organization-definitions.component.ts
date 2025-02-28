import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-organization-definitions',
  templateUrl: './organization-definitions.component.html',
  styleUrls: ['./organization-definitions.component.scss'],
})
export class OrganizationDefinitionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  // @Input() crud: any;
  crud: any;
  cardTitle: any;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  organizationList: any[] = [];
  loading: boolean = true;
  selectedItem: any;
  filterText: string = '';
  display: boolean = false;
  organizationName: string = '';
  companyAddress: string = '';
  companyPhone: string = '';
  companyType: any;
  companyTypes: any[] = [];
  header: any;
  type: any;

  tabList = [
    {id: 1, label: this.translateService.instant("Firma"), icon: "fa-solid fa-building", source: "cbo_firma", path: "company"},
    {id: 2, label: this.translateService.instant("Bölüm"), icon: "fa-solid fa-helmet-safety", source: "cbo_bolum", path: "department"},
    {id: 3, label: this.translateService.instant("Pozisyon"), icon: "fa-solid fa-clipboard-user", source: "cbo_pozisyon", path: "position"},
    {id: 4, label: this.translateService.instant("Görev"), icon: "fa-solid fa-list-check", source: "cbo_gorev", path: "job"},
    {id: 5, label: this.translateService.instant("Alt_Firma"), icon: "fa-solid fa-handshake", source: "cbo_altfirma", path: "sub-company"},
    {id: 6, label: this.translateService.instant("Direktörlük"), icon: "fa-solid fa-people-group", source: "cbo_direktorluk", path: "directorship"},
    {id: 7, label: this.translateService.instant("Yaka"), icon: "fa-brands fa-black-tie", source: "cbo_yaka", path: "collar"},
    {id: 11, label: this.translateService.instant("Belge_Tipi"), icon: "fa-solid fa-file", source: "cbo_belgetipi", path: "doc-type"},
    {id: 12, label: this.translateService.instant("Puantaj"), icon: "fa-solid fa-clock", source: "cbo_puantaj", path: "time-attendance"},
    {id: 15, label: this.translateService.instant("Ayrılış_Nedeni"), icon: "fa-solid fa-clipboard-question", source: "sys_ayrilisnedeni", path: "leave-reason"}
  ];
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const crudKey = data['crud'];
      this.crud = this.tabList.find(tab => tab.source === crudKey);

      if (this.crud) {
        this.cardTitle = this.crud.label + ' ' + this.translateService.instant('Tanımları');
        console.log('CRUD: ', this.crud);
        this.getOrganizationList();
      } else {
        console.warn("CRUD verisi bulunamadı.");
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

  getPageNumbers(): (string | number)[] {
    const pages: (string | number)[] = [];

    if (this.totalPages <= 6) {
      // Sayfa sayısı 6 veya daha azsa, tüm sayfaları göster
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // İlk 3, son 3 sayfa ve gerekirse "..." ekleme
      pages.push(1, 2, 3);

      if (this.pageNumber > 4) {
        pages.push('...');
      }

      const startPage = Math.max(4, this.pageNumber - 1);
      const endPage = Math.min(this.totalPages - 3, this.pageNumber + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (this.pageNumber < this.totalPages - 3) {
        pages.push('...');
      }

      pages.push(this.totalPages - 2, this.totalPages - 1, this.totalPages);
    }

    return pages;
  }

  // Yardımcı fonksiyon: Bu fonksiyon sayfanın `number` olup olmadığını kontrol eder.
  isNumber(value: any): value is number {
    return typeof value === 'number';
  }

  getOrganizationList() {
    // this.loading = false;

    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: this.crud.source,
        id: '0',
      },
    ];

    console.log('Organisazyon Göster Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          console.log('organizasyon listesi geldi: ', data);

          this.organizationList = [...data];
          this.totalPages = Math.ceil(
            this.organizationList.length / this.pageSize
          );
          // setTimeout(() => {
          //   this.loading = true;
          //   this.ref.detectChanges();
          // }, 1000);
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  openDialog(type: any, item?: any) {
    this.type = type;
    if (type == 'i') {
      this.header =
        this.crud.label + ' ' + this.translateService.instant('Ekle');
    } else {
      this.header =
        this.crud.label + ' ' + this.translateService.instant('Güncelle');
      this.organizationName = item.Ad;
      this.selectedItem = item;

      if (this.crud.id == 1) {
        this.getSelectedCompanyType(item);
      }
    }

    this.display = true;
    if (this.crud.id == 1) {
      this.getCompanyType();
    }
  }

  closeAction() {
    this.display = false;
    this.organizationName = '';
    this.companyAddress = '';
    this.companyPhone = '';
    this.companyType = '';
  }

  getCompanyType() {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: 'firmatip',
        id: '0',
      },
    ];

    console.log('Firma Tipleri Göster Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          console.log('Firma Tipleri geldi: ', data);

          this.companyTypes = [...data];
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  getSelectedCompanyType(item: any) {
    var sp: any[] = [
      {
        mkodu: 'yek165',
        id: item.ID.toString(),
      },
    ];

    console.log('Seçilen Firma Bilgileri Göster Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          console.log('Seçilen Firma Bilgileri geldi: ', data);
          this.companyAddress = data[0].FAdres;
          this.companyPhone = data[0].FTelefon;
          this.companyType = data[0].FTip;
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  add() {
    let sp: any[] = [];

    // let sp: any[] = [this.crud?.add || {}];

    // if (this.crud.id === 1) {
    //   Object.assign(sp[0], {
    //     ad: this.organizationName,
    //     telefon: this.companyPhone,
    //     adres: this.companyAddress,
    //     tip: this.companyType,
    //   });
    // } else {
    //   sp[0].ad = this.organizationName;
    // }

    if (this.crud.id == 1) {
      sp.push({
        mkodu: 'yek163',
        ad: this.organizationName,
        telefon: this.companyPhone,
        adres: this.companyAddress,
        tip: this.companyType,
        // fotoimage: '',
      });
    } else {
      sp.push({
        mkodu: 'yek123',
        kaynak: this.crud.source,
        id: '0',
        ad: this.organizationName,
      });
    }

    console.log('Organisazyon Ekle Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }

          console.log('Eklendi :', data);
          this.toastrService.success(
            this.crud.label + ' ' + this.translateService.instant('Eklendi'),
            this.translateService.instant('Başarılı')
          );

          this.getOrganizationList();
          this.closeAction();

          // if (this.crud == 1) {
          //   this.getOrganizationList();

          // } else {
          //   this.organizationList = [...data];
          // }
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  update() {
    let sp: any[] = [];
    // let sp: any[] = [this.crud?.update || {}];

    // if (this.crud.id === 1) {
    //   Object.assign(sp[0], {
    //     ad: this.organizationName,
    //     telefon: this.companyPhone,
    //     adres: this.companyAddress,
    //     tip: this.companyType,
    //     id: this.selectedItem.ID.toString()
    //   });
    // } else {
    //   Object.assign(sp[0], {
    //     ad: this.organizationName,
    //     id: this.selectedItem.ID.toString()
    //   });
    // }

    if (this.crud.id == 1) {
      sp.push({
        mkodu: 'yek164',
        ad: this.organizationName,
        telefon: this.companyPhone,
        adres: this.companyAddress,
        tip: this.companyType,
        id: this.selectedItem.ID.toString(),
      });
    } else {
      sp.push({
        mkodu: 'yek124',
        kaynak: this.crud.source,
        ad: this.organizationName,
        id: this.selectedItem.ID.toString(),
      });
    }

    console.log('Organisazyon Güncelle Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }

          console.log('Eklendi :', data);
          this.toastrService.success(
            this.crud.label +
              ' ' +
              this.translateService.instant('Güncellendi'),
            this.translateService.instant('Başarılı')
          );

          this.getOrganizationList();
          this.closeAction();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  delete(item: any) {
    var sp: any[] = [
      {
        mkodu: 'yek125',
        kaynak: this.crud.source,
        id: item.ID.toString(),
      },
    ];

    console.log('Organisazyon Sil Paramatreleri :', sp);

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }

          console.log(item, ' Kaldırıldı : ', data);
          this.toastrService.success(
            this.crud.label + ' ' + this.translateService.instant('Kaldırıldı'),
            this.translateService.instant('Başarılı')
          );

          this.getOrganizationList();
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}