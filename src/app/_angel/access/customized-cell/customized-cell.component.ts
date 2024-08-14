import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';


export interface CustomParams{
  buttontext?:string
}


@Component({
  selector: 'app-customized-cell',
  templateUrl: './customized-cell.component.html',
  //template:`#{{value}}`,
  styleUrls: ['./customized-cell.component.scss']
})

export class CustomizedCellComponent implements OnInit, ICellRendererAngularComp {

  value : any;
  buttontext:string="bla blaaaa"
  
  constructor () {}

  

  ngOnInit(): void {
    
  }

  agInit(params: ICellRendererParams & CustomParams):void{
    this.value = params.value;
    this.buttontext = params.buttontext || '';
  }

  refresh(params: any) :boolean {
    return true
  }

}
