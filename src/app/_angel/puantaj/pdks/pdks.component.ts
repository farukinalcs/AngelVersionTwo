import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { pdksIncrement } from '../../NGRX/pdks.action';


@Component({
  selector: 'app-pdks',
  templateUrl: './pdks.component.html',
  styleUrls: ['./pdks.component.scss']
})
export class PdksComponent implements OnInit {

  pdks:number = 0;
  constructor(private store: Store<any>) { }

  ngOnInit(): void {

  }
  
  test(){
    // this.pdks += 1;
    // alert(`'ARRUBEE' ${this.pdks}`);
    this.store.dispatch(pdksIncrement())
  }

}
