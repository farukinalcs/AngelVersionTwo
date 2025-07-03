import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexGrid,
    ApexTitleSubtitle,
    ApexLegend,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexStroke,
    ApexFill,
    ApexTooltip,
    NgApexchartsModule
} from 'ng-apexcharts';

export type TimePeriod = 'daily' | 'weekly' | 'monthly';

@Component({
    selector: 'app-shift-overview',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './shift-overview.component.html',
    styleUrl: './shift-overview.component.scss'
})
export class ShiftOverviewComponent implements OnInit {
    timePeriod: TimePeriod = 'weekly';

    stats = [
        {
            title: 'Aktif Vardiyalar',
            value: '3',
            description: 'Gündüz, Akşam, Gece',
            icon: 'bi bi-clock'
        },
        {
            title: 'Toplam Çalışan',
            value: '',
            description: 'Tüm vardiyalarda',
            icon: 'bi bi-people'
        },
        {
            title: 'En Yoğun Vardiya',
            value: 'Gündüz',
            description: '',
            icon: 'bi bi-graph-up'
        },
        {
            title: 'Ortalama Doluluk',
            value: '',
            description: 'Tüm vardiyalar',
            icon: 'bi bi-calendar2-week'
        }
    ];

    shiftEmployeeSeries: ApexAxisChartSeries = [];
    departmentShiftSeries: ApexAxisChartSeries = [];
    overtimeSeries: ApexAxisChartSeries = [];
    capacitySeries: ApexNonAxisChartSeries = [];

    barChartOptions: Partial<ApexChart & any> = {};
    stackedBarChartOptions: Partial<ApexChart & any> = {};
    overtimeChartOptions: Partial<ApexChart & any> = {};
    donutChartOptions: Partial<ApexChart & any> = {};

    ngOnInit(): void {
        this.updateCharts();
    }

    setTimePeriod(period: TimePeriod): void {
        this.timePeriod = period;
        this.updateCharts();
    }

    getPeriodLabel(): string {
        return this.timePeriod === 'daily' ? 'Günlük' : this.timePeriod === 'weekly' ? 'Haftalık' : 'Aylık';
    }

    getShiftEmployeeData() {
        const data = {
            daily: { categories: ['08:00-16:00', '16:00-00:00', '00:00-08:00'], data: [85, 62, 45] },
            weekly: { categories: ['Gündüz (08:00-16:00)', 'Akşam (16:00-00:00)', 'Gece (00:00-08:00)'], data: [120, 95, 78] },
            monthly: { categories: ['Gündüz Vardiyası', 'Akşam Vardiyası', 'Gece Vardiyası'], data: [485, 380, 312] }
        };
        return data[this.timePeriod];
    }

    getDepartmentShiftData() {
        const data = {
            daily: {
                categories: ['İK', 'Muhasebe', 'Üretim', 'Satış', 'IT'],
                gunduz: [8, 6, 25, 12, 10],
                aksam: [2, 3, 20, 8, 5],
                gece: [1, 2, 15, 3, 2]
            },
            weekly: {
                categories: ['İK', 'Muhasebe', 'Üretim', 'Satış', 'IT'],
                gunduz: [35, 25, 105, 48, 42],
                aksam: [8, 12, 85, 32, 20],
                gece: [4, 8, 65, 12, 8]
            },
            monthly: {
                categories: ['İK', 'Muhasebe', 'Üretim', 'Satış', 'IT'],
                gunduz: [140, 100, 420, 192, 168],
                aksam: [32, 48, 340, 128, 80],
                gece: [16, 32, 260, 48, 32]
            }
        };
        return data[this.timePeriod];
    }

    getOvertimeByShiftData() {
        const data = {
            daily: {
                categories: ['Gündüz', 'Akşam', 'Gece'],
                data: [3, 2, 1]
            },
            weekly: {
                categories: ['Gündüz', 'Akşam', 'Gece'],
                data: [8, 5, 3]
            },
            monthly: {
                categories: ['Gündüz', 'Akşam', 'Gece'],
                data: [15, 12, 8]
            }
        };
        return data[this.timePeriod];
    }

