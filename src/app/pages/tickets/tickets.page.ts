import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit, OnDestroy {

  isLoading: boolean;
  orders: Order[] = [];
  ordersSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private orderService: OrderService,
    private cartService: CartService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(order => {
      console.log('order data: ', order);
      this.orders = order;
    }, e => {
      console.log(e);
    });
    this.getData();
  }

  async getData() {
    try {
      this.isLoading = true;
      await this.orderService.getOrders();
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      console.log(e);
      this.globalService.errorToast();
    }
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }

}
