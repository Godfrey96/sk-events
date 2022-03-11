import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEventPageRoutingModule } from './add-event-routing.module';

import { AddEventPage } from './add-event.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEventPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AddEventPage]
})
export class AddEventPageModule { }
