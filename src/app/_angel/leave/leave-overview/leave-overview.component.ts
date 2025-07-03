import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexLegend,
    ApexAxisChartSeries,
    ApexXAxis,
    ApexStroke,
    ApexTooltip,
    ApexPlotOptions,
    ApexYAxis,
    NgApexchartsModule
} from 'ng-apexcharts';

@Component({
    selector: 'app-leave-overview',
    standalone: true,
    imports: [CommonModule, FormsModule, NgApexchartsModule],
    templateUrl: './leave-overview.component.html',
    styleUrl: './leave-overview.component.scss'
})
export class LeaveOverviewComponent {
    summaryStats = [
        {
            title: 'Toplam İzin Talebi',
            value: '81',
            change: '+12%',
            changeType: 'increase',
            icon: 'bi bi-calendar-event',
            description: 'Bu ay'
        },
        {
            title: 'Bekleyen Talepler',
            value: '23',
            change: '-5%',
            changeType: 'decrease',
            icon: 'bi bi-clock-history',
            description: 'Onay bekliyor'
        },
        {
            title: 'Aktif Çalışanlar',
            value: '156',
            change: '+3%',
            changeType: 'increase',
            icon: 'bi bi-people',
            description: 'İzinde olmayan'
        },
        {
            title: 'Onay Oranı',
            value: '89%',
            change: '+2%',
            changeType: 'increase',
            icon: 'bi bi-graph-up-arrow',
            description: 'Bu ay'
        }
    ];

    activities = [
        { name: 'Ahmet Yılmaz', department: 'IT', type: 'Yıllık İzin', days: '5 gün', status: 'approved', time: '2 saat önce' },
        { name: 'Ayşe Kaya', department: 'Pazarlama', type: 'Hastalık İzni', days: '2 gün', status: 'pending', time: '4 saat önce' },
        { name: 'Mehmet Demir', department: 'Satış', type: 'Evlilik İzni', days: '3 gün', status: 'approved', time: '1 gün önce' },
        { name: 'Fatma Şahin', department: 'Finans', type: 'Yıllık İzin', days: '7 gün', status: 'rejected', time: '2 gün önce' }
    ];

    leaveStatusChart = {
        series: [45, 23, 8, 5],
        chart: { type: 'donut' } as ApexChart,
        labels: ['Onaylandı', 'Beklemede', 'Reddedildi', 'İptal Edildi'],
        colors: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
        legend: { position: 'bottom' } as ApexLegend,
        responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }]
    };

    leaveTrendsChart = {
        series: [
            { name: 'Toplam Talep', data: [12, 19, 15, 22, 28, 35, 42, 38, 25, 18, 14, 20] },
            { name: 'Onaylanan', data: [10, 16, 13, 18, 25, 30, 38, 35, 22, 16, 12, 18] }
        ] as ApexAxisChartSeries,
        chart: { type: 'line', height: 300 } as ApexChart,
        xaxis: { categories: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'] } as ApexXAxis,
        stroke: { width: 3 } as ApexStroke,
        colors: ['#3b82f6', '#10b981'],
        tooltip: { enabled: true } as ApexTooltip
    };

    leaveTypesChart = {
        series: [{ data: [45, 23, 8, 5, 3, 7] }],
        chart: { type: 'bar', height: 300 } as ApexChart,
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4
            }
        } as ApexPlotOptions,
        xaxis: {
            categories: ['Yıllık İzin', 'Hastalık İzni', 'Doğum İzni', 'Evlilik İzni', 'Vefat İzni', 'Diğer']
        } as ApexXAxis,
        colors: ['#8b5cf6']
    };

    departmentChart = {
        series: [
            { name: 'Beklemede', data: [5, 8, 6, 4, 3] },
            { name: 'Onaylandı', data: [12, 15, 18, 10, 8] },
            { name: 'Reddedildi', data: [2, 1, 3, 1, 2] }
        ] as ApexAxisChartSeries,
        chart: { type: 'bar', height: 300, stacked: true } as ApexChart,
        xaxis: {
            categories: ['İK', 'IT', 'Satış', 'Pazarlama', 'Finans']
        } as ApexXAxis,
        colors: ['#f59e0b', '#10b981', '#ef4444'],
        legend: { position: 'bottom' } as ApexLegend,
        plotOptions: { bar: { borderRadius: 2 } } as ApexPlotOptions
    };

    getInitials(name: string): string {
        return name.split(' ').map(n => n[0]).join('');
    }

    getStatusText(status: string): string {
        switch (status) {
            case 'approved':
                return 'Onaylandı';
            case 'pending':
                return 'Beklemede';
            case 'rejected':
                return 'Reddedildi';
            default:
                return '';
        }
    }
}

