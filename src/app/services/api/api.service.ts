import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import * as geofirestore from 'geofirestore';
import { switchMap } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { Events } from 'src/app/models/event.model';
import { Ticket } from 'src/app/models/ticket.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  radius = 10; // in km
  firestore = firebase.firestore();
  GeoFirestore = geofirestore.initializeApp(this.firestore);

  constructor(
    private adb: AngularFirestore,
  ) { }

  collection(path, queryFn?) {
    return this.adb.collection(path, queryFn);
  }

  geoCollection(path) {
    return this.GeoFirestore.collection(path);
  }

  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  // add new event
  async addEvent(data: any, uid) {
    try {
      let event = Object.assign({}, data);
      delete event.g;
      delete event.distance;
      console.log('event: ', event);
      const response = await this.geoCollection('events').doc(uid).set(event);
      console.log('event-1: ', response);
      return response;
    } catch (e) {
      throw (e);
    }
  }

  // fetch events
  async getEvents() {
    try {
      const events = await this.collection('events').get().pipe(
        switchMap(async (data: any) => {
          let eventData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log('eventData: ', eventData);
          return eventData;
        })
      ).toPromise();
      console.log('events: ', events);
      return events;
    } catch (e) {
      throw (e);
    }
  }

  // get my events
  async getMyEvents(uid) {
    try {
      const events = await this.collection(
        'events',
        ref => ref.where('uid', '==', uid))
        .get().pipe(
          switchMap(async (data: any) => {
            let eventData = await data.docs.map(element => {
              const item = element.data();
              return item;
            });
            console.log('eventData: ', eventData);
            return eventData;
          })
        ).toPromise();
      console.log('events: ', events);
      return events;
    } catch (e) {
      throw (e);
    }
  }

  async getEventById(id): Promise<any> {
    try {
      const event = (await (this.collection('events').doc(id).get().toPromise())).data();
      console.log('event: ', event);
      return event;
    } catch (e) {
      throw (e);
    }
  }

  async getNearByEvents(lat, lng): Promise<any> {
    try {
      const center = new firebase.firestore.GeoPoint(lat, lng);
      const radius = this.radius;
      const data = await (await this.geoCollection('events').near({ center, radius })
        .get()).docs.sort((a, b) => a.distance - b.distance).map(element => {
          let item = element.data();
          item.id = element.id;
          item.distance = element.distance;
          return item;
        });
      return data;
    } catch (e) {
      throw (e);
    }
  }

  // get events categories
  async getEventsCategories(uid) {
    try {
      const categories = await this.collection(
        'categories',
        ref => ref.where('uid', '==', uid))
        .get().pipe(
          switchMap(async (data: any) => {
            let categoryData = await data.docs.map(element => {
              const item = element.data();
              return item;
            });
            // console.log('categoryData: ', categoryData);
            return categoryData;
          })
        ).toPromise();
      // console.log('categories: ', categories);
      return categories;
    } catch (e) {
      throw (e);
    }
  }

  // add categories 
  async addCategories(categories, uid) {
    try {
      categories.forEach(async (element) => {
        const id = this.randomString();
        const data = new Category(
          id,
          element,
          uid
        );
        const result = await this.collection('categories').doc(id).set(Object.assign({}, data));
        console.log('result-categories: ', result);
      });
      return true;
    } catch (e) {
      throw (e);
    }
  }


  // add new ticket
  // add ticket
  async addTicket(data) {
    try {
      const id = this.randomString();
      const ticket = new Ticket(
        id,
        data.event_id,
        // this.firestore.collection('categories').doc(data.category_id),
        data.numOfTickets,
        data.paymentType,
        data.price,
        true
      );
      let ticketData = Object.assign({}, ticket);
      delete ticketData.quantity;
      console.log('ticketData: ', ticketData);
      const result = await this.collection('ticket').doc(data.event_id).collection('allTickets').doc(id).set(ticketData);
      console.log('new ticket: ', result);
      return true;
    } catch (e) {
      throw (e);
    }
  }

  async getEventTicket(uid) {
    try {
      const ticketsRef = await this.collection('ticket').doc(uid)
        .collection('allTickets', ref => ref.where('status', '==', true));
      const items = ticketsRef.get().pipe(
        switchMap(async (data: any) => {
          let ticketData = await data.docs.map(element => {
            let ticket = element.data();
            // ticket.category_id.get()
            //   .then(cData => {
            //     ticket.category_id = cData.data();
            //   })
            //   .catch(e => { throw (e); });
            return ticket;
          });
          console.log('ticketData: ', ticketData);
          return ticketData;
        })
      )
        .toPromise();
      // console.log(items);
      return items;
    } catch (e) {
      throw (e);
    }
  }

  // fetch orderzier orders
  async getMyOrganizerOrders(uid) {
    try {
      const orderRef = firebase.firestore().collectionGroup('all').where('event_id', '==', uid);
      const items = orderRef.get().then((order) => {
        console.log('orders--: ', order);
      });
      console.log('di items order: ', items);
      return items;
    } catch (e) {
      throw (e);
    }
  }


}
