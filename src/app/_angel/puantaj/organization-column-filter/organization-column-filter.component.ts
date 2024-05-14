import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams, AgPromise, IAfterGuiAttachedParams } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { OKodFieldsModel } from '../../profile/models/oKodFields';
import { ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-organization-column-filter',
  templateUrl: './organization-column-filter.component.html',
  styleUrls: ['./organization-column-filter.component.scss'],
})
export class OrganizationColumnFilterComponent implements IFilterAngularComp {
  private ngUnsubscribe = new Subject();

  private static readonly rowHeight: number = 28;

  params!: IFilterParams;
  organizationFilterList: OKodFieldsModel[] = [];
  selectedType: any;
  dropdownEmptyMessage: any = 'Kayıt_Bulunamadı';
  filter: any;

  constructor(
    private profileService: ProfileService,
    private ref: ChangeDetectorRef
  ) {}

  agInit(params: IFilterParams<any, any>): void {
    this.params = params;
    console.log('Filter Comp. Params :', this.params);

    
    this.getOrganizationInfo();
  }

  getOrganizationInfo() {
    this.profileService
      .getTypeValues(this.params.column.getColId())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: ResponseModel<OKodFieldsModel, ResponseDetailZ>[]) => {
          const data = response[0].x;
          const message = response[0].z;

          if (message.islemsonuc == 1) {
            this.organizationFilterList = data;
            console.log("Organizasyon Bilgisi Geldi Custom Filter Comp. :", this.organizationFilterList);
            this.ref.detectChanges();            
          } else {

          }
        }

      );
  }

  isFilterActive(): boolean {
    return true;
  }
  doesFilterPass(params: IDoesFilterPassParams<any>): boolean {
    return true;
  }
  getModel() {
    return this.filter;
  }
  setModel(model: any): void | AgPromise<void> {
    
    console.log("model: ", model);    
  }
  onNewRowsLoaded?(): void {
  }
  onAnyFilterChanged?(): void {
  }
  getModelAsString(model: any): string {
    return model ? model.toString() : '';
  }
  
  afterGuiAttached?(params?: IAfterGuiAttachedParams | undefined): void {
    console.log("params:", params);
    
  }
  afterGuiDetached?(): void {
  }

  destroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }


  updateFilter() {
    this.params.filterChangedCallback();
  }


}
