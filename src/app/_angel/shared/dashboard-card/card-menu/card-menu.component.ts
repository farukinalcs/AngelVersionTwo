import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-card-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './card-menu.component.html',
  styleUrl: './card-menu.component.scss'
})
export class CardMenuComponent implements OnInit, OnDestroy{
  private ngUnsubscribe = new Subject();
  @Input() menu: any[];
  @Output() changeVisible: any = new EventEmitter<any>();
  @Input() editMode: boolean;

  constructor(
    private toastrService: ToastrService
  ) { }
  
  ngOnInit(): void {
    
  }

  changeTabMenu(item: any) {
    const visibleCount = this.menu.filter((menu: any) => menu.visible).length;
    const maxVisibleCount = 3; // Max Görünür Kart Sayısı
    
    if (maxVisibleCount <= visibleCount && !item.visible) {
      // Eğer görünür kart sayısı max sayıyı geçiyorsa ve item görünür değilse, görünürlük değiştirilmiyor.
      this.toastrService.warning('Maksimum görünür kart sayısına ulaşıldı. Lütfen bir kartı gizleyin.', 'Uyarı', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      return;
    }
    
    item.visible = true;
    this.changeVisible.emit(item);
  }
  

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
