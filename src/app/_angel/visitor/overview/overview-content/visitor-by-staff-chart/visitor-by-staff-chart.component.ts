import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexNoData,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexFill,
  ApexResponsive,
  ApexTheme,
  ApexStroke,
  ApexYAxis,
} from "ng-apexcharts";
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  fill: ApexFill;
  responsive: ApexResponsive[];
  theme: ApexTheme;
  stroke: ApexStroke;
  labels: string[];
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-visitor-by-staff-chart',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      NgApexchartsModule
  ],
  templateUrl: './visitor-by-staff-chart.component.html',
  styleUrl: './visitor-by-staff-chart.component.scss'
})
export class VisitorByStaffChartComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnsubscribe = new Subject();
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: ChartOptions;
  selectedPeriod: string = '1D'; // Varsayılan olarak günlük verileri ayarla


  ngAfterViewInit(): void {
    this.getChartData('1D'); // Varsayılan olarak günlük verileri al
  }
  
  ngOnInit(): void {
  }
  
  constructor(
    private profileService: ProfileService
  ) {
    this.chartOptions = {
      series: [], // örnek veri
      chart: {
        type: "polarArea",
        height: 430,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        }
      },
      labels: ['A', 'B', 'C', 'D', 'E'],
      fill: {
        opacity: 0.8,
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "diagonal1",
          shadeIntensity: 0.4,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      stroke: {
        width: 2,
        colors: ['#fff']
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0
          },
          spokes: {
            connectorColors: '#e0e0e0'
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom',
        fontSize: '13px',
        labels: {
          colors: '#555'
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      theme: {
        monochrome: {
          enabled: false
        }
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: { height: 300 },
            legend: { position: 'bottom' }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 250 },
            legend: { show: false }
          }
        },
        {
          breakpoint: 480,
          options: {
            chart: { height: 200 },
            legend: { show: false }
          }
        }
      ],
      yaxis: {
        show: false
      }
    };
    
    
  }
  
  getChartData(period: '1D' | '1W' | '1M') {
    this.selectedPeriod = period;
  
    const sp = [
      {
        mkodu: 'yek298',
        aralik: period === '1D' ? '1' : period === '1W' ? '7' : '30',
      }
    ];
  
    this.profileService.requestMethod(sp, { 'noloading': 'true' }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((res: any) => {
      const data = res[0].x;
      const message = res[0].z;
  
      if (message.islemsonuc === -1) {
        return;
      }
      
      this.chart.updateOptions({
        series: data.map((item: any) => item.ziyaretci),
        labels: data.map((item: any) => item.adsoyad),
      }, true, true);
  
      console.log("Güncel Grafik Opsiyonları: ", this.chartOptions);
    });
  }
  



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  
}
