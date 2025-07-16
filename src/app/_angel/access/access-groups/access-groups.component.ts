import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { combineLatest, debounceTime, filter, Subject, take, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { FloatLabel } from 'primeng/floatlabel';
import { DataNotFoundComponent } from '../../shared/data-not-found/data-not-found.component';
@Component({
    selector: 'app-access-groups',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        CheckboxModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        CustomPipeModule,
        FloatLabel,
        DataNotFoundComponent
    ],
    templateUrl: './access-groups.component.html',
    styleUrl: './access-groups.component.scss'
})
export class AccessGroupsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    @ViewChild('accessForm') accessForm: NgForm;
    form: FormGroup;
    accessGroups: any[] = [];
    deviceGroups: any[] = [];
    relations: any[] = [];
    timeZone: any[] = [];
    selectAllMap: { [key: string]: boolean } = {
        '-1': false,
        '255': false,
        '999999999': false
    };
    indeterminateMap: { [key: string]: boolean } = {
        '-1': false,
        '255': false,
        '999999999': false
    };
    displayEditDialog: boolean = false;
    editTitle: string = '';
    selectedAccessGroup: { Ad: string; ID?: number };
    filterText: string = '';
    singleAuthorization: string | null = null;
    // Yeni bir özellik: sadece ilk seçimde yayılma yapılacak
    private isFirstAuthorizationSelection = true;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.getDeviceGroups();
        this.getAccessGroups();
        // this.onFormChanges();
        this.onChangeAccessGroup();
        this.onChangeDeviceGroup();
    }

    createForm() {
        this.form = this.fb.group({
            accessGroup: [''],
            deviceGroup: [''],
        });
    }

    onFormChanges() {
        combineLatest([
            this.form.get('accessGroup')!.valueChanges,
            this.form.get('deviceGroup')!.valueChanges
        ])
            .pipe(
                takeUntil(this.ngUnsubscribe),
                debounceTime(200), // gereksiz tetiklenmeyi önler
                filter(([accessGroup, deviceGroup]) => !!accessGroup && !!deviceGroup)
            )
            .subscribe(([accessGroup, deviceGroup]) => {
                this.getDeviceGroups();  // accessGroup değişince çalışır
                this.getRelations(deviceGroup);
                this.getTimeZone();
            });
    }


    onChangeAccessGroup() {
        this.form.get('accessGroup')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: any) => {
            const selectedDeviceGroup = this.form.get('deviceGroup')?.value;

            if (selectedDeviceGroup && value) {
                this.getRelations(selectedDeviceGroup);
                this.getTimeZone();
            }
        });
    }

    getAccessGroups() {
        var sp: any[] = [
            {
                mkodu: 'yek041',
                kaynak: 'yetki',
                id: '0'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            this.accessGroups = [...data];
        });
    }

    getDeviceGroups() {
        var sp: any[] = [
            {
                mkodu: 'yek190',
                id: '0'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            this.deviceGroups = [...data];
            console.log("Terminal Grupları Geldi: ", this.deviceGroups);

        });
    }

    onChangeDeviceGroup() {
        this.form.get('deviceGroup')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
            const selectedAccessGroup = this.form.get('accessGroup')?.value;

            if (selectedAccessGroup && value) {
                this.getRelations(value);
                this.getTimeZone();
            }
        });
    }

    getTimeZone() {
        var sp: any[] = [
            {
                mkodu: 'yek041',
                kaynak: 'cbo_timezone',
                id: '0'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            this.timeZone = [...data];
        });
    }

    getRelations(deviceGroup: any) {
        var sp: any[] = [
            {
                mkodu: 'yek319',
                hedefid: this.form.get('accessGroup')?.value.ID.toString(),
                groupid: deviceGroup.id.toString()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.relations = data.map((item: any) => ({
                ...item,
                checked: false,
                edit: false,
                newAuthorization: null, // yeni yetki için başlangıç değeri
                yetki: item.yetki ? +item.yetki : -1 // yetki değerini sayıya çeviriyoruz, eğer undefined ise -1 olarak ayarlıyoruz
            }));
            console.log("İlişkiler Geldi: ", this.relations);

            this.selectAllMap = {
                '-1': false,
                '255': false,
                '999999999': false
            };
            this.indeterminateMap = {
                '-1': false,
                '255': false,
                '999999999': false
            };
        });
    }


    toggleAll(authorization: string) {
        const isChecked = this.selectAllMap[authorization];
        
        this.isFirstAuthorizationSelection = true; // her toggleAll çağrısında yayılma modunu sıfırla
        
        this.relations.forEach(item => {
            if (authorization == '255') {
                if (item.yetki != '-1' && item.yetki != 999999999) {
                    item.checked = isChecked;
                    item.edit = isChecked; // düzenleme başladığında edit durumunu tersi yap
                    item.newAuthorization = null; // düzenleme başladığında yeni yetki değerini sıfırla
                }
            } else {
                if (item.yetki == +authorization) {
                    item.checked = isChecked;
                    item.edit = isChecked; // düzenleme başladığında edit durumunu tersi yap
                    item.newAuthorization = null; // düzenleme başladığında yeni yetki değerini sıfırla
                }
            }
        });
        this.indeterminateMap[authorization] = false;

        console.table('Test :', this.relations);
    }

    updateSelectAllState(item: any) {
        const selected = this.relations.filter(x => x.checked);
        if (selected.length === 0) {
            this.relations.map(x => {
                x.newAuthorization = null; // yeni yetki değerini sıfırla
            });
            this.selectAllMap[item.yetki.toString()] = false;
            this.indeterminateMap[item.yetki.toString()] = false;
            this.isFirstAuthorizationSelection = true; // yayılma modunu sıfırla
        }
        
        const authorization = item.yetki.toString();
        item.edit = !item.edit; // düzenleme başladığında edit durumunu tersi yap

        item.newAuthorization = null; // düzenleme başladığında yeni yetki değerini sıfırla

        if (authorization == '255') {
            // 255 yetkisi için tüm öğeleri kontrol et
            const groupItems = this.relations.filter(item => item.yetki != -1 && item.yetki != 999999999); // 255 yetkisi olan öğeleri filtrele
            const allChecked = groupItems.every(item => item.checked); // Tüm öğelerin işaretli olup olmadığını kontrol et
            const noneChecked = groupItems.every(item => !item.checked); // Tüm öğelerin işaretli olmadığını kontrol et

            this.selectAllMap[authorization] = allChecked; // Tüm öğeler işaretli ise true, değilse false
            this.indeterminateMap[authorization] = !allChecked && !noneChecked; // Eğer tüm öğeler işaretli değilse ve hiçbiri işaretli değilse, indeterminate durumunu true yap
            return;

        } else {
            const groupItems = this.relations.filter(item => item.yetki == +authorization);
            const allChecked = groupItems.every(item => item.checked);
            const noneChecked = groupItems.every(item => !item.checked);

            this.selectAllMap[authorization] = allChecked;
            this.indeterminateMap[authorization] = !allChecked && !noneChecked;
        }
    }

    get terminalsWithAuth255() {
        return this.relations.filter(x => x.yetki != -1 && x.yetki != 999999999);
    }
    get terminalsWithAuth999999() {
        return this.relations.filter(x => x.yetki === 999999999);
    }
    get terminalsWithAuthMinusOne() {
        return this.relations.filter(x => x.yetki === -1);
    }

    editNode(item: any) {
        // item.edit = true;
        if (!item.newAuthorization) {
            item.newAuthorization = null;
            item.checked = true; // düzenleme başladığında checkbox'ı işaretle
            this.updateSelectAllState(item); // checkbox durumunu güncelle
        }
    }

    cancelEdit(item: any) {
        // item.edit = false; // düzenleme iptal edildiğinde edit durumunu sıfırla
        item.newAuthorization = null; // düzenleme iptal edildiğinde yeni yetki değerini sıfırla
        item.checked = false; // düzenleme iptal edildiğinde checkbox'ı da sıfırla
        this.updateSelectAllState(item); // checkbox durumunu güncelle
    }

    get selectedItems() {
        return this.relations.filter(item => item.checked);
    }

    checkSelected() {
        const selecteds = this.selectedItems;
        if (selecteds.length === 0) {
            return;
        }

        const existingAuths = selecteds.filter(item => !item.newAuthorization) || []; // yeni yetki atanmadıysa
        if (existingAuths.length > 0) {
            Swal.fire({
                title: this.translate.instant('Dikkat'),
                text: this.translate.instant('Bazı seçili terminallerde yeni bir yetki atanmadı. Devam ederseniz sadece yeni yetki atanmış olanlar güncellenecek. Emin misin?'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: this.translate.instant('Evet, uygula'),
                cancelButtonText: this.translate.instant('İptal')
            }).then(result => {
                if (result.isConfirmed) {
                    this.relationStateChange(selecteds);
                }
            });
        } else {
            this.relationStateChange(selecteds); // yeni yetki atanmış olanlar güncellenecek
            console.log('Yeni yetki atanmış olanlar güncellenecek: ', selecteds);
        }
    }

    relationStateChange(selecteds: any[]) {
        var sp: any[] = [];

        selecteds.forEach(item => {
            if (!item.newAuthorization) {
                return; // yeni yetki atanmadıysa işlem yapma
            }

            sp.push({
                mkodu: 'yek156',
                kaynakid: item.kaynakid.toString(),
                hedefid: item.hedefid.toString(),
                hedeftablo: 'yetki',
                extra: item.newAuthorization ? item.newAuthorization.ID.toString() : null
            });
        });
        console.log('ilişkiler güncellenecek: ', sp);

        this.profileService
            .requestMethodPost(sp)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                response.forEach((res: any) => {
                    const data = res.x;
                    const message = res.z;

                    if (message.islemsonuc != 1) {
                        console.error('İşlem başarısız: ', message);
                        return;
                    }
                    console.log('ilişki güncellendi: ', data);

                    // İlişki güncellendiğinde, öğeyi güncelle
                    this.relations = data.map((item: any) => ({
                        ...item,
                        checked: false,
                        edit: false,
                        newAuthorization: null, // yeni yetki için başlangıç değeri
                        yetki: item.yetki ? +item.yetki : -1 // yetki değerini sayıya çeviriyoruz, eğer undefined ise -1 olarak ayarlıyoruz
                    }));
                    console.log("İlişkiler Geldi: ", this.relations);

                    this.selectAllMap = {
                        '-1': false,
                        '255': false,
                        '999999999': false
                    };
                    this.indeterminateMap = {
                        '-1': false,
                        '255': false,
                        '999999999': false
                    };


                });
            });
    }

    showEditDialog(action: string) {
        this.displayEditDialog = true;
        if (action === 'add') {
            this.editTitle = this.translate.instant('Yeni Geçiş Grubu Ekle');
            this.selectedAccessGroup = { Ad: '' }; // Yeni grup için başlangıç değeri
            this.accessForm.controls['name'].setValue('');
        } else if (action === 'edit') {
            this.editTitle = this.translate.instant('Geçiş Grubu Düzenle');
            this.selectedAccessGroup = this.form.get('accessGroup')?.value;
            this.accessForm.controls['name'].setValue(this.selectedAccessGroup.Ad);
        }
        this.accessForm.controls['action'].setValue(action);

    }

    hideEditDialog() {
        this.displayEditDialog = false;
    }

    editAccessGroup(value: any) {
        const action = this.accessForm.controls['action'].value;

        if (value.name.trim() === '') {
            return; // Geçersiz isim, işlem yapma
        }

        const sp: any[] = [
            {
                mkodu: action == 'add' ? 'yek123' : 'yek124',
                kaynak: 'Yetki',
                id: this.selectedAccessGroup.ID ? this.selectedAccessGroup.ID.toString() : '0',
                ad: value.name.trim()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            // Yeni grup eklendiğinde veya düzenlendiğinde formu güncelle
            this.getAccessGroups();
            this.hideEditDialog();

            this.form.get('accessGroup')?.setValue(data[0]); // Yeni veya düzenlenen grubu formda ayarla
        });

    }

    deleteAccessGroup() {
        const value = this.form.get('accessGroup')?.value;
        if (!value || !value.ID) {
            return; // Seçili grup yoksa işlem yapma
        }

        // SweetAlert ile onay kutusu
        Swal.fire({
            title: this.translate.instant('Emin misiniz?'),
            text: this.translate.instant('Geçiş grubunu silmek istediğinize emin misiniz?'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: this.translate.instant('Evet, sil'),
            cancelButtonText: this.translate.instant('İptal')
        }).then((result) => {
            if (result.isConfirmed) {
                // Kullanıcı onayladıysa silme işlemini yap
                const sp: any[] = [
                    {
                        mkodu: 'yek125',
                        kaynak: 'Yetki',
                        id: value.ID ? value.ID.toString() : null
                    }
                ];

                this.profileService.requestMethod(sp)
                    .pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe((res: any[]) => {
                        const data = res[0].x;
                        const message = res[0].z;

                        if (message.islemsonuc == -1) {
                            return;
                        }

                        // Başarılı silme sonrası işlemler
                        this.getAccessGroups();
                        this.form.get('accessGroup')?.setValue(null);

                        // Başarı mesajı göster
                        Swal.fire({
                            icon: 'success',
                            title: this.translate.instant('Başarılı'),
                            text: this.translate.instant('Geçiş grubu silindi.')
                        });

                        if (this.relations.length > 0) {
                            this.relations = []; // İlişkileri temizle
                        }
                    });
            }
        });
    }

    checkDeleteAccessGroup() {
        var sp: any[] = [
            {
                mkodu: 'yek324',
                gecisgrubu: this.form.get('accessGroup')?.value.ID.toString()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                Swal.fire({
                    icon: 'error',
                    title: this.translate.instant('Hata'),
                    text: this.translate.instant('Geçiş grubu silinemedi. Lütfen daha sonra tekrar deneyin.')
                });
                return;
            }

            if (data[0].kisisayisi > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: this.translate.instant('Uyarı'),
                    text: this.translate.instant('Bu geçiş grubunun atalı olduğu siciller bulunduğu için silme işlemi gerçekleştirilemez.')
                });
            } else {
                this.deleteAccessGroup();
            }
        });
    }


    onAuthorizationChange(event: any, changedItem: any): void {
        const selectedAuth = event.value;
        if (!selectedAuth) return;

        // Eğer ilk seçimse ve yayılma modundaysa
        if (this.isFirstAuthorizationSelection) {
            const selectedItems = this.relations.filter(item => item.checked && item !== changedItem);

            // Farklı yetkiler varsa uyarı göster
            const existingAuths = Array.from(new Set(selectedItems.map(item => item.newAuthorization?.id).filter(id => id !== undefined)));

            if (existingAuths.length > 0) {
                Swal.fire({
                    title: this.translate.instant('Dikkat'),
                    text: this.translate.instant('Bazı seçili terminallerde daha önce bir yetki atanmış. Devam edersen hepsi yeni yetkiyle güncellenecek. Emin misin?'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.translate.instant('Evet, uygula'),
                    cancelButtonText: this.translate.instant('İptal')
                }).then(result => {
                    if (result.isConfirmed) {
                        this.applyAuthorizationToSelectedItems(selectedAuth);
                        this.isFirstAuthorizationSelection = false; // artık yayılma yapma
                    }
                });
            } else {
                this.applyAuthorizationToSelectedItems(selectedAuth);
                this.isFirstAuthorizationSelection = false; // artık yayılma yapma
            }
        } else {
            // Bundan sonra sadece ilgili item değiştirilecek
            changedItem.newAuthorization = { ...selectedAuth };
            changedItem.edit = true;
        }
    }

    // Ortak kullanım
    applyAuthorizationToSelectedItems(auth: any): void {
        const selectedItems = this.relations.filter(item => item.checked);
        for (const item of selectedItems) {
            item.edit = true;
            item.newAuthorization = { ...auth };
        }
        console.log('Tüm item’lara uygulandı:', auth);
    }




    applySummary() {
        const accessGroup = this.form.get('accessGroup')?.value;

        if (!accessGroup || !accessGroup.ID) {
            Swal.fire({
                icon: 'warning',
                title: this.translate.instant('Uyarı'),
                text: this.translate.instant('Lütfen bir geçiş grubu seçin.')
            });
            return;
        }

        const sp: any[] = [
            {
                mkodu: 'yek323',
                gecisgrubu: accessGroup.ID.toString()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc === -1) {
                Swal.fire({
                    icon: 'error',
                    title: this.translate.instant('Hata'),
                    text: this.translate.instant('Yetki uygulama işlemi başarısız oldu.')
                });
                return;
            }

            if (data[0].kisisayisi === 0) {
                Swal.fire({
                    icon: 'info',
                    title: this.translate.instant('Bilgi'),
                    text: this.translate.instant('Seçilen geçiş grubuna ait yetki uygulanacak kişi bulunamadı veya geçiş grubunda yakın zamanda bir değişiklik yapılmadı.')
                });
                return;
            }

            Swal.fire({
                title: this.translate.instant('Uyarı'),
                icon: 'warning',
                html: `
                    <div style="font-size: 14px;">
                        ${this.translate.instant('Seçilen geçiş grubuna ait')} 
                        <strong style="color:#1f8ef1;">(${accessGroup.Ad})</strong> 
                        <strong style="font-weight: bold; color: #e74c3c;">${data[0].kisisayisi}</strong> 
                        ${this.translate.instant('kişi için yetki uygulaması yapılacaktır.')}
    
                        <br/><br/>
                        <span style="font-weight: 700;">${this.translate.instant('Devam etmek istiyor musunuz?')}</span>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `<i class="fa fa-check" style="color: white;"></i> ${this.translate.instant('Evet, uygula')}`,
                cancelButtonText: `<i class="fa fa-times" style="color: white;"></i> ${this.translate.instant('İptal')}`
            }).then((result) => {
                if (result.isConfirmed) {
                    this.applyAuthorization();
                }
            });
        });
    }


    applyAuthorization(): void {
        const accessGroup = this.form.get('accessGroup')?.value;
        if (!accessGroup || !accessGroup.ID) {
            Swal.fire({
                icon: 'warning',
                title: this.translate.instant('Uyarı'),
                text: this.translate.instant('Lütfen bir geçiş grubu seçin.')
            });
            return;
        }

        var sp: any[] = [
            {
                mkodu: 'yek322',
                gecisgrubu: accessGroup.ID.toString()
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;
            if (message.islemsonuc == -1) {
                Swal.fire({
                    icon: 'error',
                    title: this.translate.instant('Hata'),
                    text: this.translate.instant('Yetki uygulama işlemi başarısız oldu.')
                });
                return;
            }
            // Başarılı yetki uygulama sonrası işlemler
        });
        Swal.fire({
            icon: 'success',
            title: this.translate.instant('Başarılı'),
            text: this.translate.instant('Yetki başarıyla uygulandı.')
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

}
