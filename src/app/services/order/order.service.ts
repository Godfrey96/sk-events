import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  userId: any;
  uid: string;
  private _orders = new BehaviorSubject<Order[]>([]);

  get orders() {
    return this._orders.asObservable();
  }

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private storageService: StorageService,
  ) { }

  async getUid() {
    if (!this.uid) return await this.authService.getId();
    else return this.uid;
  }

  async getOrderRef() {
    // this.userId = (await this.storageService.getStorage('uid')).value;
    // console.log('userId: ', this.userId);
    this.uid = await this.getUid();
    return this.apiService.collection('orders').doc(this.uid).collection('all');
    // return this.apiService.collection('orders').doc(this.uid).collection('all');
  }

  async getOrders() {
    try {
      const orders: Order[] = await (await this.getOrderRef()).get().pipe(
        switchMap(async (data: any) => {
          let itemData = await data.docs.map(element => {
            let item = element.data();
            item.id = element.id;
            item.order = JSON.parse(item.order);
            item.event.get().then(eData => {
              item.event = eData.data();
            })
              .catch(e => { throw (e); });
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
        .toPromise();
      console.log('orders: ', orders);
      this._orders.next(orders);
      return orders;
    } catch (e) {
      throw (e);
    }
  }

  async placeOrder(param) {
    try {

      let data = { ...param, address: Object.assign({}, param.address) };
      console.log('param: ', data);
      data.order = JSON.stringify(param.order);
      const uid = await this.getUid();
      data.event = await this.apiService.firestore.collection('events').doc(param.event_id);
      const orderRef = await (await this.getOrderRef()).add(data);
      const order_id = await orderRef.id;
      console.log('latest order: ', param);
      let currentOrders: Order[] = [];
      currentOrders.push(new Order(
        param.address,
        param.event,
        param.event_id,
        param.order,
        param.total,
        param.grandTotal,
        param.status,
        param.time,
        param.paid,
        order_id,
        uid,
        param.firstName,
        param.lastname,
        param.phone,
        param?.payment_id ? param.payment_id : null
      ));
      console.log('latest order: ', currentOrders);
      currentOrders = currentOrders.concat(this._orders.value);
      console.log('orders: ', currentOrders);
      this._orders.next(currentOrders);
      return currentOrders;
    } catch (e) {
      throw (e);
    }
  }

  // async placeOrder(param) {
  //   try {
  //     let data = { ...param };
  //     console.log('param: ', data);
  //     data.order = JSON.stringify(param.order);
  //     const uid = await this.getUid();
  //     console.log('uid: ', uid);
  //     data.event = await this.apiService.collection('events').doc(param.event_id);
  //     const orderRef = await (await this.getOrderRef()).add(data);
  //     console.log('orderRef: ', orderRef);
  //     const order_id = await orderRef.id;
  //     console.log('order_id: ', order_id);
  //     console.log('latest order: ', param);
  //     let currentOrders: Order[] = [];
  //     currentOrders.push(new Order(
  //       param.event,
  //       param.event_id,
  //       param.order,
  //       param.total,
  //       param.grandTotal,
  //       param.status,
  //       param.time,
  //       param.paid,
  //       order_id,
  //       uid,
  //       param.firstName,
  //       param.lastname,
  //       param.phone,
  //       param?.payment_id ? param.payment_id : null
  //     ));
  //     console.log('latest order-2: ', currentOrders);
  //     currentOrders = currentOrders.concat(this._orders.value);
  //     console.log('orders: ', currentOrders);
  //     this._orders.next(currentOrders);
  //     return currentOrders;
  //   } catch (e) {
  //     throw (e);
  //   }
  // }

}
