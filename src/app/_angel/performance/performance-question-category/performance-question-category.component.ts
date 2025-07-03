import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-performance-question-category',
  templateUrl: './performance-question-category.component.html',
  styleUrls: ['./performance-question-category.component.scss']
})

export class PerformanceQuestionCategoryComponent implements OnInit, OnDestroy {
  
  private ngUnsubscribe = new Subject();
  categoryName: string = "";

  updateName: string = ""

  categoryList: any[] = [];
  filteredItems: any[] = [];

  _updateCategoryModal: boolean = false;
  _deleteCategoryModal: boolean = false;
  _updateCategoryId: number = 0;
  _deleteCategoryId: number = 0;

  constructor(
    private perform: PerformanceService,
    private ref: ChangeDetectorRef,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getCategory(0);
  }

  filterItems() {

  }

  setCategory(name: string): void {
    this.perform.setCategory(name).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {

      const result = response[0].x[0].islemsonuc;
      console.log("setCategory:", result);
      if (result == 1) {
        this.toastrService.success(
          "Kategori Ekleme İşlemi Başarılı");
        this.getCategory(0);
      } else {
        this.toastrService.error(
          "Kategori Ekleme İşlemi Başarısız");
      }
      this.ref.detectChanges();
    });
  }

  updateCategoryModal(item: any) {
    this.categoryName = item.Ad;
    this._updateCategoryModal = true
    this._updateCategoryId = item.Id;
  }

  deleteCategoryModal(item: any) {
    this._deleteCategoryId = item.Id;
    this.categoryName = item.Ad;
    this._deleteCategoryModal = true
  }


  deleteCategory() {
    this.perform.deleteCategory(this._deleteCategoryId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("deleteCategory:", result);
      if (result == 1) {
        this.toastrService.success(
          "Kategori Silme İşlemi Başarılı");
        this.getCategory(0);
      } else {
        this.toastrService.error(
          "Kategori Silme İşlemi Başarısız");
      }
      this.ref.detectChanges();
    });
  }



  updateCategory() {
    if(this.updateName != "")
    {
      this.perform.updateCategory(this._updateCategoryId, this.updateName).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
        const result = response[0].x[0].islemsonuc;
        console.log("updateCategory:", result);
        if (result == 1) {
          this.toastrService.success(
            "Kategori Güncelleme İşlemi Başarılı");
          this.getCategory(0);
        } else {
          this.toastrService.error(
            "Kategori Güncelleme İşlemi Başarısız");
        }
        this.ref.detectChanges();
      });
    }else{
      this.toastrService.error(
        "Kategori İsmi Boş Geçilemez");
    }
   
  }


  getCategory(id: number) {
    this.perform.getCategory(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.categoryList = response[0].x;
      this.filteredItems = [...this.categoryList]
      console.log("getCategory:", this.categoryList);
      this.ref.detectChanges();
      this._deleteCategoryId = 0;
      this._updateCategoryId = 0;
      this._updateCategoryModal = false;
      this._deleteCategoryModal = false;
      this.updateName = "";
      this.categoryName = '';
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
