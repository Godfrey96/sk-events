import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-event',
  templateUrl: './loading-event.component.html',
  styleUrls: ['./loading-event.component.scss'],
})
export class LoadingEventComponent implements OnInit {

  dummy = Array(10);

  constructor() { }

  ngOnInit() { }

}
