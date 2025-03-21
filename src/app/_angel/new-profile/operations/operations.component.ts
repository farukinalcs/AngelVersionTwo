import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.scss'
})
export class OperationsComponent {

}
