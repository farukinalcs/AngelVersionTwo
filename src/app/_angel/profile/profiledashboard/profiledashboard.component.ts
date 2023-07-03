import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, startWith, Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { HelperService } from 'src/app/_helpers/helper.service';
import { LoaderService } from 'src/app/_helpers/loader.service';
import { AuthMenuService } from 'src/app/_metronic/core/services/auth-menu.service';
import { LayoutService } from 'src/app/_metronic/layout';
import { UserInformation } from '../models/user-information';
import { ProfileService } from '../profile.service';
import { DialogFazlaMesaiTalebiComponent } from '../talep-olustur/dialog-fazla-mesai-talebi/dialog-fazla-mesai-talebi.component';
import { DialogGunlukIzinTalebiComponent } from '../talep-olustur/dialog-gunluk-izin-talebi/dialog-gunluk-izin-talebi.component';
import { DialogSaatlikIzinTalebiComponent } from '../talep-olustur/dialog-saatlik-izin-talebi/dialog-saatlik-izin-talebi.component';
import { DialogZiyaretciTalebiComponent } from '../talep-olustur/dialog-ziyaretci-talebi/dialog-ziyaretci-talebi.component';

@Component({
  selector: 'app-profiledashboard',
  templateUrl: './profiledashboard.component.html',
  styleUrls: ['./profiledashboard.component.scss']
})
export class ProfiledashboardComponent implements OnInit, OnDestroy {
  menuConfig : any;
  private ngUnsubscribe = new Subject();
  user$: Observable<UserType>;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  links : any[];

  myControl : any = FormGroup;
  options: string[] = ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5'];
  filteredOptions: Observable<string[]>;


  dialogFazlaMesaiComponent = DialogFazlaMesaiTalebiComponent;
  dialogZiyaretciComponent = DialogZiyaretciTalebiComponent;
  dialogGunlukIzinComponent = DialogGunlukIzinTalebiComponent;
  dialogSaatlikIzinComponent = DialogSaatlikIzinTalebiComponent;
  displayOvertimeForm : boolean;
  displayVacationForm: boolean;

  userInformation : UserInformation;
  public isLoading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);


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
    this.setVekilForm();
    this.filtered();
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

  openDialog(component: any) {
    this.dialog.open(component);

    // var dialogRes = this.helper.dynamicDialog(false, '530px', '550px', 'fmTalepFormu', 'form', this.dialog, this);

    // const ruleDialogSubs = dialogRes.afterClosed().subscribe((result: any) => {
    //   this.helper.refreshComponent(this);
                          
    //   if (result == "OK") {
    //     console.log("result :", result);
        
    //   }

    // });

    // this.unsubscribe.push(ruleDialogSubs);
  }  

  getCurrentUserInformations() {
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  setVekilForm() {
    this.myControl = this.fomrBuilder.group({
      vekilSec : ['']
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  filtered() {
    this.filteredOptions = this.myControl.get("vekilSec").valueChanges.pipe(
      startWith(''),
      map((value : any) => this._filter(value || '')),
    );
  }

  showOvertimeDialog(){
    this.displayOvertimeForm = true;
  }

  overtimeFormIsSend() {
    this.displayOvertimeForm = false;
  }

  showVacationDialog(){
    this.displayVacationForm = true;
  }

  vacationFormIsSend() {
    this.displayVacationForm = false;
  }

  


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
