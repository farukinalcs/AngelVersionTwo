import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-custom-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './custom-code.component.html',
  styleUrl: './custom-code.component.scss'
})
export class CustomCodeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  visitCodes: any[] = [];
  form: FormGroup;

  constructor(
    private profileService: ProfileService,
    private translateService: TranslateService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    // form başlatılıyor
    this.form = this.formBuilder.group({});
    this.getVisitCodes();
  }
  
  getVisitCodes() {
    var sp: any[] = [
      {
        mkodu: 'yek283',
        kaynak: ''
      }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.visitCodes = data.map((item: any) => ({ ...item }));
      console.log("Ziyaret Kodları : ", this.visitCodes);

      // form kontrolü ekleniyor
      this.addFormControl(data);
    });
  }

  addFormControl(data: any) {
    data.forEach((item: any) => {
      // Form kontrolü ekleniyor
      this.form.addControl(item.Zokodad, this.formBuilder.control(''));
      this.form.addControl(item.Zokodad + 'lim', this.formBuilder.control(''));


      // Form değeri güncelleniyor
      this.form.patchValue({
        [item.Zokodad]: item.Zokoddeger,
        [item.Zokodad + 'lim']: item.limit
      });
    });
  }

  save() {
    var sp: any[] = [
      {
        mkodu: 'yek285',
        zokod1: this.form.get('ZOKod1')?.value,
        zokod2: this.form.get('ZOKod2')?.value, 
        zokod3: this.form.get('ZOKod3')?.value, 
        zokod4: this.form.get('ZOKod4')?.value, 
        zokod5: this.form.get('ZOKod5')?.value, 
        zokod6: this.form.get('ZOKod6')?.value,
        zokod7: this.form.get('ZOKod7')?.value, 
        zokod8: this.form.get('ZOKod8')?.value, 
        zokod9: this.form.get('ZOKod9')?.value, 
        zokod10: this.form.get('ZOKod10')?.value,
        zokod11: this.form.get('ZOKod11')?.value,
        zokod12: this.form.get('ZOKod12')?.value,
        zokod1limit: this.form.get('ZOKod1lim')?.value, 
        zokod2limit: this.form.get('ZOKod2lim')?.value, 
        zokod3limit: this.form.get('ZOKod3lim')?.value, 
        zokod4limit: this.form.get('ZOKod4lim')?.value, 
        zokod5limit: this.form.get('ZOKod5lim')?.value, 
        zokod6limit: this.form.get('ZOKod6lim')?.value, 
        zokod7limit: this.form.get('ZOKod7lim')?.value,
        zokod8limit: this.form.get('ZOKod8lim')?.value, 
        zokod9limit: this.form.get('ZOKod9lim')?.value, 
        zokod10limit: this.form.get('ZOKod10lim')?.value,
        zokod11limit: this.form.get('ZOKod11lim')?.value,
        zokod12limit: this.form.get('ZOKod12lim')?.value
      }
    ];

    console.log("Zokod params: ", sp);

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: any) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.toastrService.success(
        this.translateService.instant("Kaydedildi"),
        this.translateService.instant("Başarılı")
      );      
    });
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
