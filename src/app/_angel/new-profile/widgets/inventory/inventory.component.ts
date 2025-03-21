import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    DialogModule,
    CarouselModule
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  items: any[] = [
    {anaBaslik : 'İK', altBaslik : 'Bilgisayar', aldim : '1'},
    {anaBaslik : 'IT', altBaslik : 'Monitör', aldim : '0'},
    {anaBaslik : 'Teknik', altBaslik : 'Pil', aldim : '-1'},
  ];

  displayMyInventory : boolean;
  constructor(
  ) { }

  ngOnInit(): void {
  }

  showMyInventory() {
    this.displayMyInventory = true;
  }

}