import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { StorageService } from '../storage/storage.service';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail
} from '@angular/fire/auth';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { user } from 'rxfire/auth';

export class AuthUserId {
  constructor(public uid: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private currentUserSource!: BehaviorSubject<any>;
  // public currentUser$: Observable<User>;
  // public currentUser$ = this.currentUserSource.asObservable();

  public static UNKNOWN_USER = null;
  private _uid = new BehaviorSubject<AuthUserId>(AuthService.UNKNOWN_USER);

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private fireAuth: AngularFireAuth
  ) { }

  // // login
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.fireAuth.signInWithEmailAndPassword(email, password);
      console.log('response: ', response);
      if (response.user) {
        this.setUserData(response.user.uid);
        const user: any = await this.getUserData(response.user.uid);
        if (user?.type === 'organizer') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/tabs');
        }
        return user.type;
      }
    } catch (e) {
      throw (e);
    }
  }

  // // get current user-id
  async getId() {
    const user = this._uid.value;
    console.log('auth user id: ', user?.uid);
    if (user?.uid) {
      return user.uid;
    } else {
      return (await this.storageService.getStorage('uid')).value;
    }
  }

  // set user id when logged in
  setUserData(uid) {
    this.storageService.setStorage('uid', uid);
    this._uid.next(new AuthUserId(uid));
  }

  // // register a new user
  async registerUser(formValue, type?) {
    try {
      const registeredUser = await this.fireAuth.createUserWithEmailAndPassword(formValue.email, formValue.password);
      console.log('registered user: ', registeredUser);
      const data = new User(
        formValue.email,
        formValue.firstname,
        formValue.lastname,
        formValue.phone,
        'active',
        type ? type : 'user',
        registeredUser.user.uid,
      );
      console.log('data: ', data);
      await this.apiService.collection('users').doc(registeredUser.user.uid).set(Object.assign({}, data));
      if (!type || type !== '') {
        await this.setUserData(registeredUser.user.uid);
      }
      const userData = {
        id: registeredUser.user.uid,
        type: type ? type : 'user',
      };
      return userData;
    } catch (e) {
      throw (e);
    }
  }

  // // register a new organizer
  async registerOrganizer(formValue, type?) {
    try {
      const registeredUser = await this.fireAuth.createUserWithEmailAndPassword(formValue.email, formValue.password);
      console.log('registered user: ', registeredUser);
      const data = new User(
        formValue.email,
        formValue.firstname,
        formValue.lastname,
        formValue.phone,
        'active',
        type ? type : 'organizer',
        registeredUser.user.uid,
      );
      console.log('data: ', data);
      await this.apiService.collection('users').doc(registeredUser.user.uid).set(Object.assign({}, data));
      if (!type || type !== 'event') {
        await this.setUserData(registeredUser.user.uid);
      }
      const userData = {
        id: registeredUser.user.uid,
        type: type ? type : 'organizer',
      };
      return userData;
    } catch (e) {
      throw (e);
    }
  }

  // // reset password
  async resetPassword(email: string) {
    try {
      await this.fireAuth.sendPasswordResetEmail(email);
    } catch (e) {
      throw (e);
    }
  }

  // // logout
  async logout() {
    try {
      await this.fireAuth.signOut();
      await this.storageService.removeStorage('uid');
      this._uid.next(AuthService.UNKNOWN_USER);
    } catch (e) {
      throw (e);
    }
  }

  // // update email
  async updateEmail(oldEmail, newEmail, password) {
    try {
      const result = await this.fireAuth.signInWithEmailAndPassword(oldEmail, password);
      await updateEmail(result.user, newEmail);
    } catch (e) {
      console.log(e);
      throw (e);
    }
  }

  // // check auth state
  checkAuth() {
    return new Promise((resolve, reject) => {
      this.fireAuth.onAuthStateChanged(user => {
        console.log('auth user: ', user);
        resolve(user);
      });
    });
  }

  // // check user auth state
  async checkUserAuth() {
    try {
      // const user: any = await this.checkAuth();
      const user = (await this.storageService.getStorage('uid')).value;
      if (user) {
        this.setUserData(user);
        const profile: any = await this.getUserData(user);
        if (profile) return profile.type;
        return false;
      } else {
        return false;
      }
    } catch (e) {
      throw (e);
    }
  }

  // // get user data
  async getUserData(id) {
    return (await (this.apiService.collection('users').doc(id).get().toPromise())).data();
  }


}
