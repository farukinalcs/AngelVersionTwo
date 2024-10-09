import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-envanter',
  templateUrl: './envanter.component.html',
  styleUrls: ['./envanter.component.scss']
})
export class EnvanterComponent implements OnInit {
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
