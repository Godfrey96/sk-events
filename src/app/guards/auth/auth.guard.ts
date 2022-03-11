import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const userId = (await this.storageService.getStorage('uid')).value;

    // if (userId) {
    //   return true;
    // }

    // this.authService.logout();
    // this.router.navigate(['/login', { replaceUrl: true }]);
    // return false;

    const roleType = route.data.type;
    try {
      const type = await this.authService.checkUserAuth();
      if (type) {
        if (type === roleType) return true;
        else {
          let url = '/tabs'; //'/tabs'
          if (type === 'organizer') url = '/admin'; //'/admin'
          this.navigate(url);
        }
      } else {
        this.checkForAlert(roleType);
      }
    } catch (e) {
      console.log(e);
      this.checkForAlert(roleType);
    }
  }

  navigate(url) {
    this.router.navigateByUrl(url, { replaceUrl: true });
    return false;
  }

  async checkForAlert(roleType) {
    const id = await this.authService.getId();
    if (id) {
      console.log('alert: ', id);
      this.showAlert(roleType);
    } else {
      this.authService.logout();
      this.navigate('/login');
    }
  }

  showAlert(role) {
    this.alertCtrl.create({
      header: 'Authentication Failed',
      message: 'Please check your Internet Connectivity and tr again',
      buttons: [
        {
          text: 'Logout',
          handler: () => {
            this.authService.logout();
            this.navigate('/login');
          }
        },
        {
          text: 'Retry',
          handler: () => {
            let url = '/tabs';
            if (role === 'organizer') url = '/admin';
            this.navigate(url);
          }
        }
      ]
    })
      .then(alertEl => alertEl.present());
  }

}
