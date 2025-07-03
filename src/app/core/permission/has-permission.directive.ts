import {
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import { PermissionService } from './permission.service';

@Directive({
    selector: '[appPermission]' // kullanımı: *appPermission="'kod123'"
})
export class HasPermissionDirective implements OnInit {
    @Input('appPermission') code?: string; // permission kodu, örneğin 'kod123'

    constructor(
        private templateRef: TemplateRef<any>, // TemplateRef, HTML şablonunu temsil eder
        private viewContainer: ViewContainerRef, // ViewContainerRef, şablonun yerleştirileceği yerdir
        private permissionService: PermissionService
    ) { }

    ngOnInit(): void {
        // Eğer kod yoksa veya permissionService'de varsa, template'i oluştur
        // Aksi takdirde viewContainer'ı temizle
        if (!this.code || this.permissionService.has(this.code)) { // has() metodu, permissionService'de kodun varlığını kontrol eder
            this.viewContainer.createEmbeddedView(this.templateRef); // template'i oluştur
        } else {
            this.viewContainer.clear(); // template'i temizle
        }
    }
}
