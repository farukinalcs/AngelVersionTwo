import { Injectable } from '@angular/core';
import { MenuAuthorization } from 'src/app/_angel/profile/models/menu-authorization';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissionSet = new Set<string>();

  /**
   * API'den gelen yetkileri servis içine yükler.
   */
  setPermissions(data: MenuAuthorization[]): void {
    this.permissionSet.clear();
    data.forEach(item => {
      if (item.goruntulenme) {
        this.permissionSet.add(item.menu);
      }
    });
  }

  /**
   * Tek bir permission code kontrolü
   */
  has(code: string): boolean {
    return this.permissionSet.has(code);
  }

  /**
   * Birden fazla koddan en az biri varsa true döner
   */
  hasAny(...codes: string[]): boolean {
    return codes.some(code => this.has(code));
  }

  /**
   * Şu anda kayıtlı tüm yetkileri döner (debug, log, vs.)
   */
  getAll(): string[] {
    return Array.from(this.permissionSet);
  }
}
