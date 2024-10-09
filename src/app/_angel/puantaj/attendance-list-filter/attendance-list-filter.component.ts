import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-attendance-list-filter',
  templateUrl: './attendance-list-filter.component.html',
  styleUrls: ['./attendance-list-filter.component.scss']
})
export class AttendanceListFilterComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() displayFilterModal: boolean;
  @Input() filterByGrid: any;
  @Input() dateRangeByGrid : any;
  @Output() onHideFilterModalEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() setFilterFormEvent: EventEmitter<any> = new EventEmitter<{formValues:any}>();

  filterForm: FormGroup;

  @ViewChild('accordionStaffInfo') accordionStaffInfo: MatExpansionPanel;
  @ViewChild('accordionOrganizationInfo') accordionOrganizationInfo: MatExpansionPanel;
  @ViewChild('accordionPrivateInfo') accordionPrivateInfo: MatExpansionPanel;

  organizationGroup: any[] = [
    {source: 'cbo_firma', name: 'company', viewName: 'Firma', data: [], selectedType: ''},
    {source: 'cbo_altfirma', name: 'subcompany', viewName: 'Alt_Firma', data: [], selectedType: ''},
    {source: 'cbo_bolum', name: 'department', viewName: 'Bölüm', data: [], selectedType: ''},
    {source: 'cbo_pozisyon', name: 'position', viewName: 'Pozisyon', data: [], selectedType: ''},
    {source: 'cbo_yaka', name: 'collar', viewName: 'Yaka', data: [], selectedType: ''},
    {source: 'cbo_direktorluk', name: 'directorship', viewName: 'Direktörlük', data: [], selectedType: ''},
    {source: 'cbo_gorev', name: 'job', viewName: 'Görev', data: [], selectedType: ''},
  ];
  
  privateCode: OKodFieldsModel[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private ref: ChangeDetectorRef
  ) { }
  

  ngOnInit(): void {
    this.createFilterForm();
    console.log("dateRangeByGrid: ", this.dateRangeByGrid);
    
  }
  
  ngAfterViewInit() {
    this.accordionStaffInfo.opened.subscribe(() => this.panelOpened('Panel 1'));
    this.accordionStaffInfo.closed.subscribe(() => this.panelClosed('Panel 1'));

    this.accordionOrganizationInfo.opened.subscribe(() => this.panelOpened('Panel 2'));
    this.accordionOrganizationInfo.closed.subscribe(() => this.panelClosed('Panel 2'));

    this.accordionPrivateInfo.opened.subscribe(() => this.panelOpened('Panel 3'));
    this.accordionPrivateInfo.closed.subscribe(() => this.panelClosed('Panel 3'));
  }

  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      startDate : [this.dateRangeByGrid?.startDate || ''],
      endDate : [this.dateRangeByGrid?.endDate || ''],
      name : [this.filterByGrid?.ad?.filter || ''],
      surname : [this.filterByGrid?.soyad?.filter || ''],
      registrationNumber : [this.filterByGrid?.sicilno?.filter || ''],
      staffNumber : [''],
      company: [this.filterByGrid?.cbo_firma?.toString() || '0'],
      department: [this.filterByGrid?.cbo_bolum?.toString() || '0'],
      collar: [this.filterByGrid?.cbo_yaka?.toString() || '0'],
      position: [this.filterByGrid?.cbo_pozisyon?.toString() || '0'],
      directorship: [this.filterByGrid?.cbo_direktorluk?.toString() || '0'],
      job: [this.filterByGrid?.cbo_gorev?.toString() || '0'],
      subcompany: [this.filterByGrid?.cbo_altfirma?.toString() || '0'],
      code1: [''],
      code2: [''],
      code3: [''],
      code4: [''],
      code5: [''],
      code6: [''],
      code7: [''],
      code8: [''],
      code9: [''],
      code10: [''],
      code11: [''],
      code12: [''],
      code13: [''],
      code14: [''],
      code15: [''],
      code16: [''],
      code17: [''],
      code18: [''],
      code19: [''],
      code20: ['']
    });
  }

  panelOpened(panel: string) {
    if (panel == 'Panel 2' && this.organizationGroup[0].data.length == 0) {
      this.organizationGroup.forEach(item => {
        this.getTypeValues(item.source);
      });
    } else if (panel == 'Panel 3' && this.privateCode.length == 0) {
      this.getTypeValues('Okod');
    }
  }

  panelClosed(panel: string) {
    console.log("Panel Kapatıldı : ", panel);
  }

  onHideFilterModal() {
    this.onHideFilterModalEvent.emit();
  }

  getTypeValues(source : string) {
    this.profileService.getTypeValues(source).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == 1) {

        if (source == 'Okod') {
          this.privateCode = data;
          console.log("Okod : ", data);
          
        } else {
          this.organizationGroup.forEach(item => {
            if (item.source == source && item.data.length == 0) {
              item.data = data;
              console.log(item.name + ' : ', data);
              // this.filterForm.addControl(item.name, this.formBuilder.control(''));
            }
          });
        }
      }
      this.ref.detectChanges();
    });
  }

  setFormValues() {
    let formValues = Object.assign({}, this.filterForm.value);
    console.log("Filter Form : ", formValues); 

    this.setFilterFormEvent.emit({formValues});
  }

  
  


  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
