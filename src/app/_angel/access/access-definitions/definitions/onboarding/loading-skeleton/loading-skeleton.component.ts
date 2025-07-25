import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss'
})
export class LoadingSkeletonComponent {
    @Input() count = 6
}
