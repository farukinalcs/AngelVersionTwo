import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
// import { DrawerComponent } from '../../../kt/components';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {
  @Input() contentContainerCSSClass: string = '';
  @Input() appContentContiner?: 'fixed' | 'fluid';
  @Input() appContentContainerClass: string = '';

  private unsubscribe: Subscription[] = [];
  disablePadding = false;
  constructor(private router: Router) {}


  ngOnInit(): void {
    this.routingChanges();
  }

  onActivate(componentRef: any): void {
    const deepestComponent = this.getDeepestChild(componentRef);
    console.log('Aktif component:', componentRef);
    console.log('disableLayoutPadding:', componentRef?.disableLayoutPadding);
    this.disablePadding = componentRef?.disableLayoutPadding === true;
  }

  getDeepestChild(component: any): any {
    let current = component;
    while (current?.childOutletContexts) {
      const outlet = current.childOutletContexts?.contexts.get('primary');
      if (outlet?.outlet?.component) {
        current = outlet.outlet.component;
      } else {
        break;
      }
    }
    return current;
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // DrawerComponent.hideAll();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  
}
