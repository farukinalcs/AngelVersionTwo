import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdks',
  templateUrl: './pdks.component.html',
  styleUrls: ['./pdks.component.scss']
})
export class PdksComponent implements OnInit {

  pdks:number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  test(){
    this.pdks += 1;
    alert(`'ARRUBEE' ${this.pdks}`);
  }

}
