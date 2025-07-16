import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-my-requests-page',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container mt-3">
      <h2>Benim Taleplerim</h2>
      
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a routerLink="pending" routerLinkActive="active" class="nav-link">Onay Bekleyen</a>
        </li>
        <li class="nav-item">
          <a routerLink="approved" routerLinkActive="active" class="nav-link">Onaylanan</a>
        </li>
        <li class="nav-item">
          <a routerLink="rejected" routerLinkActive="active" class="nav-link">Reddedilen</a>
        </li>
      </ul>

      <router-outlet></router-outlet>
    </div>
  `,
})
export class MyRequestsPage { }
