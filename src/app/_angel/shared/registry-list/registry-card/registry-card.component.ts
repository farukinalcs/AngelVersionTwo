import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { resetAllForms } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { AccessGroupComponent } from './access-group/access-group.component';
import { AccessInfoComponent } from './access-info/access-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { CustomInfoComponent } from './custom-info/custom-info.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { RegisterAuthorizedAreasComponent } from './register-authorized-areas/register-authorized-areas.component';
import { ShiftInfoComponent } from './shift-info/shift-info.component';

@Component({
  selector: 'app-registry-card',
  templateUrl: './registry-card.component.html',
  styleUrls: ['./registry-card.component.scss']
})
export class RegistryCardComponent implements OnInit, OnDestroy, OnChanges{
  private ngUnsubscribe = new Subject();
  @Input() operationType: any;
  @Input() fromWhere: any[];
  @Input() display: boolean;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Input() selectedRegister: any;
  header: any = "";
  isDetailsOpen = true;
  tabs: any[] = [
    {id: 1, label: this.translateService.instant('Kişisel_Bilgileri'), action: ['u', 'i']},
    {id: 2, label: this.translateService.instant('İletişim_Bilgileri'), action: ['u', 'i']},
    {id: 3, label: this.translateService.instant('Organizasyon_Bilgileri'), action: ['u', 'i']},
    {id: 4, label: this.translateService.instant('Özel_Bilgileri_(1)'), action: ['u', 'i']},
    {id: 5, label: this.translateService.instant('Özel Bilgileri_(2)'), action: ['u', 'i']},
    {id: 6, label: this.translateService.instant('Mesai_Bilgileri'), action: ['u', 'i']},
    {id: 7, label: this.translateService.instant('Kart_RF_Parmak_Yüz_Bilgileri'), action: ['u']},
    {id: 8, label: this.translateService.instant('Geçiş_Grupları'), action: ['u']},
    // {id: 9, label: this.translateService.instant('Sicil_Yetkileri'), action: ['u']},
    {id: 10, label: this.translateService.instant('Program_Kullanımı'), action: ['u']},
    {id: 11, label: this.translateService.instant('Sicil_Geçmiş'), action: ['u']},
    {id: 12, label: this.translateService.instant('Çalışma_Dönemleri'), action: ['u']},
    {id: 13, label: this.translateService.instant('Belgeler'), action: ['u']},
    {id: 14, label: this.translateService.instant('Splitler'), action: ['u']},
    {id: 15, label: this.translateService.instant('Zimmet'), action: ['u', 'i']}
  ];
  selectedIndex: any = 1;
  @ViewChildren(PersonalInfoComponent) personalInfoComponents!: QueryList<PersonalInfoComponent>;
  @ViewChildren(ContactInfoComponent) contactInfoComponents!: QueryList<ContactInfoComponent>;
  @ViewChildren(OrganizationInfoComponent) organizationInfoComponents!: QueryList<OrganizationInfoComponent>;
  @ViewChildren(CustomInfoComponent) customInfoComponents!: QueryList<CustomInfoComponent>;
  @ViewChildren(ShiftInfoComponent) shiftInfoComponents!: QueryList<ShiftInfoComponent>;
  @ViewChildren(AccessInfoComponent) accessInfoComponents!: QueryList<AccessInfoComponent>;
  @ViewChildren(AccessGroupComponent) accessGroupComponents!: QueryList<AccessGroupComponent>;
  @ViewChildren(RegisterAuthorizedAreasComponent) authorizedAreasComponents!: QueryList<RegisterAuthorizedAreasComponent>;
  name: any;
  surname: any;
  department: any;
  seniority: any = "-"
  left: any = "-"
  used: any = "-"
  isEdit: boolean = false;
  birthday: any = "";
  employmentDate: any = "";
  registerDetail: any[] = [];
  vacationDetail: any[] = [];
  registerId: any;
  responsiveOptions: any[] | undefined = [];
  loading: boolean = false;

