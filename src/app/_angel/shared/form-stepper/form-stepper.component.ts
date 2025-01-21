import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss']
})
export class FormStepperComponent implements OnInit {
  @Input() stepperFields : any;
  @Input() isFromAttendance: boolean;
  @Input() lineHeight?: any = "h-40px";
  constructor() { }

  ngOnInit(): void {
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['stepperFields']) {
  //     // items değiştiğinde yapılacak işlemler
  //     console.log('stepperFields değişti:', this.stepperFields);
  //   }
  // }

}
