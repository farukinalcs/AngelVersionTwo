import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { TranslationModule } from 'src/app/modules/i18n';

@Component({
  selector: 'app-add-banned-visitor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, TranslationModule],
  templateUrl: './add-banned-visitor.component.html',
  styleUrl: './add-banned-visitor.component.scss'
})
export class AddBannedVisitorComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() visible: boolean; 
  @Output() hideEvent = new EventEmitter<any>();
  @Output() refreshEvent = new EventEmitter();
  form: FormGroup;
  
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    public translateService: TranslateService,
    private toastrService: ToastrService
  ) { }
  
  ngOnInit(): void {
    this.createForm();
  }

  onHide() {
    this.hideEvent.emit();
  }
  
  createForm() {
    this.form = this.formBuilder.group({
      identityInfo: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      explanation: ['', Validators.required]
    });
  }

  add() {
    const formValues = this.getFormValues();
    console.log("formValues: ", formValues);

    var sp: any[] = [
      {
        mkodu: 'yek268',
        ad: formValues.name,
        soyad: formValues.surname,
        kimlikno: formValues.identityInfo,
        aciklama: formValues.explanation,
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      console.log("Yasaklı eklendi : ", data);
      this.toastrService.success(
        this.translateService.instant("Yasaklı_Ziyaretçi_Eklendi"),
        this.translateService.instant("Başarılı")
      );

      this.onHide();
      this.refreshEvent.emit();
    });
    
  }
  
  getFormValues(): FormModel {
    return this.form.value;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}


export interface FormModel {
  identityInfo: string,
  name: string,
  surname: string,
  explanation: string
}