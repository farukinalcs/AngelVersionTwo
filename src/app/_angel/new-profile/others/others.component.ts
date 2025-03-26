import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-others',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss'
})
export class OthersComponent {

}
