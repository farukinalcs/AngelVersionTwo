import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-performance-dashboard',
  templateUrl: './performance-dashboard.component.html',
  styleUrl: './performance-dashboard.component.scss'
})
export class PerformanceDashboardComponent {

  @Input() isFromAttendance: boolean;

  _formMatchModal:boolean = false;

  _formDetailModal: boolean = false;

  _formTitle: string = "";
  formList: any[] = [];
  formDetail: any[] = [];
  parsedForms: any[] = [];

  categoryS: any[] = [];
  questionS: any[] = [];

  sicilGroup:any[] = [];

  quesPuan: any;
  catPuan: any

  selectedQuestionId: any | null = 0;
  selectedCategoryId: number | null = null;
  selectedFormId: number | null = null;
  selectedSicilGroupId: number | null = null;

  asChecked:boolean = false;
  usChecked:boolean = false;
  myselfChecked:boolean = false;
  isValid: boolean = true;

  as:number;
  us:number;
  myself:number;

  startDate: Date | null = null;
  endDate: Date | null = null;
  startDateStr: string = '';
  endDateStr: string = '';


  constructor(
    private perform: PerformanceService,
    private ref: ChangeDetectorRef,
    private helper: HelperService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.form_s(0);
    this.getSicilGroups();
  }

  getItem(item: any) {
    this.selectedFormId = item?.id;
    this._formTitle = item?.baslik;
    this._formDetailModal = true;
    console.log("getItem:", item);
    this.forms_Detail(this.selectedFormId ?? 0);
  }

  formMatch(item: any) {
    this.selectedFormId = item?.id;
    this._formTitle = item?.baslik;
    this._formMatchModal = true;
    console.log("getItem:", item);
    this.forms_Detail(this.selectedFormId ?? 0);
  }

  form_s(id: number) {
    this.perform.form_s(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.formList = response[0]?.x ?? [];
      console.log("form_s:", this.formList);
      this.ref.detectChanges();
    });
  }

  forms_Detail(id: number) {
    this.perform.form_s(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.formDetail = response[0]?.x ?? [];
      console.log("formDetail:", this.formDetail);

      this.parsedForms = this.formDetail.map(form => {
        const parsedSorular = JSON.parse(form.sorular || '[]');
        const parsedKategoriler = JSON.parse(form.kategoriler || '[]');

        this.categoryS = [...parsedKategoriler];
        this.questionS = [...parsedSorular];
        return {
          ...form,
          sorular: parsedSorular,
          kategoriler: parsedKategoriler
        };
      });

      console.log('parsedForms:', this.parsedForms);
      console.log('Tüm Kategoriler:', this.categoryS);
      console.log('Tüm Sorular:', this.questionS);

      this.ref.detectChanges();
    });
  }

  formData = {
    evaluationType: '',
    evaluationPeriod: ''
  };

  submitForm() {
    console.log('Form Verileri:', this.formData);
  
  }



  editCategory(cat: any) {
    // this.selectedCategoryId = cat.Id;
    this.perform.edit_Category(this.selectedFormId ?? 0, cat.Id ?? 0, cat.kategoripuan).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("editCategory:", result);
      if (result == 1) {
        this.toastrService.success(
          "Kategori Güncelleme İşlemi Başarılı");
        this._formDetailModal = false;
      } else {
        this.toastrService.error(
          "Kategori Güncelleme İşlemi Başarısız");
      }
      this.ref.detectChanges();
    });
    // cat burada zaten güncellenmiş haliyle geliyor
  }

  editQuestion(item: any) {
    console.log('editQuestion:', item);
  }
  // Kategoriye ait soruları filtreleyen fonksiyon
  getQuestionsByCategory(kategoriad: string) {
    return this.questionS.filter(q => q.kategoriad === kategoriad);
  }

  onCheckboxChange() {

    this.as = this.asChecked ? 1 : 0;
    this.us = this.usChecked ? 1 : 0;
    this.myself = this.myselfChecked ? 1 : 0;
     
    this.isValid = this.asChecked || this.usChecked || this.myselfChecked;
    console.log('asChecked:', this.as, 'usChecked:', this.us, 'myselfChecked:', this.myself);
  }

  onSicilGroupChange(event:any){
    console.log('Seçilen Sicil Grubu ID:', this.selectedSicilGroupId);
    // veya direkt:
    console.log('Event Value:', event.value);
  }

  getSicilGroups(){
    this.perform.getSicilGroups().subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      this.sicilGroup = response[0].x;
      console.log("getSicilGroups:", this.sicilGroup );
      this.ref.detectChanges();
    });
  }

  getDate(type: 'start' | 'end', value: Date) {
    const formatted = formatDate(value, 'yyyy-MM-dd', 'en-US');

    if (type === 'start') {
      this.startDate = value;
      this.startDateStr = formatted;
    } else {
      this.endDate = value;
      this.endDateStr = formatted;
    }
  
    console.log(`${type.toUpperCase()} Date (start):`, this.startDateStr);
    console.log(`${type.toUpperCase()} Date (end):`, this.endDateStr);
  }

  formMatchSicil(){
    console.log("1",this.selectedFormId)
    console.log("2",this.selectedSicilGroupId)
    console.log("3",this.as)
    console.log("4",this.us)
    console.log("5",this.myself)
    console.log("6",this.startDateStr)
    console.log("7",this.endDateStr)
    if(this.isValid){
      this.perform.formMatchSicil(this.selectedFormId ?? 0,this.selectedSicilGroupId ?? 0,this.as,this.us,this.myself,this.startDateStr,this.endDateStr).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
        const result = response;
        console.log("formMatchSicil:", result );
        this.ref.detectChanges();
      });
    }else {
      this.toastrService.error(
        "Lütfen Formun Kimin Tarafından Cevaplanacağını Seçiniz");
    }

    
  }

}
