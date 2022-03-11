import { Injectable } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import {
  AlertController,
  isPlatform,
  LoadingController,
  ModalController,
  ToastController
} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLoading: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(message: string, header?, buttonArray?, inputs?) {
    this.alertCtrl.create({
      header: header ? header : 'Authentication failed',
      message: message,
      inputs: inputs ? inputs : [],
      buttons: buttonArray ? buttonArray : ['Okay']
    }).then(alertEl => alertEl.present());
  }

  async showToast(msg, color, position, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  errorToast(msg?, duration = 4000) {
    this.showToast(msg ? msg : 'No Internet Connection', 'danger', 'bottom', duration);
  }

  successToast(msg) {
    this.showToast(msg, 'success', 'bottom');
  }

  showLoader(msg?, spinner?) {
    if (!this.isLoading) this.setLoader();
    return this.loadingCtrl.create({
      message: msg ? msg : '',
      spinner: spinner ? spinner : 'bubbles',
    }).then(res => {
      res.present().then(() => {
        if (!this.isLoading) {
          res.dismiss().then(() => {
            console.log('abort presenting');
          });
        }
      });
    });
  }

  hideLoader() {
    if (this.isLoading) this.setLoader();
    return this.loadingCtrl.dismiss()
      .then(() => console.log('dismissed'))
      .catch(e => console.log('error hide loader: ', e));
  }

  async creacteModal(options) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log('data: ', data);
    if (data) return data;
  }

  modalDismiss(val?) {
    let data: any = val ? val : null;
    console.log('data-1: ', data);
    this.modalCtrl.dismiss(data);
  }

  getIcon(title) {
    const name = title.toLowerCase();
    switch (name) {
      case 'home': return 'home-outline';
      case 'work': return 'briefcase-outline';
      default: return 'location-outline';
    }
  }

  async customStatusbar(primaryColor?: boolean) {
    await StatusBar.setStyle({ style: primaryColor ? Style.Light : Style.Light });
    if (isPlatform('android')) StatusBar.setBackgroundColor({ color: primaryColor ? '#de0f17' : '#ffffff' });
  }

}
