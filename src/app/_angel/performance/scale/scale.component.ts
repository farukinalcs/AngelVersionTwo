import { ChangeDetectorRef, Component } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})

export class ScaleComponent {
  scaleName: string = '';
  selectedCount: number = 0;
  answer1: string = '';
  answer2: string = '';
  answer3: string = '';
  answer4: string = '';
  answer5: string = '';
  knobValue: number = 1;
  sliderValue: number = 1;
  direction: number = 0;
  

  allowedCounts = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`, value: i + 1
  }));
  

  constructor(
    private perform : PerformanceService,
    private ref : ChangeDetectorRef,
    private helper : HelperService
  ){}


    ngOnInit(): void {

    }
  
    ngAfterViewInit() {
  
    }
  
    filterItems(){
  
    }
  
    setScale(): void {
        this.perform.setScale(this.scaleName,this.answer1,this.answer2,this.answer3,this.answer4,this.answer5,this.selectedCount,this.direction).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
          const Result = response[0].x;
        
          console.log("setScale:", Result);
          this.ref.detectChanges();
        });
        this.scaleName = ''; 
        this.direction = 0;
      }
  //   saveScale() {
  //   const scale = {
  //     name: this.scaleName,
  //     options: this.selectedCount <= 5 ? 
  //       [this.answer1, this.answer2, this.answer3, this.answer4, this.answer5].slice(0, this.selectedCount) :
  //       [],
  //       sliderValue: this.selectedCount > 5 ? this.sliderValue : null
  //   };

  //   console.log('Kaydedilen:', scale);
  // }
}
