import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { MyTeamModel } from 'src/app/_angel/profile/models/myTeam';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';
import { SearchFilterPipe } from 'src/app/_helpers/pipes/search-filter.pipe';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
    selector: 'app-my-team',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        CustomPipeModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule,
        InputTextModule

    ],
    templateUrl: './my-team.component.html',
    styleUrl: './my-team.component.scss'
})
export class MyTeamComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    myTeam: any[] = [];
    filterText: string = "";
    filteredItems: any[] = [];
    imageUrl: string;
    filteredData: any[] = [];
    // Seçili filtreler
    activeFilters: { [key: string]: boolean } = {
        present: false,
        absent: false,
        pending: false,
        tomorrowLeave: false
    };


    constructor(
        private profileService: ProfileService,
    ) {
        this.imageUrl = this.profileService.getImageUrl();
    }


    ngOnInit(): void {
        this.getMyTeam();
    }

    getMyTeam() {
        this.profileService.getMyTeam().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<MyTeamModel, ResponseDetailZ>[]) => {
            const data = response[0].x;
            const message = response[0].z;

            console.log("Takımım :", response);
            if (message.islemsonuc == 1) {
                this.myTeam = [...data];
                this.filteredData = this.myTeam;
            }

        });
    }

    filterTextChange() {
        const searchPipe = new SearchFilterPipe();
        this.filteredItems = this.myTeam.filter(item => {
            const searchFilter = searchPipe.transform([item], this.filterText, ['durum', 'ad', 'soyad', 'sicilno', 'mesaiaciklama', 'ggiris', 'gcikis']);
            return searchFilter.length > 0;
        });
    }

    get presentCount(): number {
        return this.myTeam.filter((m) => m.ggiris).length;
    }

    get absentCount(): number {
        return this.myTeam.filter((m) => !m.ggiris).length;
    }

    get pendingRequestsCount(): number {
        return this.myTeam.reduce(
            (sum, m) => sum + m.bekleyenizintalep + m.bekleyenfmtalep,
            0
        );
    }

    get tomorrowLeaveCount(): number {
        return this.myTeam.filter((m) => m.yarinizin).length;
    }

    toggleFilter(filterKey: keyof typeof this.activeFilters) {
        this.activeFilters[filterKey] = !this.activeFilters[filterKey];
        this.applyFilters();
    }

    applyFilters() {
        let data = [...this.myTeam];

        // Bugün İşte
        if (this.activeFilters.present) {
            data = data.filter(m => m.ggiris);
        }

        // Bugün Yok
        if (this.activeFilters.absent) {
            data = data.filter(m => !m.ggiris);
        }

        // Bekleyen Talepler
        if (this.activeFilters.pending) {
            data = data.filter(m => (m.bekleyenizintalep + m.bekleyenfmtalep) > 0);
        }

        // Yarın İzinli
        if (this.activeFilters.tomorrowLeave) {
            data = data.filter(m => m.yarinizin); 
        }

        // Metin
        if (this.filterText.trim() !== '') {
            const searchPipe = new SearchFilterPipe();
            data = searchPipe.transform(data, this.filterText, [
                'durum', 'ad', 'soyad', 'sicilno', 'mesaiaciklama', 'ggiris', 'gcikis', 'gelmedi'
            ]);
        }

        this.filteredData = data;
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }
}
