import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  user: any;
  userId: any;
  firstname: any;
  lastname: any;
  phone: any;
  isLoading: boolean;
  profile: any = {};
  profileSub: Subscription;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private profileService: ProfileService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.getLoggedUser();
    this.getData();
  }

  getLoggedUser() {
    this.profileSub = this.profileService.profile.subscribe(profile => {
      this.profile = profile;
      console.log('my-profile: ', this.profile);
    });
    // this.userId = (await this.storageService.getStorage('uid')).value;;
    // console.log('user: ', this.userId);

    // this.authService.getUserData(this.userId).then(user => {
    //   this.user = user;
    //   this.firstname = this.user.firstname;
    //   this.lastname = this.user.lastname;
    //   this.phone = this.user.phone;
    //   console.log('user -in: ', user);
    // });
  }

  async getData() {
    try {
      this.isLoading = true;
      await this.profileService.getProfile();
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      console.log(e);
      this.globalService.errorToast();
    }
  }

}
