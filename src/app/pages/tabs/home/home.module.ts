import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { HomePage } from './home.page';
import { BannerComponent } from 'src/app/components/banner/banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    HomePage,
    BannerComponent
  ]
})
export class HomePageModule { }
