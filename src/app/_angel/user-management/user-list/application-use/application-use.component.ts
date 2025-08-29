import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
    selector: 'app-application-use',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MatTabsModule,
        SelectModule,
        DropdownModule,
        TooltipModule
    ],
    templateUrl: './application-use.component.html',
    styleUrl: './application-use.component.scss'
})
export class ApplicationUseComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() selectedRegister: any;
    @Input() registerDetail: any[] = [];
    @Output() eventLogin = new EventEmitter<any>();
    detail: any;
    twoFactorAuth: any[] = [
        { name: this.translateService.instant("Mobil"), value: "Mobile" },
        { name: "Mail", value: "Mail" },
        { name: "SMS", value: "Sms" },
        { name: this.translateService.instant("Yok"), value: "" }
    ];
    selectedTwoFactorAuth: any = "Mail";
    loginName: string = "";
    password: any = "";
    disabledLoginName: boolean = true;
    disabledPass: boolean = true;
    @ViewChild('loginInput') loginInputRef: ElementRef;
    @ViewChild('passInput') passInputRef: ElementRef;
    twoFactorAuthInfo: any;
    otp: string = '----';
    accessGroups: any[] = [];
    deviceGroups: any[] = [];
    dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');
    selectedDevice: any;
    selectedAccessGroup: any;


    disabled: boolean = true;
    updatedPassword: any = "";

    constructor(
        private profileService: ProfileService,
        private toastrService: ToastrService,
        private translateService: TranslateService,
    ) { }

    ngOnInit(): void {
        this.getLoginDetail();
        this.getPin();
        this.getAccessGroupForRegister();
        this.getDeviceGroups();
    }

    editState(formControl: any) {
        if (formControl == 'loginName') {
            this.disabledLoginName = !this.disabledLoginName;
            const inputElement = this.loginInputRef.nativeElement;

            // fade-in-danger sınıfını ekledim
            inputElement.classList.add('fade-in-danger');

            // 2 saniye sonra sınıfı kaldırıldı
            setTimeout(() => {
                inputElement.classList.remove('fade-in-danger');
            }, 1000);
        } else if (formControl == 'password') {
            this.disabledPass = !this.disabledPass;
            const inputElement = this.passInputRef.nativeElement;

            // fade-in-danger sınıfını ekledim
            inputElement.classList.add('fade-in-danger');

            // 2 saniye sonra sınıfı kaldırıldı
            setTimeout(() => {
                inputElement.classList.remove('fade-in-danger');
            }, 1000);
        } else {
            this.disabledLoginName = !this.disabledLoginName;
            this.disabledPass = !this.disabledPass;

        }
    }

    

    getLoginDetail() {
        var sp: any[] = [
            { mkodu: 'yek226', sicilid: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.detail = data[0];
            this.eventLogin.emit(this.detail);

            if (this.detail?.LoginName) {
                this.selectedTwoFactorAuth = this.detail['2FA'];
                this.loginName = this.detail.LoginName;
            }

            console.log("Yanıt Geldi :", data);
            this.getTwoFactorAuthInfo();

        });
    }

    getTwoFactorAuthInfo() {
        var sp: any[] = [
            { mkodu: 'yek227', id: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.twoFactorAuthInfo = data[0];
            console.log("Yanıt Geldi :", data);

            this.twoFactorAuth = this.twoFactorAuth.map((item) => {
                if (item?.value == 'Mail') {
                    return { ...item, visible: this.twoFactorAuthInfo?.hasmail >= 0 ? true : false };
                } else if (item?.value == 'Sms') {
                    return { ...item, visible: this.twoFactorAuthInfo?.hassms >= 0 ? true : false };
                } else if (item?.value == 'Mobile') {
                    return { ...item, visible: this.twoFactorAuthInfo?.hasmobil >= 0 ? true : false };
                } else {
                    return { ...item, visible: true };
                }
            });


            console.log("Visible Eklendi :", this.twoFactorAuth);

        });
    }

    removeMobile() {
        var sp: any[] = [
            { mkodu: 'yek232', id: this.twoFactorAuthInfo.hasmobil.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.otp = data[0].key2;
        });
    }

    getPin() {
        var sp: any[] = [
            { mkodu: 'yek235', xsid: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.otp = data[0]?.key2 || "----";
        });
    }

    setPin() {
        var sp: any[] = [
            { mkodu: 'yek233', xsid: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.otp = data[0].key2;
        });
    }

    get otpArray(): string[] {
        return this.otp.split(''); // String'i diziye dönüştür
    }

    removePin() {
        var sp: any[] = [
            { mkodu: 'yek234', xsid: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.otp = "----";
        });
    }


    getAccessGroupForRegister() {
        var sp: any[] = [
            { mkodu: 'yek206', kaynak: 'yetki', id: '0', sid: this.selectedRegister.Id.toString() }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Geçiş Grupları :", data);

            this.accessGroups = [...data];
        });
    }

    getDeviceGroups(item?: any) {
        // this.loading = false;
        var sp: any[] = [
            {
                mkodu: 'yek190',
                id: '0',
            },
        ];
        console.log('Terminal Grupları Param : ', sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.deviceGroups = [...data];
                console.log('Terminal Grupları Geldi : ', this.deviceGroups);
            });
    }

    createNewAppUser() {
        if (!this.loginName || !this.password) {
            this.toastrService.error(this.translateService.instant('Kullanıcı_Adı_Ve_Şifre_Boş_Bırakılamaz'), this.translateService.instant('Hata'));
            return;
        }

        var sp: any[] = [
            {
                mkodu: "yek247",
                sicilID: this.selectedRegister.Id.toString(),
                admin: "",
                terminalserver: "",
                kullad: this.loginName,
                password: this.password
            }
        ];
        console.log("Program Kullanıcı Oluştur Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    this.toastrService.error(this.translateService.instant('Program_Kullanıcı_Oluşturulurken_Hata_Oluştu'), this.translateService.instant('Hata'));
                    return;
                }

                console.log("Program Kullanıcı Oluşturuldu : ", data);
                this.getLoginDetail();
                this.toastrService.success(this.translateService.instant('Program_Kullanıcı_Oluşturuldu'), this.translateService.instant('Başarılı'));
            });
    }

    updateAppUser() {
        if (!this.loginName) {
            this.toastrService.error(this.translateService.instant('Kullanıcı_Adı_Boş_Bırakılamaz'), this.translateService.instant('Hata'));
            return;
        }

        var sp: any[] = [
            {
                mkodu: "yek244",
                sicilID: this.selectedRegister.Id.toString(),
                admin: this.detail.Admin ? "1" : "0",
                terminalserver: this.detail.TerminalServer ? "1" : "0",
                kullad: this.loginName,
                password: this.updatedPassword,
                ldap: this.detail.ldap ? "1" : "0",
                bilgilendirme: this.detail.Bilgilendirme ? "1" : "0",
                access: this.detail.Access,
                pdks: this.detail.Pdks,
                ziyaretci: this.detail.Ziyaretci,
                yemekhane: this.detail.Yemekhane,
                kantin: this.detail.Kantin,
                otopark: this.detail.Otopark,
                terminalgrubu: this.detail.TerminalGrubu.toString(),
                yetkigrubu: this.detail.YetkiGrubu
            }
        ];
        console.log("Program Kullanıcısı Güncelle Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    this.toastrService.error(this.translateService.instant('Program_Kullanıcı_Güncellenirken_Hata_Oluştu'), this.translateService.instant('Hata'));
                    return;
                }

                console.log("Program Kullanıcısı Güncellendi : ", data);
                this.getLoginDetail();
                this.toastrService.success(this.translateService.instant('Program_Kullanıcı_Güncellendi'), this.translateService.instant('Başarılı'));
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
