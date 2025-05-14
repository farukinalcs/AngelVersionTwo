import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexNoData,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexResponsive
} from "ng-apexcharts";
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  noData: ApexNoData;
  plotOptions: ApexPlotOptions
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  fill: ApexFill;
  colors: string[];
  grid: ApexGrid;
  responsive: ApexResponsive[];
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-visitor-company-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule
  ],
  templateUrl: './visitor-company-chart.component.html',
  styleUrl: './visitor-company-chart.component.scss'
})
export class VisitorCompanyChartComponent implements OnInit, OnDestroy, AfterViewInit {
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
      series: [
        {
          name: "Ziyaretçiler",
          data: [] // dinamik veri
        }
      ],
      chart: {
        type: "bar", // grafik türü
        height: 250,
        toolbar: { show: false },
        animations: {
          enabled: true, // animasyonları etkinleştir
          easing: 'easeinout', // animasyon geçişi
          speed: 800, // animasyon hızı
          animateGradually: { 
            enabled: true, // animasyonun kademeli olarak başlaması
            delay: 100  // her bir veri noktası için gecikme süresi
          }
        },
        zoom: {
          enabled: true, // yakınlaştırmayı devre dışı bırak
          type: 'x', // yakınlaştırma türü
          autoScaleYaxis: true, // Y eksenini otomatik ölçekle
          zoomedArea: {
            fill: {
              color: '#90CAF9', // yakınlaştırma alanının rengi
              opacity: 0.4 // yakınlaştırma alanının opaklığı
            }
          }
        }
      },
      noData: {
        text: 'Veri yükleniyor...', // veri yüklenirken gösterilecek metin
        align: 'center', // metin hizalaması
        verticalAlign: 'middle', // dikey hizalama
        style: {
          color: '#999', // metin rengi
          fontSize: '14px' 
        }
      },
      plotOptions: {
        bar: {
          horizontal: false, // yatay çubuk grafik
          borderRadius: 4, // kenar yuvarlama
          barHeight: '40%', // <== TEK VERİDE DEVASA BAR SORUNUNU ÇÖZER
          distributed: true // her bara farklı ton verilebilir
        }
      },
      dataLabels: {
        enabled: false // veri etiketlerini gizle
      },
      fill: {
        type: "gradient", // dolgu tipi
        gradient: {
          shade: 'light', // gradient tonu
          type: "horizontal", // gradient türü
          shadeIntensity: 0.4, // gradientin koyu tonu
          gradientToColors: undefined, // gradientin bitiş rengi
          inverseColors: true, // renklerin ters çevrilmesini engelle
          opacityFrom: 0.8, // başlangıç opaklığı
          opacityTo: 1, // bitiş opaklığı
          stops: [0, 90, 100] // gradient durakları
        }
      },
      colors: ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#9b59b6"], // modern tonlar
      grid: {
        borderColor: "#ecf0f1", // daha belirgin çizgiler
        strokeDashArray: 4, // çizgi stili
        xaxis: { 
          lines: { show: true } // X ekseninde çizgileri göster
        },
        yaxis: {
          lines: { show: false } // Y ekseninde çizgileri gizle
        }
      },
      title: {
        text: "Ziyaretçi Analizi",
        align: "left",
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: "Günlük Ziyaretçi Sayısı",
        align: "left",
        style: {
          fontSize: '18px',
          color: '#888',
          fontWeight: 'normal',
          fontFamily: 'Arial, sans-serif'
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#2c3e50', // daha koyu ve net
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#2c3e50',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
          }
        }
      },
      legend: { show: false },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: { height: 300 }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 250 },
            xaxis: {
              labels: {
                rotate: -45
              }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            chart: { height: 200 },
            xaxis: { labels: { show: false } }
          }
        }
      ]
    };
    
    
  }
  
  
  // Ziyaretçi firma grafiği için veri al
  getChartData(period: '1D' | '1W' | '1M') {
    this.selectedPeriod = period;

    var sp: any[] = [
      {
        mkodu: 'yek297',
        aralik: period == '1D' ? '1' : period == '1W' ? '7' : '30',
      }
    ];

    this.profileService.requestMethod(sp, { 'noloading': 'true' }).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res: any) => {
      const data = res[0].x;
      const message = res[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      // this.chart.updateSeries([
      //   {
      //     name: "Ziyaretçiler",
      //     data: data.map((item: any) => item.ziyaretci)
      //   }
      // ]);
      
      this.chart.updateOptions({
        series: [
          {
            name: "Ziyaretçiler",
            data: data.map((item: any) => item.ziyaretci)
          }
        ],
        xaxis: {
          categories: data.map((item: any) => item.firma),
          labels: {
            show: data.length <= 20 // 20'den az veri varsa etiketleri göster 
          }
        },
        subtitle: {
          text: period === '1D' ? 'Günlük Ziyaretçi Sayısı' : period === '1W' ? 'Haftalık Ziyaretçi Sayısı' : 'Aylık Ziyaretçi Sayısı',
          offsetY: 0, // alt başlık konumu
          floating: true, // alt başlık konumu
          style: {
            fontSize: '15px',
            color: '#888',
            fontWeight: 'normal',
            fontFamily: 'Arial, sans-serif'
          }
        }
      }, true, true);
      
    });
  }



  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
  
}