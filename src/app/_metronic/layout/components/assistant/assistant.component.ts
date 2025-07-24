import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-assistant',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './assistant.component.html',
    styleUrl: './assistant.component.scss'
})
export class AssistantComponent implements AfterViewInit {
    @ViewChild('assistantClock') canvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('character') character!: ElementRef;
    @ViewChild('leftEye') leftEye!: ElementRef;
    @ViewChild('rightEye') rightEye!: ElementRef;

    private ctx!: CanvasRenderingContext2D;
    private radius!: number;
    private shortenedRadius!: number;
    private mouseX = 0;
    private mouseY = 0;
    private eyeMovementInterval: any;
    private isSleeping = false;

    // Sürükleme için yeni değişkenler
    private isDragging = false;
    private startX = 0;
    private startY = 0;
    private offsetX = 0;
    private offsetY = 0;
    private currentX = 30; // Başlangıç pozisyonu (right)
    private currentY = 30; // Başlangıç pozisyonu (bottom)
    private isHovered = false;

    showTodoList = false;
    todoItems = [
        { id: 1, text: 'Anketlere katıldım', completed: false },
        { id: 2, text: 'Talepleri onayladım', completed: false },
        { id: 3, text: 'Haftalık raporu hazırladım', completed: false },
        { id: 4, text: 'Yeni güncellemeleri kontrol ettim', completed: false }
    ];

    constructor(private renderer: Renderer2) { }

    ngAfterViewInit(): void {
        this.initClock();
        this.initEyeTracking();
        this.updatePosition();
    }

