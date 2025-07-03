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
  formTitle: string = "";
  explanation: string = "";
  categoryList: any[] = [];
  questionList: any[] = [];
  formList: any[] = [];
  parsedForms: any[] = [];

  selectedQuestionId: number | null;

  selectedCategoryId: number | null;
  selectedFormId: number | null;

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
    this.form_s(0);

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

    this.selectedCategoryId = categoryId;
    console.log("categoryId", this.selectedCategoryId);
    const found = this.categoryList.find(s => s.Id === categoryId);
    console.log("onCategoryChange", found);
    this.selectedQuestionId = 0;
    this.getQuestion(0, categoryId);
  }

  onQuestionChange(questionId: number) {
    this.selectedQuestionId = questionId;
    console.log("onQuestionChange", this.selectedQuestionId);
  }

  onFormChange(formId: number) {

    this.selectedFormId = formId;
    console.log("onFormChange", this.selectedFormId);
  }

  form_i() {
    this.perform.form_i(this.formTitle, this.explanation).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("form_i:", result);
      if (result == 1) {
        this.toastrService.success(
          "Form Oluşturma İşlemi Başarılı");
        this.form_s(0);
      } else {
        this.toastrService.error(
          "Form Oluşturma İşlemi Başarısız");
      }
      this.ref.detectChanges();
    });
  }

  form_s(id: number) {
    this.perform.form_s(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.formList = response[0]?.x ?? [];
      console.log("form_s:", this.formList);

      this.parsedForms = this.formList.map(form => ({
        ...form,
        sorular: JSON.parse(form.sorular || '[]'),
        kategoriler: JSON.parse(form.kategoriler || '[]'),
      }));

      console.log('parsedForms:', this.parsedForms);

      this.ref.detectChanges();
    });
  }



  form_question() {
    if (this.selectedQuestionId != 0) {
      this.perform.form_question(this.selectedFormId ?? 0, this.selectedQuestionId ?? 0, this.selectedCategoryId ?? 0).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
        const result = response[0].x[0].islemsonuc;
        console.log("form_question:", result);
        if (result == 1) {
          this.toastrService.success(
            "Form'a Soru Ekleme İşlemi Başarılı");
          this.form_s(0);
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}


