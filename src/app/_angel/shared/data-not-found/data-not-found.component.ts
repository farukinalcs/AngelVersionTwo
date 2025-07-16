import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-data-not-found',
  templateUrl: './data-not-found.component.html',
  styleUrls: ['./data-not-found.component.scss'],
  imports: [CommonModule, TranslateModule, FormsModule],
  standalone: true
})
export class DataNotFoundComponent implements OnInit {
  @Input() imgWidth : any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
