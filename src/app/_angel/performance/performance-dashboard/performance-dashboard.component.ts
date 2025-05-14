import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-performance-dashboard',
  templateUrl: './performance-dashboard.component.html',
  styleUrl: './performance-dashboard.component.scss'
})
export class PerformanceDashboardComponent {
  @Input() isFromAttendance: boolean;



  constructor(){}


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
}
