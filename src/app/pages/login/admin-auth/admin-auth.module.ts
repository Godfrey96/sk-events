import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAuthPageRoutingModule } from './admin-auth-routing.module';

import { AdminAuthPage } from './admin-auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminAuthPageRoutingModule
  ],
  declarations: [AdminAuthPage]
})
export class AdminAuthPageModule {}
