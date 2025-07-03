import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { ProfileService } from '../../profile/profile.service';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-survey-in-house',
  standalone: true,
  imports: [CommonModule,TranslateModule,MatTabsModule,DialogModule,TableModule,RadioButtonModule,SliderModule,FormsModule,TooltipModule],
  templateUrl: './survey-in-house.component.html',
  styleUrl: './survey-in-house.component.scss'
})

export class SurveyInHouseComponent implements OnInit, OnDestroy  {

 private ngUnsubscribe = new Subject();
 
  surveyForm: FormGroup;
  allSurveys : boolean;
  goSurvey:boolean;
  selectedItem: any;
  filteredItems: any[] = [];
  selectedFormId: number | null = null;
  mySurveyList:any[] = [];

  _formTitle: string = "";
  formList: any[] = [];
  formDetail: any[] = [];
  parsedForms: any[] = [];

  categoryS: any[] = [];
  questionS: any[] = [];
  scaleS: any[] = [];
  sicilGroup: any[] = [];
  formsicilid:number;

  answer1:string;
  answer2:string;
  answer3:string;
  answer4:string;
  answer5:string; 

  answern:any;


  constructor(
    private profileService : ProfileService,
    private toastrService: ToastrService,
    private ref : ChangeDetectorRef
    ) { }

    ngOnInit(){
      this.getMySurvey();
    }

    getUniqueBolumValues(items: any[]) {
      const bolumler: string[] = [];
  

      for (const item of items) {
        if (!bolumler.includes(item.bolum)) {
          bolumler.push(item.bolum);
        }
      }
  
      return bolumler;
    }

    showAllSurveys() {
      this.allSurveys = true;
    }

    getMySurvey(){
      this.profileService.getMySurvey().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response:any) => {
        this.mySurveyList = response[0].x;
        const message = response[0].z;
        if (message.islemsonuc == -1) {
          return;  
        }
        console.log("getMySurvey : ", this.mySurveyList);
      });
    }

    getItem(item: any) {
      if (!item || !item.formid || item.formid === 0) {
        console.log("getItem:", item);
        console.warn("Geçersiz veya eksik item:", item);
        return;
      }
      this.formsicilid = item?.formsicilid;
      this.selectedFormId = item?.formid;
      this._formTitle = item?.baslik;
      this.goSurvey = true;
      console.log("getItem:", item);
      this.forms_Detail(this.selectedFormId ?? 0);
    }

      forms_Detail(id: number){
        console.log("KAAAÇ",id);
        this.profileService.perfprmans_form_s(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          this.formDetail = response[0]?.x ?? [];
          console.log("formDetail:", this.formDetail);
      
          this.parsedForms = this.formDetail.map(form => {
            const parsedSorular = JSON.parse(form.sorular || '[]');
            const parsedKategoriler = JSON.parse(form.kategoriler || '[]');
      
            this.categoryS = [...parsedKategoriler];
            this.questionS = [...parsedSorular];
      
            // Benzersiz ölçekleri çıkar
            this.scaleS = this.questionS
              .map(q => ({
                olcekid: q.olcekid,
                olcekad: q.olcekad,
                cevap1: q.cevap1?.trim() || '',
                cevap2: q.cevap2?.trim() || '',
                cevap3: q.cevap3?.trim() || '',
                cevap4: q.cevap4?.trim() || '',
                cevap5: q.cevap5?.trim() || '',
                cevapn:  q.cevapn
              }))
              .filter((value, index, self) =>
                index === self.findIndex(v =>
                  v.olcekid === value.olcekid &&
                  v.cevap1 === value.cevap1 &&
                  v.cevap2 === value.cevap2 &&
                  v.cevap3 === value.cevap3 &&
                  v.cevap4 === value.cevap4 &&
                  v.cevap5 === value.cevap5 &&
                  v.cevapn === value.cevapn
                )
              );
      
            return {
              ...form,
              sorular: parsedSorular,
              kategoriler: parsedKategoriler,
              olcekler : this.scaleS
            };
          });
      
          console.log('parsedForms:', this.parsedForms);
          console.log('Tüm Kategoriler:', this.categoryS);
          console.log('Tüm Sorular:', this.questionS);
          console.log('Benzersiz Ölçekler:', this.scaleS);
      
          this.ref.detectChanges();
        });
      }


      getQuestionsByCategory(kategoriad: string) {
        return this.questionS.filter(q => q.kategoriad === kategoriad);
      }
    
      getScaleByQuestion(question: any) {
        return this.scaleS.find(scale => scale.olcekid === question.olcekid);
      }

      onAnswerChange(question: any, newValue: number) {
        question.userAnswer = newValue;
  
        const scale = this.getScaleByQuestion(question);
        const answer = this.getAnswerText(question);
     
        const payload = {
          soruId: question.id,
          formId: this.selectedFormId,
          cevap: answer,
          sicilID:this.formsicilid
        };
      

        this.profileService.sendAnswer(payload.sicilID!,payload.formId!,payload.soruId!,payload.cevap).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          const ANSWER = response[0];
          console.log("ANSWER:", ANSWER);
     
      
          this.ref.detectChanges();
        });
        console.log("Cevap gönderiliyor:", payload);
      
        // this.profileService.sendSingleAnswer(payload).subscribe({
        //   next: (res) => {
        //     console.log("Cevap başarıyla gönderildi:", res);
        //   },
        //   error: (err) => {
        //     console.error("Gönderim hatası:", err);
        //   }
        // });
      }

      getAnswerText(question: any): string {
        const scale = this.getScaleByQuestion(question);
        const answerKey = 'cevap' + question.userAnswer; // "cevap1", "cevap2", ...
        return scale?.[answerKey] || '';
      }
      
    
      getTooltipText(item: any): string {
        if (item.durum == 1) {
            return "Tamamlandı";
        } else if(item.durum == 99) {
            return 'Devam ediyor';
        }else{
          return 'Başlanmadı'
        }
    }
      // getDropdownOptionsForQuestion(question: any) {
      //   const scale = this.getScaleByQuestion(question);
      //   if (!scale) return [];
    
      //   const options = [];
      //   if (scale.cevap1) options.push({ label: `a) ${scale.cevap1}`, value: 'cevap1' });
      //   if (scale.cevap2) options.push({ label: `b) ${scale.cevap2}`, value: 'cevap2' });
      //   if (scale.cevap3) options.push({ label: `c) ${scale.cevap3}`, value: 'cevap3' });
      //   if (scale.cevap4) options.push({ label: `d) ${scale.cevap4}`, value: 'cevap4' });
      //   if (scale.cevap5) options.push({ label: `e) ${scale.cevap5}`, value: 'cevap5' });
    
      //   return options;
      // }

    ngOnDestroy(): void {
      this.ngUnsubscribe.next(true);
      this.ngUnsubscribe.complete();
    }
}
