import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererParams } from 'ag-grid-community';
import { param } from 'jquery';

@Component({
  selector: 'app-customized-cell-component',
  templateUrl: './customized-cell-component.component.html',
  styleUrls: ['./customized-cell-component.component.scss']
})
export class CustomizedCellComponentComponent implements OnInit, ICellRendererAngularComp {
  public cellvalue:any;
  constructor () {}

  ngOnInit(): void {
    
  }

  agInit(params: any){
    this.cellvalue.params.value;
  }

  // refresh(params: ICellRendererParams<any, any, any>): boolean {
    
  // }

  refresh(params: any): boolean {
    this.cellvalue = params.value;
    return true;
  }
}
