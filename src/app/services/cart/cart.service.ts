import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Cart } from 'src/app/models/cart.interface';
import { Events } from 'src/app/models/event.model';
import { Order } from 'src/app/models/order.model';
import { Ticket } from 'src/app/models/ticket.model';
import { GlobalService } from '../global/global.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  model = {} as Cart;
  private _cart = new BehaviorSubject<Cart>(null);

  get cart() {
    return this._cart.asObservable();
  }

  constructor(
    private storageService: StorageService,
    private globalService: GlobalService,
    private router: Router,
  ) { }

  getCart() {
    return this.storageService.getStorage('cart');
  }

  getCartOrder() {
    return this.storageService.getStorage('user_cart_order');
  }

  async getCartData(val?) {
    let data: any = await this.getCart();
    console.log('data: ', data);
    if (data?.value) {
      this.model = await JSON.parse(data.value);
      console.log('model: ', this.model);
      await this.calculate();
      if (!val) this._cart.next(this.model);
    }
  }

  alertClearCart(index, items, data, order?) {
    this.globalService.showAlert(
      order ?
        'Would you like to reset your cart before re-ordering from this event?'
        :
        'Your cart contain items from a different event. Would you like to reset your cart before browsing the event?',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.clear(index, items, data, order);
          }
        }
      ]
    );
  }

  async clear(index, items, data, order?) {
    await this.clearCart();
    this.model = {} as Cart;
    if (order) {
      this.orderToCart(order);
    } else {
      this.quantityPlus(index, items, data);
    }
  }

  async orderToCart(order: Order) {
    console.log('order: ', order);
    const data = {
      event: order.event,
      items: order.order
    };
    this.model = data;
    await this.calculate();
    this.saveCart();
    console.log('model: ', this.model);
    this._cart.next(this.model);
    this.router.navigate(['/', 'tabs', 'events', order.event_id]);
  }

  async quantityPlus(index, items?: Ticket[], event?: Events) {
    try {
      if (items) {
        console.log('model: ', this.model);
        this.model.items = [...items];
        if (this.model.from) this.model.from = '';
      }
      if (event) {
        this.model.event = event;
      }
      console.log('q-plus: ', this.model.items[index]);
      if (!this.model.items[index].quantity || this.model.items[index].quantity === 0) {
        this.model.items[index].quantity = 1;
      } else {
        this.model.items[index].quantity += 1;
      }
      console.log('check-cart: ', this.model.items);
      await this.calculate();
      this._cart.next(this.model);
      return this.model;
    } catch (e) {
      throw (e);
    }
  }

  async quantityMinus(index, items?: Ticket[]) {
    try {
      if (items) {
        console.log('model: ', this.model);
        this.model.items = [...items];
        if (this.model.from) this.model.from = '';
      } else {
        this.model.from = 'cart';
      }
      console.log('items: ', this.model.items[index]);
      if (this.model.items[index].quantity && this.model.items[index].quantity !== 0) {
        this.model.items[index].quantity -= 1;
      } else {
        this.model.items[index].quantity = 0;
      }
      await this.calculate();
      this._cart.next(this.model);
      return this.model;
    } catch (e) {
      console.log(e);
      throw (e);
    }
  }

  async calculate() {
    let item = this.model.items.filter(x => x.quantity > 0);
    console.log('model check qty: ', item);
    this.model.items = item;
    this.model.totalPrice = 0;
    this.model.totalItem = 0;
    this.model.grandTotal = 0;
    item.forEach(element => {
      this.model.totalItem += element.quantity;
      this.model.totalPrice += element.price * element.quantity;
    });
    this.model.grandTotal = this.model.totalPrice + 0;
    if (this.model.totalItem === 0) {
      this.model.totalItem = 0;
      this.model.totalPrice = 0;
      this.model.grandTotal = 0;
      await this.clearCart();
      this.model = {} as Cart;
    }
    console.log('cart: ', this.model);
  }

  async clearCart() {
    this.globalService.showLoader();
    await this.storageService.removeStorage('cart');
    await this.storageService.removeStorage('user_cart_order');
    this._cart.next(null);
    this.globalService.hideLoader();
  }

  async clearCartOrder() {
    return this.storageService.removeStorage('user_cart_order');
  }

  saveCart(model?) {
    if (model) this.model = model;
    this.storageService.setStorage('cart', JSON.stringify(this.model));
  }

  saveCartOrder(model) {
    this.storageService.setStorage('user_cart_order', JSON.stringify(model));
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getDistanceFromLatLngInKm(lat1, lng1, lat2, lng2) {
    // 1mile = 1.6 km;
    let radius = 6371; // Radius of earth in km
    let lat = this.deg2rad(lat2 - lat1);
    let lng = this.deg2rad(lng2 - lng1);

    let result = Math.sin(lat / 2) * Math.sin(lat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(lng / 2) * Math.sin(lng / 2);
    var c = 2 * Math.atan2(Math.sqrt(result), Math.sqrt(1 - result));
    var d = radius * c; // Distance in km
    console.log(d);
    return d;
  }

  async checkCart(lat1, lng1, radius) {
    let distance: number;
    await this.getCartData(1);
    if (this.model?.event) {
      distance = this.getDistanceFromLatLngInKm(lat1, lng1, this.model.event.g.geopoint.latitude, this.model.event.g.geopoint.longitude);
      console.log('distance: ', distance);
      if (distance > radius) {
        return true;
      } else return false;
    } else return false;
  }


}
