import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from './features/home/home.module';
import { AboutModule } from './features/about/about.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbNavModule,
    NgbModule,
    HomeModule,
    AboutModule
  ],
  providers: [
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
