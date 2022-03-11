import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart.interface';
import { Category } from 'src/app/models/category.model';
import { Events } from 'src/app/models/event.model';
import { Ticket } from 'src/app/models/ticket.model';
import { ApiService } from 'src/app/services/api/api.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit, OnDestroy {

  // @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  @ViewChild('map') mapElementRef: ElementRef;
  googleMaps: any;
  map: any;
  marker: any;
  center = { lat: 28.649944693035188, lng: 77.23961776224988 };
  mapListener: any;

  id: any;
  data = {} as Events;
  items: Ticket[] = [];
  item: any;
  isLoading: boolean;
  cartData = {} as Cart;
  storedData = {} as Cart;
  model = {
    icon: 'fast-food-outline',
    title: 'No Ticket Avaliable for this Event'
  };
  categories: Category[] = [];
  // allItems: Ticket[] = [];
  allItems: any;
  cartSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService,
    private globalService: GlobalService,
    private storageService: StorageService,
    private googleMapsService: GoogleMapsService,
    private renderer: Renderer2,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('eventId');
    console.log('check-id: ', id);
    if (!id) {
      this.navCtrl.back();
      return;
    }
    this.id = id;
    console.log('id: ', this.id);

    this.cartSub = this.cartService.cart.subscribe(cart => {
      console.log('cart-items: ', cart);
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      if (cart && cart?.totalItem > 0) {
        this.storedData = cart;
        this.cartData.totalItem = this.storedData.totalItem;
        this.cartData.totalPrice = this.storedData.totalPrice;
        if (cart?.event?.uid === this.id) {
          this.allItems.forEach(element => {
            let qty = false;
            cart.items.forEach(element2 => {
              if (element.id !== element2.id) {
                return;
              }
              element.quantity = element2.quantity;
              qty = true;
            });
            console.log(`element checked (${qty}): `, element?.event_id + ' | ' + element?.quantity);
            if (!qty && element?.quantity) element.quantity = 0;
          });
          console.log('allItems: ', this.allItems);
          this.cartData.items = this.allItems.filter(x => x.quantity > 0);
          this.items = [...this.allItems];
        } else {
          this.allItems.forEach(element => {
            element.quantity = 0;
          });
          this.items = [...this.allItems];
        }
      }
      else {
        this.allItems.forEach(element => {
          element.quantity = 0;
          console.log('allItems: ', element);
        });
        this.items = [...this.allItems];
        console.log('allItems: ', this.allItems);
      }
    });
    this.getItems();
  }

  async getItems() {
    try {
      this.isLoading = true;
      this.data = {} as Events;
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      this.data = await this.apiService.getEventById(this.id);
      this.categories = await this.apiService.getEventsCategories(this.id);
      this.allItems = await this.apiService.getEventTicket(this.id);
      this.item = await this.apiService.getEventTicket(this.id);
      this.items = [...this.allItems];
      console.log('event - : ', this.data);
      await this.cartService.getCartData();
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.isLoading = false;
      this.globalService.errorToast();
    }
  }

  quantityPlus(item) {
    console.log('item: ', item);
    const index = this.allItems.findIndex(x => x.id === item.id);
    console.log('index: ', index);
    if (!this.allItems[index].quantity || this.allItems[index].quantity === 0) {
      if (!this.storedData.event || (this.storedData.event && this.storedData.event.uid === this.id)) {
        console.log('index-item: ', this.allItems);
        this.cartService.quantityPlus(index, this.allItems, this.data);
      } else {
        this.cartService.alertClearCart(index, this.allItems, this.data);
      }
    } else {
      this.cartService.quantityPlus(index, this.allItems, this.data);
    }
  }

  quantityMinus(item) {
    const index = this.allItems.filter(x => x.id === item.id);
    this.cartService.quantityMinus(index, this.allItems);
  }

  saveToCart() {
    try {
      this.cartData.event = {} as Events;
      this.cartData.event = this.data;
      console.log('save cartdata: ', this.cartData);
      this.cartService.saveCart();
    } catch (e) {
      console.log(e);
    }
  }

  async saveItemToCart(item) {
    console.log('save-item-model--: ', this.cartService.model);
    if (item) {
      await this.quantityPlus(item);
      this.saveToCart();
      // await this.cartService.saveCart();
      this.viewCart();
    }
  }

  async saveItemToCartFree(item) {
    console.log('save-item-model--: ', this.cartService.model);
    if (item) {
      await this.quantityPlus(item);
      this.saveToCart();
      // await this.cartService.saveCart();
      this.viewCart();
    }
  }

  async viewCart() {
    console.log('view cardData: ', this.cartData);
    if (this.cartData.items && this.cartData.items.length > 0) await this.saveToCart();
    console.log('router url: ', this.router.url);
    this.router.navigate([this.router.url + '/cart']);
  }

  // checkItemCategory(id) {
  //   const item = this.items.find(x => x.category_id.id === id);
  //   if(item) return true;
  //   return false;
  // }

  async ionViewWillLeave() {
    console.log('ionViewWIllLeave ItemPage');
    if (this.cartData?.items && this.cartData?.items.length > 0) await this.saveToCart();
  }

  async ngAfterViewInit() {
    await this.initMap();
  }

  async initMap() {
    try {
      await this.loadMap();
      // this.getAddress(this.center.lat, this.center.lng);
    } catch (e) {
      console.log(e);
      this.center = { lat: -26.019219023633433, lng: 27.938185539865323, };
      console.log(this.center);
      this.loadMap();
      // this.getAddress(this.center.lat, this.center.lng);
    }
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.googleMapsService.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -100 }
          ]
        }
      ];
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [googleMaps.MapTypeId.ROADMAP, 'SwiggyClone']
        }
      });
      var mapType = new googleMaps.StyledMapType(style, { name: 'Grayscale' });
      this.map.mapTypes.set('SwiggyClone', mapType);
      this.map.setMapTypeId('SwiggyClone');
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);
    } catch (e) {
      console.log(e);
    }
  }

  addMarker(location) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50),
    };
    this.marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: true,
      animation: googleMaps.Animation.DROP
    });
    this.mapListener = this.googleMaps.event.addListener(this.marker, 'dragend', () => {
      console.log('markerchange');
      // this.getAddress(this.marker.position.lat(), this.marker.position.lng());
    });
  }

  // async getAddress(lat, lng) {
  //   try {
  //     const result = await this.googleMapsService.getAddress(lat, lng);
  //     console.log(result);
  //     const loc = {
  //       title: result.address_components[0].short_name,
  //       address: result.formatted_address,
  //       lat,
  //       lng
  //     };
  //     console.log(loc);
  //     // this.locationService.emit(loc);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  ngOnDestroy() {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

}
