import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, IRowNode, IsRowSelectable, SideBarDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';


@Component({
  selector: 'app-sicil-liste',
  templateUrl: './sicil-liste.component.html',
  styleUrls: ['./sicil-liste.component.scss']
})
export class SicilListeComponent implements OnInit {
  @Input() displayPersonsList: boolean;
  @Output() displayPersonsListEvent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild("agGrid",{static:false}) agGrid:AgGridAngular;

  private ngUnsubscribe = new Subject();

  personsList: any[] = [];

  public columnDefs: ColDef[] = [
    {
      field: 'athlete',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    { field: 'age' },
    { field: 'country' },
    { field: 'year' },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 180,
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
    editable: false,
  };
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public isRowSelectable: IsRowSelectable = (
    params: IRowNode<any>
  ) => {
    return !!params.data && params.data.year >= 2012;
  };
  public rowData!: any[];


  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private ref: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.onGridReady();
  }

  onSelectionChanged() {
    const selectedRows = this.agGrid.api.getSelectedRows();
    console.log("Seçilenler : ", selectedRows);
  }

  onGridReady() {
    this.rowData = [
      {
        "athlete": "Michael ",
        "age": 19,
        "country": "United States",
        "year": 2008,
        "date": "24/08/2008",
        "sport": "Swimming",
        "gold": 8,
        "silver": 0,
        "bronze": 0,
        "total": 8
      },
      {
        "athlete": "Phelps",
        "age": 20,
        "country": "United States",
        "year": 2018,
        "date": "24/08/2008",
        "sport": "Swimming",
        "gold": 8,
        "silver": 0,
        "bronze": 0,
        "total": 8
      },
      {
        "athlete": "Michael c",
        "age": 21,
        "country": "United States",
        "year": 2008,
        "date": "24/08/2008",
        "sport": "Swimming",
        "gold": 8,
        "silver": 0,
        "bronze": 0,
        "total": 8
      },
      {
        "athlete": "Michael Phelps Phelps",
        "age": 22,
        "country": "United States",
        "year": 2013,
        "date": "24/08/2008",
        "sport": "Swimming",
        "gold": 8,
        "silver": 0,
        "bronze": 0,
        "total": 8
      },
      {
        "athlete": "Michael Michael Phelps",
        "age": 23,
        "country": "United States",
        "year": 2012,
        "date": "24/08/2008",
        "sport": "Swimming",
        "gold": 8,
        "silver": 0,
        "bronze": 0,
        "total": 8
      }
    ]  
  }
  

  hidePersonsList() {
    this.displayPersonsListEvent.emit();
  }

  ngOnDestroy(): void {
    this.displayPersonsListEvent.emit();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
