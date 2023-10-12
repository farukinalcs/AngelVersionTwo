import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { HelperService } from 'src/app/_helpers/helper.service';
import { OKodFieldsModel } from '../../models/oKodFields';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-dosya-tipi-tanimlama',
  templateUrl: './dosya-tipi-tanimlama.component.html',
  styleUrls: ['./dosya-tipi-tanimlama.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DosyaTipiTanimlamaComponent implements OnInit, OnDestroy {
  @Input() selectedItem: any; 
  @Output() closeAnimationEvent = new EventEmitter<void>();
  private ngUnsubscribe = new Subject();

  form : FormGroup;
  selectedValue : any[] = []

  sourceItems: any[] = [];
  targetItems: any[] = [];
  vacationReasons: any[] = [];

  selectedType  : any;
  dropdownEmptyMessage : any = this.translateService.instant('PUBLIC.DATA_NOT_FOUND');
  selected: any;
  demandParam: string = '';
  fileParam: string = '';
  dragDrop : boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private profileService : ProfileService,
    private translateService : TranslateService,
    private helperService : HelperService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.configureComponentBehavior();
    this.getFormValue();
  }

  configureComponentBehavior() {
    this.helperService.configureComponentBehavior
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((value : any) => {
      // if (value == 1) {
      //   this.demandParam = 'cbo_izintipleri';
      //   this.fileParam = 'izin';
  
      // } else if (value == 2) {
      //   this.demandParam = 'cbo_fmnedenleri';
      //   this.fileParam = 'fm';
        
      // } else if (value == 3) {
      //   this.demandParam = 'cbo_ziyaretnedeni';
      //   this.fileParam = 'ziyaret';
      // }

      
      this.demandParam = value.demandParam;
      this.fileParam = value.fileParam;

      this.targetItems = [];
      this.sourceItems = [];
      this.getDemandType();

      this.ref.detectChanges();
    });
    
  }

  createForm() {
    this.form = this.formBuilder.group({
      type : ['']
    });
  }

  getFormValue() {
    this.form.get('type')?.valueChanges.subscribe((v : any) => {
      this.selected = v;
      this.selectedValue = v;

      if (v) {
        this.getFileTypeForDemandType();  
        // this.getFileType();
      }
    });
    
    console.log("Get Value : ", this.selectedValue);
  }

  getDemandType() {
    this.profileService
    .getOKodField(this.demandParam)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {

      const data = response[0].x;
      const message = response[0].z;
      
      if (message.islemsonuc == 1) {
        this.vacationReasons = data;
        console.log("İzin Tipleri : ", data);
      }

      this.ref.detectChanges();
    });
  }

  getFileType() {
    this.sourceItems = [];
    this.profileService
    .getOKodField('cbo_belgetipi')
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
      const data = response[0].x;
      const message = response[0].z;

      this.sourceItems = this.removeItemsWithMatchingIds(data, this.targetItems);
      // this.sourceItems = data.filter((item : any) => {
      //   const matchingItem  = this.targetItems.find(targetItem => targetItem.ID === item.ID);
      //   return !matchingItem;
      // });
      // this.sourceItems = data;

      this.ref.detectChanges();

    });
  }

  removeItemsWithMatchingIds(mainArray: any[], nestedArray: any[]): any[] {
    return mainArray.filter(mainItem => {
      const matchingItem = nestedArray.find(nestedItem => nestedItem.BelgeId === mainItem.ID);
      return !matchingItem;
    });
  }  

  getFileTypeForDemandType() {
    this.targetItems = [];
    this.profileService
    .getFileTypeForDemandType(this.selected.ID, this.fileParam)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      console.log("Tipi geldi", data);
      this.targetItems = data;

      this.getFileType();

      this.ref.detectChanges();
    });
  }

  onMoveToTarget(event : any) {
    console.log("onMoveToTarget :", event.items);
    this.dragDrop = false;
    this.postFileTypeForDemandType(event.items);
  }

  onMoveToSource(event : any) {
    console.log("onMoveToSource :", event.items);
    this.dragDrop = false;
    this.deleteFileTypeForDemandType(event.items);
  }

  deleteFileTypeForDemandType(arr : any[]) {
    this.profileService
    .deleteFileTypeForDemandType(arr, this.fileParam)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      const data = response[0].x;
      const message = response[0].z;

      console.log("Tipi silindi", data);
      this.dragDrop = true;

      this.ref.detectChanges();
    });
  }

  postFileTypeForDemandType(arr : any[]) {
    this.profileService
    .postFileTypeForDemandType(this.selected.ID, this.fileParam, arr)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {
      console.log("Tipi Atandı", response);
      
      this.dragDrop = true;

      this.ref.detectChanges();
    });
  }

  onCloseButtonClick() {
    this.fileParam = '';
    this.demandParam = '';
    this.closeAnimationEvent.emit();

    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    console.log("Bitti");
    
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
