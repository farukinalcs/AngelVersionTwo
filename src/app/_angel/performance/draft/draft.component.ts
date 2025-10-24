import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})


export class DraftComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  draftTitle: string = "";
  explanation: string = "";
  categoryList: any[] = [];
  questionList: any[] = [];

  _draft_s: any[]= [];
  parsedForms: any[] = [];

  _selectedQuestionId: number | null;

  _selectedCategoryId: number | null;



  _editDraft:boolean = false;
  _openNewDraft : boolean = false;
  categoryS: any[] = [];
  questionS: any[] = [];
  scaleS: any[] = [];
 
  _draftWithQuest_s: any[] = [];
  
  startDate: Date | null = null;
  endDate: Date | null = null;
  startDateStr: string = '';
  endDateStr: string = '';



  _draftTitle:string="";
  _selectedDraftId : number = 0;
  _draftMatchModal: boolean = false;
  _selectedSicilGroupId: number | null = null;
  _stepperValue: number = 1;

  constructor(
    private perform: PerformanceService,
    private ref: ChangeDetectorRef,
    private helper: HelperService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getCategory(0);
    this.draft_s(0);

  }

  editDraft(item:any){

    this._editDraft = true;
    this._stepperValue = 1;
    this._selectedDraftId = item?.id;
    this.draftWithQuest_s(this._selectedDraftId);
    console.log("_selectedDraftId:", this._selectedDraftId);

  }

  is_ready(){
    console.log("_selectedDraftId:", this._selectedDraftId);
    this.perform.is_ready(this._selectedDraftId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
     
      const result = response[0]?.x[0]?.islemsonuc;
      if (result == 1) {
        this.toastrService.success(
          "Şablon Yayınlanma İşlemi Başarılı");
        this.draft_s(0);
      } else {
        this.toastrService.error(
          "FŞablon Yayınlanma İşlemi Başarısız");
      }

      this.ref.detectChanges();

    });
  }
 
  getQuestion(id: number, categoryId: number) {
    this.perform.getQuestion(id, categoryId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.questionList = response[0]?.x ?? [];
      console.log("questionList:", this.questionList);
      this.ref.detectChanges();
    });
  }

  getCategory(id: number) {
    this.perform.getCategory(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.categoryList = response[0].x;
      // this.filteredItems = [...this.categoryList]
      console.log("getCategory:", this.categoryList);
      this.ref.detectChanges();
    });
  }

  onCategoryChange(categoryId: number) {

    this._selectedCategoryId = categoryId;
    console.log("categoryId", this._selectedCategoryId);
    const found = this.categoryList.find(s => s.Id === categoryId);
    console.log("onCategoryChange", found);
    this._selectedQuestionId = 0;
    this.getQuestion(0, categoryId);
  }

  onQuestionChange(questionId: number) {
    this._selectedQuestionId = questionId;
    console.log("onQuestionChange", this._selectedQuestionId);
  }

  onFormChange(formId: number) {

    this._selectedDraftId = formId;
    console.log("onFormChange", this._selectedDraftId);
    this.draftWithQuest_s(this._selectedDraftId);
  }

  draft_i() {
    this.perform.draft_i(this.draftTitle, this.explanation).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0]?.x[0]?.islemsonuc;
 
      console.log("draft_i:", result);
      if (result == 1) {
        this.toastrService.success(
          "Form Oluşturma İşlemi Başarılı");
       
        this.draft_s(0);
      } else {
        this.toastrService.error(
          "Form Oluşturma İşlemi Başarısız");

      }
      this.ref.detectChanges();
    });
  }


  draft_s(id: number) {
    this.perform.draft_s(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._draft_s = (response[0]?.x ?? []).filter((item: any) => item.aktif !== 1);
      console.log("draft_s :", this._draft_s);
      this._selectedDraftId = this._draft_s[0]?.id;
      this.draftWithQuest_s(this._selectedDraftId);
      this.ref.detectChanges();
      this._openNewDraft = false;
      this._draftTitle = "";
      this.explanation = "";
    });
  }


  
  draft_d(item: any) {
    this._selectedDraftId = item?.id;
    this.perform.draft_d(this._selectedDraftId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0]?.x[0]?.islemsonuc;
 
      console.log("draft_d:", result);
      if (result == 1) {
        this.toastrService.success(
          "Şablon Silme İşlemi Başarılı");
       
        this.draft_s(0);
      } else {
        this.toastrService.error(
          "Şablon Silme İşlemi Başarısız");

      }
      this.ref.detectChanges();
    });
  }

  draft_question_i() {
    if (this._selectedQuestionId != 0) {
      this.perform.draft_question_i(this._selectedDraftId ?? 0, this._selectedQuestionId ?? 0, this._selectedCategoryId ?? 0).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
        const result = response[0].x[0]?.islemsonuc;
        console.log("result:", result);
        console.log("_selectedDraftId:", this._selectedDraftId);
        console.log("selectedQuestionId:", this._selectedQuestionId);
        console.log("selectedCategoryId:", this._selectedCategoryId);
        if (result == 1) {
          this.toastrService.success(
            "Form'a Soru Ekleme İşlemi Başarılı");
            this.draftWithQuest_s(this._selectedDraftId);
        } else {
          this.toastrService.error(
            "Form'a Soru Ekleme İşlemi Başarısız");
        }
        this.ref.detectChanges();
      });

    } else {
      this.toastrService.error(
        "Lütfen Eklemek İstediğiniz Soruyu Seçin");
    }
  }

  draft_question_d(question:any){
    console.log("question",question);
      this.perform.draft_question_d(question.sablonid ?? 0,question.id ?? 0, question.kategoriid ?? 0).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
        const result = response[0].x[0]?.islemsonuc;
        console.log("draft_question_d:", result);

        if (result == 1) {
          this.toastrService.success(
            `${question.aciklama} Silme İşlemi Başarılı`);
            this.draftWithQuest_s(this._selectedDraftId);
        } else {
          this.toastrService.error(
            "Soru Silme İşlemi Başarısız");
        }
        this.ref.detectChanges();
      });
   
  }



  onSicilGroupChange(event:any){
    console.log('Seçilen Sicil Grubu ID:', this._selectedSicilGroupId);
    // veya direkt:
    console.log('Event Value:', event.value);
  }

  getScaleByQuestion(question: any) {
    return this.scaleS.find(scale => scale.olcekid === question.olcekid);
  }
  getQuestionsByCategory(kategoriad: string) {
    return this.questionS.filter(q => q.kategoriad === kategoriad);
  }

  // getSicilGroups() {
  //   this.perform.getSicilGroups().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
  //     const result = response?.[0]?.x;
  //     this.sicilGroup = Array.isArray(result) ? result : [];
  //     console.log("getSicilGroups:", result );
  //     this.ref.detectChanges();
  //   });
  // }

  draftWithQuest_s(id: number) {
    this.perform.draftWithQuest_s(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._draftWithQuest_s = response[0]?.x ?? [];
      console.log("_draftWithQuest_s:", this._draftWithQuest_s);
      this.parsedForms = this._draftWithQuest_s.map(form => {
      const parsedSorular = JSON.parse(form.sorular || '[]');
      const parsedKategoriler = JSON.parse(form.kategoriler || '[]');

      this.categoryS = [...parsedKategoriler];
      this.questionS = [...parsedSorular];

  
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

    this.ref.detectChanges();

    });
}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}


