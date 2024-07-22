import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss']
})
export class FormStepperComponent implements OnInit {
  @Input() stepperFields : any;
  @Input() isFromAttendance: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
