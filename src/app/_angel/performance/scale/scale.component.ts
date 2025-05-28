import { ChangeDetectorRef, Component } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { Scale } from '../models/scale';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})

export class ScaleComponent {
  scaleName: string = '';
  selectedCount: number = 0;
  answers: any[] = [null, null, null, null, null];
  sliderValue: number = 1;
  direction: number = 0;

  scaleList: any[] = [];

  selectedScale: Scale | null = null;
  selectedScaleId: number | null = null;

  allowedCounts = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`, value: i + 1
  }));


  constructor(
    private perform: PerformanceService,
    private ref: ChangeDetectorRef,
    private helper: HelperService,
    private toastrService : ToastrService
  ) { }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getScale(0);
  }

  // onScaleChange(scaleId: number) {
  //   const found = this.scaleList.find(s => s.id === scaleId);
  //   if (found) {
  //     console.log("FOUND",found);
  //     this.selectedScale = found;
  //     this.scaleName = found.scaleName;
  //     this.answers = [...found.answers]; // kopyasını al
  //     this.selectedCount = found.answers.length;
  //   }
  // }

  onScaleChange(scaleId: number) {
 
    const found = this.scaleList.find(s => s.id === scaleId);
    if (found) {
      this.selectedScale = found;
      this.selectedScaleId = scaleId;
      console.log("FOUND",found);
    
      this.scaleName = (found as any).ad || ''; 
      this.selectedCount = (found as any).cevapn || 0;
      this.direction = (found as any).yon || 0;
  
      this.answers = [];
      for (let i = 1; i <= 5; i++) {
        const key = `cevap${i}`;
        this.answers.push((found as any)[key]?.trim() || '');
      }
    }
  }
  
  setScale(): void {
    const scale: Scale = {
      name: this.scaleName,
      answers: this.answers.slice(0, this.selectedCount),
      count: this.selectedCount,
      direction: this.direction
    };

    this.perform.setScale(scale).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("setScale:", result);
      if(result == 1){
        this.toastrService.success(
          "Ölçek Ekleme İşlemi Başarılı");
      }else{
        this.toastrService.error(
          "Ölçek Ekleme İşlemi Başarısız");
      }
     
      this.getScale(0);
      this.ref.detectChanges();
    });
   
  }

  getScale(id: number) {
    this.perform.getScale(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.scaleList = response[0]?.x ?? [];
      console.log("getScale:", this.scaleList);
      this.ref.detectChanges();
    });
       // Form temizle
       this.scaleName = '';
       this.selectedCount = 0;
       this.answers = [null, null, null, null, null];
       this.direction = 0;
  }

  updateScale(): void {
    const scale: Scale = {
      id: this.selectedScaleId ?? undefined,
      name: this.scaleName,
      answers: this.answers.slice(0, this.selectedCount),
      count: this.selectedCount,
      direction: this.direction
    };

    this.perform.updateScale(scale).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      console.log("updateScale:", result);
      if(result == 1){
        this.toastrService.success(
          "Ölçek Güncelleme İşlemi Başarılı");
      }else{
        this.toastrService.error(
          "Ölçek Güncelleme İşlemi Başarısız");
      }
      this.getScale(0);
      this.ref.detectChanges();
    });
   
    // Form temizle
    this.selectedScaleId  = 0;
  }

  // Seçilen ölçek verisini forma doldur
  // editScale(scale: Scale): void {
  //   this.scaleName = scale.name;
  //   this.selectedCount = scale.count;
  //   this.answers = [...scale.answers, null, null, null, null].slice(0, 5); // 5 elemanlı sabit diziye yay
  //   this.direction = scale.direction;
  // }
  deleteScale(){
    this.perform.deleteScale(this.selectedScaleId ?? 0).subscribe((response: ResponseModel<any, ResponseDetailZ>[]) => {
      const result = response[0].x[0].islemsonuc;
      if(result == 1){
        this.toastrService.success(
          "Ölçek Silme İşlemi Başarılı");
          this.getScale(0);
      }else{
        this.toastrService.error(
          "Ölçek Silme İşlemi Başarısız");
      }
      console.log("deleteScale:", result);
      this.ref.detectChanges();
    });
  }

}
