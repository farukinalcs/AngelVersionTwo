import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { LoaderService } from 'src/app/_helpers/loader.service';
import { AuthMenuService } from 'src/app/_metronic/core/services/auth-menu.service';
import { LayoutService } from 'src/app/_metronic/layout';
import { UserInformation } from '../models/user-information';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profiledashboard',
  templateUrl: './profiledashboard.component.html',
  styleUrls: ['./profiledashboard.component.scss']
})
export class ProfiledashboardComponent implements OnInit, OnDestroy {
  public closedVisitorForm : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public closedOvertimeForm : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public closedVacationForm : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  menuConfig : any;
  private ngUnsubscribe = new Subject();
  user$: Observable<UserType>;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';


  displayOvertimeForm : boolean;
  displayVacationForm: boolean;

  userInformation : UserInformation;
  public isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  displayVisitRequestForm: boolean;
  displayAdvancePaymentForm: boolean;


  constructor(
    private auth: AuthService,
    private authMenuService : AuthMenuService,
    private fomrBuilder : FormBuilder,
    public dialog: MatDialog,
    private profileService : ProfileService,
    public loaderService : LoaderService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMenuConfig();
    this.getUserInformation();
    this.getCurrentUserInformations();

    // this.profileService.getImage('path').subscribe(response => {
    //   console.log("Image : ", response);
    // });
  }

  getUserInformation() {
    this.profileService.getUserInformation().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<UserInformation,ResponseDetailZ>[]) => {
      // let data = JSON.parse(response[0].x.toString());
      // let message = JSON.parse(response[0].z.toString());
      let data = response[0].x;
      let message = response[0].z;
      let responseToken = response[0].y;

      console.log("Sicil Bilgiler :", data);
      

      if (message.islemsonuc == 1) {
        this.userInformation = data[0];
        console.log("USER :", this.userInformation);
      }
      
      this.isLoading.next(false);
      this.ref.detectChanges();
    })
  }

  getMenuConfig() {
    this.authMenuService.menuConfig$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.menuConfig = res;
      this.ref.detectChanges();
    });

    console.log("ben ekranı menü config :", this.menuConfig);
  }

  getCurrentUserInformations() {
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  /* Fazla Mesai Form Dialog Penceresi */
  showOvertimeDialog(){
    this.displayOvertimeForm = true;
  }
  overtimeFormIsSend() {
    this.displayOvertimeForm = false;
    this.closedOvertimeForm.next(false);
  }
  /* --------------------------------- */


  /* İzin Form Dialog Penceresi */
  showVacationDialog(){
    this.displayVacationForm = true;
  }
  vacationFormIsSend() {
    this.displayVacationForm = false;
    this.closedVacationForm.next(false);
  }
  /* --------------------------------- */


  /* Ziyaretçi Form Dialog Penceresi */
  showVisitRequestDialog() {
    this.displayVisitRequestForm = true;
  }
  visitRequestFormIsSend() {
    this.displayVisitRequestForm = false;
    this.closedVisitorForm.next(false);
  }
  /* --------------------------------- */


  /* Avans Form Dialog Penceresi */
  showAdvancePaymentDialog() {
    this.displayAdvancePaymentForm = true;
  }
  advancePaymentIsSend() {
    this.displayAdvancePaymentForm = false;
  }
  /* --------------------------------- */



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
