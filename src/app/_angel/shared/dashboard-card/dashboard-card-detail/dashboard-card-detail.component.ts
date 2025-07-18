import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CustomPipeModule } from 'src/app/_helpers/custom-pipe.module';

@Component({
    selector: 'app-dashboard-card-detail',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        CustomPipeModule,
        FormsModule,
        InputIconModule,
        IconFieldModule,
        FloatLabelModule,
        DialogModule,
        InputTextModule
    ],
    templateUrl: './dashboard-card-detail.component.html',
    styleUrls: ['./dashboard-card-detail.component.scss']
})
export class DashboardCardDetailComponent implements OnInit, OnDestroy {
    @Input() display: boolean = false;
    @Input() selectedDetail: any;
    @Output() hide = new EventEmitter<any>();
    @Input() fromWhere: string;
    filterText: string = "";
    constructor() { }

    ngOnInit(): void {
    }

    onHide() {
        this.display = false;
        this.hide.emit();
    }

    ngOnDestroy(): void {
    }

}
