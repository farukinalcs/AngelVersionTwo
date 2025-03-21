import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-mobile-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mobile-location.component.html',
  styleUrl: './mobile-location.component.scss'
})
export class MobileLocationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  displayedColumns : string[] = ['id', 'harita', 'yerAd', 'adSoyad', 'eventTime', 'IO', 'adres']; 
  locations : any[] = [];
  

  constructor(
    private profileService : ProfileService,
  ) { }
  

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation() {
    this.profileService.getLocations().pipe(takeUntil(this.ngUnsubscribe)).subscribe((response : any) => {
      console.log("Mobil Lokasyon :", response);
      
    })
  }

  

  


  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

