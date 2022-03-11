import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  user: any;

  constructor(
    private authService: AuthService,
    private globalService: GlobalService,
    private navCtrl: NavController
  ) { }


  ngOnInit() {
    // this.authService.currentUser$.subscribe(x => this.user = x);
  }

  // logout() {
  // this.globalService.showLoader();
  // this.authService.logout();
  // this.navCtrl.navigateRoot('/login');
  // }

  confirmLogout() {
    this.globalService.showAlert(
      'Are you sure you want to sign-out?',
      'Confirm',
      [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          this.logout();
        }
      }]
    );
  }

  logout() {
    this.globalService.showLoader();
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot('/login');
      this.globalService.hideLoader();
    })
      .catch(e => {
        console.log(e);
        this.globalService.hideLoader();
        this.globalService.errorToast('Logout Failed! Check your internet connection');
      });
  }

  // logout() {
  //   console.log('logout');
  //   this.globalService.showLoader();
  //   this.authService.logout().then(() => {
  //     this.navCtrl.navigateRoot('/login');
  //     this.globalService.hideLoader();
  //   }).catch(e => {
  //     this.globalService.hideLoader();
  //     this.globalService.errorToast('Logout Failed! Check your internet connection');
  //   });
  // }

}
