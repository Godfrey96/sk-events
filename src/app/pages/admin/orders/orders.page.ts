import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders: any[] = [];
  // orders: any;
  userId: any;
  endsub$: Subject<any> = new Subject();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this._getMyEvents();
  }

  async _getMyEvents() {
    try {
      this.userId = (await this.storageService.getStorage('uid')).value;
      const orderRef = firebase.firestore().collectionGroup('all').where('event_id', '==', this.userId);
      orderRef.get().then((querySnapshop) => {
        this.orders = [];
        querySnapshop.forEach(doc => {
          this.orders.push(Object.assign(doc.data(), { uid: doc.id }));
        });
      });
    } catch (e) {
      console.log(e);
    }
    // try {
    //   this.userId = (await this.storageService.getStorage('uid')).value;
    //   console.log('userId: ', this.userId);
    //   this.orders = await this.apiService.getMyOrganizerOrders(this.userId);
    //   console.log('orders: ', this.orders);
    // } catch (e) {
    //   console.log(e);
    //   // this.globalService.errorToast();
    // }
  }

}
