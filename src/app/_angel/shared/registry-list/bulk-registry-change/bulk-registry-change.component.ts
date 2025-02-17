import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { AttendanceService } from 'src/app/_angel/puantaj/attendance.service';
import { AccessGroupState } from 'src/app/store/models/access-group.state';
import { FormState } from 'src/app/store/models/form.state';
import { selectAddedGroups } from 'src/app/store/selectors/access-group.selector';

@Component({
  selector: 'app-bulk-registry-change',
  templateUrl: './bulk-registry-change.component.html',
  styleUrls: ['./bulk-registry-change.component.scss']
})
export class BulkRegistryChangeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() display: boolean;
  @Input() fromWhere: any;
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() completedEvent = new EventEmitter<any>();
  tabs: any[] = [
    // {id: 1, label: this.translateService.instant('Genel_Bilgiler'), action: ['u', 'i']},
    {id: 3, label: this.translateService.instant('Organizasyon_Bilgileri'), action: ['u', 'i']},
    {id: 4, label: this.translateService.instant('Özel_Bilgileri_(1)'), action: ['u', 'i']},
    {id: 5, label: this.translateService.instant('Özel Bilgileri_(2)'), action: ['u', 'i']},
    {id: 6, label: this.translateService.instant('Mesai_Bilgileri'), action: ['u', 'i']},
    {id: 7, label: this.translateService.instant('Kart_RF_Parmak_Yüz_Bilgileri'), action: ['u']},
    {id: 8, label: this.translateService.instant('Geçiş_Grupları'), action: ['u']},
  ];
  selectedIndex: any = 3;
  entryDate: any;
  
  checkFormController: any = {
    checkEntryDate: "",
    checkCompany: "",
    checkDepartment: "",
    checkPosition: "",
    checkJob: "",
    checkSubcompany: "",
    checkCollar: "",
    checkDirectorship: "",
    checkTimeAttendance: "",
    okod1: "",
    okod2: "",
    okod3: "",
    okod4: "",
    okod5: "",
    okod6: "",
    okod7: "",
    okod8: "",
    okod9: "",
    okod10: "",
    okod11: "",
    okod12: "",
    okod13: "",
    okod14: "",
    okod15: "",
    okod16: "",
    okod17: "",
    okod18: "",
    okod19: "",
    okod20: "",
    checkUserDef: "",
    checkMaster: "",
    checkByPass: "",
    checkSalaryType: "",
    checkOvertime: "",
    checkMissingTime: "",
    checkMissingTimeOvertime: "",
    checkEarylWork: "",
    checkMissingDay: "",
    checkNightRaise: "",
    overrideType: "",
    checkAccessGroup: ""
  };
  actionType: string = "0";
  selectedRegistry: any[] = [];
  loadingProgress: number = 0;
  completedRequests: number = 0;
  totalRequests: number = 0;
  imageUrl: string;
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private storeForm: Store<{ form: FormState }>,
    private storeAccess: Store<AccessGroupState>,
    private attendanceService: AttendanceService,
    private toastrService: ToastrService
  ) {
    this.imageUrl = this.profileService.getImageUrl();
  }
  
  ngOnInit(): void {
    this.getSelectedRows();
  }

  changeTabMenu(event: any) {
    this.selectedIndex = event;
    console.log("State :", this.checkFormController);
    
  }
  
  close() {
    this.closeEvent.emit(false);
  }

  collectAllFormData() {
    let value: any;
    this.storeForm.select('form').pipe(take(1)).subscribe((state) => {
      console.log("STATE : ", state);
      value = state;
    });

    let accessGroupValue: any;
    this.storeAccess.pipe(select(selectAddedGroups)).pipe(take(1)).subscribe((state) => {
      console.log("Access Group State: ", state);
      accessGroupValue = state;
    });

    if (!this.selectedRegistry || this.selectedRegistry.length === 0) {
      return;
    }
  
    // Toplam istek sayısını belirledim
    this.totalRequests = this.selectedRegistry.length;
    this.completedRequests = 0;
    this.loadingProgress = 0;
  
    this.sendRequestsWithDelay(value, accessGroupValue, 0);
  }

  sendRequestsWithDelay(value: any, accessGroupValue: any, index: number) {
    if (index >= this.selectedRegistry.length) {
      console.log("Tüm istekler tamamlandı.");
      return;
    }
  
    const register = this.selectedRegistry[index];
  
    this.updateRegistry(value, accessGroupValue, register);
  
    this.completedRequests++;
    this.loadingProgress = Math.round((this.completedRequests / this.totalRequests) * 100);
    console.log(`Yükleme Durumu: ${this.loadingProgress}%`);
  
    setTimeout(() => {
      this.sendRequestsWithDelay(value, accessGroupValue, index + 1);
    }, 500);
  }

  getSelectedRows() {
    this.attendanceService.getSelectedItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe((items) => {
      console.log("Sicil Listesinde Siciller Geldi : ", items);
      
      if (items.length == 0) {
        this.toastrService.warning(
          this.translateService.instant("Sicil_Veya_Siciller_Seçiniz"),
          this.translateService.instant("Uyarı")
        )
        this.close();
        return;
      }

      this.selectedRegistry = [...items];
    });

  }

  
  updateRegistry(value: any, accessGroupValue: any, register: any) {
    const matchAccessGroup = this.matchAccessGroup(accessGroupValue);
    
    var sp: any[] = [
      {
        mkodu: "yek252",
        id: register.Id.toString(),
        firma: this.checkFormController.checkCompany ? value.organizationInfo.company.ID.toString() : null,
        bolum: this.checkFormController.checkDepartment ? value.organizationInfo.department.ID.toString() : null,
        pozisyon: this.checkFormController.checkPosition ? value.organizationInfo.position.ID.toString() : null,
        gorev: this.checkFormController.checkJob ? value.organizationInfo.job.ID.toString() : null,
        altfirma: this.checkFormController.checkSubcompany ? value.organizationInfo.subCompany.ID.toString() : null,
        yaka: this.checkFormController.checkCollor ? value.organizationInfo.collar.ID.toString() : null,
        direktorluk: this.checkFormController.checkDirectorship ? value.organizationInfo.directorship.ID.toString() : null,
        maastipi: this.checkFormController.checkSalaryType ? value.shiftInfo.salaryType.ID.toString() : null,
        fazlamesai: this.checkFormController.checkOvertime ? value.shiftInfo.overtime ? "1" : "0" : null,
        eksikmesai: this.checkFormController.checkMissingTime ? value.shiftInfo.missingTime ? "1" : "0" : null,
        eksikfm: this.checkFormController.checkMissingTimeOvertime ? value.shiftInfo.missingTimeOvertime ? "1" : "0" : null,
        erkenmesai: this.checkFormController.checkEarylWork ? value.shiftInfo.earylWork ? "1" : "0" : null,
        eksikgun: this.checkFormController.checkMissingDay ? value.shiftInfo.missingDay ? "1" : "0" : null,
        gecezammi: this.checkFormController.checkNightRaise ? value.shiftInfo.nightRaise ? "1" : "0" : null,
        yetkistr: this.checkFormController.checkAccessGroup ? matchAccessGroup : null,
        ezmetipi: this.checkFormController.checkAccessGroup ? this.actionType : null,
        userdef: this.checkFormController.checkUserDef ? value.accessInfo.userDefinition.ID.toString() : null,
        puantaj: this.checkFormController.checkTimeAttendance ? value.organizationInfo.timeAttendance.ID.toString() : null,
        master: this.checkFormController.checkMaster ? value.accessInfo.master ? "1" : "0" : null,
        okod1: this.checkFormController.okod1 ? value.customInfo.okod1 : null,
        okod2: this.checkFormController.okod2 ? value.customInfo.okod2 : null,
        okod3: this.checkFormController.okod3 ? value.customInfo.okod3 : null,
        okod4: this.checkFormController.okod4 ? value.customInfo.okod4 : null,
        okod5: this.checkFormController.okod5 ? value.customInfo.okod5 : null,
        okod6: this.checkFormController.okod6 ? value.customInfo.okod6 : null,
        okod7: this.checkFormController.okod7 ? value.customInfo.okod7 : null,
        okod8: this.checkFormController.okod8 ? value.customInfo.okod8 : null,
        okod9: this.checkFormController.okod9 ? value.customInfo.okod9 : null,
        okod10: this.checkFormController.okod10 ? value.customInfo.okod10 : null,
        okod11: this.checkFormController.okod11 ? value.customInfo.okod11 : null,
        okod12: this.checkFormController.okod12 ? value.customInfo.okod12 : null,
        okod13: this.checkFormController.okod13 ? value.customInfo.okod13 : null,
        okod14: this.checkFormController.okod14 ? value.customInfo.okod14 : null,
        okod15: this.checkFormController.okod15 ? value.customInfo.okod15 : null,
        okod16: this.checkFormController.okod16 ? value.customInfo.okod16 : null,
        okod17: this.checkFormController.okod17 ? value.customInfo.okod17 : null,
        okod18: this.checkFormController.okod18 ? value.customInfo.okod18 : null,
        okod19: this.checkFormController.okod19 ? value.customInfo.okod19 : null,
        okod20: this.checkFormController.okod20 ? value.customInfo.okod20 : null,
        bypasscard: this.checkFormController.checkMaster ? value.accessInfo.master ? "1" : "0" : null
      }
    ];

    console.log("Toplu Değişiklik Params: ", sp);
    
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;

      const requestState = message.islemsonuc == -1 ? false : true;
      const updatedRegister = { ...register, requestState };
      this.updateSelectedRegistry(updatedRegister);
      
      this.selectedRegistry[register] 
      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Toplu Değişiklik Yapıldı :", data);

      if (this.loadingProgress == 100) {
        console.log("Testoo :", this.selectedRegistry);
        this.completedEvent.emit();
      }
      
    });
  }

  matchAccessGroup(accessGroup: any) {
    return accessGroup
      .filter((item: any) => !('isTemp' in item))  // isTemp false olanları filtreledim
      .map((item: any) => item.ID)  // Sadece ID'leri aldımm
      .join(';');  // ID'leri birleştirdim
  }


  onActionType(event:string) {
    const actionMap: any = {
      'u': '0',
      'c': '1',
      'd': '2'
    };
  
    this.actionType = actionMap[event] !== undefined ? actionMap[event] : null;
  }

  updateSelectedRegistry(updatedRegister: any): void {
    this.selectedRegistry = this.selectedRegistry.map(item => 
      item.Id === updatedRegister.Id ? updatedRegister : item
    );
  }
  
  sendToApiFetch() {
    const getItems = () => {
      const token = localStorage.getItem('authToken'); 
    
      fetch("/test/testasync", {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data); 
      })
      .catch(error => console.error(error)); 
    };
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
