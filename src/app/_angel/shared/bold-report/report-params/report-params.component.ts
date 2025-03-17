import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';

@Component({
  selector: 'app-report-params',
  templateUrl: './report-params.component.html',
  styleUrls: ['./report-params.component.scss']
})

export class ReportParamsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() report: any;
  @Output() cacheKeyEvent = new EventEmitter<string>();
  @Output() formValue = new EventEmitter<any>();
  form!: FormGroup;
  reportParams: ReportParam[] = [];
  selectOptions: { [key: string]: any[] } = {}; // Seçenekleri tutacak obje

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private toastrService: ToastrService
  ) { }
  
  ngOnInit(): void {
    this.form = this.fb.group({});

    this.fetchReportParams();
  }

  fetchReportParams() {
    var sp: any[] = [
      {
        mkodu: 'yek257',
        spname: this.report.id
      }
    ];

    console.log('Rapor Parametreleri (sp):', sp);
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }

          console.log('Rapor Parametreleri :', data);
          

          // displayName ve hasTimeField'i hesaplayarak yeni bir array oluştur
          this.reportParams = data.map((param:ReportParam) => ({
            ...param,
            displayName: this.extractDisplayName(param.ParameterName),
            hasTimeField: param.tip === '16' // Eğer tarih alanıysa true yap
          }));

          console.log('Rapor Parametreleri (Yeni) :', this.reportParams);
          
          this.createForm();
          this.loadAllSelectOptions(); // Seçenekleri çekme işlemi

        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  extractDisplayName(paramatreName: string): string {
    if (paramatreName.includes('#')) {
      return paramatreName.replace('@', '').split('#')[0]; // @ işaretini kaldır ve # ile ayırıp ilk kısmı al
    } else if (paramatreName.includes('$')) {
      return paramatreName.replace('@', '').split('$')[0]; // @ işaretini kaldır ve $ ile ayırıp ilk kısmı al 
    } else {
      return paramatreName.replace('@', ''); // @ işaretini kaldır 
    }    
  }

  createForm() {
    const group: any = {};
    this.reportParams.forEach((param:ReportParam) => {
      group[param.ParameterName] = ['']; // Normal form kontrolü

      // Eğer tip 16 (tarih) ise ekstra time form kontrolü oluştur
      // if (param.hasTimeField) {
      //   group[`${param.displayName}_time`] = ['']; // Örn: TarihBas_time, TarihBit_time
      // }
    });
    this.form = this.fb.group(group);
  }

  loadSelectOptions(kaynak: string) {
    var sp: any[] = [
      {
        mkodu: 'yek041',
        kaynak: kaynak,
        id: '0',
      },
    ];

    console.log(`Kaynak Parametreleri (${kaynak}) :`, sp);
    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: any) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == -1) {
            return;
          }
          
          this.selectOptions[kaynak] = [...data];
          console.log(`Kaynaklar (${kaynak}) :`, this.selectOptions[kaynak]);
        },
        (err) => {
          this.toastrService.error(
            this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
            this.translateService.instant('Hata')
          );
        }
      );
  }

  loadAllSelectOptions() {
    this.reportParams
      .filter(param => param.tip === '7' && param.kaynak)
      .forEach(param => this.loadSelectOptions(param.kaynak));
  }

  onSubmit() {
    console.log(this.form.value);
  }
  
  setReport() {
    var sp: any[] = this.updateSpDynamically(this.form.value);
    console.log('Raporun Parametrelerini Gönderiyoruz (sp):', sp);
    this.formValue.emit(this.form.value);
    
    this.profileService.requestMethodPost(sp).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      console.log("Rapor Response: ", response);

      const cacheKey = response[0].x[0].cacheKey;
      console.log("Cache Key: ", cacheKey);
      this.cacheKeyEvent.emit(cacheKey);
    });
  }
  
  
  
  updateSpDynamically(formValue: any) {
    // Sp dizisini başlatıyoruz.
    const sp: SpItem[] = [{
      mkodu: 'rpt'+this.report.mkodu,
    }];

    // Formdaki her parametreyi kontrol ediyoruz
    Object.keys(formValue).forEach(key => {
      let value = formValue[key];

      // Eğer key içerisinde "tarih" kelimesi geçiyorsa ve değer string ise "T" harfini boşluk ile değiştir
      if (key.toLowerCase().includes("tarih") && typeof value === 'string') {
        value = value.replace("T", " ");
      }

      // Eğer parametre iç içe bir nesne ise (ID, Ad gibi)
      if (value && typeof value === 'object' && value.ID !== undefined) {
        // "ID" değeri 0 ise "0" olarak atama yapıyoruz
        sp[0][key] = value.ID === 0 ? "0" : value.ID.toString();
      } else if (typeof value === 'string' || typeof value === 'number') {
        // Eğer parametre bir string veya number ise direkt olarak atıyoruz
        sp[0][key] = value || "";
      } else {
        // Diğer tipler için boş string ataması yapıyoruz
        sp[0][key] = "";
      }
    });


    return sp;
  }
  
  getOptionName(item: any): string {
    const adKey = Object.keys(item).find(k => k.toLowerCase() === "ad");

    return item[adKey!];
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}


interface ReportParam {
  ParameterName: string;
  DataType: string;
  tip: string;
  kaynak: string;
  MaxLength: number;
  precision: number;
  scale: number;
  IsOutputParameter: boolean;
  displayName: string;   // Ekranda göstereceğimiz sade ad
  hasTimeField?: boolean;  // tip 16 olanlar için
}

interface SpItem {
  mkodu: string;
  [key: string]: string | number; // key burada dinamik olarak string olabilir ve değeri string ya da number olabilir.
}