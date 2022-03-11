import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsPageRoutingModule } from './items-routing.module';

import { ItemsPage } from './items.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { EventDetailComponent } from 'src/app/components/event-detail/event-detail.component';
import { ItemComponent } from 'src/app/components/item/item.component';
import { MapComponent } from 'src/app/components/map/map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    ItemsPage,
    ItemComponent,
    EventDetailComponent,
    MapComponent
  ]
})
export class ItemsPageModule { }
