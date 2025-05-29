import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { PermissionService } from './permission.service';

@Directive({
  selector: '[appPermissionAny]' // Kullanımı: *appPermissionAny="['kod1','kod2']"
})
export class HasPermissionAnyDirective implements OnInit {
  @Input('appPermissionAny') codes: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    const hasAny = this.codes.some(code => this.permissionService.has(code));

    if (hasAny) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
