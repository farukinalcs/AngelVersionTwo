import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { DialogContainerComponent } from '../_angel/shared/dialog-container/dialog-container.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  gateResponseX : any;
  gateResponseY : any;
  customerCode:any;
  userLoginModel : any;

 loginOptions:any = {
    loginName : "",
    password : "",
    langcode : "",
    appcode : "",
    mkodu : ''
  };

  yetki : any[];

  isMobileSubsDynamicDialog: Subscription = new Subscription();

  _isMobile: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  isMobile$: Observable<any> = this._isMobile.asObservable();

  lang = new Subject;

  dropdownEmptyMessage : any = this.translateService.instant('Kayıt_Bulunamadı');

  configureComponentBehavior: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  
  constructor(
    private translateService : TranslateService
  ) { }

  
  dynamicDialog(disableClose: any, width: any, height: any, componentType: any, dialogType: any, dialog: any, component: any) {

    if (width === "") { width = "100%"; }
    if (height === "") { height = "95%"; }


    this.isMobileSubsDynamicDialog.unsubscribe();


    const dialogRef = dialog.open(DialogContainerComponent, {
      width: width,
      height: height,
      panelClass: 'full-width-dialog',
      disableClose: disableClose,
      data: {
        // rowSelection: rowSelection,
        // rangeSelection: rangeSelection,
        component: component,
        // componentParam: componentParam,
        componentType: componentType,
        dialogType: dialogType,
        dialogReturn: []
      }
    });

    this.isMobileSubsDynamicDialog = this._isMobile.subscribe((result) => {

      if (result == true) {
        dialogRef.updateSize("95%", "95%")

      }
      else {
        dialogRef.updateSize(width, height)

      }
    });

    return dialogRef;
  }


  refreshComponent(component: any) {

    try {
      component.ref.detectChanges();
    } catch (error) {

    }

    try {
      component.ref.markForCheck();
    } catch (error) {

    }
  }

}