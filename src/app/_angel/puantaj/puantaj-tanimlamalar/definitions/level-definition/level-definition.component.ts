import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-level-definition',
  templateUrl: './level-definition.component.html',
  styleUrls: ['./level-definition.component.scss']
})
export class LevelDefinitionComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  dropdownEmptyMessage : any = this.translateService.instant('Kayıt_Bulunamadı');
  formGroup: FormGroup;
  selectedPermitType  : any;
  selectedOvertimeType  : any;
  selectedShiftType  : any;
  selectedMailType  : any;
  levels: any[] = [
    { level: '0' },
    { level: '1' },
    { level: '2' },
    { level: '3' },
    { level: '4' },
    { level: '5' },
    { level: '6' },
    { level: '7' },
    { level: '8' },
    { level: '9' }
  ];
  
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.dropdownEmptyMessage = this.translateService.instant('Kayıt_Bulunamadı');

    this.createForm();
    this.getLevelDefinition();
    
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      permitLevel: [''],
      overtimeLevel: [''],
      shiftPlanLevel: [''],
      mailServiceLevel: ['']  
    });
  }

  getLevelDefinition() {
    var sp: any[] = [
      {
        mkodu: 'yek121',
        kaynak: 'kademe',
      },
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Kademe Tanımları: ', data);

        data.forEach((item:any) => {
          if (item.ad == 'izinkademe') {
            this.formGroup.get('permitLevel')?.setValue(item.deger);
            this.selectedPermitType = {level:item.deger}
          } else if (item.ad == 'fmkademe') {
            this.formGroup.get('overtimeLevel')?.setValue(item.deger);
            this.selectedOvertimeType = {level:item.deger}
  
          } else if (item.ad == 'vardiyakademe') {
            this.formGroup.get('shiftPlanLevel')?.setValue(item.deger);
            this.selectedShiftType = {level:item.deger}
            
          } else if (item.ad == 'mailserviskademe') {
            this.formGroup.get('mailServiceLevel')?.setValue(item.deger);
            this.selectedMailType = {level:item.deger}
            
          }
        });
        
        
      });
  }

  setLevelDefinition(){
    var sp: any[] = [
      {
        mkodu: 'yek122',
        ik: this.formGroup.get('permitLevel')?.value.level,
        fk: this.formGroup.get('overtimeLevel')?.value.level,
        vk: this.formGroup.get('shiftPlanLevel')?.value.level,
        msk: this.formGroup.get('mailServiceLevel')?.value.level
      },
    ];

    console.log("Kademe Tanımları Set Params :", sp);
    
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response[0].x;
        const message = response[0].z;

        if (message.islemsonuc != 1) {
          return;
        }
        console.log('Kademe Tanımları: ', data);

        data.forEach((item:any) => {
          if (item.ad == 'izinkademe') {
            this.formGroup.get('permitLevel')?.setValue(item.deger);
            this.selectedPermitType = {level:item.deger}
          } else if (item.ad == 'fmkademe') {
            this.formGroup.get('overtimeLevel')?.setValue(item.deger);
            this.selectedOvertimeType = {level:item.deger}
  
          } else if (item.ad == 'vardiyakademe') {
            this.formGroup.get('shiftPlanLevel')?.setValue(item.deger);
            this.selectedShiftType = {level:item.deger}
            
          } else if (item.ad == 'mailserviskademe') {
            this.formGroup.get('mailServiceLevel')?.setValue(item.deger);
            this.selectedMailType = {level:item.deger}
            
          }
        });
        
        this.toastrService.success(
          this.translateService.instant('Kademe_Tanımları_Güncellendi'),
          this.translateService.instant('Başarılı')
        );
        
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Kademe_Tanımları_Güncellenirken_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }




  
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
