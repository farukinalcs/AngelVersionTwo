import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-custom-info',
  templateUrl: './custom-info.component.html',
  styleUrls: ['./custom-info.component.scss']
})
export class CustomInfoComponent implements OnInit, OnDestroy, OnChanges {
  private ngUnsubscribe = new Subject();
  @Input() inputValue!: number;
  @Input() selectedRegister: any;
  @Input() operationType: any;
  form!: FormGroup;
  customCodes: any[] = [];
  display: boolean;
  selectedItem: any;
  newName: any;
  selectedFormType: any;
  registerDetail: any[] = [];
  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.form = this.fb.group({});
    this.getCustomInfo();
  }

  ngOnChanges() {
    // if (this.operationType == 'u') {
    //   this.setFormValue();
    // }
  }

  getCustomInfo() {
    var sp: any[] = [
      { mkodu: 'yek205', id: '0'}
    ];
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      let data = response[0].x;
      const message = response[0].z;
      if (message.islemsonuc == -1) {
        return;
      }
      data = data.map((item:any, index:any) => ({
        ...item,
        controlName: `okod${index + 1}`
      }));
      console.log("OKod : ", data);
      this.customCodes = [...data];
      this.createForm(data);

      if (this.operationType == 'u') {
        this.getRegisterDetail();
      }
    });
  }

  createForm(data: any[]): void {
    const group: any = {};

    data.forEach(item => {
      group[item.controlName] = [""];
    });
    this.form = this.fb.group(group);
  }

  showEdit(item:any) {
    this.display = true;
    this.selectedItem = item;
    this.newName = item.ad
    this.selectedFormType = item.type
  }
  
  closeEdit() {
    this.display = false;
  }

  editCustomCode() {
    var sp: any[] = [
      { mkodu: 'yek204', okod: this.selectedItem.okodtype, deger : this.selectedFormType},
      { mkodu: 'yek208', ad: this.newName, id: this.selectedItem.ID.toString()}
    ];
    console.log("Form Tipi Güncelle Param :", sp);
    
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      response.forEach((item:any) => {
        let data = item.x;
        const message = item.z;
        
        if (message.islemsonuc == -1) {
          return;
        }
        console.log("OKod Güncellendi : ", data);
      });
      
      this.closeEdit();
      this.getCustomInfo();
    });
  }

  getRegisterDetail() {
    var sp: any[] = [
      { mkodu: 'yek209', id: this.selectedRegister?.Id.toString() }
    ];
    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
      const data = response[0].x;
      const message = response[0].z;
      if (message.islemsonuc == -1) {
        return;  
      }
      console.log("Sicil Detay Geldi : ", data);
      this.registerDetail = [...data];
      this.setFormValue();
    });
  }

  setFormValue() {
    const okodFields = Array.from({ length: 20 }, (_, i) => `okod${i + 1}`);
    const registerDetail = this.registerDetail[0];
  
    okodFields.forEach(field => {
      const value = registerDetail?.[field];
      this.form?.get(field)?.setValue(value);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
