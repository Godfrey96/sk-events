import { Component, Input, OnInit, Output } from '@angular/core';
import { Ticket } from 'src/app/models/ticket.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: Ticket;
  @Input() index;
  // @Output() 

  constructor() { }

  ngOnInit() { }

}
