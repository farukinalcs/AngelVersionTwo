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

  params!: CustomFilterParams;
  organizationFilterList: OKodFieldsModel[] = [];
  filter: any;
  searchText: string = '';
  key: string | undefined;

  constructor(
    private profileService: ProfileService,
    private ref: ChangeDetectorRef
  ) {}

  agInit(params: CustomFilterParams): void {
    // this.customVariable = params?.customVariable;
    // console.log("TESTO: ", this.customVariable);
    
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
            if (this.params.customVariable) {
              // this.organizationFilterList = data.filter((item:any) => item.ID == this.params.customVariable);
              this.organizationFilterList = data.filter((item: any) => this.params.customVariable?.includes(item.ID));
            } else {
              this.organizationFilterList = data;
            }


            // İlk objenin anahtarlarını kontrol edip 'ad' key'ini belirliyoruz
            const firstObj = this.organizationFilterList[0] || {};
            this.key = Object.keys(firstObj).find(k => k.toLowerCase() === "ad");
            
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



interface CustomFilterParams extends IFilterParams {
  customVariable?: any[];
}