import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, startWith } from 'rxjs';
import { MenuItem } from 'primeng/api';

type BreadcrumbLabel = string | ((data: any, params: any) => string);

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly _items$ = new BehaviorSubject<MenuItem[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null)
    ).subscribe(() => this.build());
  }

  private build() {
    const items: MenuItem[] = [];
    let ar: ActivatedRoute | null = this.route.root;
    let url = '';

    while (ar) {
      const cfg = ar.routeConfig;
      const snap = ar.snapshot;

      if (cfg) {
        const bc = cfg.data?.['breadcrumb'] as BreadcrumbLabel | null | undefined;
        if (bc !== null && bc !== undefined) {
          const segment = snap.url.map(u => u.path).join('/');
          if (segment) {
            url += `/${segment}`;
            const label = typeof bc === 'function' ? bc(snap.data, snap.params) : bc || this.humanize(segment);
            items.push({ label, routerLink: url });
          }
        }
      }
      ar = ar.firstChild;
    }
    this._items$.next(items);
  }

  private humanize(s: string) {
    return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
