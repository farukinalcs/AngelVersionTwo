import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

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

  stepperFields: any[] = [
    { class: 'stepper-item current', number: 1, title: "Cihaz Ad ve Modeli" },
    { class: 'stepper-item', number: 2, title: "Cihaz Port/Ip/ModuleId" },
    { class: 'stepper-item', number: 3, title: "Cihaz Yön/Tanım" },
    { class: 'stepper-item', number: 4, title: "Pc/Kart/Kapı" },
    { class: 'stepper-item', number: 5, title: "Ping/ByPass/Pasif?" },
    { class: 'stepper-item', number: 6, title: "Lokasyon" },
    { id: '0', class: 'stepper-item', number: 7, title: "Özet" },
  ];

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

  editCategory2(item: any) {
    console.log('editCategory:', item);
    this.selectedCategoryId = item.Id;
    this.perform.edit_Category(this.selectedFormId ?? 0, item.Id ?? 0, this.catPuan).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
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

    const val1 = this.asChecked ? 1 : 0;
    const val2 = this.usChecked ? 1 : 0;
    const val3 = this.myselfChecked ? 1 : 0;
     
    this.isValid = this.asChecked || this.usChecked || this.myselfChecked;
    console.log('asChecked:', val1, 'usChecked:', val2, 'myselfChecked:', val3);


  }

  getSicilGroups(){
    this.perform.getSicilGroups().subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      this.sicilGroup = response[0].x;
      console.log("getSicilGroups:", this.sicilGroup );
      this.ref.detectChanges();
    });
  }



}