  // @ViewChild('slider') slider!: ElementRef;
  // items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
  // isDragging = false;
  // startX = 0;
  // startScrollLeft = 0;
  // scrollInterval: any; // Kaydırma işlemini kontrol için
  constructor(
    private profileService : ProfileService,
    private translateService : TranslateService,
    private store: Store,
    private storeForm: Store<{ form: FormState }>,
    private toastrService: ToastrService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tabs = this.tabs.filter((tab:{action:any[]}) => tab.action.includes(this.operationType));
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '1100px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operationType']) {
      console.log('İşlem Türü Değişti:', changes['operationType'].currentValue);
      if (this.operationType === 'i') {
        this.translateService.get('Yeni_Sicil_Ekle').subscribe((res: string) => {
          this.header = res;
        });
      } else if (this.operationType === 'u') {
        this.translateService.get('Sicil_Güncelle').subscribe((res: string) => {
          this.header = res;
        });
        this.getRegisterDetail();
        this.getVacationDetail();
      }
    }
  }

  close() {
    this.closeEvent.emit(false);
  }


  toggleDetails(): void {
    this.isDetailsOpen = !this.isDetailsOpen;
  }

  changeTabMenu(event: any) {
    this.selectedIndex = event;
    // if (event.tab) {
    //   this.selectedIndex = event.index;
    // }
  }

  collectAllFormData() {
    let personalInfoValid; 
    this.personalInfoComponents.map((component) => {
      personalInfoValid = component.form.valid
    });
    const personalInfoData = this.personalInfoComponents.map((component) => {component.form.value});
    const contactInfoData = this.contactInfoComponents.map((component) => component.form.value);
    const organizationInfoData = this.organizationInfoComponents.map((component) => component.form.value);
    const customInfoData = this.customInfoComponents.map((component) => component.form.value);
    const shiftInfoData = this.shiftInfoComponents.map((component) => component.form.value);
    const accessInfoData = this.accessInfoComponents.map((component) => component.form.value);
    const accessGroupData = this.accessGroupComponents.map((component) => component.addedGroups);
    const authorizedAreaData = this.authorizedAreasComponents.map((component) => component.devices);



    console.log('Personal Info Data:', personalInfoData);
    console.log('Contact Info Data:', contactInfoData);
    console.log('organizationInfoData:', organizationInfoData);
    console.log('customInfoData:', customInfoData);
    console.log('shiftInfoData:', shiftInfoData);
    console.log('accessInfoData:', accessInfoData);
    console.log('accessGroupData:', accessGroupData);
    console.log('authorizedAreaData:', authorizedAreaData);

    
    let value: any;
    this.storeForm.select('form').pipe(take(1)).subscribe((state) => {
      console.log("STATE : ", state);
      value = state;
    });

    if (!personalInfoValid) {
      this.toastrService.warning(
        this.translateService.instant('Ad_Ve_Soyad_Boş_Geçilemez!'),
        this.translateService.instant('HATA')
      );
      return;
    }

    if (this.operationType == 'i') {
      this.addNewRegister(value);
    }

  }

  formEvent(event: any) {
    this.name =event?.name || this.translateService.instant("Ad");
    this.surname = event?.surname || this.translateService.instant("Soyad");
  }

  organizationFormEvent(event: any) {
    this.department = event.department?.Ad || this.translateService.instant("Bölüm");
  }

  edit() {
    this.isEdit = !this.isEdit;
  }

  getRegisterDetail() {
    var sp: any[] = [
      {
        mkodu: 'yek209',
        id: this.selectedRegister?.Id.toString()
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Sicil Detay Geldi : ", data);

      this.registerDetail = [...data];

      this.name = this.registerDetail[0]?.ad;
      this.surname = this.registerDetail[0]?.soyad;
      this.birthday = this.registerDetail[0]?.dogumtarih?.split('T')[0];
      this.employmentDate = this.registerDetail[0]?.giristarih?.split('T')[0];
      this.department = this.selectedRegister?.bolumad;
      this.registerId = this.selectedRegister?.Id
    });
  }

  getVacationDetail() {
    var sp: any[] = [
      {
        mkodu: 'yek107',
        sicilid: this.selectedRegister?.Id.toString(),
        izintip: '3'
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Sicil İzin Detay Geldi : ", data);

      this.vacationDetail = [...data];

      this.left = this.vacationDetail[0]?.Kalan;
      this.seniority = this.vacationDetail[0]?.Kidem;
      this.used = this.vacationDetail[0]?.KullanilanYillikIzin;

    });
  }

  addNewRegister(value: any) {
    this.loading = true;
    console.log("Sicil Ekle:", value);

    var sp: any[] = [
      {
        mkodu: "yek218",
        ad: value.personalInfo?.name || "",
        soyad: value.personalInfo?.surname || "",
        sicilno: value.personalInfo?.registryNo || "",
        personelno: value.personalInfo?.personNo || "",
        firma: value.organizationInfo?.company?.ID?.toString() || "",
        bolum: value.organizationInfo?.department?.ID?.toString() || "",
        pozisyon: value.organizationInfo?.position?.ID?.toString() || "",
        gorev: value.organizationInfo?.job?.ID?.toString() || "",
        altfirma: value.organizationInfo?.subCompany?.ID?.toString() || "",
        direktorluk: value.organizationInfo?.directorship?.ID?.toString() || "",
        yaka: value.organizationInfo?.collar?.ID?.toString() || "",
        puantaj: value.organizationInfo?.timeAttendance?.ID?.toString() || "",
        kangrubu: value.personalInfo?.bloodGroup?.ID?.toString() || "",
        cinsiyet: value.personalInfo?.gender?.ID?.toString() || "",
        maastipi: value.shiftInfo?.salaryType?.ID?.toString() || "",
        adres: value.contactInfo?.address || "",
        il: value.contactInfo?.province || "",
        ilce: value.contactInfo?.town || "",
        email: value.contactInfo?.mail || "",
        dogumtarih: this.birthday,
        giristarih: this.employmentDate,
        telefon1: value.contactInfo?.tel || "",
        ceptelefon: value.contactInfo?.mobilePhone || "",
        okod1: value.customInfo?.okod1 || "",
        okod2: value.customInfo?.okod2 || "",
        okod3: value.customInfo?.okod3 || "",
        okod4: value.customInfo?.okod4 || "",
        okod5: value.customInfo?.okod5 || "",
        okod6: value.customInfo?.okod6 || "",
        okod7: value.customInfo?.okod7 || "",
        okod8: value.customInfo?.okod8 || "",
        okod9: value.customInfo?.okod9 || "",
        okod10: value.customInfo?.okod10 || "",
        okod11: value.customInfo?.okod11 || "",
        okod12: value.customInfo?.okod12 || "",
        okod13: value.customInfo?.okod13 || "",
        okod14: value.customInfo?.okod14 || "",
        okod15: value.customInfo?.okod15 || "",
        okod16: value.customInfo?.okod16 || "",
        okod17: value.customInfo?.okod17 || "",
        okod18: value.customInfo?.okod18 || "",
        okod19: value.customInfo?.okod19 || "",
        okod20: value.customInfo?.okod20 || "",
        cardid: value.accessInfo?.cardNumber || "",
        cardid26: value.accessInfo?.rfLabelNumber || "",
        facilitycode: value.accessInfo?.facilityNumber || "",
        fazlamesai: value.shiftInfo?.overtime ? "1" : "0",
        eksikmesai: value.shiftInfo?.missingTime ? "1" : "0",
        eksikfm: value.shiftInfo?.missingTimeOvertime ? "1" : "0",
        eksikfmas: value.shiftInfo?.overtime ? "1" : "0",
        erkenmesai: value.shiftInfo?.earlyWork ? "1" : "0",
        eksikgun: value.shiftInfo?.missingDay ? "1" : "0",
        gecezammi: value.shiftInfo?.nightRaise ? "1" : "0",
        master: value.accessInfo?.master ? "1" : "0",
        bypasscard: value.accessInfo?.passCard ? "1" : "0",
        userdef: value.accessInfo?.userDefinition.ID?.toString() || "",
      },
    ];

    console.log("Sicil i params:", sp);


    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Sicil Eklendi :", data);

      this.toastrService.success(
        this.translateService.instant('Sicil_Eklendi'),
        this.translateService.instant('Başarılı')
      );


      setTimeout(() => {
        this.loading = false;
        this.ref.detectChanges();
      }, 1000);

    }, () => {
      this.toastrService.error(
        this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
        this.translateService.instant('Hata')
      );
      this.router.navigate(['error/500']);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetAllForms());
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
