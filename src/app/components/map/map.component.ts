import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  @Input() data;
  googleMaps: any;
  map: any;
  marker: any;

  constructor(
    private googleMapsService: GoogleMapsService,
    private renderer: Renderer2,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    console.log('data map: ', this.data);
  }

}
