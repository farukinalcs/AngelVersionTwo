import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { LayoutService } from 'src/app/_metronic/layout';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-yemek-tipi-tanimlama',
  templateUrl: './yemek-tipi-tanimlama.component.html',
  styleUrls: ['./yemek-tipi-tanimlama.component.scss']
})
export class YemekTipiTanimlamaComponent implements OnInit {

  private ngUnsubscribe = new Subject()

  @Input() selectedItem: any; 

  @Output() closeAnimationEvent = new EventEmitter<void>();

  demandParam: string = '';

  fileParam: string = '';

  mealType: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private profileService : ProfileService,
    private translateService : TranslateService,
    private helperService : HelperService,
    public layoutService : LayoutService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMealType();
  }

  onSubmit(data:any){
    this.profileService
    .setMeal(data)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {

     let blabla = response[0].x;
  
     console.log("setMeal:", blabla);
     console.log("YEMEK",response);
     console.log("SUBMİT",data);
      this.ref.detectChanges();
    });
   
  }


  getMealType(){
    this.profileService
    .getMealType()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {

     this.mealType = response[0].x;
  
     console.log("getMealType:", this.mealType);
      
      this.ref.detectChanges();
    });
  }


  onCloseButtonClick() {
    this.fileParam = '';
    this.demandParam = '';
    this.closeAnimationEvent.emit();

    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
