import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabel } from 'primeng/floatlabel';
import { RegistriesComponent } from './registries/registries.component';
import Swal from 'sweetalert2';
import { TooltipModule } from 'primeng/tooltip';
import { ToastrService } from 'ngx-toastr';
import { DataNotFoundComponent } from '../../shared/data-not-found/data-not-found.component';

@Component({
    selector: 'app-registry-groups',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DialogModule,
        CustomPipeModule,
        InputIconModule,
        IconFieldModule,
        FloatLabel,
        RegistriesComponent,
        TooltipModule,
        DataNotFoundComponent
    ],
    templateUrl: './registry-groups.component.html',
    styleUrl: './registry-groups.component.scss'
})
export class RegistryGroupsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    registryGroups: any[] = []; // Sicil gruplarını tutacak dizi
    @ViewChild('editForm') editForm: NgForm;
    @ViewChild('assignForm') assignForm: NgForm;
    form: FormGroup;
    displayEditDialog: boolean = false;
    editTitle: string = '';
    filterText: string = '';
    selectedGroup: { ad: string; id?: number };
    filter: { cbo_firma?: number; cbo_bolum?: number; cbo_pozisyon?: number; cbo_gorev?: number; cbo_yaka?: number; cbo_direktorluk?: number; cbo_altfirma?: number };
    groupDetails: any[] = []; // Grup detaylarını tutacak dizi
    isFlipped = false;
    displayAssign: boolean = false;
    triggered: boolean = false;
    selectedDetail: any;
    imageUrl: string;
    editTriggered: boolean = false; // Düzenleme tetiklendi mi?
    newExplanation: string = ''; // Yeni açıklama için değişken

    constructor(
        private profileService: ProfileService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private toastrService: ToastrService
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }

    ngOnInit(): void {
        this.createForm(); // Formu oluştur
        this.onFormChange(); // Form değişikliklerini dinle

        this.getRegistryGroups(); // Bileşen yüklendiğinde grupları al
    }

    createForm() {
        this.form = this.fb.group({
            registryGroup: ['']
        });
    }

    onFormChange() {
        this.form.get('registryGroup')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
            if (value) {
                this.loadGroupDetails();

                if (this.isFlipped) {
                    this.toggleFlip(); // Kart açıldıysa, kartı kapat
                }
            }

        });
    }

    getRegistryGroups(groupId?: any): void {
        var sp: any[] = [
            {
                mkodu: 'yek326'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            this.registryGroups = [...data];

            if (groupId) {
                // Eğer grup ID'si verilmişse, o grubu seç
                const selectedGroup = this.registryGroups.find(group => group.id === groupId);
                if (selectedGroup) {
                    this.form.get('registryGroup')?.setValue(selectedGroup);
                } else {
                    this.form.get('registryGroup')?.setValue(null); // Grup bulunamazsa null yap
                }
                
            }
        });

    }

    showEditDialog(action: string) {
        this.displayEditDialog = true;
        if (action === 'add') {
            this.editTitle = this.translate.instant('Yeni Sicil Grubu Ekle');
            this.selectedGroup = { ad: '' }; // Yeni grup için başlangıç değeri
            this.editForm.controls['name'].setValue('');
        } else if (action === 'edit') {
            this.editTitle = this.translate.instant('Sicil Grubu Düzenle');
            this.selectedGroup = this.form.get('registryGroup')?.value;
            this.editForm.controls['name'].setValue(this.selectedGroup.ad);
        }
        this.editForm.controls['action'].setValue(action);

    }

    hideEditDialog() {
        this.displayEditDialog = false;
    }

    editRegistryGroup(value: any) {
        const action = this.editForm.controls['action'].value;
        if (value.name.trim() === '') {
            return; // Geçersiz isim, işlem yapma
        }

        const sp: any[] = [
            {
                mkodu: action == 'add' ? 'yek325' : 'yek331',
                ad: value.name.trim()
            }
        ];

        // Eğer düzenleme yapılıyorsa grup ID'sini ekle
        if (action == 'edit') {
            const groupId = this.form.get('registryGroup')?.value.id.toString();
            sp[0].id = groupId;
        }

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            // Yeni grup eklendiğinde veya düzenlendiğinde formu güncelle
            this.getRegistryGroups(action == 'edit' ? this.form.get('registryGroup')?.value.id : null);
            this.hideEditDialog();

            if (this.isFlipped) {
                this.toggleFlip(); // Kart açıldıysa, kartı kapat
            }

            this.form.get('registryGroup')?.setValue(null) // Yeni veya düzenlenen grubu formda ayarla
        });

    }

    onFilterEvent(event: { selectedRows?: any, cbo_firma?: number, cbo_bolum?: number, cbo_pozisyon?: number, cbo_gorev?: number, cbo_yaka?: number, cbo_direktorluk?: number, cbo_altfirma?: number }) {
        const filterValue = event;

        this.addRegister(event);
    }

    addRegister(filter: any) {
        const sp: any[] = [
            {
                mkodu: 'yek327',
                islem: '1',
                statik: filter.selectedRows && filter.selectedRows.length > 0 ? '1' : '0',
                grupid: this.form.get('registryGroup')?.value.id.toString(),
                firma: filter?.cbo_firma ? filter.cbo_firma.toString() : '0',
                bolum: filter?.cbo_bolum ? filter.cbo_bolum.toString() : '0',
                pozisyon: filter?.cbo_pozisyon ? filter.cbo_pozisyon.toString() : '0',
                gorev: filter?.cbo_gorev ? filter.cbo_gorev.toString() : '0',
                yaka: filter?.cbo_yaka ? filter.cbo_yaka.toString() : '0',
                direktorluk: filter?.cbo_direktorluk ? filter.cbo_direktorluk.toString() : '0',
                altfirma: filter?.cbo_altfirma ? filter.cbo_altfirma.toString() : '0',
                sicilgrup: '0',
                siciller: filter.selectedRows ? filter.selectedRows.map((item: any) => item.Id).join(',') : '',
                aciklama: this.assignForm.value.explanation
            }
        ];

        console.log('Sicil grubu ekleme verisi:', sp);
        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
            const data = res[0].x;
            const message = res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }

            console.log('Sicil grubu eklendi:', data);
            // Ekleme işlemi başarılıysa grup detaylarını güncelle
            this.loadGroupDetails();
            if (this.isFlipped) {
                this.toggleFlip(); // Kart açıldıysa, kartı kapat
            }
        });
    }

    loadGroupDetails() {
        const groupId = this.form.get('registryGroup')?.value.id.toString();
        const sp1 = [{ mkodu: 'yek328', grupid: groupId, statik: '1' }];
        const sp0 = [{ mkodu: 'yek328', grupid: groupId, statik: '0' }];

        forkJoin([
            this.profileService.requestMethod(sp1),
            this.profileService.requestMethod(sp0)
        ])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(([res1, res0]) => {
                const data1 = res1[0]?.x ?? [];
                const data0 = res0[0]?.x ?? [];

                const message1 = res1[0]?.z;
                const message0 = res0[0]?.z;

                if (message1?.islemsonuc === -1 || message0?.islemsonuc === -1) {
                    return;
                }

                const groupData = this.groupByFormId(data1);
                const organizationData = this.addOrganizationToItems(data0);
                console.log(organizationData);

                this.groupDetails = [...groupData, ...organizationData];
                console.log('Sicil grubu detayları:', this.groupDetails);
            });
    }

    selectGroup(group: any) {
        this.filter = {
            cbo_firma: group.firma,
            cbo_bolum: group.bolum,
            cbo_pozisyon: group.pozisyon,
            cbo_gorev: group.gorev,
            cbo_yaka: group.yaka,
            cbo_direktorluk: group.direktorluk,
            cbo_altfirma: group.altfirma
        };
    }

    toggleFlip(item?: any) {
        if (item) {
            this.newExplanation = item.aciklama || ''; // Detay açıklamasını güncelle
        }
        this.selectedDetail = item;
        this.isFlipped = !this.isFlipped;
    }

    deleteRegistryDetail(event: any, detail: any) {
        event.stopPropagation();

        Swal.fire({
            title: this.translate.instant('Sicil Grubu Detayı Silinsin Mi?'),
            text: this.translate.instant('Bu işlem geri alınamaz!'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('Evet, Sil'),
            cancelButtonText: this.translate.instant('Hayır, İptal Et')
        }).then((result) => {
            if (result.isConfirmed) {
                const sp: any[] = [
                    {
                        mkodu: 'yek339',
                        formid: detail.formid.toString(),
                        aktif: detail.aktif.toString(),
                        statik: detail.statik.toString() 
                    }
                ];

                this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
                    const data = res[0].x;
                    const message = res[0].z;

                    if (message.islemsonuc == -1) {
                        return;
                    }

                    this.toastrService.success("Sicil Grup Detayı Silindi","Başarılı");

                    console.log('Sicil grubu detayı silindi:', data);

                    // Detay silindikten sonra grup detaylarını güncelle
                    this.loadGroupDetails();
                });
            }
        });
    }

    changeStateDetail(event: Event, detail: any) {
        event.stopPropagation();

        Swal.fire({
            title: this.translate.instant('Sicil Grubu Detayı Durumu Değiştirilsin Mi?'),
            text: this.translate.instant('Daha sonra aktif veya pasif olarak ayarlanabilir!'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('Evet, Değiştir'),
            cancelButtonText: this.translate.instant('Hayır, İptal Et')
        }).then((result) => {
            if (result.isConfirmed) {
                const sp: any[] = [
                    {
                        mkodu: 'yek338',
                        formid: detail.formid.toString(),
                        aktif: detail.aktif.toString(),
                        statik: detail.statik.toString() 
                    }
                ];

                this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
                    const data = res[0].x;
                    const message = res[0].z;

                    if (message.islemsonuc == -1) {
                        return;
                    }

                    this.toastrService.success("Sicil Grup Detayı Durumu Değiştirildi","Başarılı");
                    console.log('Sicil grubu detayı durumu değiştirildi:', data);

                    // Durum değişikliğinden sonra grup detaylarını güncelle
                    this.loadGroupDetails();
                });
            }
        });
    }

    displayAssignDialog() {
        this.displayAssign = true;
    }

    onHideAssignDialog() {
        this.displayAssign = false;
    }

    saveAssign() {
        if (this.assignForm.value) {
            const formData = this.assignForm.value;
            // Burada form verilerini işleyebilirsiniz
            console.log('Assign Form Data:', formData);
            this.displayAssign = false; // Dialogu kapat
            this.triggered = !this.triggered; // Trigger değişkenini değiştir
        } else {
            Swal.fire({
                icon: 'error',
                title: this.translate.instant('Hata'),
                text: this.translate.instant('Lütfen tüm alanları doldurun!')
            });
        }
    }

    groupByFormId(response: any[]): any[] {
        // 1. Statik === 1 olanları filtrele
        const filtered = response.filter(item => item.statik === 1);

        // 2. Map ile gruplama
        const groupedMap = new Map<number, any>();

        filtered.forEach(item => {
            const key = item.formid;

            if (!groupedMap.has(key)) {
                // İlk kez ekleniyorsa temel yapıyı oluştur
                groupedMap.set(key, {
                    formid: item.formid,
                    aciklama: item.aciklama,
                    grupid: item.grupid,
                    grupadi: item.grupadi,
                    islem: item.islem == 1 ? true : false,
                    duzenleyen: item.duzenleyen,
                    statik: item.statik,
                    aktif: item.aktif,
                    zaman: item.zaman,
                    xsicilid: item.xsicilid,
                    siciller: []
                });
            }

            // Sicil bilgilerini ekle
            groupedMap.get(key).siciller.push({
                adsoyad: item.adsoyad,
                sicilid: item.sicilid
            });
        });

        // 3. Map'ten array'e çevir
        return Array.from(groupedMap.values());
    }

    addOrganizationToItems(items: any[]): any[] {
        const fields = [
            { idKey: 'firmaid', nameKey: 'firmaad' },
            { idKey: 'bolumid', nameKey: 'bolumad' },
            { idKey: 'pozisyonid', nameKey: 'pozisyonad' },
            { idKey: 'gorevid', nameKey: 'gorevad' },
            { idKey: 'altfirmaid', nameKey: 'altfirmaad' },
            { idKey: 'direktorlukid', nameKey: 'direktorlukad' },
            { idKey: 'yakaid', nameKey: 'yakaad' }
        ];

        return items.map(item => {
            const organizations: { organizationName: string, id: number, name: string }[] = [];

            fields.forEach(({ idKey, nameKey }) => {
                const id = item[idKey];
                const name = item[nameKey];
                const organizationName = nameKey.replace('ad', '');

                if (id && id !== 0) {
                    organizations.push({ organizationName, id, name });
                }
            });

            return {
                ...item,
                organizations
            };
        });
    }

    deleteRegistryGroup() {
        Swal.fire({
            title: this.translate.instant('Sicil Grubu Silinsin Mi?'),
            text: this.translate.instant('Bu işlem geri alınamaz!'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('Evet, Sil'),
            cancelButtonText: this.translate.instant('Hayır, İptal Et')
        }).then((result) => {
            if (result.isConfirmed) {
                const groupId = this.form.get('registryGroup')?.value.id.toString();
                const sp: any[] = [
                    {
                        mkodu: 'yek330',
                        id: groupId
                    }
                ];

                this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
                    const data = res[0].x;
                    const message = res[0].z;

                    if (message.islemsonuc == -1) {
                        return;
                    }

                    console.log('Sicil grubu silindi:', data);

                    // Silme işlemi başarılıysa formu temizle ve grupları güncelle
                    this.form.get('registryGroup')?.setValue(null);
                    this.getRegistryGroups();
                });
            }
        });
    }

    updateRegistryDetail(detail: any, selecteds: any) {
        Swal.fire({
            title: this.translate.instant('Sicil Grubu Detayı Güncellensin Mi?'),
            text: this.translate.instant('Bu işlem geri alınamaz!'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('Evet, Güncelle'),
            cancelButtonText: this.translate.instant('Hayır, İptal Et')
        }).then((result) => {
            if (result.isConfirmed) {
                const sp: any[] = [
                    {
                        mkodu: 'yek332',
                        grupid: detail.grupid.toString(),
                        aciklama: this.newExplanation, // Detay açıklamasını güncelle
                        formid: detail.formid.toString(),
                        islem: detail.islem ? '1' : '0', // İşlem durumunu güncelle
                        siciller: selecteds.selectedRows ? selecteds.selectedRows.map((item: any) => item.Id).join(',') : '', // Sicil ID'lerini virgülle ayır
                    }
                ];

                this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any[]) => {
                    const data = res[0].x;
                    const message = res[0].z;

                    if (message.islemsonuc == -1) {
                        return;
                    }

                    console.log('Sicil grubu detayı güncellendi:', data);

                    // Güncelleme işlemi başarılıysa grup detaylarını güncelle
                    this.loadGroupDetails();
                    if (this.isFlipped) {
                        this.toggleFlip(); // Kart açıldıysa, kartı kapat
                    }
                });
            }
        });
    }

    onEditTriggered() {
        this.editTriggered = !this.editTriggered; // Düzenleme tetiklendi
    }

    onEditEvent(event: any) {
        this.updateRegistryDetail(this.selectedDetail, event); // Detay güncelleme işlemi
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
