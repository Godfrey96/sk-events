import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Events } from 'src/app/models/event.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as moment from 'moment';
import { AddressService } from 'src/app/services/address/address.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  events: Events[] = [];
  userId: any;
  endsub$: Subject<any> = new Subject();

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this._getMyEvents();
  }

  async _getMyEvents() {
    try {
      this.userId = (await this.storageService.getStorage('uid')).value;
      console.log('userId: ', this.userId);
      this.events = await this.apiService.getMyEvents(this.userId);
      console.log('events: ', this.events);
    } catch (e) {
      console.log(e);
      // this.globalService.errorToast();
    }
  }

  // async _getMyEvents() {
  //   try {
  //     this.events = await this.apiService.getEvents();
  //     console.log('events: ', this.events);
  //   } catch (e) {
  //     console.log(e);
  //     // this.globalService.errorToast();
  //   }
  // }

  // private _currentUser() {
  //   this.authService.currentUser$.subscribe(x => this.user = x);
  //   console.log('current-user: ', this.user._id);
  // }

  // private _getMyEvents() {
  //   this.apiService.getMyEvents(this.user._id).pipe(
  //     takeUntil(this.endsub$)).subscribe((events) => {
  //       this.events = events;
  //       console.log('me-events: ', events);
  //     });
  // }

  // ago(time) {
  //   let difference = moment(time).diff(moment());
  //   return moment.duration(difference).humanize();
  // }

  // ngOnDestroy() {
  //   this.endsub$.next();
  //   this.endsub$.complete();
  // }

}
