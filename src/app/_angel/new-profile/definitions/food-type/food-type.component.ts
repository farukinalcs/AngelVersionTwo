import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TanimlamalarService } from 'src/app/_angel/profile/profile-definitions/tanimlamalar.service';
import { HelperService } from 'src/app/_helpers/helper.service';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './food-type.component.html',
  styleUrl: './food-type.component.scss'
})
export class FoodTypeComponent implements OnInit {

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