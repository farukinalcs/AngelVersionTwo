import { ChangeDetectorRef, Component } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { HelperService } from 'src/app/_helpers/helper.service';
import { ResponseModel } from 'src/app/modules/auth/models/response-model';
import { ResponseDetailZ } from 'src/app/modules/auth/models/response-detail-z';
import { Scale } from '../models/scale';

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

  allowedCounts = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`, value: i + 1
  }));


  constructor(
    private perform: PerformanceService,
    private ref: ChangeDetectorRef,
    private helper: HelperService
  ) { }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getScale(0);
  }

  setScale(): void {
    const scale: Scale = {
      name: this.scaleName,
      answers: this.answers.slice(0, this.selectedCount),
      count: this.selectedCount,
      direction: this.direction
    };

    this.perform.setScale(scale).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      const result = response[0].x;
      console.log("setScale:", result);
      this.getScale(0);
      this.ref.detectChanges();
    });
   
    // Form temizle
    this.scaleName = '';
    this.selectedCount = 0;
    this.answers = [null, null, null, null, null];
    this.direction = 0;
  }

  getScale(id: number) {
    this.perform.getScale(id).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
      this.scaleList = response[0]?.x ?? [];
      console.log("getScale:", this.scaleList);
      this.ref.detectChanges();
    });
  }

  // updateScale(): void {
  //   const scale: Scale = {
  //     name: this.scaleName,
  //     answers: this.answers.slice(0, this.selectedCount),
  //     count: this.selectedCount,
  //     direction: this.direction
  //   };

  //   this.perform.setScale(scale).subscribe((response: ResponseModel<"", ResponseDetailZ>[]) => {
  //     const result = response[0].x;
  //     console.log("setScale:", result);
  //     this.ref.detectChanges();
  //   });
  //   this.getScale(0);
  //   // Form temizle
  //   this.scaleName = '';
  //   this.selectedCount = 0;
  //   this.answers = [null, null, null, null, null];
  //   this.direction = 0;
  // }

  // Seçilen ölçek verisini forma doldur
  // editScale(scale: Scale): void {
  //   this.scaleName = scale.name;
  //   this.selectedCount = scale.count;
  //   this.answers = [...scale.answers, null, null, null, null].slice(0, 5); // 5 elemanlı sabit diziye yay
  //   this.direction = scale.direction;
  // }


}
