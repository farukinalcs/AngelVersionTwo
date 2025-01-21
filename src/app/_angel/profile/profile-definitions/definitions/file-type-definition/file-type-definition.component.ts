import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { HelperService } from 'src/app/_helpers/helper.service';
import { OKodFieldsModel } from '../../../models/oKodFields';
import { ProfileService } from '../../../profile.service';

@Component({
  selector: 'app-file-type-definition',
  templateUrl: './file-type-definition.component.html',
  styleUrls: ['./file-type-definition.component.scss']
})
export class FileTypeDefinitionComponent implements OnInit, OnDestroy {
  @Input() selectedItem: any;
  @Output() closeAnimationEvent = new EventEmitter<void>();
  private ngUnsubscribe = new Subject();
  form: FormGroup;
  selectedValue: any[] = [];
  sourceItems: any[] = [];
  targetItems: any[] = [];
  vacationReasons: any[] = [];
  selectedType: any;
  dropdownEmptyMessage: any;
  selected: any;
  dragDrop: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private translateService: TranslateService,
    private helperService: HelperService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dropdownEmptyMessage = this.translateService.instant('Kayıt_Bulunamadı');
    console.log("Selected item : ", this.selectedItem);
    this.createForm();
    this.getDemandType();
    this.getFormValue();
  }

  createForm() {
    this.form = this.formBuilder.group({
      type: [''],
    });
  }

  getFormValue() {
    this.form.get('type')?.valueChanges.subscribe((v: any) => {
      this.selected = v;
      this.selectedValue = v;
      if (v) {
        this.getFileTypeForDemandType();
      }
    });
    console.log('Get Value : ', this.selectedValue);
  }

  getDemandType() {
    this.profileService
      .getTypeValues(this.selectedItem.demandParam)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;
          if(message.islemsonuc == -1) {
            return;
          }
          this.vacationReasons = [...data];
          this.selectedType = this.vacationReasons[1];
          console.log('İzin Tipleri : ', data);
        }
      );
  }

  getFileType() {
    this.sourceItems = [];
    this.profileService
      .getTypeValues('cbo_belgetipi')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;
          if (message.islemsonuc == -1) {
            return;
          }
          this.sourceItems = this.removeItemsWithMatchingIds(data,this.targetItems);
          // this.sourceItems = this.sourceItems.map(item => ({
          //   BelgeId: item.ID,
          //   ad: item.Ad
          // }));
          console.log("Source : ", this.sourceItems);
        }
      );
  }

  removeItemsWithMatchingIds(mainArray: any[], nestedArray: any[]): any[] {
    return mainArray.filter((mainItem) => {
      const matchingItem = nestedArray.find(
        (nestedItem) => nestedItem.BelgeId === mainItem.ID
      );
      return !matchingItem;
    });
  }

  getFileTypeForDemandType() {
    this.targetItems = [];
    this.profileService
      .getFileTypeForDemandType(this.selected.ID, this.selectedItem.fileParam)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;
        if (message.islemsonuc == -1) {
          return;          
        }
        console.log('Tipi geldi', data);
        this.targetItems = [...data];
        this.getFileType();
        console.log("Target :", this.targetItems);
        
      });
  }

  onMoveToTarget(item: any) {
    var sp : any[] = [
      {
        mkodu : 'yek060',
        tip : this.selected.ID.toString(),
        belge : item.ID.toString(),
        kaynak : this.selectedItem.fileParam  
      }
    ];
    console.log("Ekle Param: ", sp);
  
    this.profileService
    .requestMethod(sp)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log('Tipi Atandı', data);
      this.getFileTypeForDemandType();
    });
  }

  onMoveToSource(item: any) {
    var sp : any[] = [
      {
        mkodu : 'yek061',
        id : item.id.toString(),
        kaynak : this.selectedItem.fileParam  
      }
    ];
    console.log("Kaldır Param: ", sp);

    this.profileService
    .requestMethod(sp)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }
      console.log('Tipi Kaldırıldı', data);
      this.getFileTypeForDemandType();
    });
  }


  ngOnDestroy(): void {
    console.log('Bitti');
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
