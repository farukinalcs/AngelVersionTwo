import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { MyFilesDetailComponent } from './my-files-detail/my-files-detail.component';
import { HelperService } from 'src/app/_helpers/helper.service';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { DataNotFoundComponent } from 'src/app/_angel/shared/data-not-found/data-not-found.component';

@Component({
    selector: 'app-my-files',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MyFilesDetailComponent,
        DialogModule,
        TooltipModule,
        DataNotFoundComponent
    ],
    templateUrl: './my-files.component.html',
    styleUrl: './my-files.component.scss'
})
export class MyFilesComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    necessaries: any[] = [];
    display: boolean = false;
    registryId: any;

    ngOnInit(): void {
        this.registryId = this.helperService.userLoginModel.xSicilID;
        this.fetchNecessaryDocs();
    }

    constructor(
        private profileService: ProfileService,
        private helperService: HelperService,
        private toastrService: ToastrService
    ) { }
    

    fetchNecessaryDocs() {
        var sp: any[] = [
            {
                mkodu: 'yek349'
            }
        ];

        this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
            const data = res[0].x;
            const message =  res[0].z;

            if (message.islemsonuc == -1) {
                return;
            }
            this.necessaries = [...data];

            console.log("Zorunlu Belgeler Geldi:", this.necessaries);

        });
    }

    open() {
        if (this.necessaries.length > 0) {
            this.display = true;            
        } else {
            this.toastrService.warning("Gerekli Belge Bulunamadı!", "Uyarı");
        }
    }
    
    close() {
        this.display = false;
    }

    onUploaded(event: any) {
        console.log("(YENİ) Dosya Yüklendi... ", event);
        this.fetchNecessaryDocs();
    }

    getTooltipText(item: any): string {
        if (item.durum == 1) {
            return "İstenilen Belge Yüklenmiş. 'Tümü' kısmından inceleyebilirsiniz";
        } else {
            return 'Henüz Yüklenmemiş';
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}