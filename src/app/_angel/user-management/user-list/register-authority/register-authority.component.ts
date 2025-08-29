import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { concatMap, Subject, takeUntil, tap } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButton } from 'primeng/radiobutton';
import { ToastrService } from 'ngx-toastr';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-register-authority',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        SelectModule,
        FormsModule,
        PopoverModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        RadioButton,
        CardModule
    ],
    templateUrl: './register-authority.component.html',
    styleUrl: './register-authority.component.scss'
})
export class RegisterAuthorityComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() selectedRegister: any;
    registerGroups: any[] = [];
    registryGroup: any;
    authority: any;
    requestSteps: any[] = [];

    myForm!: FormGroup;
    levels: number[] = [];
    detail: any;


    constructor(
        private profileService: ProfileService,
        private fb: FormBuilder,
        private toastrService: ToastrService
    ) { }

    ngOnInit(): void {
        this.getLoginDetail();
        console.log("Sicil Yetkileri :", this.selectedRegister);

        this.levels = Array.from({ length: 11 }, (_, i) => i);

        this.myForm = this.fb.group({
            level: ['0'],
            accessType: ['view'],
        });

        this.fetchRegisterGroups()
            .pipe(
                concatMap(() => this.fetchRequestSteps()),
                concatMap(() => this.fetchAuthority())
            )
            .subscribe({
                next: () => console.log("Tüm istekler sırasıyla tamamlandı."),
                error: err => console.error(err)
            });
    }

    fetchRegisterGroups() {
        const sp = [{ mkodu: "yek326" }];
        return this.profileService.requestMethod(sp).pipe(
            takeUntil(this.ngUnsubscribe),
            tap(res => {
                const data = res[0].x;
                const message = res[0].z;
                if (message.islemsonuc !== -1) {
                    this.registerGroups = [...data];
                }
            })
        );
    }

    fetchRequestSteps() {
        const sp = [{ mkodu: "yek381" }];
        return this.profileService.requestMethod(sp).pipe(
            takeUntil(this.ngUnsubscribe),
            tap(res => {
                const data = res[0].x;
                const message = res[0].z;
                if (message.islemsonuc !== -1) {
                    this.requestSteps = [...data];
                    console.log("Geldi: ", this.requestSteps);
                    this.requestSteps.forEach(step => {
                        if (!this.myForm.contains(step.key)) {
                            this.myForm.addControl(step.key, this.fb.control(false));
                        }
                    });
                }
            })
        );
    }

    fetchAuthority() {
        const sp = [
            { mkodu: "yek379", login: this.detail.Id.toString() }
        ];
        return this.profileService.requestMethod(sp).pipe(
            takeUntil(this.ngUnsubscribe),
            tap(res => {
                const data = res[0].x;
                const message = res[0].z;
                if (message.islemsonuc !== -1) {
                    console.log("Seçilen Kişinin Sicil Yetkileri Geldi :", data);
                    const mappedData = data.map((item: any) => ({
                        ...item,
                        yetkimap: item.yetki == '59' ? 'edit' : 'view',
                        kategoriler: this.requestSteps.map(k => ({
                            deger: item[k.key as keyof typeof item] == 1,
                            ad: k.ad,
                            key: k.key
                        }))
                    }));

                    this.authority = [...mappedData];
                    console.log("mapping :", this.authority);
                }
            })
        );
    }


    onSubmit() {
        console.log(this.myForm.value);

        if (!this.registryGroup) {
            this.toastrService.warning("Bir Sicil Grubu Seçmelisiniz!", "Uyarı!");
            return;
        }


        this.postAuthority(this.myForm.value);
    }

    postAuthority(value: any) {
        var sp: any[] = [
            {
                mkodu: 'yek380',
                login: this.detail.Id.toString(),
                sicilid: this.detail.xSicilID.toString(),
                sicilgrup: this.registryGroup.id.toString(),
                kademe: value.level,
                yetki: value.accessType == 'view' ? '50' : '59',
                sicil: value['sicil'] ? '1' : '0',
                izin: value['izin'] ? '1' : '0',
                fm: value['fm'] ? '1' : '0',
                hareket: value['hareket'] ? '1' : '0',
                performans: value['performans'] ? '1' : '0',
                avans: value['avans'] ? '1' : '0',
                zimmet: value['zimmet'] ? '1' : '0',
                masraf: value['masraf'] ? '1' : '0'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Ekleme İşlemi Başarılı :", data);
            this.toastrService.success("Ekleme İşlemi Tamamlandı.", "Başarılı");
            this.fetchRegisterGroups()
                .pipe(
                    concatMap(() => this.fetchRequestSteps()),
                    concatMap(() => this.fetchAuthority())
                )
                .subscribe({
                    next: () => console.log("Tüm istekler sırasıyla tamamlandı."),
                    error: err => console.error(err)
                });
        });
    }

    updateAuthority(item: any) {
        var sp: any[] = [
            {
                mkodu: 'yek382',
                id: item.id.toString(),
                kademe: item.kademe.toString(),
                yetki: item.yetkimap == 'view' ? '50' : '59',
                ...item.kategoriler.reduce((acc: any, k: any) => {
                    acc[k.key] = k.deger ? '1' : '0';
                    return acc;
                }, {})
            }
        ];

        console.log("Güncellemem params: ", sp);



        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Güncelleme İşlemi Başarılı :", data);
            this.toastrService.success("Güncelleme İşlemi Tamamlandı.", "Başarılı");
            this.fetchRegisterGroups()
                .pipe(
                    concatMap(() => this.fetchRequestSteps()),
                    concatMap(() => this.fetchAuthority())
                )
                .subscribe({
                    next: () => console.log("Tüm istekler sırasıyla tamamlandı."),
                    error: err => console.error(err)
                });
        });
    }

    deleteAuthority(item: any) {
        var sp: any[] = [
            {
                mkodu: 'yek383',
                id: item.id.toString()
            }
        ];


        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log("Silme İşlemi Başarılı :", data);
            this.toastrService.success("Silme İşlemi Tamamlandı.", "Başarılı");
            this.fetchRegisterGroups()
                .pipe(
                    concatMap(() => this.fetchRequestSteps()),
                    concatMap(() => this.fetchAuthority())
                )
                .subscribe({
                    next: () => console.log("Tüm istekler sırasıyla tamamlandı."),
                    error: err => console.error(err)
                });
        });
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

            

            console.log("Yanıt Geldi Sicil Yeykiler:", this.detail);
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
