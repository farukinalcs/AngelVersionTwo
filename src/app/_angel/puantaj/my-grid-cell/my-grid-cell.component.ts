import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-my-grid-cell',
  template: `
     # {{value}}
  `,
  styles: [
  ]
})
export class MyGridCellComponent implements OnInit, ICellRendererAngularComp {

  value: any;

  constructor() { }
  agInit(params: ICellRendererParams<any, any>): void {
    this.value=params.value;
    // throw new Error('Method not implemented.');
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  ngOnInit(): void {
  }

}