    // Sürükleme fonksiyonları
    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (event.button !== 0) return; // Sadece sol tık
        this.startDrag(event.clientX, event.clientY);
        event.preventDefault();
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) return;
        this.startDrag(event.touches[0].clientX, event.touches[0].clientY);
        event.preventDefault();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        if (this.isDragging) {
            this.drag(event.clientX, event.clientY);
        }
    }

    @HostListener('document:touchmove', ['$event'])
    onTouchMove(event: TouchEvent) {
        if (this.isDragging && event.touches.length === 1) {
            this.drag(event.touches[0].clientX, event.touches[0].clientY);
            event.preventDefault();
        }
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.endDrag();
    }

    @HostListener('document:touchend')
    onTouchEnd() {
        this.endDrag();
    }

    private startDrag(clientX: number, clientY: number) {
        const container = this.character.nativeElement.parentElement;
        const rect = container.getBoundingClientRect();

        this.isDragging = true;
        this.startX = clientX;
        this.startY = clientY;
        this.offsetX = this.currentX - (window.innerWidth - rect.right);
        this.offsetY = this.currentY - (window.innerHeight - rect.bottom);

        this.renderer.addClass(container, 'dragging');
    }

    private drag(clientX: number, clientY: number) {
        if (!this.isDragging) return;

        this.currentX = window.innerWidth - (clientX + this.offsetX);
        this.currentY = window.innerHeight - (clientY + this.offsetY);
        this.updatePosition();
    }

    private endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.renderer.removeClass(this.character.nativeElement.parentElement, 'dragging');

        // Ekran sınırlarını kontrol et
        const container = this.character.nativeElement.parentElement;
        const rect = container.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Sağ/sol kenarlara yapışma
        if (rect.right > windowWidth * 0.8) {
            this.currentX = 30; // Sağ kenar
        } else if (rect.left < windowWidth * 0.2) {
            this.currentX = windowWidth - rect.width - 30; // Sol kenar
        }

        // Üst/alt kenarlara yapışma
        if (rect.top < windowHeight * 0.1) {
            this.currentY = windowHeight - rect.height - 30; // Üst kenar
        } else if (rect.bottom > windowHeight * 0.9) {
            this.currentY = 30; // Alt kenar
        }

        this.updatePosition();
    }

    private updatePosition() {
        const container = this.character.nativeElement.parentElement;
        this.renderer.setStyle(container, 'right', `${this.currentX}px`);
        this.renderer.setStyle(container, 'bottom', `${this.currentY}px`);
        this.renderer.setStyle(container, 'left', 'auto');
        this.renderer.setStyle(container, 'top', 'auto');
    }

    initClock(): void {
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
        this.ctx.arc(0, 0, this.shortenedRadius, Math.PI * 0.45, Math.PI * 1.55);
        const gradient = this.ctx.createLinearGradient(0, -this.shortenedRadius, 0, this.shortenedRadius);
        gradient.addColorStop(0, '#ed1b24');
        gradient.addColorStop(1, '#ed1b24');
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 7;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, this.shortenedRadius * 0.2, this.shortenedRadius * 0.7, Math.PI * 0.45, Math.PI * 1.55);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fill();
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

        this.drawHand(hourAngle, this.shortenedRadius * 0.4, 4, '#333', -this.shortenedRadius * 0.15);
        this.drawHand(minuteAngle, this.shortenedRadius * 0.65, 5, '#333', -this.shortenedRadius * 0.15);
        this.drawHand(secondAngle, this.shortenedRadius * 0.8, 2, '#c80101', -this.shortenedRadius * 0.2);
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

    initEyeTracking(): void {
        this.eyeMovementInterval = setInterval(() => this.updateEyePosition(), 50);
        this.checkSleepState();
    }

    // updateEyePosition(): void {
    //     if (this.isSleeping) return;

    //     const characterRect = this.character.nativeElement.getBoundingClientRect();
    //     const centerX = characterRect.left + characterRect.width / 2;
    //     const centerY = characterRect.top + characterRect.height / 2;

    //     const angle = Math.atan2(this.mouseY - centerY, this.mouseX - centerX);
    //     const distance = Math.min(8,
    //         Math.sqrt(Math.pow(this.mouseX - centerX, 2) + Math.pow(this.mouseY - centerY, 2)) / 20);

    //     const leftPupil = this.leftEye.nativeElement.querySelector('.pupil');
    //     const rightPupil = this.rightEye.nativeElement.querySelector('.pupil');

    //     if (leftPupil && rightPupil) {
    //         const pupilX = Math.cos(angle) * distance * 4;
    //         const pupilY = Math.sin(angle) * distance * 4;

    //         this.renderer.setStyle(leftPupil, 'transform',
    //             `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`);
    //         this.renderer.setStyle(rightPupil, 'transform',
    //             `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`);
    //     }
    // }

    private updateEyePosition(): void {
        if (this.isSleeping || this.isHovered) return; // Hover durumunda takip yapma
        
        if (this.isSleeping) return;

        const characterRect = this.character.nativeElement.getBoundingClientRect();
        const centerX = characterRect.left + characterRect.width / 2;
        const centerY = characterRect.top + characterRect.height / 2;

        // Gözlerin konumunu hesapla
        const leftEyeRect = this.leftEye.nativeElement.getBoundingClientRect();
        const rightEyeRect = this.rightEye.nativeElement.getBoundingClientRect();

        // Sol göz için pozisyon
        const leftEyeCenterX = leftEyeRect.left + leftEyeRect.width / 2;
        const leftEyeCenterY = leftEyeRect.top + leftEyeRect.height / 2;
        const leftAngle = Math.atan2(this.mouseY - leftEyeCenterY, this.mouseX - leftEyeCenterX);

        // Sağ göz için pozisyon
        const rightEyeCenterX = rightEyeRect.left + rightEyeRect.width / 2;
        const rightEyeCenterY = rightEyeRect.top + rightEyeRect.height / 2;
        const rightAngle = Math.atan2(this.mouseY - rightEyeCenterY, this.mouseX - rightEyeCenterX);

        // Hareket mesafesini sınırla (gözün içinde kalacak şekilde)
        const maxMovement = 30;
        const leftDistance = Math.min(maxMovement,
            Math.sqrt(Math.pow(this.mouseX - leftEyeCenterX, 2) + Math.pow(this.mouseY - leftEyeCenterY, 2))) / 20;
        const rightDistance = Math.min(maxMovement,
            Math.sqrt(Math.pow(this.mouseX - rightEyeCenterX, 2) + Math.pow(this.mouseY - rightEyeCenterY, 2))) / 20;

        const leftPupil = this.leftEye.nativeElement.querySelector('.pupil');
        const rightPupil = this.rightEye.nativeElement.querySelector('.pupil');

        if (leftPupil && rightPupil) {
            // Sol göz bebeği
            const leftPupilX = Math.cos(leftAngle) * leftDistance * 3;
            const leftPupilY = Math.sin(leftAngle) * leftDistance * 3;

            // Sağ göz bebeği
            const rightPupilX = Math.cos(rightAngle) * rightDistance * 3;
            const rightPupilY = Math.sin(rightAngle) * rightDistance * 3;

            this.renderer.setStyle(leftPupil, 'transform',
                `translate(calc(-50% + ${leftPupilX}px), calc(-50% + ${leftPupilY}px))`);
            this.renderer.setStyle(rightPupil, 'transform',
                `translate(calc(-50% + ${rightPupilX}px), calc(-50% + ${rightPupilY}px))`);
        }
    }

    checkSleepState(): void {
        if (this.allTasksCompleted) {
            this.setSleepingEyes();
        } else {
            this.setAwakeEyes();
        }
    }

    setSleepingEyes(): void {
        this.isSleeping = true;
        this.renderer.addClass(this.character.nativeElement, 'sleeping');
    }

    setAwakeEyes(): void {
        this.isSleeping = false;
        this.renderer.removeClass(this.character.nativeElement, 'sleeping');
    }

    // @HostListener('document:mousemove', ['$event'])
    // onMouseMove(event: MouseEvent) {
    //     this.mouseX = event.clientX;
    //     this.mouseY = event.clientY;
    // }

    toggleTodoList(event: Event) {
        event.stopPropagation();
        this.showTodoList = !this.showTodoList;
    }

    toggleItem(item: any) {
        item.completed = !item.completed;
        this.checkSleepState();
    }

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (!this.showTodoList) return;

        const target = event.target as HTMLElement;
        if (!target.closest('.assistant-container')) {
            this.showTodoList = false;
        }
    }

    get allTasksCompleted(): boolean {
        return this.todoItems.every(item => item.completed);
    }

    get completionPercentage(): number {
        const completed = this.todoItems.filter(item => item.completed).length;
        return (completed / this.todoItems.length) * 100;
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.isHovered = true;
        this.renderer.addClass(this.character.nativeElement, 'hovered');
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.isHovered = false;
        this.renderer.removeClass(this.character.nativeElement, 'hovered');
    }
}



