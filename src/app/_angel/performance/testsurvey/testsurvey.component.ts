import { ChangeDetectorRef, Component } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-testsurvey',
  templateUrl: './testsurvey.component.html',
  styleUrls: ['./testsurvey.component.scss']
})
export class TestsurveyComponent {

  formDetail: any[] = [];
  parsedForms: any[] = [];

  categoryS: any[] = [];
  questionS: any[] = [];
  scaleS: any[] = [];

  showTest:boolean=false; 
    constructor(
      private perform: PerformanceService,
      private ref: ChangeDetectorRef,
      private helper: HelperService,
      private toastrService: ToastrService
    ) { }
  
    ngOnInit(): void {
      //this.forms_Detail(1);
    }
  
    ngAfterViewInit() {
     
    }

      // forms_Detail(id: number) {
      //   this.showTest = true;
      //   this.perform.form_s(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      //     this.formDetail = response[0]?.x ?? [];
      //     console.log("TEST SURVEY:", this.formDetail);
      
      //     this.parsedForms = this.formDetail.map(form => {
      //       const parsedSorular = JSON.parse(form.sorular || '[]');
      //       const parsedKategoriler = JSON.parse(form.kategoriler || '[]');
      
      //       this.categoryS = [...parsedKategoriler];
      //       this.questionS = [...parsedSorular];
      
      //       // Benzersiz ölçekleri çıkar
      //       this.scaleS = this.questionS
      //         .map(q => ({
      //           olcekid: q.olcekid,
      //           olcekad: q.olcekad,
      //           cevap1: q.cevap1?.trim() || '',
      //           cevap2: q.cevap2?.trim() || '',
      //           cevap3: q.cevap3?.trim() || '',
      //           cevap4: q.cevap4?.trim() || '',
      //           cevap5: q.cevap5?.trim() || '',
      //           cevapn:  q.cevapn
      //         }))
      //         .filter((value, index, self) =>
      //           index === self.findIndex(v =>
      //             v.olcekid === value.olcekid &&
      //             v.cevap1 === value.cevap1 &&
      //             v.cevap2 === value.cevap2 &&
      //             v.cevap3 === value.cevap3 &&
      //             v.cevap4 === value.cevap4 &&
      //             v.cevap5 === value.cevap5 &&
      //             v.cevapn === value.cevapn
      //           )
      //         );
      
      //       return {
      //         ...form,
      //         sorular: parsedSorular,
      //         kategoriler: parsedKategoriler,
      //         olcekler : this.scaleS
      //       };
      //     });
      
      //     console.log('parsedForms:', this.parsedForms);
      //     console.log('Tüm Kategoriler:', this.categoryS);
      //     console.log('Tüm Sorular:', this.questionS);
      //     console.log('Benzersiz Ölçekler:', this.scaleS);
      
      //     this.ref.detectChanges();
      //   });
      // }

      // getQuestionsByCategory(kategoriad: string) {
      //   return this.questionS.filter(q => q.kategoriad === kategoriad);
      // }
    
      // getScaleByQuestion(question: any) {
      //   return this.scaleS.find(scale => scale.olcekid === question.olcekid);
      // }
      categorys = [
        { id: 1, Ad: 'İletişim' },
        { id: 2, Ad: 'Takım Çalışması' }
      ];
    
      questions: any[] = [
        { id: 1, aciklama: 'Kendini açık ve net ifade eder.', kategori: 'İletişim', scaleId: 1 },
        { id: 2, aciklama: 'Dinleme becerisi yüksektir.', kategori: 'İletişim', scaleId: 1 },
        { id: 3, aciklama: 'Takım içinde yapıcı rol alır.', kategori: 'Takım Çalışması', scaleId: 2 }
      ];
    
      scales: any[] = [
        { id: 1, cevap1: 'Hiç Katılmıyorum', cevap2: 'Katılmıyorum', cevap3: 'Kararsızım', cevap4: 'Katılıyorum', cevap5: 'Tamamen Katılıyorum' },
        { id: 2, cevap1: 'Zayıf', cevap2: 'Orta', cevap3: 'İyi', cevap4: 'Çok İyi' }
      ];
    
      getQuestionsByCategory(catAd: string): any[] {
        return this.questions.filter(q => q.kategori === catAd);
      }
    
      getScaleByQuestion(question: any): any | undefined {
        return this.scales.find(s => s.id === question.scaleId);
      }
    
      getDropdownOptionsForQuestion(question: any) {
        const scale = this.getScaleByQuestion(question);
        if (!scale) return [];
    
        const options = [];
        if (scale.cevap1) options.push({ label: `a) ${scale.cevap1}`, value: 'cevap1' });
        if (scale.cevap2) options.push({ label: `b) ${scale.cevap2}`, value: 'cevap2' });
        if (scale.cevap3) options.push({ label: `c) ${scale.cevap3}`, value: 'cevap3' });
        if (scale.cevap4) options.push({ label: `d) ${scale.cevap4}`, value: 'cevap4' });
        if (scale.cevap5) options.push({ label: `e) ${scale.cevap5}`, value: 'cevap5' });
    
        return options;
      }
    
      saveForm() {
        console.log("Yanıtlar:", this.questions.map(q => ({
          soru: q.aciklama,
          cevap: q.selectedAnswer
        })));
      }
}

