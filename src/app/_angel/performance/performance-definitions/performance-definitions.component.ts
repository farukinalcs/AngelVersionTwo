import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-performance-definitions',

  templateUrl: './performance-definitions.component.html',
  styleUrls: ['./performance-definitions.component.scss']
})
export class PerformanceDefinitionsComponent {
  activeWidget: number = 1;

    constructor(
      private ref : ChangeDetectorRef
    ) { }

  ngOnInit(): void {

    this.ref.markForCheck();
    this.changeContent(1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    });
  }
  
  changeContent(widgetValue: number) {
    this.activeWidget = widgetValue;
  }

  widgets = [
    { title: 'Değerlendirme Kategorileri', value: 1},
    { title: 'Cevap Ölçekleri', value: 2},
    { title: 'Değerlendirme Soruları', value: 3},
    { title: 'Değerlendirme Şablonları', value: 4},

  ];

  ngOnDestroy(){

  }
}
