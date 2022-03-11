import { Component, OnInit } from '@angular/core';
import { Events } from 'src/app/models/event.model';
import firebase from 'firebase/compat/app';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Ticket } from 'src/app/models/ticket.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  events: Events[] = [];
  tickets: Ticket[] = [];
  orders: any[] = [];
  userId: any;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this._getData();
  }

  async _getData() {
    this.userId = (await this.storageService.getStorage('uid')).value;

    // get events length
    this.events = await this.apiService.getMyEvents(this.userId);

    // get tickets length
    this.tickets = await this.apiService.getEventTicket(this.userId);

    // get order length 
    const orderRef = firebase.firestore().collectionGroup('all').where('event_id', '==', this.userId);
    orderRef.get().then((querySnapshop) => {
      this.orders = [];
      querySnapshop.forEach(doc => {
        this.orders.push(Object.assign(doc.data(), { uid: doc.id }));
      });
    });
  }

}
