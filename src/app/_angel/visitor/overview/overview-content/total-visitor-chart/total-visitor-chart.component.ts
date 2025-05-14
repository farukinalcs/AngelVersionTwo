import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexResponsive
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  fill: ApexFill;
  colors: string[];
  grid: ApexGrid;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-total-visitor-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule
  ],
  templateUrl: './total-visitor-chart.component.html',
  styleUrl: './total-visitor-chart.component.scss'
})
export class TotalVisitorChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;
  periodData = {
    '1D': series.dayDataSeries.prices,
    '1W': series.weekDataSeries.prices,
    '1M': series.monthDataSeries1.prices
  };
  
  periodDates = {
    '1D': series.dayDataSeries.dates,
    '1W': series.weekDataSeries.dates,
    '1M': series.monthDataSeries1.dates
  };
  selectedPeriod: string = '1D'; // Varsayılan olarak günlük verileri ayarla

  
  ngOnInit(): void {
    // this.setPeriod('1D'); // Varsayılan olarak günlük verileri ayarla
  }
  
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Ziyaretçiler", // Grafik adı
          data: series.monthDataSeries1.prices // Varsayılan olarak aylık verileri ayarla
        }
      ],
      chart: {
        type: "area", // Grafik tipi
        height: 250, // Grafik yüksekliği
        zoom: {
          enabled: false // Yakınlaştırma özelliğini devre dışı bırak
        },
        toolbar: {
          show: false // Araç çubuğunu gizle
        },
        fontFamily: "Segoe UI, sans-serif" // Font ayarları
      },
      dataLabels: {
        enabled: false // Veri etiketlerini gizle
      },
      stroke: {
        curve: "smooth", // Eğri çizgi
        width: 2 // Çizgi kalınlığı
      },
      fill: {
        type: "gradient", // Gradient tipi
        gradient: {
          shade: "dark", // Gradientin tonu
          type: "vertical", // Gradientin yönü
          shadeIntensity: 0.6, // Gradientin koyu tonu
          gradientToColors: ["#2C3E50"], // Lacivert ton
          inverseColors: false, // Renklerin ters çevrilmesini engelle
          opacityFrom: 0.8, // Gradientin başlangıç opaklığı
          opacityTo: 0.1, // Gradientin başlangıç ve bitiş opaklıkları
          stops: [0, 100] // Gradient durakları
        }
      },
      colors: ["#34495E"], // Lacivert ton
      grid: {
        borderColor: "#e0e6ed", // Daha belirgin çizgiler
        strokeDashArray: 3, // Çizgi stili
        xaxis: {
          lines: {
            show: true // X ekseninde çizgileri gizle
          }
        },
        yaxis: {
          lines: {
            show: true // Y ekseninde çizgileri gizle
          }
        }
      },
      title: {
        text: "Ziyaretçi Analizi", // Grafik başlığı
        align: "left", // Başlık hizalaması
        style: { 
          fontSize: "18px", // Başlık font boyutu
          fontWeight: "bold", // Başlık font kalınlığı
          color: "#181C32" // Başlık rengi
        }
      },
      subtitle: {
        text: "Günlük Ziyaretçi Sayısı", // Grafik alt başlığı
        align: "right", // Alt başlık hizalaması
        style: {
          fontSize: "13px", // Alt başlık font boyutu
          color: "#6c757d", // Alt başlık rengi
          fontWeight: "500" // Alt başlık font kalınlığı
        }
      },
      labels: series.monthDataSeries1.dates, // X eksenindeki etiketler
      xaxis: {
        type: "datetime", // X ekseni tipi
        labels: {
          show: true, // X eksenindeki etiketleri gizle
          style: {
            colors: "#181C32",  // X eksenindeki etiket rengi
            fontWeight: "bold", // X eksenindeki etiket font kalınlığı
            fontSize: "13px" // X eksenindeki etiket font boyutu
          }
        },
        axisTicks: {
          color: "#ccc" // X eksenindeki çizgi rengi
        },
        axisBorder: {
          color: "#ccc" // X eksenindeki kenar rengi
        }
      },
      yaxis: {
        show:true, // Y eksenini gizle
        opposite: true, // Y eksenini sağ tarafa yerleştir
        labels: {
          style: {
            colors: "#181C32", // Y eksenindeki etiket rengi
            fontWeight: "bold", // Y eksenindeki etiket font kalınlığı
            fontSize: "13px" // Y eksenindeki etiket font boyutu
          }
        },
        axisTicks: {
          color: "#ccc" // Y eksenindeki çizgi rengi
        },
        axisBorder: {
          color: "#ccc" // Y eksenindeki kenar rengi
        }
      },
      legend: {
        show: false // Efsaneyi gizle
      },
      responsive: [
        {
          breakpoint: 1024, // 1024 pikselden küçük ekranlar için
          options: {
            chart: {
              height: 300 // Grafik yüksekliği
            },
            legend: {
              position: "bottom" // Efsane konumu
            }
          }
        },
        {
          breakpoint: 768, // 768 pikselden küçük ekranlar için
          options: {
            chart: {
              height: 250 // Grafik yüksekliği
            },
            xaxis: {
              labels: {
                rotate: -45 // X eksenindeki etiketlerin açısı
              }
            }
          }
        },
        {
          breakpoint: 480, // 480 pikselden küçük ekranlar için
          options: {
            chart: {
              height: 200 // Grafik yüksekliği
            },
            xaxis: {
              labels: {
                show: false // X eksenindeki etiketleri gizle
              }
            },
            legend: {
              show: false   // Efsaneyi gizle
            }
          }
        }
      ]
    };
    
    
  }
  



  setPeriod(period: '1D' | '1W' | '1M') {
    this.selectedPeriod = period;
    this.chartOptions.series = [
      {
        name: "Ziyaretçiler",
        data: this.periodData[period]
      }
    ];
    this.chartOptions.labels = this.periodDates[period];
    this.chartOptions.subtitle.text =
      period === '1D' ? 'Günlük Ziyaretçi Sayısı' :
      period === '1W' ? 'Haftalık Ziyaretçi Sayısı' : 'Aylık Ziyaretçi Sayısı';
  }
  
}



