import { Component, EventEmitter, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { ApexChart, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ChartComponent } from 'ng-apexcharts';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};


@Component({
  selector: 'app-widget2003',
  templateUrl: './widget2003.component.html',
  styleUrls: ['./widget2003.component.scss']
})
export class Widget2003Component implements OnInit, OnDestroy {
  @Input() widget : any;
  @Input() resizeEvent: EventEmitter<GridsterItem>;
  @Input() iceridekiler : any[];

  resizeSub: Subscription;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;


  constructor() { }

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe(widget => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        
      }

    });
    this.setChartValue();

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName == 'iceridekiler') {
        const chng = changes[propName];
        const cur  = chng.currentValue;
        const prev = chng.previousValue;  

        this.iceridekiler = cur;
      }
      
    }
  }

  setChartValue(){
    this.chartOptions = {
      series: [this.iceridekiler.length,130,20],
      chart: {
        width: 430,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "40%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: true
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E"],
      labels: ["Toplam", "Personel", "Ziyaretçi"],
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        formatter: function(seriesName : any, opts : any) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };

    
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

}
