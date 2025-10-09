import { ChangeDetectorRef, Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PerformanceService } from '../performance.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CommonModule, formatDate } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-process-management',
  standalone: true,
  imports: [
        FormsModule,
        RadioButtonModule,
        ButtonModule,
        CardModule,
        SelectModule,
        DropdownModule,
        DatePickerModule,
        DialogModule,
        TableModule,
        CheckboxModule,
        CommonModule
  ],
  templateUrl: './process-management.component.html',
  styleUrl: './process-management.component.scss'
})
export class ProcessManagementComponent {

  private ngUnsubscribe = new Subject();
  _draftWithQuest_s: any[] = [];
  _draft_s: any[]= [];

  parsedForms: any[] = [];

  categoryS: any[] = [];
  questionS: any[] = [];
  scaleS: any[] = [];
  sicilGroup: any[] = [];


  
  startDate: Date | null = null;
  endDate: Date | null = null;
  startDateStr: string = '';
  endDateStr: string = '';


  _draftTitle:string="";
  _selectedDraftId : number = 0;
  _draftMatchModal: boolean = false;
  _selectedSicilGroupId: number | null = null;

  asChecked:boolean = false;
  usChecked:boolean = false;
  myselfChecked:boolean = false;
  isValid: boolean = true;

  as:number;
  us:number;
  myself:number;

    constructor(
      private perform: PerformanceService,
      private ref: ChangeDetectorRef,
      private helper: HelperService,
      private toastrService: ToastrService
    ) { }

    ngOnInit(): void {

    }

    
  ngAfterViewInit() {
    this.draft_s(0);
    this.getSicilGroups();
  }

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
  
      console.log('parsedForms:', this.parsedForms);
      console.log('Tüm Kategoriler:', this.categoryS);
      console.log('Tüm Sorular:', this.questionS);
      console.log('Benzersiz Ölçekler:', this.scaleS);
  
      this.ref.detectChanges();
      });
  }

  draft_s(id: number) {
    this.perform.draft_s(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this._draft_s = response[0]?.x ?? [];
      console.log("_draft_s:", this._draft_s);

      this.ref.detectChanges();
    });
  }

  draftMatch(item: any) {
    this._selectedDraftId = item?.id;
    this._draftTitle = item?.baslik;
    this._draftMatchModal = true;
    console.log("getItem:", item);
    this.draftWithQuest_s(this._selectedDraftId ?? 0);
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

    onCheckboxChange() {

      this.as = this.asChecked ? 1 : 0;
      this.us = this.usChecked ? 1 : 0;
      this.myself = this.myselfChecked ? 1 : 0;
       
      this.isValid = this.asChecked || this.usChecked || this.myselfChecked;
      console.log('asChecked:', this.as, 'usChecked:', this.us, 'myselfChecked:', this.myself);
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

    getSicilGroups() {
      this.perform.getSicilGroups().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
        const result = response?.[0]?.x;
        this.sicilGroup = Array.isArray(result) ? result : [];
        console.log("getSicilGroups:", result );
        this.ref.detectChanges();
      });
    }
  // formMatch(item: any) {
  //   this.selectedFormId = item?.id;
  //   this._formTitle = item?.baslik;
  //   this._formMatchModal = true;
  //   console.log("getItem:", item);
  //   this.draftWithQuest_s(this.selectedFormId ?? 0);
  // }
}
