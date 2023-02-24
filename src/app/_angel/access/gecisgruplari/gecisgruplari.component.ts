import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-gecisgruplari',
  templateUrl: './gecisgruplari.component.html',
  styleUrls: ['./gecisgruplari.component.scss']
})
export class GecisgruplariComponent implements OnInit {
  @ViewChild(MatPaginator, {static : true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns : string[] = ['checkbox', 'terminal', 'durum'];

  dataSource : MatTableDataSource<any>;

  terminaller : any[] = [
    {terminal : 'BioMini 998', durum : 'Atanmamış'},
    {terminal : 'BioMini 998', durum : 'Atanmamış'},
    {terminal : 'BioMini 998', durum : 'Yetkili'},
    {terminal : 'BioMini 998', durum : 'Atanmamış'},
    {terminal : 'BioMini 998', durum : 'Atanmamış'},
    {terminal : 'BioMini 998', durum : 'Atanmamış'},
    {terminal : 'BioMini 998', durum : 'Yetkili'}
  ]
  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.terminaller);
    this.dataSource.paginator = this.paginator;
  }
}
