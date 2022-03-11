import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  urlCheck: any;
  url: any;
  model = {} as Cart;
  cartSub: Subscription;
  firstname: any;
  lastname: any;
  phone: any;
  userId: any;
  user: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private globalService: GlobalService,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    await this.getData();

    await this.getLoggedUser();

    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart-page: ', cart);
      this.model = cart;
      console.log('cart page model: ', this.model);
    });
  }

  async getData() {
    await this.checkUrl();
    await this.cartService.getCartData();
  }

  async getLoggedUser() {
    this.userId = (await this.storageService.getStorage('uid')).value;;
    console.log('user: ', this.userId);

    this.authService.getUserData(this.userId).then(user => {
      this.user = user;
      this.firstname = this.user.firstname;
      this.lastname = this.user.lastname;
      this.phone = this.user.phone;
      console.log('user -in: ', user);
    });
  }


  checkUrl() {
    let url: any = (this.router.url).split('/');
    console.log('url: ', url);
    const spliced = url.splice(url.length - 2, 2); // /tabs/cart url.length - 1 - 1
    this.urlCheck = spliced[0];
    console.log('urlcheck: ', this.urlCheck);
    url.push(this.urlCheck);
    this.url = url;
    console.log(this.url);
  }

  getPreviousUrl() {
    return this.url.join('/');
  }

  quantityPlus(index) {
    this.cartService.quantityPlus(index);
  }

  quantityMinus(index) {
    this.cartService.quantityMinus(index);
  }

  async makePayment() {
    try {
      console.log('model: ', this.model);
      const data = {
        event_id: this.model.event.uid,
        firstname: this.firstname ? this.firstname : '',
        lastname: this.lastname ? this.lastname : '',
        phone: this.phone ? this.phone : '',
        event: this.model.event,
        order: this.model.items,
        time: moment().format('lll'),
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        status: 'Created',
        paid: 'Paid',
        // paid: this.model.items[0].paymentType,
      };
      console.log('order: ', data);
      await this.cartService.saveCartOrder(data);
      this.router.navigate([this.router.url, 'payment-option']);
    } catch (e) {
      console.log(e);
    }
  }

  async makeFreePayment() {
    try {
      console.log('model: ', this.model);
      const data = {
        event_id: this.model.event.uid,
        firstname: this.firstname ? this.firstname : '',
        lastname: this.lastname ? this.lastname : '',
        phone: this.phone ? this.phone : '',
        event: this.model.event,
        order: this.model.items,
        time: moment().format('lll'),
        total: this.model.totalPrice,
        grandTotal: this.model.grandTotal,
        status: 'Created',
        paid: 'Free',
        // paid: this.model.items[0].paymentType,
      };
      console.log('order: ', data);
      await this.orderService.placeOrder(data);
      // clear cart
      await this.cartService.clearCart();
      this.model = {} as Cart;
      this.globalService.successToast('Your Order is Placed Successfully');
      this.navCtrl.navigateRoot(['tabs/account']);
      // await this.cartService.saveCartOrder(data);
      // this.router.navigate([this.router.url, 'payment-option']);
    } catch (e) {
      console.log(e);
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(500);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave CartPage');
    if (this.model?.items && this.model?.items.length > 0) {
      this.cartService.saveCart();
    }
  }

  ngOnDestroy() {
    console.log('Destroy CartPage');
    if (this.cartSub) this.cartSub.unsubscribe();
  }

}
