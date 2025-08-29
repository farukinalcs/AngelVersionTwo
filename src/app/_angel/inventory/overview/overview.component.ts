import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  stats = [
        {
            title: 'Toplam Ekipman Talebi',
            value: '215',
            unit: 'Adet',
            change: '+12%',
            icon: 'bi bi-clock',
            color: 'text-primary'
        },
        {
            title: 'Ekipman Sahibi Personel',
            value: '98',
            unit: 'kişi',
            change: '+3%',
            icon: 'bi bi-people',
            color: 'text-success'
        },
        {
            title: 'Taleplere Ortalama Dönüş',
            value: '3.7',
            unit: 'saat/kişi',
            change: '+8%',
            icon: 'bi bi-graph-up',
            color: 'text-purple'
        },
        {
            title: 'Bu Ay',
            value: '4',
            unit: 'saat',
            change: '-5%',
            icon: 'bi bi-calendar',
            color: 'text-warning'
        }
    ];

    charts: any[] = [];
    ngOnInit(): void {
        this.charts = [
            {
                title: 'Aylık Sarf Malzeme Talebi',
                description: 'Son 12 ayın Sarf Malzeme saatleri',
                series: [{ name: 'Sarf Malzeme Talepleri', data: [120, 145, 180, 165, 190, 210, 185, 220, 195, 175, 160, 140] }],
                options: {
                    chart: { type: 'line', height: 350, toolbar: { show: false }, background: 'transparent' },
                    colors: ['#0d6efd'],
                    stroke: { curve: 'smooth', width: 3 },
                    xaxis: {
                        categories: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                        labels: { style: { colors: '#6c757d' } }
                    },
                    yaxis: { labels: { style: { colors: '#6c757d' } } },
                    grid: { borderColor: '#dee2e6', strokeDashArray: 4 },
                    tooltip: { theme: 'light' }
                }
            },
            {
                title: 'Departmanlara Göre Dağılım',
                description: 'Bu ayki departman bazlı ekipman talepleri',
                series: [{ name: 'Ekipman Talepleri', data: [85, 72, 95, 68, 90, 78, 82] }],
                options: {
                    chart: { type: 'bar', height: 350, toolbar: { show: false }, background: 'transparent' },
                    colors: ['#d1362bff'],
                    plotOptions: { bar: { borderRadius: 8, horizontal: false, columnWidth: '60%' } },
                    xaxis: {
                        categories: ['IT', 'İnsan Kaynakları', 'Satış', 'Pazarlama', 'Muhasebe', 'Üretim', 'Lojistik'],
                        labels: { style: { colors: '#6c757d' } }
                    },
                    yaxis: { labels: { style: { colors: '#6c757d' } } },
                    grid: { borderColor: '#dee2e6', strokeDashArray: 4 },
                    tooltip: { theme: 'light' }
                }
            },
            {
                title: 'Ekipman Türleri',
                description: 'Ekipman türlerine göre dağılım (%)',
                series: [40, 60,],
                options: {
                    chart: { type: 'donut', height: 350, background: 'transparent' },
                    colors: ['#227409ff', '#dc3545',],
                    labels: ['Sarf Malzeme', 'Ekipman',],
                    legend: {
                        position: 'bottom',
                        labels: { colors: '#6c757d' }
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '70%'
                            }
                        }
                    },
                    tooltip: { theme: 'light' },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: { width: 200 },
                                legend: { position: 'bottom' }
                            }
                        }
                    ]
                }
            },
            {
                title: 'Haftalık Trend Karşılaştırması',
                description: 'Bu hafta vs geçen hafta ekioman talepleri',
                series: [
                    { name: 'Bu Hafta', data: [8, 12, 15, 10, 18, 6, 4] },
                    { name: 'Geçen Hafta', data: [6, 10, 12, 8, 14, 8, 5] }
                ],
                options: {
                    chart: { type: 'area', height: 350, toolbar: { show: false }, background: 'transparent' },
                    colors: ['#6f42c1', '#d63384'],
                    fill: {
                        type: 'gradient',
                        gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] }
                    },
                    stroke: { curve: 'smooth', width: 2 },
                    xaxis: {
                        categories: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
                        labels: { style: { colors: '#6c757d' } }
                    },
                    yaxis: { labels: { style: { colors: '#6c757d' } } },
                    grid: { borderColor: '#dee2e6', strokeDashArray: 4 },
                    tooltip: { theme: 'light' },
                    legend: { labels: { colors: '#6c757d' } }
                }
            }
        ];
    }
}
