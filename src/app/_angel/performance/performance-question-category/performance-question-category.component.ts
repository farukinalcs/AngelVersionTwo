import { ChangeDetectorRef, Component } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-performance-question-category',
  templateUrl: './performance-question-category.component.html',
  styleUrls: ['./performance-question-category.component.scss']
})

export class PerformanceQuestionCategoryComponent {
  categoryName:string="";
  categoryList:any[]=[];
  filteredItems:any[]=[];
  updateName:string=""
  _updateCategoryModal:boolean=false;
  _updateCategoryId:number = 0;

  constructor(
    private perform : PerformanceService,
    private ref : ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.getCategory(0);
  }

  ngAfterViewInit() {

  }

  filterItems(){

  }

  setCategory(name:string): void {
      this.perform.setCategory(name).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.categoryList = response[0].x;
        this.filteredItems = [...this.categoryList]
        console.log("setCategory:", this.categoryList);
        this.ref.detectChanges();
      });
      this.categoryName = ''; 
    }

    deleteCategory(item:any){
      const categoryid = item.Id;
      this.perform.deleteCategory(categoryid).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
       this.categoryList = response[0].x;
       this.filteredItems = [...this.categoryList]
        console.log("deleteCategory:", this.categoryList);
        this.ref.detectChanges();
      });
    } 

    updateCategoryModal(item:any){
      this._updateCategoryModal = true
      this._updateCategoryId = item.Id;
    
    }

    updateCategory(){
      this.perform.updateCategory(this._updateCategoryId,this.updateName).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.categoryList = response[0].x;
        this.filteredItems = [...this.categoryList]
        console.log("updateCategory:", this.categoryList);
        this.ref.detectChanges();
      });
      this.updateName = "";
    }

    
    getCategory(id:number){
      this.perform.getCategory(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
        this.categoryList = response[0].x;
        this.filteredItems = [...this.categoryList]
        console.log("getCategory:", this.categoryList);
        this.ref.detectChanges();
      });
    } 

}
