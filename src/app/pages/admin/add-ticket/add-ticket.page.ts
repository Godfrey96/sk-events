import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import { Events } from 'src/app/models/event.model';
import { Ticket } from 'src/app/models/ticket.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.page.html',
  styleUrls: ['./add-ticket.page.scss'],
})
export class AddTicketPage implements OnInit {

  isLoading: boolean = false;
  categories: Category[] = [];
  myEvents: Events[] = [];
  currentTicketId: any;
  selectedPayMethod: any;
  category: any;
  user: any;
  event: any;
  userId: any;
  endsub$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private storageService: StorageService,
    private globalService: GlobalService,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // this.getLoggedInUser();
    // this._currentUser();
    this.getLoggedInUser();
    this._getEvents();
  }

  async getLoggedInUser() {
    this.userId = (await this.storageService.getStorage('uid')).value;
    console.log('userId: ', this.userId);
  }

  async _getEvents() {
    try {
      this.userId = (await this.storageService.getStorage('uid')).value;
      this.myEvents = await this.apiService.getMyEvents(this.userId);
      console.log('events: ', this.myEvents);
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }

  async changeEvent(event) {
    try {
      console.log(event);
      this.globalService.showLoader();
      this.categories = await this.apiService.getEventsCategories(event.detail.value);
      this.category = '';
      this.globalService.hideLoader();
    } catch (e) {
      console.log(e);
      this.globalService.hideLoader();
      this.globalService.errorToast();
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.addTicket(form);
  }

  async addTicket(form: NgForm) {
    try {
      this.isLoading = true;
      console.log(form.value);

      const data = {
        paymentType: this.selectedPayMethod,
        ...form.value
      };
      console.log('data: ', data);
      // console.log('my events-id: ', this.myEvents.findIndex(x => x === this.userId));
      await this.apiService.addTicket(data);
      this.isLoading = false;
      form.reset();
      this.globalService.successToast('Ticket added successfully');
    } catch (e) {
      console.log(e);
      this.isLoading = true;
      this.globalService.errorToast();
    }

    // const ticket: Ticket = {
    //   event: form.value.event,
    //   paymentType: this.selectedPayMethod,
    //   price: form.value.price ? form.value.price : 0,
    //   numOfTickets: form.value.numOfTickets,
    //   status: true
    // };
    // console.log('ticket: ', ticket);
    // this.apiService.addTicket(ticket).subscribe((ticket) => {
    //   console.log('ticket added: ', ticket);
    //   this.globalService.successToast('Ticket added successfully');
    //   this.router.navigateByUrl('/admin');
    //   this.isLoading = false;
    //   form.reset();
    // });

  }

  segmentChanged(event: any) {
    this.selectedPayMethod = event.detail.value;
    console.log('selectedPayMethod: ', this.selectedPayMethod);
  }

  // ngOnDestroy() {
  //   this.endsub$.next();
  //   this.endsub$.complete();
  // }

}
