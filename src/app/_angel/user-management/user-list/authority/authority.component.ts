import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { updateForm } from 'src/app/store/actions/form.action';
import { FormState } from 'src/app/store/models/form.state';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastrService } from 'ngx-toastr';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { Chip } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';

// Sıralama durumlarını takip için enum
enum SortState {
    Original,
    Asc,
    Desc
}

@Component({
    selector: 'app-authority',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        MatTabsModule,
        SelectModule,
        TooltipModule, AccordionModule, AvatarModule, TableModule, FloatLabelModule, IconFieldModule, InputIconModule, Chip, ButtonModule,
        CustomPipeModule
    ],
    templateUrl: './authority.component.html',
    styleUrl: './authority.component.scss'
})
export class AuthorityComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @Input() selectedRegister: any;
    @Input() registerDetail: any[] = [];
    form: FormGroup;
    detail: any;
    loginName: string = "";


    selectedIndex: 0;
    roles: any[] = [];
    selectedRole: any;
    keys: any[] = ["Pdks", "Access", "Ziyaretci", "Yemekhane", "Kantin", "Otopark"];
    checkboxValues: any[] = [];
    checkboxData: any = {};
    menuAuthorizations: any[] = [];
    shiftAuthorizations: any[] = [];
    reportAuthorizations: any[] = [];
    vacationAuthorizations: any[] = [];
    disabled: boolean = true;

    filterMenuText: string = "";
    filterShiftText: string = "";
    filterVacationText: string = "";
    filterReportText: string = "";

    // Orijinal kopyaları saklıyoruz
    private originalMenuAuthorizations: any[] = [];
    private originalVacationAuthorizations: any[] = [];
    private originalShiftAuthorizations: any[] = [];
    private originalReportAuthorizations: any[] = [];

    // State'ler
    private menuSortState: SortState = SortState.Original;
    private vacationSortState: SortState = SortState.Original;
    private shiftSortState: SortState = SortState.Original;
    private reportSortState: SortState = SortState.Original;
    menuSortIcon: string = 'pi-sort'; // başlangıçta karışık
    splitRoles: any[] = [];
    selectedChips: Set<string> = new Set();

    constructor(
        private profileService: ProfileService,
        private store: Store<{ form: FormState }>,
        private toastrService: ToastrService,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.getLoginDetail();
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

            if (this.detail?.LoginName) {
                this.loginName = this.detail.LoginName;
            }

            console.log("Yanıt Geldi :", data);

            // this.splitRoles = this.stringToArray(this.detail.yetkirolleri)
            // console.log("Yetki rolleri ayrıldı :", this.splitRoles);

            this.getRoles();

        });
    }

    stringToArray(input: string): any[] {
        if (!input || input.trim() === '') {
            return [];
        }
        return input
            .split(',')               // virgüle göre ayır
            .map(x => x.trim())       // boşlukları temizle
            .filter(x => x !== '');   // boş değerleri çıkar
    }

    addRole() {
        this.splitRoles.push(this.selectedRole);

        const sp: any[] = [
            {
                mkodu: 'yek236',
                sicilid: this.selectedRegister.Id.toString(),
                rolid: this.splitRoles.map(item => item.ID).join(',')
            }
        ];

        console.log('Rol Güncelleme Param: ', sp);

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            console.log('Rol Güncellendi: ', data);

            this.toastrService.success(
                this.translateService.instant('Rol_Güncellendi'),
                this.translateService.instant('Başarılı')
            );

            this.getLoginDetail();;

        }, (err) => {
            this.toastrService.error(
                this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                this.translateService.instant('Hata')
            );
        });
    }

    deleteRole() {
        const sp: any[] = [
            {
                mkodu: 'yek236',
                sicilid: this.selectedRegister.Id.toString(),
                rolid: this.splitRoles.map(item => item.ID).join(',')
            }
        ];

        console.log('Rol Güncelleme Param: ', sp);

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
            const data = response[0].x;
            const message = response[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            console.log('Rol Güncellendi: ', data);

            this.toastrService.success(
                this.translateService.instant('Rol_Güncellendi'),
                this.translateService.instant('Başarılı')
            );

            this.getLoginDetail();;

        }, (err) => {
            this.toastrService.error(
                this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                this.translateService.instant('Hata')
            );
        });
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


    getRoles() {
        var sp: any[] = [
            {
                mkodu: "yek041",
                kaynak: "yetkisablon",
                id: "0"
            }
        ];
        console.log("Rolleri Getir Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.roles = [...data];
                console.log("Roller Geldi : ", this.roles);

                // Stringi array'e çevir
                const yetkiIDs = this.detail.yetkirolleri.split(",").map(Number);

                // Eşleşen objeleri bul
                this.detail["yetkirollerix"] = this.roles.filter(r => yetkiIDs.includes(r.ID));
                console.log("Login Detayı :", this.detail);

                this.splitRoles = this.detail.yetkirollerix;
                // const matchedRole = this.roles.find(role => role.ID == this.detail?.yetkirolleri);

                this.selectRole(this.roles[0]);
            });
    }

    // selectRole(role: any) {
    //     this.selectedRole = role;
    //     this.getRoleDetail(role);
    //     this.getMenuAuth(role);
    //     this.getShiftAuth(role);
    //     this.getVacationAuth(role);
    //     this.getReportAuth(role);
    //     this.saveRoleToStore(role);
    // }

    selectRole(role: any, isManual: boolean = false) {
        // Eğer manuel değişiklikse ve rol ID'si 9999 değilse
        if (isManual) {
            if (role.ID === 9999) {
                return; // hiçbir şey yapma
            }

            // roles içinde ID=9999 olan objeyi selectedRole yap
            const defaultRole = this.roles.find(r => r.ID === 9999);
            if (defaultRole) {
                this.selectedRole = defaultRole;
            }

            this.toastrService.warning("Yetki Rolü Otomatik Olarak 'Kişiye Özel' Olarak Değiştirildi", "Uyarı");
            // Manuel işlemde API çağrıları yapma!
            return;
        }

        // Normal çalışmaya devam
        this.selectedRole = role;
        this.getRoleDetail(role);
        this.getMenuAuth(role);
        this.getShiftAuth(role);
        this.getVacationAuth(role);
        this.getReportAuth(role);
        // this.saveRoleToStore(role);
    }


    getRoleDetail(role: any = null, isFilter: boolean = false, selectedChips: Set<any> = new Set([])) {
        var sp: any[] = [
            {
                mkodu: "yek178",
                rolid: isFilter ? this.joinChips(selectedChips) : role.ID.toString()
            }
        ];
        console.log("Rol Detay Getir Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.checkboxValues = [...data];
                console.log("Rol Detay Geldi : ", data);
                // this.keys.forEach(key => {
                //     this.checkboxData[key] = Array.from(this.checkboxValues[0][key]).map(val => val === "1");
                // });

                this.keys.forEach(key => {
                    this.checkboxData[key] = Array.from(this.checkboxValues[0][key]).map(val => {
                        return { checked: val === "1" };  // boolean yerine object
                    });
                });


                console.log("TESTO :", this.checkboxData);
                console.log("TESTO :", this.checkboxData['Access'][0]);
                console.log("TESTO :", this.checkboxData['Access'][1]);
                console.log("TESTO :", this.checkboxData['Access'][2]);

            });
    }


    getMenuAuth(role: any, isFilter: boolean = false, selectedChips: Set<any> = new Set([])) {
        var sp: any[] = [
            {
                mkodu: "yek179",
                rolid: isFilter ? this.joinChips(selectedChips) : role.ID.toString()
            }
        ];
        console.log("Menü yetkilendirme Getir Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.menuAuthorizations = [...data];
                this.originalMenuAuthorizations = [...this.menuAuthorizations];
                console.log("Menü yetkilendirme Geldi : ", data);
            });
    }

    getShiftAuth(role: any, isFilter: boolean = false, selectedChips: Set<any> = new Set([])) {
        var sp: any[] = [
            {
                mkodu: "yek180",
                rolid: isFilter ? this.joinChips(selectedChips) : role.ID.toString()
            }
        ];
        console.log("Vardiya yetkilendirme Getir Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.shiftAuthorizations = [...data];
                this.originalShiftAuthorizations = [...this.shiftAuthorizations];
                console.log("Vardiya yetkilendirme Geldi : ", data);
            });
    }

    getVacationAuth(role: any, isFilter: boolean = false, selectedChips: Set<any> = new Set([])) {
        var sp: any[] = [
            {
                mkodu: "yek181",
                rolid: isFilter ? this.joinChips(selectedChips) : role.ID.toString()
            }
        ];
        console.log("İzin yetkilendirme Getir Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.vacationAuthorizations = [...data];
                this.originalVacationAuthorizations = [...this.vacationAuthorizations];
                console.log("İzin yetkilendirme Geldi : ", data);
            });
    }

    getReportAuth(role: any, isFilter: boolean = false, selectedChips: Set<any> = new Set([])) {
        var sp: any[] = [
            {
                mkodu: "yek182",
                rolid: isFilter ? this.joinChips(selectedChips) : role.ID.toString()
            }
        ];
        console.log("Rapor yetkilendirme Getir Param : ", sp);

        this.profileService
            .requestMethod(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                const data = response[0].x;
                const message = response[0].z;

                if (message.islemsonuc == -1) {
                    return;
                }

                this.reportAuthorizations = [...data];
                this.originalReportAuthorizations = [...this.reportAuthorizations];
                console.log("Rapor yetkilendirme Geldi : ", data);
            });
    }


    changeDetection(): boolean {
        const registerRole = this.detail?.yetkirolleri;

        if (this.selectedRole && this.selectedRole.ID == registerRole) {
            return false;
        } else {
            return true;
        }
    }

    saveRoleToStore(role: any) {
        this.store.dispatch(updateForm({ formName: 'applicationUse', formData: { role: role } }));
    }

    getTooltipText(index: number): string {
        const labels = ['Modülü Görme Yetkisi', 'Tanımlamaları Görme Yetkisi', 'Raporları Görme Yetkisi'];
        return labels[index] || '';
    }

    onCheckboxChange(item: any) {
        console.log("Kullanıcı manuel değişiklik yaptı:", item);

        this.selectRole(this.selectedRole, true);
    }


    sortMenu(): void {
        if (this.menuSortState === SortState.Original) {
            this.menuAuthorizations = [...this.menuAuthorizations].sort((a, b) =>
                a.ad.localeCompare(b.ad, 'tr', { sensitivity: 'base' })
            );
            this.menuSortState = SortState.Asc;
            this.menuSortIcon = 'pi-sort-alpha-down';
        } else if (this.menuSortState === SortState.Asc) {
            this.menuAuthorizations = [...this.menuAuthorizations].sort((a, b) =>
                b.ad.localeCompare(a.ad, 'tr', { sensitivity: 'base' })
            );
            this.menuSortState = SortState.Desc;
            this.menuSortIcon = 'pi-sort-alpha-up';
        } else {
            this.menuAuthorizations = [...this.originalMenuAuthorizations];
            this.menuSortState = SortState.Original;
            this.menuSortIcon = 'pi-sort';
        }
    }

    sortVacations(): void {
        if (this.vacationSortState === SortState.Original) {
            this.vacationAuthorizations = [...this.vacationAuthorizations].sort((a, b) =>
                a.Aciklama.localeCompare(b.Aciklama, 'tr', { sensitivity: 'base' })
            );
            this.vacationSortState = SortState.Asc;
            this.menuSortIcon = 'pi-sort-alpha-down';
        } else if (this.vacationSortState === SortState.Asc) {
            this.vacationAuthorizations = [...this.vacationAuthorizations].sort((a, b) =>
                b.Aciklama.localeCompare(a.Aciklama, 'tr', { sensitivity: 'base' })
            );
            this.vacationSortState = SortState.Desc;
            this.menuSortIcon = 'pi-sort-alpha-up';

        } else {
            this.vacationAuthorizations = [...this.originalVacationAuthorizations];
            this.vacationSortState = SortState.Original;
            this.menuSortIcon = 'pi-sort';

        }
    }

    sortShifts(): void {
        if (this.shiftSortState === SortState.Original) {
            this.shiftAuthorizations = [...this.shiftAuthorizations].sort((a, b) =>
                a.Aciklama.localeCompare(b.Aciklama, 'tr', { sensitivity: 'base' })
            );
            this.shiftSortState = SortState.Asc;
            this.menuSortIcon = 'pi-sort-alpha-down';

        } else if (this.shiftSortState === SortState.Asc) {
            this.shiftAuthorizations = [...this.shiftAuthorizations].sort((a, b) =>
                b.Aciklama.localeCompare(a.Aciklama, 'tr', { sensitivity: 'base' })
            );
            this.shiftSortState = SortState.Desc;
            this.menuSortIcon = 'pi-sort-alpha-up';

        } else {
            this.shiftAuthorizations = [...this.originalShiftAuthorizations];
            this.shiftSortState = SortState.Original;
            this.menuSortIcon = 'pi-sort';

        }
    }

    sortReports(): void {
        if (this.reportSortState === SortState.Original) {
            this.reportAuthorizations = [...this.reportAuthorizations].sort((a, b) =>
                a.ad.localeCompare(b.ad, 'tr', { sensitivity: 'base' })
            );
            this.reportSortState = SortState.Asc;
            this.menuSortIcon = 'pi-sort-alpha-down';

        } else if (this.reportSortState === SortState.Asc) {
            this.reportAuthorizations = [...this.reportAuthorizations].sort((a, b) =>
                b.ad.localeCompare(a.ad, 'tr', { sensitivity: 'base' })
            );
            this.reportSortState = SortState.Desc;
            this.menuSortIcon = 'pi-sort-alpha-up';

        } else {
            this.reportAuthorizations = [...this.originalReportAuthorizations];
            this.reportSortState = SortState.Original;
            this.menuSortIcon = 'pi-sort';

        }
    }


    onChipClick(event: MouseEvent, item: string) {
        // Eğer tıklanan remove butonu ise işlem yapma
        const target = event.target as HTMLElement;
        if (target.classList.contains('border-danger')) {
            return;
        }

        // Class eklemek için toggle mantığı
        if (this.selectedChips.has(item)) {
            this.selectedChips.delete(item);
        } else {
            this.selectedChips.add(item);
        }

        console.log("selectedChips Tıklandı", this.selectedChips);
        this.getRoleDetail(null, true, this.selectedChips);
        this.getMenuAuth(null, true, this.selectedChips);
        this.getShiftAuth(null, true, this.selectedChips);
        this.getVacationAuth(null, true, this.selectedChips);
        this.getReportAuth(null, true, this.selectedChips);
    }

    joinChips(selectedChips: Set<any>) {
        const iterator = selectedChips.values();
        return Array.from(iterator).join(',');
    }

    onChipRemove(item: any) {
        this.splitRoles = this.splitRoles.filter(role => role.ID != item.ID);

        this.selectedChips.delete(item); // remove edilince listeden de kaldır
        console.log("selectedChips", this.selectedChips);
        console.log("this.splitRoles", this.splitRoles);

        this.deleteRole();

    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }


}
