import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _profile = new BehaviorSubject<User>(null);

  get profile() {
    return this._profile.asObservable();
  }

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  async getProfile() {
    try {
      const uid = await this.authService.getId();
      let profile: any = await (await (this.apiService.collection('users').doc(uid).get().toPromise())).data();
      console.log('profile: ', profile);
      const data = new User(
        profile.email,
        profile.firstname,
        profile.lastname,
        profile.phone,
        profile.status,
        profile.type,
        uid
      );
      this._profile.next(data);
      return data;
    } catch (e) {
      throw (e);
    }
  }

  async updateProfile(profile, param) {
    try {
      const uid = await this.authService.getId();
      const result = await this.apiService.collection('users').doc(uid).update(param);
      const data = new User(
        param.email,
        profile.firstname,
        profile.lastname,
        param.phone,
        profile.status,
        profile.type,
        profile.uid,
      );
      this._profile.next(data);
      return data;
    } catch (e) {
      console.log(e);
      throw (e);
    }
  }

  async updateProfileWithEmail(profile, param, password) {
    try {
      await this.authService.updateEmail(profile.email, param.email, password);
      await this.updateProfile(profile, param);
      return profile;
    } catch (e) {
      throw (e);
    }
  }

}
