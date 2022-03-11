import { Component, Input, OnInit } from '@angular/core';
import { Events } from 'src/app/models/event.model';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {

  fallbackImage = 'assets/imgs/1.jpg';
  @Input() event: Events;

  constructor() { }

  ngOnInit() { }

  onImgError(event) {
    event.target.src = this.fallbackImage;
  }

}