// import { CommonModule } from '@angular/common';
// import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

// @Component({
//     selector: 'app-assistant',
//     standalone: true,
//     imports: [CommonModule],
//     templateUrl: './assistant.component.html',
//     styleUrl: './assistant.component.scss'
// })
// export class AssistantComponent implements AfterViewInit {
//     showTodoList = false;

//     todoItems = [
//         { id: 1, text: 'Anketlere katıldım', completed: false },
//         { id: 2, text: 'Talepleri onayladım', completed: false },
//         { id: 3, text: 'Haftalık raporu hazırladım', completed: false },
//         { id: 4, text: 'Yeni güncellemeleri kontrol ettim', completed: false },
//         { id: 5, text: 'Kullanıcı geri bildirimlerini inceledim', completed: false }
//     ];

//     get allTasksCompleted(): boolean {
//         return this.todoItems.every(item => item.completed);
//     }

//     get hasPendingTasks(): boolean {
//         return this.todoItems.some(item => !item.completed) && this.showTodoList;
//     }

//     get completionPercentage(): number {
//         const completed = this.todoItems.filter(item => item.completed).length;
//         return (completed / this.todoItems.length) * 100;
//     }

//     toggleTodoList(event: Event) {
//         event.stopPropagation();
//         this.showTodoList = !this.showTodoList;
//     }

//     toggleItem(item: any) {
//         item.completed = !item.completed;
//     }

//     @HostListener('document:click', ['$event'])
//     onClick(event: MouseEvent) {
//         if (!this.showTodoList) return;

//         const target = event.target as HTMLElement;
//         if (!target.closest('.assistant-container')) {
//             this.showTodoList = false;
//         }
//     }

//     ngAfterViewInit() {
//         // Animation initialization if needed
//     }
// }