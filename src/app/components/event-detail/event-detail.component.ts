import { Component, Input, OnInit } from '@angular/core';
import { Events } from 'src/app/models/event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {

  @Input() data: Events;
  @Input() isLoading;

  constructor() { }

  ngOnInit() { }

}
