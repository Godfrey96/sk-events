import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchLocationComponent } from './search-location/search-location.component';
import { EmptyScreenComponent } from './empty-screen/empty-screen.component';
import { LoadingEventComponent } from './loading-event/loading-event.component';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { EventComponent } from './event/event.component';



@NgModule({
  declarations: [
    EmptyScreenComponent,
    LoadingEventComponent,
    SearchLocationComponent,
    EventComponent,
    DateTimePickerComponent,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    EmptyScreenComponent,
    LoadingEventComponent,
    SearchLocationComponent,
    EventComponent,
    DateTimePickerComponent,
  ],
  // only those components not defined in template
  entryComponents: [
    SearchLocationComponent
  ]
})
export class ComponentsModule { }
