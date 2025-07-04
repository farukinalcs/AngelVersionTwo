import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-logo-clock',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './logo-clock.component.html',
    styleUrl: './logo-clock.component.scss'
})
export class LogoClockComponent implements AfterViewInit {
    @ViewChild('logoClock', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;
    private radius!: number;
    private shortenedRadius!: number;

    ngAfterViewInit(): void {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;
        this.radius = canvas.width / 2;
        this.ctx.translate(this.radius, this.radius);
        this.shortenedRadius = this.radius * 0.9;
        this.drawClock();
    }

    drawClock(): void {
        this.ctx.clearRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        this.drawBackgroundCircle();
        this.drawHourIndicators();
        this.drawEmptySideLines(this.shortenedRadius);
        this.drawHands();
        requestAnimationFrame(() => this.drawClock());
    }

    drawBackgroundCircle(): void {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.shortenedRadius, Math.PI * 0.4, Math.PI * 1.6);
        this.ctx.strokeStyle = '#c80101';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();
    }

    drawHourIndicators(): void {
        for (let i = 0; i < 12; i++) {
            const angle = i * Math.PI / 6;
            const isMajor = i % 3 === 0;
            const length = isMajor ? this.shortenedRadius * 0.45 : this.shortenedRadius * 0.28;
            this.drawStaticLine(angle, length, 1, '#cececf');
        }
    }

    drawStaticLine(angle: number, length: number, width: number, color = '#333'): void {
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(Math.sin(angle) * length, -Math.cos(angle) * length);
        this.ctx.stroke();
    }

    drawEmptySideLines(r: number): void {
        const startAngle = Math.PI * 1.65;
        const endAngle = Math.PI * 2.4;
        const count = 5;

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.30)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        for (let i = 0; i < count; i++) {
            const angle = startAngle + ((endAngle - startAngle) * i) / (count - 0.7);
            const inner = r * 0.93;
            const outer = r * 1.05;

            this.ctx.beginPath();
            this.ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
            this.ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#bbb';
            this.ctx.stroke();
        }

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    drawHands(): void {
        const now = new Date();
        let hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const millis = now.getMilliseconds();

        hour = hour % 12;
        const hourAngle = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60));
        const minuteAngle = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        const secondAngle = (second + millis / 1000) * Math.PI / 30;

        this.drawHand(hourAngle, this.shortenedRadius * 0.4, 4, '#000', -this.shortenedRadius * 0.15);
        this.drawHand(minuteAngle, this.shortenedRadius * 0.65, 5, '#000', -this.shortenedRadius * 0.15);
        this.drawHand(secondAngle, this.shortenedRadius * 0.8, 2, '#e74c3c', -this.shortenedRadius * 0.2);
    }

    drawHand(angle: number, length: number, width: number, color: string, innerOffset = 0): void {
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.50)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 3;

        const xStart = Math.sin(angle) * innerOffset;
        const yStart = -Math.cos(angle) * innerOffset;
        const xEnd = Math.sin(angle) * length;
        const yEnd = -Math.cos(angle) * length;

        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.stroke();

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
}