export const series = {
  dayDataSeries: {
    prices: [8600.65, 8610.1, 8605.8, 8599.2, 8615.3],
    dates: [
      "08 Dec 2017 09:00",
      "08 Dec 2017 11:00",
      "08 Dec 2017 13:00",
      "08 Dec 2017 15:00",
      "08 Dec 2017 17:00"
    ]
  },
  weekDataSeries: {
    prices: [
      8496.25,
      8600.65,
      8881.1,
      9340.85,
      9402.4,
      9500.6,
      9555.7
    ],
    dates: [
      "04 Dec 2017",
      "05 Dec 2017",
      "06 Dec 2017",
      "07 Dec 2017",
      "08 Dec 2017",
      "09 Dec 2017",
      "10 Dec 2017"
    ]
  },
  monthDataSeries1: {
    prices: [
      8107.85,
      8128.0,
      8122.9,
      8165.5,
      8340.7,
      8423.7,
      8423.5,
      8514.3,
      8481.85,
      8487.7,
      8506.9,
      8626.2,
      8668.95,
      8602.3,
      8607.55,
      8512.9,
      8496.25,
      8600.65,
      8881.1,
      9340.85
    ],
    dates: [
      "13 Nov 2017",
      "14 Nov 2017",
      "15 Nov 2017",
      "16 Nov 2017",
      "17 Nov 2017",
      "20 Nov 2017",
      "21 Nov 2017",
      "22 Nov 2017",
      "23 Nov 2017",
      "24 Nov 2017",
      "27 Nov 2017",
      "28 Nov 2017",
      "29 Nov 2017",
      "30 Nov 2017",
      "01 Dec 2017",
      "04 Dec 2017",
      "05 Dec 2017",
      "06 Dec 2017",
      "07 Dec 2017",
      "08 Dec 2017"
    ]
  }
};

