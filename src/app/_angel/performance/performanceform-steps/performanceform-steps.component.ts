import { ChangeDetectorRef, Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ])
]);



@Component({
  selector: 'app-performanceform-steps',
  templateUrl: './performanceform-steps.component.html',
  styleUrls: ['./performanceform-steps.component.scss']
})



export class PerformanceformStepsComponent {
  activeIndex: number = 0;

  formData = {
    evaluationType: '',
    evaluationPeriod: ''
  };

  steps = [
    { label: 'Form' },        
    { label: 'Yetkinlikler' },
    { label: 'Hedefler' },    
    { label: 'Önizleme' },    
    { label: 'Tamamlandı' } 
  ];
  
  competency:string;
  goal:string;
  competencyQuestions: string[] = [];
  goalQuestions: string[] = [];

  yetkinlikler:string[] = [];
  hedefler:string[] = [];
  yetkinlik:string;
  hedef:string;
  
  constructor(public ref:ChangeDetectorRef){}

  updateSteps() {
    this.steps = [{ label: 'Form' }];
    
    if (this.formData.evaluationType === 'yetkinlik') {
      this.steps.push({ label: 'Yetkinlikler' });
    } else if (this.formData.evaluationType === 'hedef') {
      this.steps.push({ label: 'Hedefler' });
    } else if (this.formData.evaluationType === 'hedef_yetkinlik') {
      this.steps.push({ label: 'Yetkinlikler' }, { label: 'Hedefler' });
    }
    
    this.steps.push({ label: 'Önizleme' });
    this.steps.push({ label: 'Tamamlandı' });
    
    // Seçim değişince en başa dönelim
    this.activeIndex = 0;
  
    console.log('Steps:', this.steps); // Steps dizisinin güncellenip güncellenmediğini kontrol et
  }
  

  
  evaluationTypes = [
    { label: 'Yetkinlik', value: 'yetkinlik' },
    { label: 'Hedef', value: 'hedef' },
    { label: 'Hedef + Yetkinlik', value: 'hedef_yetkinlik' }
  ];
  
  evaluationPeriods = [
    { label: '3 Aylık', value: '3' },
    { label: '6 Aylık', value: '6' },
    { label: '12 Aylık', value: '12' }
  ];

  
  goNext() {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }
  
  goBack() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }
  
  addCompetencyQuestion() {
    this.competencyQuestions.push(this.competency);
    this.competency = "";
  }
  
  removeCompetencyQuestion(index: number) {
    this.competencyQuestions.splice(index, 1);
  }
  
  addGoalQuestion() {
    this.goalQuestions.push(this.goal);
    this.goal = "";
  }
  
  removeGoalQuestion(index: number) {
    this.goalQuestions.splice(index, 1);
  }

  yetkinlikEkle(){
    this.yetkinlikler.push(this.yetkinlik);
    this.ref.detectChanges();
    this.yetkinlik = "";
  }

  hedefEkle(){
    this.hedefler.push(this.hedef)
    this.hedef = "";
  }

  yetkinlikSil(index: number){

    this.yetkinlikler.splice(index,1)

  }

  hedefSil(index: number){

    this.hedefler.splice(index,1)

  }

  saveForm() {
    // Burada tüm formu kaydedersin
    console.log('Form verisi:', this.formData);
    console.log('Yetkinlik Soruları:', this.competencyQuestions);
    console.log('Hedef Soruları:', this.goalQuestions);
  
    this.activeIndex++;
  }
  

}
