import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { RazorpayService } from 'src/app/services/razorpay/razorpay.service';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.page.html',
  styleUrls: ['./payment-option.page.scss'],
})
export class PaymentOptionPage implements OnInit, OnDestroy {

  url: any;
  urlCheck: any;
  profile = {} as User;
  order = {} as Order;
  profileSub: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private profileService: ProfileService,
    private razorpayService: RazorpayService,
    private globalService: GlobalService,
  ) { }

  async ngOnInit() {
    await this.getData();

    this.profileSub = this.profileService.profile.subscribe(profile => {
      console.log('profile: ', profile);
      this.profile = profile;
    });
  }

  async getData() {
    try {
      await this.checkUrl();
      const profile = await this.profileService.getProfile();
      const order = await this.cartService.getCartOrder();
      console.log('order: ', order);
      this.order = JSON.parse(order?.value);
      console.log('this.order: ', this.order);
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
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

  async payWithRazorPay() {
    try {
      this.globalService.showLoader();
      // const razorpay_data ={
      //   amount: this.order.grandTotal * 100,
      //   currency: 'ZAR'
      // };
      const param = {
        email: this.profile.email,
        phone: this.profile.phone,
        amount: this.order.grandTotal * 100,
      };
      this.globalService.hideLoader();
      const data: any = await this.razorpayService.payWithRazorPay(param);
      console.log(data?.razorpay_payment_id);
      const order_param = {
        paid: 'Razorpay',
        payment_id: data?.razorpay_payment_id
      };
      console.log('order_param: ', order_param);
      await this.placeOrder(order_param);
      console.log('data: ', data);
    } catch (e) {
      console.log(e);
      this.globalService.hideLoader();
      this.globalService.errorToast();
    }
  }

  async placeOrder(param) {
    try {
      this.globalService.showLoader();
      const order = {
        ...this.order,
        ...param
      };
      await this.orderService.placeOrder(order);
      await this.cartService.clearCart();
      this.globalService.hideLoader();
      this.globalService.successToast('Your order ticket is placed successfully');
      this.router.navigateByUrl('/tabs/account');
    } catch (e) {
      console.log(e);
      this.globalService.hideLoader();
      this.globalService.errorToast();
    }
  }

  async ngOnDestroy() {
    await this.cartService.clearCartOrder();
    if (this.profileSub) this.profileSub.unsubscribe();
  }

}
