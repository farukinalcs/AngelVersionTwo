import { ChangeDetectorRef, Component } from '@angular/core';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { PerformanceService } from '../performance.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-competence-questions',
  templateUrl: './competence-questions.component.html',
  styleUrls: ['./competence-questions.component.scss']
})
export class CompetenceQuestionsComponent {

  questionName: string = '';
  // selectedCount: number = 0;
  // answers: any[] = [null, null, null, null, null];
  // sliderValue: number = 1;
  // direction: number = 0;

  scaleList: any[] = [];
  categoryList: any[] = [];
  questionList:any[] = [];




  selectedQuestionId: any | null = 0;
  selectedScaleId: number | null = null;
  selectedCategoryId: number | null = null;

  allowedCounts = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`, value: i + 1
  }));


  constructor(
    private perform: PerformanceService,
    private ref: ChangeDetectorRef,
    private helper: HelperService,
    private toastrService : ToastrService
  ) { }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getScale(0);
    this.getCategory(0);
    this.getQuestion(0,0);
  }

  onQuestionChange(questionId:number){

    console.log("questionId",questionId);
    const found = this.questionList.find(s => s.id === questionId);
    console.log("onQuestionChange",found);
    this.selectedQuestionId = questionId;
    this.selectedCategoryId = found.kategori;
    this.selectedScaleId = found.olcek;
    this.questionName = found.aciklama;
  }

  onScaleChange(scaleId: number) {

    this.selectedScaleId = scaleId;
    console.log("scaleId",this.selectedScaleId);
    const found = this.scaleList.find(s => s.id === scaleId);
    console.log("onScaleChange",found);

  }

  onCategoryChange(categoryId: number) {

    this.selectedCategoryId = categoryId;
    console.log("categoryId",this.selectedCategoryId);
    const found = this.categoryList.find(s => s.Id === categoryId);
    console.log("onCategoryChange",found);

  }
  
  setQuestion(): void {

    this.perform.setQuestion(this.questionName,this.selectedCategoryId ?? 0,this.selectedScaleId ?? 0).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("setScale:", result);
      if(result == 1){
        this.toastrService.success(
          "Soru Ekleme İşlemi Başarılı");
          this.getQuestion(0,0);
      }else{
        this.toastrService.error(
          "Soru Ekleme İşlemi Başarısız");
      }
      this.ref.detectChanges();
    });
  
  }


  updateQuestion(): void {
    this.perform.updateQuestion(this.selectedQuestionId,this.questionName,this.selectedCategoryId ?? 0,this.selectedScaleId ?? 0).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("updateQuestion:", result);
      if(result == 1){
        this.toastrService.success(
          "Soru Ekleme İşlemi Başarılı");
          this.getQuestion(0,0);
      }else{
        this.toastrService.error(
          "Soru Ekleme İşlemi Başarısız");
      }
      this.ref.detectChanges();
    });
    this.selectedQuestionId = 0;
  }

  deleteQuestion(){
    this.perform.deleteQuestion(this.selectedQuestionId).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("deleteQuestion:", result);
      if(result == 1){
        this.toastrService.success(
          "Soru Silme İşlemi Başarılı");
          this.getQuestion(0,0);
      }else{
        this.toastrService.error(
          "Soru Silme İşlemi Başarısız");
      }
      this.ref.detectChanges();
    });
    this.getQuestion(0,0);
  }

  getQuestion(id: number,categoryId:number) {
    this.perform.getQuestion(id,categoryId).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.questionList = response[0]?.x ?? [];
      console.log("questionList:", this.questionList);
      this.ref.detectChanges();
    });
    this.selectedScaleId = 0;
    this.selectedCategoryId = 0;
    this.selectedQuestionId = 0;
    this.questionName = "";
  }

  getCategory(id:number){
    this.perform.getCategory(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.categoryList = response[0].x;
      // this.filteredItems = [...this.categoryList]
      console.log("getCategory:", this.categoryList);
      this.ref.detectChanges();
    });
  }

  getScale(id: number) {
    this.perform.getScale(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.scaleList = response[0]?.x ?? [];
      console.log("getScale:", this.scaleList);
      this.ref.detectChanges();
    });
  }
}
