import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from 'src/app/_helpers/helper.service';
import { TanimlamalarService } from '../../tanimlamalar.service';

@Component({
  selector: 'app-food-type-definition',
  templateUrl: './food-type-definition.component.html',
  styleUrls: ['./food-type-definition.component.scss']
})
export class FoodTypeDefinitionComponent implements OnInit {

  private ngUnsubscribe = new Subject()

  @Input() selectedItem: any; 

  @Output() closeAnimationEvent = new EventEmitter<void>();

  demandParam: string = '';

  fileParam: string = '';

  mealType: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tanimlamalar: TanimlamalarService,
    private translateService : TranslateService,
    private helperService : HelperService,
    private ref : ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMealType();
  }

  onSubmit(data:any){
    this.tanimlamalar
    .setMeal(data)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((response : any) => {

     let blabla = response[0].x;
  
     console.log("setMeal:", blabla);
     console.log("Yemek",response);
     console.log("SUBMİT",data);
      this.ref.detectChanges();
    });
   
  }


  getMealType(){
    this.tanimlamalar
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