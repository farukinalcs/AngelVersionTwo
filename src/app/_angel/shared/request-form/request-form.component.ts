import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ApiUrlService } from 'src/app/_helpers/api-url.service';

@Component({
    selector: 'app-request-form',
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule
    ],
    templateUrl: './request-form.component.html',
    styleUrl: './request-form.component.scss'
})
export class RequestFormComponent implements OnInit {
    @Input() type: any;
    display: boolean = false;
    cacheKey: any;
    serviceUrl: any;
    reportPath: any;
    parameters: any;

    constructor(
        private apiUrlService: ApiUrlService,
    ) { }

    ngOnInit(): void {
        this.serviceUrl = this.apiUrlService.apiUrl + '/BoldReport';
    }

    showForm() {

    }

    open() {
        this.display = true;
    }

    close() {
        this.display = false;
    }

}