    getShiftCapacityData() {
        const data = {
            daily: [92, 78, 65],
            weekly: [88, 82, 71],
            monthly: [85, 79, 68]
        };
        return data[this.timePeriod];
    }

    getOvertimeTotal() {
        return this.getOvertimeByShiftData().data.reduce((a, b) => a + b, 0);
    }

    updateCharts(): void {
        const shift = this.getShiftEmployeeData();
        const dept = this.getDepartmentShiftData();
        const overtime = this.getOvertimeByShiftData();
        const capacity = this.getShiftCapacityData();

        this.stats[1].value = shift.data.reduce((a, b) => a + b, 0).toString();
        this.stats[2].description = `${Math.max(...shift.data)} çalışan`;
        this.stats[3].value = `${Math.round(capacity.reduce((a, b) => a + b, 0) / capacity.length)}%`;

        this.shiftEmployeeSeries = [{ name: 'Çalışan Sayısı', data: shift.data }];
        this.departmentShiftSeries = [
            { name: 'Gündüz', data: dept.gunduz },
            { name: 'Akşam', data: dept.aksam },
            { name: 'Gece', data: dept.gece }
        ];
        this.overtimeSeries = [{ name: 'Fazla Mesai Yapan', data: overtime.data }];
        this.capacitySeries = capacity;

        this.barChartOptions = {
            chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
            plotOptions: {
                bar: {
                    borderRadius: 6,
                    columnWidth: '60%'
                }
            },
            xaxis: { categories: shift.categories, labels: { style: { colors: '#64748b' } } },
            yaxis: {
                labels: { style: { colors: '#64748b' } },
                title: { text: 'Çalışan Sayısı', style: { color: '#64748b' } }
            },
            dataLabels: { enabled: true },
            grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
            colors: ['#3b82f6'],
            title: { text: 'Vardiya Bazlı Çalışan Dağılımı', style: { color: '#1e293b', fontSize: '16px' } }
        };

        this.stackedBarChartOptions = {
            chart: { type: 'bar', stacked: true, background: 'transparent', toolbar: { show: false } },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '70%' } },
            xaxis: { categories: dept.categories, labels: { style: { colors: '#64748b' } } },
            yaxis: {
                labels: { style: { colors: '#64748b' } },
                title: { text: 'Çalışan Sayısı', style: { color: '#64748b' } }
            },
            grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
            colors: ['#3b82f6', '#8b5cf6', '#1f2937'],
            legend: { position: 'top', labels: { colors: '#64748b' } },
            title: { text: 'Departman Bazlı Vardiya Dağılımı', style: { color: '#1e293b', fontSize: '16px' } }
        };

        this.overtimeChartOptions = {
            chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
            plotOptions: { bar: { borderRadius: 6, columnWidth: '60%' } },
            xaxis: { categories: overtime.categories, labels: { style: { colors: '#64748b' } } },
            yaxis: {
                labels: { style: { colors: '#64748b' } },
                title: { text: '+45 Saat Aşan Kişi Sayısı', style: { color: '#64748b' } }
            },
            dataLabels: { enabled: true },
            grid: { borderColor: '#e2e8f0', strokeDashArray: 3 },
            colors: ['#ef4444'],
            title: { text: 'Vardiya Bazlı Analizi', style: { color: '#1e293b', fontSize: '16px' } }
        };

        this.donutChartOptions = {
            chart: { type: 'donut', background: 'transparent' },
            labels: ['Gündüz', 'Akşam', 'Gece'],
            colors: ['#10b981', '#f59e0b', '#ef4444'],
            legend: { position: 'bottom', labels: { colors: '#64748b' } },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => Math.round(val) + '%'
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Ortalama Doluluk',
                                formatter: () => `${Math.round(capacity.reduce((a, b) => a + b, 0) / capacity.length)}%`
                            }
                        }
                    }
                }
            },
            title: {
                text: 'Vardiya Doluluk Oranları',
                style: { color: '#1e293b', fontSize: '16px' }
            }
        };
    }
}
