import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.modal';
import { Events } from 'src/app/models/event.model';
import { AddressService } from 'src/app/services/address/address.service';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  events: Events[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub: Subscription;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private addressService: AddressService,
    private globalService: GlobalService,
    private locationService: LocationService,
    private mapService: GoogleMapsService
  ) { }

  ngOnInit() {
    this.addressSub = this.addressService.addressChange.subscribe(address => {
      console.log('address: ', address);
      if (address && address?.lat) {
        this.location = address;
        this.nearbyApiCall();
      } else {
        if (address && (!this.location || !this.location?.lat)) {
          this.searchLocation('home', 'home-modal');
        }
      }
    }, e => {
      console.log(e);
      this.isLoading = false;
      this.globalService.errorToast();
    });
    this.isLoading = true;
    // this.getBanners();
    if (!this.location?.lat) {
      this.getNearbyEvents();
    }
  }

  nearbyApiCall() {
    try {
      console.log('location: ', this.location);
      this.apiService.getNearByEvents(this.location.lat, this.location.lng).then((events) => {
        this.events = events;
        console.log('events: ', this.events);
        this.isLoading = false;
      });
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }

  async getNearbyEvents() {
    try {
      const position = await this.locationService.getCurrentLocation();
      console.log('get nearby events', position);
      const { latitude, longitude } = position.coords;
      const address = await this.mapService.getAddress(latitude, longitude);
      if (address) {
        this.location = new Address(
          '',
          address.address_components[0].short_name,
          address.formatted_address,
          '',
          '',
          latitude,
          longitude
        );
        await this.getData();
      }
      console.log('events: ', this.events);
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      this.searchLocation('home', 'home-modal');
    }
  }

  async getData() {
    try {
      this.events = [];
      await this.addressService.checkExistAddress(this.location);
    } catch (e) {
      console.log(e);
      this.globalService.errorToast();
    }
  }

  async searchLocation(prop, className?) {
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass: className ? className : '',
        backdropDismiss: prop === 'select-place' ? true : false,
        componentProps: {
          from: prop
        }
      };
      const modal = await this.globalService.creacteModal(options);
      console.log('modal value: ', modal);
      if (modal) {
        if (modal === 'add') {
          this.addAddress(this.location);
        } else if (modal === 'select') {
          this.searchLocation('select-place');
        } else {
          this.location = modal;
          await this.getData();
        }
      } else {
        console.log('location value: ', this.location);
        if (!this.location || !this.location.lat) {
          this.searchLocation('home', 'home-modal');
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  addAddress(val?) {
    let navData: NavigationExtras;
    if (val) {
      val.from = 'home';
    } else {
      val = {
        from: 'home'
      };
    }
    navData = {
      queryParams: {
        data: JSON.stringify(val)
      }
    },
      this.router.navigate(['/', 'tabs', 'address', 'edit-address'], navData);
  }

  ngOnDestroy() {
    if (this.addressSub) this.addressSub.unsubscribe();
  }

}
