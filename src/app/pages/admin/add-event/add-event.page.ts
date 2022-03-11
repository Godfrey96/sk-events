import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgForm } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { finalize, takeUntil } from 'rxjs/operators';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Category } from 'src/app/models/category.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { Events } from 'src/app/models/event.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {

  currentEventId: any;
  isLoading: boolean = false;
  coverImage: any;
  location: any = {};
  category: string;
  isCuisine: boolean = false;
  cuisines: any[] = [];
  categories: any[] = [];
  userId: any;
  endsub$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private afStorage: AngularFireStorage,
    private apiService: ApiService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    // this.authService.currentUser$.subscribe(x => this.user = x);
    // console.log('current-user: ', this.user._id);
    // this.getCategories();
    this.getLoggedInUser();
  }

  async getLoggedInUser() {
    this.userId = (await this.storageService.getStorage('uid')).value;
    console.log('userId: ', this.userId);
  }

  // async getCategories() {
  //   this.apiService.getCategories()
  //     .pipe(takeUntil(this.endsub$))
  //     .subscribe((categories) => {
  //       this.categories = categories;
  //       console.log('categories: ', categories);
  //     });
  // }

  // async getCategories() {
  //   try {
  //     this.categories = await this.apiService.getCategories();
  //     console.log('categories: ', this.categories);
  //   } catch (e) {
  //     console.log(e);
  //     this.globalService.errorToast();
  //   }
  // }

  async searchLocation() {
    try {
      const options = {
        component: SearchLocationComponent
      };
      const modal = await this.globalService.creacteModal(options);
      if (modal) {
        console.log(modal);
        this.location = modal;
      }
    } catch (e) {
      console.log(e);
    }
  }

  addCategory() {
    console.log(this.category);
    if (this.category.trim() === '') return;
    // console.log(this.isCuisine);
    const checkString = this.categories.find(x => x === this.category);
    if (checkString) {
      this.globalService.errorToast('Category already added');
      return;
    }
    this.categories.push(this.category);
    // if (this.isCuisine) this.cuisines.push(this.category);
  }

  clearCategory() {
    this.categories = [];
    this.cuisines = [];
  }

  getArrayAsString(array) {
    return array.join(', ');
  }

  preview(event) {
    console.log(event);
    const files = event.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) === null) return;
    const file = files[0];
    const filePath = 'events/' + Date.now() + '_' + file.name;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    task.snapshotChanges().pipe(
      finalize(() => {
        const downloadUrl = fileRef.getDownloadURL();
        downloadUrl.subscribe(url => {
          console.log('url: ', url);
          if (url) {
            this.coverImage = url;
          }
        });
      })
    ).subscribe(url => {
      console.log('data: ', url);
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    if (!this.coverImage || this.coverImage === '') {
      this.globalService.errorToast('Please select a cover image');
      return;
    }
    if (this.location && this.location?.lat) this.addEvent(form);
    else this.globalService.errorToast('Please select address for this event!');
  }

  async addEvent(form: NgForm) {
    try {
      this.isLoading = true;
      console.log(form.value);
      if (this.userId) {
        const position = new firebase.firestore.GeoPoint(this.location.lat, this.location.lng);
        const event = new Events(
          this.userId,
          this.coverImage ? this.coverImage : '',
          form.value.eventName,
          (form.value.eventName).toLowerCase(),
          form.value.price,
          form.value.description,
          form.value.checkIn,
          form.value.checkOut,
          this.cuisines,
          this.location.address,
          'active',
          position
        );
        const result = await this.apiService.addEvent(event, this.userId);
        await this.apiService.addCategories(this.categories, this.userId);
        form.reset();
        this.globalService.successToast('Event added successfully');
      } else {
        this.globalService.showAlert('Failed to add an event');
      }
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      let msg: string = 'Could not add the event, please try again.';
      // if (e.code === 'auth/email-already-in-use') {
      //   msg = e.message;
      // }
      this.globalService.showAlert(msg);
    }
  }

  // addEvent(form: NgForm) {
  //   this.isLoading = true;
  //   console.log(form.value);

  // const events: Events = {
  //   id: this.currentEventId,
  //   eventName: form.value.eventName,
  //   description: form.value.description,
  //   category: form.value.category,
  //   price: form.value.price,
  //   checkIn: form.value.checkIn,
  //   checkOut: form.value.checkOut,
  //   user: this.user._id,
  //   cover: this.coverImage,
  //   status: true,
  //   address: this.location.address,
  //   lat: this.location.lat,
  //   lng: this.location.lng,
  // };
  // console.log('new events: ', events);
  // this.apiService.createEvent(events).subscribe((events) => {
  //   console.log('events: ', events);
  //   this.globalService.successToast('Event added successfully');
  //   this.router.navigateByUrl('/admin');
  //   this.isLoading = false;
  //   form.reset();
  // });
  // }

  // ngOnDestroy() {
  //   this.endsub$.next('');
  //   this.endsub$.complete();
  // }

  // async addEvent(form: NgForm) {
  //   try {
  //     this.isLoading = true;
  //     console.log(form.value);
  //     const data = await this.authService.registerOrganizer(form.value, 'event');
  //     if (data?.id) {
  //       const position = new firebase.firestore.GeoPoint(this.location.lat, this.location.lng);
  //       const restaurant = new Events(
  //         data.id,
  //         // this.coverImage ? this.coverImage : '',
  //         form.value.name,
  //         form.value.description,
  //         form.value.price,
  //         form.value.category,
  //         this.location.address,
  //         'active',
  //         position
  //       );
  //       const result = await this.apiService.addEvent(restaurant, data.id);
  //       console.log(result);
  //       // form.reset();
  //       this.globalService.successToast('Event Added Successfully');
  //     } else {
  //       this.globalService.showAlert('Event Registration failed');
  //     }
  //     this.isLoading = false;
  //   } catch (e) {
  //     console.log(e);
  //     this.isLoading = false;
  //     let msg: string = 'Could not add the event, please try again.';
  //     this.globalService.showAlert(msg);
  //   }
  // }

  // async addEvent(form: NgForm) {
  //   try {
  //     this.isLoading = true;
  //     console.log(form.value);
  //     const data = await this.authService.registerOrganizer(form.value, 'admin');
  //     if (data?.id) {
  //       const position: any = new firebase.firestore.GeoPoint(this.location.lat, this.location.lng);
  //       const event = new Events(
  //         data.id,
  //         this.coverImage ? this.coverImage : '',
  //         form.value.name,
  //         form.value.description,
  //         form.value.category,
  //         form.value.price,
  //         this.location.address,
  //         'active',
  //         position
  //       );
  //       const result = await this.apiService.addEvent(event, data.id);
  //       console.log('result: ', result);
  //       this.globalService.successToast('Event added successfully');
  //     } else {
  //       this.globalService.showAlert('Event failed');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     this.isLoading = false;
  //     let msg: string = 'Could not add the event, please try again.';
  //     this.globalService.showAlert(msg);
  //   }
  // }

}
