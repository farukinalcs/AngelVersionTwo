import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { resetAllForms } from 'src/app/store/actions/form.action';
import { insertRegisterSuccess, loadRegistersSuccess, updateRegisterSuccess } from 'src/app/store/actions/register.action';
import { AccessGroupState } from 'src/app/store/models/access-group.state';
import { FormState } from 'src/app/store/models/form.state';
import { selectAddedGroups } from 'src/app/store/selectors/access-group.selector';
import { selectAllRegisters } from 'src/app/store/selectors/register.selector';
import { RegisterAuthorizedAreasComponent } from '../registry-card/register-authorized-areas/register-authorized-areas.component';
import { AccessGroupComponent } from '../registry-card/access-group/access-group.component';
import { AccessInfoComponent } from '../registry-card/access-info/access-info.component';
import { ShiftInfoComponent } from '../registry-card/shift-info/shift-info.component';
import { CustomInfoComponent } from '../registry-card/custom-info/custom-info.component';
import { OrganizationInfoComponent } from '../registry-card/organization-info/organization-info.component';
import { ContactInfoComponent } from '../registry-card/contact-info/contact-info.component';
import { PersonalInfoComponent } from '../registry-card/personal-info/personal-info.component';
import { CommonModule } from '@angular/common';
import { SplitsComponent } from '../registry-card/splits/splits.component';
import { FilesComponent } from '../registry-card/files/files.component';
import { WorkingPeriodsComponent } from '../registry-card/working-periods/working-periods.component';
import { RegisterHistoryComponent } from '../registry-card/register-history/register-history.component';
import { ApplicationUseComponent } from '../registry-card/application-use/application-use.component';

@Component({
    selector: 'app-new-registry-card',
    standalone: true,
    imports: [
        CommonModule,
        SplitsComponent,
        FilesComponent,
        WorkingPeriodsComponent,
        RegisterHistoryComponent,
        ApplicationUseComponent,
        RegisterAuthorizedAreasComponent,
        AccessGroupComponent,
        AccessInfoComponent,
        ShiftInfoComponent,
        CustomInfoComponent,
        OrganizationInfoComponent,
        ContactInfoComponent,
        PersonalInfoComponent
    ],
    templateUrl: './new-registry-card.component.html',
    styleUrl: './new-registry-card.component.scss'
})
export class NewRegistryCardComponent implements OnInit, OnDestroy, OnChanges {
    private ngUnsubscribe = new Subject();
    @Input() operationType: any;
    @Input() fromWhere: any[];
    @Input() display: boolean;
    @Output() closeEvent = new EventEmitter<boolean>();
    @Input() selectedRegister: any;
    @Input() requestTime: any;
    header: any = "";
    isDetailsOpen = true;
    tabs: any[] = [
        { id: 1, label: this.translateService.instant('Kişisel_Bilgileri'), action: ['u', 'i'] },
        { id: 2, label: this.translateService.instant('İletişim_Bilgileri'), action: ['u', 'i'] },
        { id: 3, label: this.translateService.instant('Organizasyon_Bilgileri'), action: ['u', 'i'] },
        { id: 4, label: this.translateService.instant('Özel_Bilgileri_(1)'), action: ['u', 'i'] },
        { id: 5, label: this.translateService.instant('Özel Bilgileri_(2)'), action: ['u', 'i'] },
        { id: 6, label: this.translateService.instant('Mesai_Bilgileri'), action: ['u', 'i'] },
        { id: 7, label: this.translateService.instant('Kart_RF_Parmak_Yüz_Bilgileri'), action: ['u'] },
        { id: 8, label: this.translateService.instant('Geçiş_Grupları'), action: ['u'] },
        // {id: 9, label: this.translateService.instant('Sicil_Yetkileri'), action: ['u']},
        { id: 10, label: this.translateService.instant('Program_Kullanımı'), action: ['u'] },
        { id: 11, label: this.translateService.instant('Sicil_Geçmiş'), action: ['u'] },
        { id: 12, label: this.translateService.instant('Çalışma_Dönemleri'), action: ['u'] },
        { id: 13, label: this.translateService.instant('Belgeler'), action: ['u'] },
        { id: 14, label: this.translateService.instant('Splitler'), action: ['u'] },
        { id: 15, label: this.translateService.instant('Zimmet'), action: ['u', 'i'] }
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
    imageUrl: string;
    uploadedFile: any[] = [];
    timestamp = new Date().getTime();

    // @ViewChild('slider') slider!: ElementRef;
    // items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
    // isDragging = false;
    // startX = 0;
    // startScrollLeft = 0;
    // scrollInterval: any; // Kaydırma işlemini kontrol için
    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private store: Store,
        private storeForm: Store<{ form: FormState }>,
        private storeAccess: Store<AccessGroupState>,
        private toastrService: ToastrService,
        private router: Router,
        private ref: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.tabs = this.tabs.filter((tab: { action: any[] }) => tab.action.includes(this.operationType));
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
    }

