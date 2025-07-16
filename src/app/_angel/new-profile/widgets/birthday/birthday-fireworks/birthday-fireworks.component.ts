import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-birthday-fireworks',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './birthday-fireworks.component.html',
    styleUrl: './birthday-fireworks.component.scss'
})
export class BirthdayFireworksComponent implements OnInit, AfterViewInit {
    @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
    ctx!: CanvasRenderingContext2D;
    fireworks: Firework[] = [];

    @Input() shouldFire: boolean = false;

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        if (this.shouldFire) {
            this.initCanvas();
            this.animate();
            setInterval(() => this.launchFirework(), 1000);
        }
    }

    initCanvas(): void {
        const canvas = this.canvasRef.nativeElement;
        const parent = canvas.parentElement;

        if (parent) {
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        this.ctx = canvas.getContext('2d')!;
    }

    @HostListener('window:resize')
    onResize(): void {
        this.initCanvas(); // yeniden hesapla
    }


    launchFirework(): void {
        const canvas = this.canvasRef.nativeElement;
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        this.fireworks.push(new Firework(x, y, this.ctx, canvas.width));
    }


    animate(): void {
        requestAnimationFrame(() => this.animate());

        const canvas = this.canvasRef.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Saydam temizlik

        this.fireworks.forEach(fw => {
            fw.update();
            fw.draw();
        });

        this.fireworks = this.fireworks.filter(fw => !fw.done);
    }
}

class Firework {
    particles: Particle[] = [];
    exploded = false;
    done = false;

    constructor(
        private x: number,
        private y: number,
        private ctx: CanvasRenderingContext2D,
        private canvasWidth: number
    ) { }

    explode(): void {
        const spread = this.canvasWidth < 400 ? 30 : 50; // küçük ekran için azalt
        for (let i = 0; i < spread; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 3 + 0.5; // küçük ekranda daha yavaş
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            this.particles.push(new Particle(this.x, this.y, dx, dy, color));
        }
        this.exploded = true;
    }

    update(): void {
        if (!this.exploded) {
            this.explode();
        } else {
            this.particles.forEach(p => p.update());
            this.particles = this.particles.filter(p => p.alpha > 0);
            if (this.particles.length === 0) {
                this.done = true;
            }
        }
    }

    draw(): void {
        this.particles.forEach(p => p.draw(this.ctx));
    }
}


class Particle {
    alpha = 1;

    constructor(
        public x: number,
        public y: number,
        public dx: number,
        public dy: number,
        public color: string
    ) { }

    update(): void {
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.01;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}
