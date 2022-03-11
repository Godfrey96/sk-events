import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketsPageRoutingModule } from './tickets-routing.module';

import { TicketsPage } from './tickets.page';
import { OrdersComponent } from 'src/app/components/orders/orders.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketsPageRoutingModule
  ],
  declarations: [TicketsPage, OrdersComponent]
})
export class TicketsPageModule { }
