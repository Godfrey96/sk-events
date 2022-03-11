import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {

    try {
      const val = await this.authService.getId();
      console.log(val);
      if (val) {
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
