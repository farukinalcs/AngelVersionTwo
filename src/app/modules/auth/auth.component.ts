import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  imagePath: string = '';
  routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Sayfa ilk yüklendiğinde ve her navigasyonda çalışır
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setImageByRoute(event.urlAfterRedirects);
      });

    // İlk görüntüleme için manuel olarak çağır
    this.setImageByRoute(this.router.url);
  }

  setImageByRoute(url: string): void {
    if (url.includes('/two-factor')) {
      this.imagePath = '../../../assets/media/svg/illustrations/login-custom-3.svg';
    } else if (url.includes('/forgot-password')) {
      this.imagePath = '../../../assets/media/svg/illustrations/login-custom-4.svg';
    } else {
      this.imagePath = '../../../assets/media/svg/illustrations/login-custom-2.svg';
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