    collectAllFormData() {
        let value: any;
        this.storeForm.select('form').pipe(take(1)).subscribe((state) => {
            console.log("STATE : ", state);
            value = state;
        });

        let accessGroupValue: any;
        this.storeAccess.pipe(select(selectAddedGroups)).pipe(take(1)).subscribe((state) => {
            console.log("Access Group State: ", state);
            accessGroupValue = state;
        });



        if (!value.personalInfo?.name || !value.personalInfo?.surname) {
            this.toastrService.warning(
                this.translateService.instant('Ad_Ve_Soyad_Boş_Geçilemez!'),
                this.translateService.instant('HATA')
            );
            return;
        }

        if (this.operationType == 'i') {
            this.addNewRegister(value);

        } else if (this.operationType == 'u') {
            this.updateRegister(value);
            this.updateAccessGroup(accessGroupValue);
            if (accessGroupValue.some((item: any) => item.isTemp)) {
                this.updateAccessGroupTemp(accessGroupValue);
            }


        }

    }


    formEvent(event: any) {
        this.name = event?.name || this.translateService.instant("Ad");
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

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
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

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
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
                dogumtarih: this.birthday || "",
                giristarih: this.employmentDate || "",
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
                userdef: value.accessInfo?.userDefinition.ID?.toString() || "1",
                zaman: this.requestTime
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

            if (data[0].tumveri == 0) {
                this.store.dispatch(insertRegisterSuccess({ register: data[0] }));
            } else {
                this.store.dispatch(loadRegistersSuccess({ registers: data }));
            }

            setTimeout(() => {
                this.loading = false;
                this.ref.detectChanges();
            }, 1000);

            this.close();
        }, () => {
            this.toastrService.error(
                this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                this.translateService.instant('Hata')
            );
            this.router.navigate(['error/500']);
            this.loading = false;
        });
    }

    updateRegister(value: any) {
        this.loading = true;
        console.log("Sicil Güncelle:", value);

        var sp: any[] = [
            {
                mkodu: "yek249",
                id: this.selectedRegister.Id.toString(),
                ad: value.personalInfo ? value.personalInfo?.name || "" : null,
                soyad: value.personalInfo ? value.personalInfo?.surname || "" : null,
                sicilno: value.personalInfo ? value.personalInfo?.registryNo || "" : null,
                personelno: value.personalInfo ? value.personalInfo?.personNo || "" : null,
                firma: value.organizationInfo ? value.organizationInfo?.company?.ID?.toString() || "" : null,
                bolum: value.organizationInfo ? value.organizationInfo?.department?.ID?.toString() || "" : null,
                pozisyon: value.organizationInfo ? value.organizationInfo?.position?.ID?.toString() || "" : null,
                gorev: value.organizationInfo ? value.organizationInfo?.job?.ID?.toString() || "" : null,
                altfirma: value.organizationInfo ? value.organizationInfo?.subCompany?.ID?.toString() || "" : null,
                direktorluk: value.organizationInfo ? value.organizationInfo?.directorship?.ID?.toString() || "" : null,
                yaka: value.organizationInfo ? value.organizationInfo?.collar?.ID?.toString() || "" : null,
                kangrubu: value.personalInfo ? value.personalInfo?.bloodGroup?.ID?.toString() || "" : null,
                cinsiyet: value.personalInfo ? value.personalInfo?.gender?.ID?.toString() || "" : null,
                maastipi: value.shiftInfo ? value.shiftInfo?.salaryType?.ID?.toString() || "" : null,
                adres: value.contactInfo ? value.contactInfo?.address || "" : null,
                il: value.contactInfo ? value.contactInfo?.province || "" : null,
                ilce: value.contactInfo ? value.contactInfo?.town || "" : null,
                email: value.contactInfo ? value.contactInfo?.mail || "" : null,
                dogumtarih: this.birthday || "",
                giristarih: this.employmentDate || "",
                telefon1: value.contactInfo ? value.contactInfo?.tel || "" : null,
                ceptelefon: value.contactInfo ? value.contactInfo?.mobilePhone || "" : null,
                okod1: value.customInfo ? value.customInfo?.okod1 || "" : null,
                okod2: value.customInfo ? value.customInfo?.okod2 || "" : null,
                okod3: value.customInfo ? value.customInfo?.okod3 || "" : null,
                okod4: value.customInfo ? value.customInfo?.okod4 || "" : null,
                okod5: value.customInfo ? value.customInfo?.okod5 || "" : null,
                okod6: value.customInfo ? value.customInfo?.okod6 || "" : null,
                okod7: value.customInfo ? value.customInfo?.okod7 || "" : null,
                okod8: value.customInfo ? value.customInfo?.okod8 || "" : null,
                okod9: value.customInfo ? value.customInfo?.okod9 || "" : null,
                okod10: value.customInfo ? value.customInfo?.okod10 || "" : null,
                okod11: value.customInfo ? value.customInfo?.okod11 || "" : null,
                okod12: value.customInfo ? value.customInfo?.okod12 || "" : null,
                okod13: value.customInfo ? value.customInfo?.okod13 || "" : null,
                okod14: value.customInfo ? value.customInfo?.okod14 || "" : null,
                okod15: value.customInfo ? value.customInfo?.okod15 || "" : null,
                okod16: value.customInfo ? value.customInfo?.okod16 || "" : null,
                okod17: value.customInfo ? value.customInfo?.okod17 || "" : null,
                okod18: value.customInfo ? value.customInfo?.okod18 || "" : null,
                okod19: value.customInfo ? value.customInfo?.okod19 || "" : null,
                okod20: value.customInfo ? value.customInfo?.okod20 || "" : null,
                cardid: value.accessInfo ? value.accessInfo?.cardNumber || "" : null,
                cardid26: value.accessInfo ? value.accessInfo?.rfLabelNumber || "" : null,
                facilitycode: value.accessInfo ? value.accessInfo?.facilityNumber || "" : null,
                fazlamesai: value.shiftInfo ? value.shiftInfo?.overtime ? "1" : "0" : null,
                eksikmesai: value.shiftInfo ? value.shiftInfo?.missingTime ? "1" : "0" : null,
                eksikfm: value.shiftInfo ? value.shiftInfo?.missingTimeOvertime ? "1" : "0" : null,
                eksikfmas: value.shiftInfo ? value.shiftInfo.overtime ? "1" : "0" : null,
                erkenmesai: value.shiftInfo ? value.shiftInfo?.earlyWork ? "1" : "0" : null,
                eksikgun: value.shiftInfo ? value.shiftInfo?.missingDay ? "1" : "0" : null,
                gecezammi: value.shiftInfo ? value.shiftInfo?.nightRaise ? "1" : "0" : null,
                master: value.accessInfo ? value.accessInfo?.master ? "1" : "0" : null,
                bypasscard: value.accessInfo ? value.accessInfo?.passCard ? "1" : "0" : null,
                puantaj: value.organizationInfo ? value.organizationInfo?.timeAttendance?.ID?.toString() || "" : null,
                userdef: value.accessInfo ? value.accessInfo?.userDefinition.ID?.toString() || "1" : null,
                zaman: this.requestTime
            },
        ];

        console.log("Sicil u params:", sp);


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(response => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Sicil Güncellendi :", data);

            this.toastrService.success(
                this.translateService.instant('Sicil_Güncellendi'),
                this.translateService.instant('Başarılı')
            );

            if (data[0].tumveri == 0) {
                this.store.dispatch(updateRegisterSuccess({ register: data[0] }));

                this.store.select(selectAllRegisters).subscribe((value) => {
                    console.log("TESTO :", value);
                })
            } else {
                this.store.dispatch(loadRegistersSuccess({ registers: data }));
            }



            setTimeout(() => {
                this.loading = false;
                this.ref.detectChanges();
            }, 1000);


            this.close();
        }, () => {
            this.toastrService.error(
                this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                this.translateService.instant('Hata')
            );
            this.router.navigate(['error/500']);
            this.loading = false;
        });
    }

    updateAccessGroup(accessGroupValue: any) {
        const matchAccessGroup = this.matchAccessGroup(accessGroupValue);

        var sp: any[] = [
            {
                mkodu: 'yek250',
                yetkistr: matchAccessGroup,
                id: this.selectedRegister.Id.toString()
            },
        ];
        console.log('Geçiş Grupları Param: ', sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }
                console.log('Geçiş Grupları Gönderildi: ', data);

            }, (err) => {
                this.toastrService.error(
                    this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                    this.translateService.instant('Hata')
                );
            });
    }

    matchAccessGroup(accessGroup: any) {
        return accessGroup
            .filter((item: any) => !('isTemp' in item))  // isTemp false olanları filtreledim
            .map((item: any) => item.ID)  // Sadece ID'leri aldımm
            .join(';');  // ID'leri birleştirdim
    }

    updateAccessGroupTemp(accessGroupValue: any) {
        var sp: any[] = [];

        accessGroupValue.forEach((item: any) => {
            if (item.isTemp) {
                sp.push(
                    {
                        mkodu: 'yek077',
                        yetkiid: item.ID.toString(),
                        aciklama: item.tempDesc,
                        limit: '1',
                        tip: '1',
                        bastarih: item.tempEndDate,
                        bassaat: item.tempStartTime,
                        bittarih: item.tempEndDate,
                        bitsaat: item.tempEndTime,
                        sicillerim: this.selectedRegister.Id.toString()
                    }
                );
            }

        });

        console.log('Süreli Geçiş Grupları Param: ', sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }
                console.log('Süreli Geçiş Grupları Gönderildi: ', data);

            }, (err) => {
                this.toastrService.error(
                    this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                    this.translateService.instant('Hata')
                );
            });
    }

    addRegisterPhoto(event: any) {
        if (this.registerDetail[0].fotoid != '0') {
            this.remove();
        }

        // Dosya Yüklendiğinde İlk Çalışan Fonksiyon
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
            // this.uploadedFile.push(item);
            console.log('Uploaded File : ', this.uploadedFile);

            this.setPhoto(this.uploadedFile);

            this.ref.detectChanges();

        };

    }


    setPhoto(item?: any) {
        if (item) {

            this.profileService
                .postFileForDemand(
                    item[0].sendFile,
                    this.selectedRegister.Id.toString(),
                    'sicilfoto',
                    '0'
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
                    this.registerDetail[0].fotoid = response[0].k.split('.')[0];
                    this.registerDetail[0].DosyaTipi = response[0].k.split('.')[1];
                    console.log("Sicil Detay Güncellendi : ", this.registerDetail);

                    // item = { ...item, upload: true};
                    item[0].upload = true;
                    this.timestamp = new Date().getTime();
                });
        }
    }

    remove() {
        this.profileService.deleteFileForDemand(this.registerDetail[0].fotoid, this.registerDetail[0].DosyaTipi, 'sicilfoto').pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                this.toastrService.warning(
                    this.translateService.instant('Fotoğraf_Kaldırılamadı!'),
                    this.translateService.instant('HATA')
                );
                return;
            }

            this.timestamp = new Date().getTime();
            console.log("Belge Silindi :", data);
            this.toastrService.success(
                this.translateService.instant('Fotoğraf_Kaldırıldı'),
                this.translateService.instant('Başarılı')
            );
        });
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetAllForms());
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
