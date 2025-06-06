import { ChangeDetectorRef, Component } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})


export class DraftComponent {
  formTitle:string = "";
  explanation:string = "";
  categoryList: any[] = [];
  questionList:any[] = [];
  formList:any[] = [];
  parsedForms: any[] = [];

  selectedQuestionId: number | null = 0;

  selectedCategoryId: number | null = 0;
  selectedFormId: number | null = 0;

  constructor(
    private perform: PerformanceService,
    private ref: ChangeDetectorRef,
    private helper: HelperService,
    private toastrService : ToastrService
  ){}
  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getCategory(0);
    this.form_s(0);

  }

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: "Cihaz Ad ve Modeli" },
    { class: 'stepper-item', number: 2, title: "Cihaz Port/Ip/ModuleId"},
    { class: 'stepper-item', number: 3,title: "Cihaz Yön/Tanım"},
    { class: 'stepper-item', number: 4, title: "Pc/Kart/Kapı" },
    { class: 'stepper-item', number: 5, title: "Ping/ByPass/Pasif?" },
    { class: 'stepper-item', number: 6, title: "Lokasyon" },
    { id : '0', class: 'stepper-item', number: 7,title: "Özet"},
  ];


  formData = {
    evaluationType: '',
    evaluationPeriod: ''
  };
  
  submitForm() {
    console.log('Form Verileri:', this.formData);
    // Burada ileride yetkinlik ve hedef ayar ekranlarına yönlendirebiliriz
  }

    getQuestion(id: number,categoryId:number) {
      this.perform.getQuestion(id,categoryId).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.questionList = response[0]?.x ?? [];
        console.log("questionList:", this.questionList);
        this.ref.detectChanges();
      });
      this.selectedCategoryId = 0;
      this.selectedQuestionId = 0;
    }
  
    getCategory(id:number){
      this.perform.getCategory(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.categoryList = response[0].x;
        // this.filteredItems = [...this.categoryList]
        console.log("getCategory:", this.categoryList);
        this.ref.detectChanges();
      });
    }

    onCategoryChange(categoryId: number) {

      this.selectedCategoryId = categoryId;
      console.log("categoryId",this.selectedCategoryId);
      const found = this.categoryList.find(s => s.Id === categoryId);
      console.log("onCategoryChange",found);
      this.selectedQuestionId = 0;
      this.getQuestion(0,categoryId);
    }

    onQuestionChange(questionId: number) {
      this.selectedQuestionId = questionId;
      console.log("onQuestionChange",this.selectedQuestionId);
    }

    onFormChange(formId:number){
      
      this.selectedFormId = formId;
      console.log("onFormChange",this.selectedFormId);
    }

    form_i(){
      this.perform.form_i(this.formTitle,this.explanation).subscribe((response:ResponseModel<any,ResponseDetailZ>[]) =>{
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

    form_s(id:number){
      this.perform.form_s(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.formList = response[0]?.x ?? [];
        console.log("form_s:",  this.formList);

        this.parsedForms = this.formList.map(form => ({
          ...form,
          sorular: JSON.parse(form.sorular || '[]'),
          kategoriler: JSON.parse(form.kategoriler || '[]'),
        }));
        
        console.log('parsedForms:', this.parsedForms);
        
        this.ref.detectChanges();
      });
    }

    
  // form_question(formId:number,questionId:number,catId:number,){
  //   var sp: any[] = [{
  //     mkodu: 'yek318',
  //     formid:formId.toString(),
  //     soruid:questionId.toString(),
  //     kategoriid:catId.toString()
  //   }]
  //   return this.requestMethod(sp);
  // }


  
  form_question()
  {
    if( this.selectedQuestionId != 0){
      this.perform.form_question(this.selectedFormId ?? 0,this.selectedQuestionId ?? 0,this.selectedCategoryId ?? 0).subscribe((response:ResponseModel<any,ResponseDetailZ>[]) =>{
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

    }else {
      this.toastrService.error(
        "Lütfen Eklemek İstediğiniz Soruyu Seçin");
    }
   
  }
}


