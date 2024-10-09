import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { AccessDataModel } from '../../profile/models/accessData';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-detail-search',
  templateUrl: './detail-search.component.html',
  styleUrls: ['./detail-search.component.scss']
})
export class DetailSearchComponent implements OnInit, OnDestroy {
  @Input() selectedNavItem: any;
  @Input() displayDetailSearch: boolean;
  @Output() formValuesEvent = new EventEmitter<{selectedNavItem: any, formValues: any}>();
  @Output() displayDetailSearchEvent: EventEmitter<void> = new EventEmitter<void>();

  private ngUnsubscribe = new Subject();

  detailSearchForm : FormGroup;

  oKodFields: any[] = [];
  overtimeReasons: any[] = [];
  vacationTypes: any[] = [];
  companies: any[] = [];
  departments: any[] = [];
  positions: any[] = [];
  duties: any[] = [];
  collars: any[] = [];
  subsidiaries: any[] = [];
  directorates: any[] = [];

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createDetailSearchForm();
    this.showDetailSearchDialog();
  }

  createDetailSearchForm() {
    this.detailSearchForm = this.formBuilder.group({
      ad: [""],
      soyad: [""],
      sicilno: [""],
      personelno: [""],
      firma: ["0"],
      bolum: ["0"],
      pozisyon: ["0"],
      gorev: ["0"],
      altfirma: ["0"],
      yaka: ["0"],
      direktorluk: ["0"],
      okod0: [""],
      okod1: [""],
      okod2: [""],
      okod3: [""],
      okod4: [""],
      okod5: [""],
      okod6: [""],
      tarih: [""],
      tarihbit: [""],
      ftip: [""]
    });
  }

  showDetailSearchDialog() {
    this.getAccessData();
    this.getTypeValues('Okod');
    
    if (this.selectedNavItem == 'izin') {
      this.getTypeValues('cbo_izintipleri');
    } else if (this.selectedNavItem == 'fazlamesai') {
      this.getTypeValues('cbo_fmnedenleri');

    } else if (this.selectedNavItem == 'tum') {
      
    }
  }

  getTypeValues(kaynak : string) {
    this.profileService.getTypeValues(kaynak).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {

        if (kaynak == 'Okod') {
          this.oKodFields = data;  
          
        } else if(kaynak == 'cbo_fmnedenleri') {
          this.overtimeReasons = data;
          
        } else {
          this.vacationTypes = data;

        }
        console.log("Okod Alanları : ", data);
      }

      this.ref.detectChanges();
    });
  }

  getAccessData() {
    this.profileService.getAccessData().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<AccessDataModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;
      console.log("Access Data :", response);

      this.companies = [];
      this.departments = [];
      this.positions = [];
      this.duties = [];
      this.collars = [];
      this.subsidiaries = [];
      this.directorates = [];

      
      if (message.islemsonuc == 1) {
        data.forEach((item : AccessDataModel) => {
          if (item.tip == 'cbo_Firma') {
            this.companies.push(item);
          } else if(item.tip == 'cbo_Bolum') {
            this.departments.push(item);

          } else if(item.tip == 'cbo_Pozisyon') {
            this.positions.push(item);
            
          } else if(item.tip == 'cbo_Gorev') {
            this.duties.push(item);
            
          } else if(item.tip == 'cbo_AltFirma') {
            this.subsidiaries.push(item);
            
          } else if(item.tip == 'cbo_Yaka') {
            this.collars.push(item);
            
          } else if(item.tip == 'cbo_Direktorluk') {
            this.directorates.push(item);
            
          }
        })
      }
      
      this.ref.detectChanges();
    });
  }

  getFormValues(selectedNavItem: any) {
    let formValues = Object.assign({}, this.detailSearchForm.value);
    this.detailSearchForm.reset();
    this.formValuesEvent.emit({selectedNavItem, formValues})
  }

  hideDetailSearch() {
    this.detailSearchForm.reset();
    this.displayDetailSearchEvent.emit();
  }

  ngOnDestroy(): void {
    this.detailSearchForm.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
