import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreadcrumbService } from '../breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  template: `
    <p-breadcrumb [home]="home" [model]="items()"></p-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBreadcrumbComponent {
  private readonly svc = inject(BreadcrumbService);

  // Serviste BehaviorSubject<MenuItem[]>([]) kullandığımız için initialValue gerekmez.
  readonly items = toSignal<MenuItem[]>(this.svc.items$);

  readonly home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
}
