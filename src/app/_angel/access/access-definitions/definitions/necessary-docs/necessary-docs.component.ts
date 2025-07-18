import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-necessary-docs',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        CustomPipeModule,
        SelectModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule,
        InputTextModule
    ],
    templateUrl: './necessary-docs.component.html',
    styleUrl: './necessary-docs.component.scss'
})
export class NecessaryDocsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    filterText: string = "";
    dropdownEmptyMessage: any = this.translateService.instant('Kayıt_Bulunamadı');
    necessaries: any[] = [];
    registryGroups: any[];
    selected: any;
    assigns: any[] = [];

    constructor(
        private profileService: ProfileService,
        private translateService: TranslateService,
        private toastrService: ToastrService
    ) { }

    ngOnInit(): void {
        this.fetchRegistryGroups();
        this.fetchNecessaryDocs();
    }

    fetchRegistryGroups() {
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
            this.selected = this.registryGroups[0];
        });
    }

    fetchNecessaryDocs() {
        var sp: any[] = [
            {
                mkodu: 'yek041',
                kaynak: 'cbo_belgetipi',
                id: '0',
            },
        ];

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
                    console.log('Belge tipleri geldi: ', data);

                    this.necessaries = [...data];
                },
                (err) => {
                    this.toastrService.error(
                        this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
                        this.translateService.instant('Hata')
                    );
                }
            );
    }

    control() {
        return this.necessaries.filter(item => 
            !this.assigns.some(a => a.ID === item.ID)
        );
    }

    relationStateChange(item: any, process: any) {
        var mkodu;
        if (process == "i") {
            mkodu = "yek346"
        } else if (process == "d") {
            mkodu = "yek348"
        }

        var sp: any[] = [
            {
                mkodu: mkodu,
                sicilgrup: this.selected.id.toString(), 
                belgetipi: item.ID.toString()
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
                console.log('relations durum değişti: ', data);
                this.onChange();

            });
    }

    onChange() {
        var sp: any[] = [
            {
                mkodu: 'yek347',
                sicilgrup: this.selected.id.toString()
            }
        ];

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
                    console.log('Atanmışlar geldi: ', data);

                    this.assigns = [...data];
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
