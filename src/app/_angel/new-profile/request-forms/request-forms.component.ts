import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-forms',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './request-forms.component.html',
  styleUrl: './request-forms.component.scss'
})
export class RequestFormsComponent {

}
