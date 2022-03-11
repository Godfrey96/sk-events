import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

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

}
