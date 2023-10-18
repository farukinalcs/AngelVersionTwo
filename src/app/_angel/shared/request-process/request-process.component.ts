import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { DemandProcessModel } from '../../profile/models/demandProcess';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-request-process',
  templateUrl: './request-process.component.html',
  styleUrls: ['./request-process.component.scss']
})
export class RequestProcessComponent implements OnInit, OnDestroy {
  @Input() demandId: any;
  @Input() demandTypeName: any;
  @Input() displayRequestProcess: boolean;
  @Output() displayRequestProcessEvent : EventEmitter<void> = new EventEmitter<void>();

  private ngUnsubscribe = new Subject();
  
  requestProcess : any[] = [];

  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    this.getDemandProcess(this.demandId, this.demandTypeName);
  }

  getDemandProcess(formId : any, formTip : any) {
    if (formTip == 'İzin') {
      formTip = 'izin';
    }else if (formTip == 'Fazla Mesai'){
      formTip = 'fazlamesai'
    }
    this.profileService.getDemandProcess(formId, formTip).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<DemandProcessModel, ResponseDetailZ>[]) => {
      let data = response[0].x;
      let message = response[0].z;

      console.log("Talep Süreci : ", data);
      if (message.islemsonuc == 1) {
        this.requestProcess = data; 

      }else {
        this.toastrService.warning(
          this.translateService.instant("TOASTR_MESSAGE.SUREC_BULUNAMADI"),
          this.translateService.instant("TOASTR_MESSAGE.UYARI")
        );
      }
      this.ref.detectChanges();
    })
  }

  hideRequestProcess() {
    this.displayRequestProcessEvent.emit();
  }

  ngOnDestroy(): void {
    this.displayRequestProcessEvent.emit();
  }
}
