import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { GlobalService } from './services/global/global.service';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private globalService: GlobalService
  ) {
    this.initializeApp();
    firebase.initializeApp(environment.firebase);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.globalService.customStatusbar();
      SplashScreen.hide();
    });
  }

}
